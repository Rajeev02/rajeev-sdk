pub mod cache;
pub mod connectivity;
pub mod optimization;
pub mod queue;

use std::sync::Mutex;

pub use cache::{CacheStats, CachedResponse, HttpCache};
pub use connectivity::{
    BandwidthEstimator, ConnectionType, ImageQuality, NetworkStatus,
};
pub use optimization::{compress_string, decompress_string, should_compress};
pub use queue::{Priority, QueuedRequest, RequestQueue};

// ─── Error Type ─────────────────────────────────────────────────────

#[derive(Debug, thiserror::Error)]
pub enum NetworkError {
    #[error("Queue error: {0}")]
    QueueError(String),
    #[error("Cache error: {0}")]
    CacheError(String),
    #[error("Compression error: {0}")]
    CompressionError(String),
    #[error("Not initialized")]
    NotInitialized,
    #[error("Invalid configuration: {0}")]
    InvalidConfig(String),
}

impl From<queue::QueueError> for NetworkError {
    fn from(e: queue::QueueError) -> Self {
        NetworkError::QueueError(e.to_string())
    }
}

impl From<cache::CacheError> for NetworkError {
    fn from(e: cache::CacheError) -> Self {
        NetworkError::CacheError(e.to_string())
    }
}

impl From<optimization::CompressionError> for NetworkError {
    fn from(e: optimization::CompressionError) -> Self {
        NetworkError::CompressionError(e.to_string())
    }
}

// ─── Configuration ──────────────────────────────────────────────────

/// Configuration for the network engine
pub struct NetworkConfig {
    /// App identifier (used for database naming)
    pub app_id: String,
    /// Database directory path
    pub db_dir: String,
    /// Maximum cache size in bytes (default: 50MB)
    pub max_cache_bytes: u64,
    /// Whether to enable offline request queuing
    pub enable_queue: bool,
    /// Whether to enable response caching
    pub enable_cache: bool,
    /// Whether to auto-compress large request bodies
    pub auto_compress: bool,
}

// ─── Main Network Engine ────────────────────────────────────────────

/// The main network engine exposed to all platforms
pub struct RajeevNetwork {
    queue: Option<RequestQueue>,
    cache: Option<HttpCache>,
    bandwidth: BandwidthEstimator,
    status: Mutex<NetworkStatus>,
    config: NetworkConfig,
}

impl RajeevNetwork {
    /// Create a new network engine
    pub fn new(config: NetworkConfig) -> Result<Self, NetworkError> {
        let queue = if config.enable_queue {
            let queue_path = format!("{}/{}.network.queue.db", config.db_dir, config.app_id);
            Some(RequestQueue::new(&queue_path).map_err(|e| NetworkError::QueueError(e.to_string()))?)
        } else {
            None
        };

        let cache = if config.enable_cache {
            let cache_path = format!("{}/{}.network.cache.db", config.db_dir, config.app_id);
            Some(HttpCache::new(&cache_path, config.max_cache_bytes).map_err(|e| NetworkError::CacheError(e.to_string()))?)
        } else {
            None
        };

        Ok(RajeevNetwork {
            queue,
            cache,
            bandwidth: BandwidthEstimator::new(50),
            status: Mutex::new(NetworkStatus::from_connection_type(ConnectionType::Unknown)),
            config,
        })
    }

    // ─── Connectivity ───────────────────────────────────────────────

    /// Update network status (called from platform layer)
    pub fn update_status(
        &self,
        connection_type: &str,
        downlink_kbps: u32,
        rtt_ms: u32,
        save_data: bool,
    ) {
        let conn_type = match connection_type.to_lowercase().as_str() {
            "offline" | "none" => ConnectionType::Offline,
            "2g" | "cellular2g" => ConnectionType::Cellular2G,
            "3g" | "cellular3g" => ConnectionType::Cellular3G,
            "4g" | "lte" | "cellular4g" => ConnectionType::Cellular4G,
            "5g" | "cellular5g" => ConnectionType::Cellular5G,
            "wifi" => ConnectionType::WiFi,
            "ethernet" | "wired" => ConnectionType::Ethernet,
            _ => ConnectionType::Unknown,
        };

        let mut status = NetworkStatus::from_connection_type(conn_type);
        if downlink_kbps > 0 {
            status.downlink_kbps = downlink_kbps;
        }
        if rtt_ms > 0 {
            status.rtt_ms = rtt_ms;
        }
        status.save_data = save_data;

        if let Ok(mut current) = self.status.lock() {
            *current = status;
        }
    }

    /// Get current network status
    pub fn get_status(&self) -> NetworkStatus {
        self.status
            .lock()
            .map(|s| s.clone())
            .unwrap_or_else(|_| NetworkStatus::offline())
    }

    /// Get suggested timeout for current network conditions
    pub fn get_suggested_timeout_ms(&self) -> u64 {
        let status = self.get_status();
        status.suggested_timeout().as_millis() as u64
    }

    /// Get suggested image quality for current network
    pub fn get_suggested_image_quality(&self) -> String {
        let status = self.get_status();
        let quality = status.suggested_image_quality();
        serde_json::to_string(&quality).unwrap_or_else(|_| "\"Medium\"".to_string())
    }

    /// Record a completed network transfer for bandwidth estimation
    pub fn record_transfer(&self, bytes: u64, duration_ms: u64) {
        self.bandwidth.record_transfer(bytes, duration_ms);
    }

    /// Get estimated bandwidth in Kbps
    pub fn get_estimated_bandwidth_kbps(&self) -> u32 {
        self.bandwidth.estimate_kbps()
    }

    // ─── Request Queue ──────────────────────────────────────────────

    /// Queue a request for later sending
    pub fn enqueue_request(
        &self,
        method: String,
        url: String,
        headers_json: String,
        body: Option<String>,
        priority: String,
        compress: bool,
        tag: Option<String>,
    ) -> Result<String, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;

        let pri = match priority.to_lowercase().as_str() {
            "low" => Priority::Low,
            "high" => Priority::High,
            "critical" => Priority::Critical,
            _ => Priority::Normal,
        };

        // Auto-compress if enabled and body is large
        let final_body = if self.config.auto_compress && compress {
            if let Some(ref b) = body {
                if should_compress(b.as_bytes()) {
                    Some(compress_string(b)?)
                } else {
                    body
                }
            } else {
                body
            }
        } else {
            body
        };

        let id = queue.enqueue(
            &method,
            &url,
            &headers_json,
            final_body.as_deref(),
            pri,
            compress,
            tag.as_deref(),
        )?;

        Ok(id)
    }

    /// Get next request to send based on current network quality
    pub fn dequeue_request(&self) -> Result<Option<String>, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;

        let quality = self.get_status().quality_score;
        let request = queue.dequeue(quality)?;

        match request {
            Some(req) => Ok(Some(serde_json::to_string(&req).map_err(|e| {
                NetworkError::QueueError(e.to_string())
            })?)),
            None => Ok(None),
        }
    }

    /// Mark a queued request as completed
    pub fn complete_request(&self, request_id: String) -> Result<bool, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.complete(&request_id)?)
    }

    /// Mark a queued request as failed (will retry with backoff)
    pub fn fail_request(&self, request_id: String) -> Result<bool, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.fail(&request_id)?)
    }

    /// Cancel a specific request
    pub fn cancel_request(&self, request_id: String) -> Result<bool, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.cancel(&request_id)?)
    }

    /// Cancel all requests with a tag
    pub fn cancel_by_tag(&self, tag: String) -> Result<u64, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.cancel_by_tag(&tag)?)
    }

    /// Get queue size
    pub fn get_queue_size(&self) -> Result<u64, NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.size()?)
    }

    /// Clear the request queue
    pub fn clear_queue(&self) -> Result<(), NetworkError> {
        let queue = self.queue.as_ref().ok_or(NetworkError::InvalidConfig(
            "Queue not enabled".to_string(),
        ))?;
        Ok(queue.clear()?)
    }

    // ─── Cache ──────────────────────────────────────────────────────

    /// Get a cached response
    pub fn get_cached(
        &self,
        method: String,
        url: String,
    ) -> Result<Option<String>, NetworkError> {
        let cache = self.cache.as_ref().ok_or(NetworkError::InvalidConfig(
            "Cache not enabled".to_string(),
        ))?;

        let entry = cache.get(&method, &url)?;
        match entry {
            Some(e) => Ok(Some(serde_json::to_string(&e).map_err(|e| {
                NetworkError::CacheError(e.to_string())
            })?)),
            None => Ok(None),
        }
    }

    /// Store a response in cache
    pub fn cache_response(
        &self,
        method: String,
        url: String,
        status_code: u16,
        headers_json: String,
        body: String,
        ttl_seconds: u64,
        etag: Option<String>,
        last_modified: Option<String>,
    ) -> Result<(), NetworkError> {
        let cache = self.cache.as_ref().ok_or(NetworkError::InvalidConfig(
            "Cache not enabled".to_string(),
        ))?;

        cache.put(
            &method,
            &url,
            status_code,
            &headers_json,
            &body,
            ttl_seconds,
            etag.as_deref(),
            last_modified.as_deref(),
        )?;

        Ok(())
    }

    /// Invalidate a cache entry
    pub fn invalidate_cache(&self, method: String, url: String) -> Result<bool, NetworkError> {
        let cache = self.cache.as_ref().ok_or(NetworkError::InvalidConfig(
            "Cache not enabled".to_string(),
        ))?;
        Ok(cache.invalidate(&method, &url)?)
    }

    /// Get cache statistics
    pub fn get_cache_stats(&self) -> Result<String, NetworkError> {
        let cache = self.cache.as_ref().ok_or(NetworkError::InvalidConfig(
            "Cache not enabled".to_string(),
        ))?;

        let stats = cache.stats()?;
        serde_json::to_string(&stats).map_err(|e| NetworkError::CacheError(e.to_string()))
    }

    /// Clear entire cache
    pub fn clear_cache(&self) -> Result<(), NetworkError> {
        let cache = self.cache.as_ref().ok_or(NetworkError::InvalidConfig(
            "Cache not enabled".to_string(),
        ))?;
        Ok(cache.clear()?)
    }

    // ─── Cleanup ────────────────────────────────────────────────────

    /// Run maintenance tasks (cleanup expired cache/queue entries)
    pub fn cleanup(&self) -> Result<(), NetworkError> {
        if let Some(ref cache) = self.cache {
            let _ = cache.cleanup_expired();
        }
        if let Some(ref queue) = self.queue {
            let _ = queue.cleanup_old(24); // Remove non-critical requests older than 24h
        }
        Ok(())
    }
}

// ─── Tests ──────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_network() -> RajeevNetwork {
        RajeevNetwork::new(NetworkConfig {
            app_id: "test-app".to_string(),
            db_dir: ":memory:".to_string(),
            max_cache_bytes: 10 * 1024 * 1024,
            enable_queue: true,
            enable_cache: true,
            auto_compress: true,
        })
        .unwrap()
    }

    // Use in-memory databases for testing
    fn create_test_network_inmemory() -> RajeevNetwork {
        let queue = Some(RequestQueue::new(":memory:").unwrap());
        let cache = Some(HttpCache::new(":memory:", 10 * 1024 * 1024).unwrap());

        RajeevNetwork {
            queue,
            cache,
            bandwidth: BandwidthEstimator::new(50),
            status: Mutex::new(NetworkStatus::from_connection_type(ConnectionType::WiFi)),
            config: NetworkConfig {
                app_id: "test".to_string(),
                db_dir: ":memory:".to_string(),
                max_cache_bytes: 10 * 1024 * 1024,
                enable_queue: true,
                enable_cache: true,
                auto_compress: true,
            },
        }
    }

    #[test]
    fn test_update_and_get_status() {
        let network = create_test_network_inmemory();

        network.update_status("4g", 25000, 40, false);
        let status = network.get_status();

        assert!(status.is_online);
        assert_eq!(status.downlink_kbps, 25000);
        assert_eq!(status.rtt_ms, 40);
        assert!(status.is_metered);
    }

    #[test]
    fn test_offline_status() {
        let network = create_test_network_inmemory();
        network.update_status("offline", 0, 0, false);

        let status = network.get_status();
        assert!(!status.is_online);
        assert_eq!(status.quality_score, 0);
    }

    #[test]
    fn test_suggested_timeout() {
        let network = create_test_network_inmemory();

        network.update_status("2g", 100, 800, false);
        let slow_timeout = network.get_suggested_timeout_ms();

        network.update_status("wifi", 50000, 20, false);
        let fast_timeout = network.get_suggested_timeout_ms();

        assert!(slow_timeout > fast_timeout);
    }

    #[test]
    fn test_queue_and_dequeue() {
        let network = create_test_network_inmemory();

        let id = network
            .enqueue_request(
                "POST".to_string(),
                "https://api.test.com/data".to_string(),
                "{}".to_string(),
                Some("{\"key\":\"value\"}".to_string()),
                "high".to_string(),
                false,
                None,
            )
            .unwrap();

        assert!(!id.is_empty());
        assert_eq!(network.get_queue_size().unwrap(), 1);

        let req_json = network.dequeue_request().unwrap();
        assert!(req_json.is_some());
    }

    #[test]
    fn test_cache_and_retrieve() {
        let network = create_test_network_inmemory();

        network
            .cache_response(
                "GET".to_string(),
                "https://api.test.com/users".to_string(),
                200,
                "{}".to_string(),
                "{\"users\":[]}".to_string(),
                300,
                None,
                None,
            )
            .unwrap();

        let cached = network
            .get_cached("GET".to_string(), "https://api.test.com/users".to_string())
            .unwrap();
        assert!(cached.is_some());
    }

    #[test]
    fn test_bandwidth_estimation() {
        let network = create_test_network_inmemory();

        network.record_transfer(500_000, 100); // 500KB in 100ms
        let estimate = network.get_estimated_bandwidth_kbps();
        assert!(estimate > 0);
    }

    #[test]
    fn test_complete_request() {
        let network = create_test_network_inmemory();

        let id = network
            .enqueue_request(
                "GET".to_string(),
                "https://test.com".to_string(),
                "{}".to_string(),
                None,
                "normal".to_string(),
                false,
                None,
            )
            .unwrap();

        network.complete_request(id).unwrap();
        assert_eq!(network.get_queue_size().unwrap(), 0);
    }

    #[test]
    fn test_cancel_by_tag() {
        let network = create_test_network_inmemory();

        network
            .enqueue_request("GET".to_string(), "https://a.com".to_string(), "{}".to_string(), None, "normal".to_string(), false, Some("batch".to_string()))
            .unwrap();
        network
            .enqueue_request("GET".to_string(), "https://b.com".to_string(), "{}".to_string(), None, "normal".to_string(), false, Some("batch".to_string()))
            .unwrap();

        let cancelled = network.cancel_by_tag("batch".to_string()).unwrap();
        assert_eq!(cancelled, 2);
    }
}
