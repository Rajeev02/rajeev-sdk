use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use std::time::Duration;

/// Network connection type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ConnectionType {
    /// No network connectivity
    Offline,
    /// 2G cellular (GPRS, EDGE) — ~50-200 Kbps
    Cellular2G,
    /// 3G cellular (HSPA, UMTS) — ~1-5 Mbps
    Cellular3G,
    /// 4G cellular (LTE) — ~5-50 Mbps
    Cellular4G,
    /// 5G cellular — ~50-1000 Mbps
    Cellular5G,
    /// WiFi connection
    WiFi,
    /// Ethernet (wired)
    Ethernet,
    /// Unknown connection type
    Unknown,
}

impl ConnectionType {
    /// Get the typical bandwidth range for this connection type (in Kbps)
    pub fn typical_bandwidth_kbps(&self) -> (u32, u32) {
        match self {
            ConnectionType::Offline => (0, 0),
            ConnectionType::Cellular2G => (50, 200),
            ConnectionType::Cellular3G => (1000, 5000),
            ConnectionType::Cellular4G => (5000, 50000),
            ConnectionType::Cellular5G => (50000, 1000000),
            ConnectionType::WiFi => (5000, 100000),
            ConnectionType::Ethernet => (10000, 1000000),
            ConnectionType::Unknown => (100, 1000),
        }
    }

    /// Whether this connection is metered (user pays per MB)
    pub fn is_metered(&self) -> bool {
        matches!(
            self,
            ConnectionType::Cellular2G
                | ConnectionType::Cellular3G
                | ConnectionType::Cellular4G
                | ConnectionType::Cellular5G
        )
    }

    /// Get a quality score from 0 (offline) to 100 (excellent)
    pub fn quality_score(&self) -> u8 {
        match self {
            ConnectionType::Offline => 0,
            ConnectionType::Cellular2G => 15,
            ConnectionType::Cellular3G => 40,
            ConnectionType::Cellular4G => 70,
            ConnectionType::Cellular5G => 90,
            ConnectionType::WiFi => 80,
            ConnectionType::Ethernet => 95,
            ConnectionType::Unknown => 20,
        }
    }
}

/// Current network status with all relevant info
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkStatus {
    /// Connection type
    pub connection_type: ConnectionType,
    /// Estimated downlink bandwidth in Kbps (0 if unknown)
    pub downlink_kbps: u32,
    /// Estimated round-trip time in ms (0 if unknown)
    pub rtt_ms: u32,
    /// Whether the user has "save data" / "low data" mode enabled
    pub save_data: bool,
    /// Whether the connection is metered
    pub is_metered: bool,
    /// Quality score 0-100
    pub quality_score: u8,
    /// Whether we're currently online
    pub is_online: bool,
}

impl NetworkStatus {
    /// Create an offline status
    pub fn offline() -> Self {
        NetworkStatus {
            connection_type: ConnectionType::Offline,
            downlink_kbps: 0,
            rtt_ms: 0,
            save_data: false,
            is_metered: false,
            quality_score: 0,
            is_online: false,
        }
    }

    /// Create status from connection type with estimated values
    pub fn from_connection_type(conn_type: ConnectionType) -> Self {
        let (min_bw, max_bw) = conn_type.typical_bandwidth_kbps();
        let avg_bw = (min_bw + max_bw) / 2;
        let rtt = match conn_type {
            ConnectionType::Offline => 0,
            ConnectionType::Cellular2G => 800,
            ConnectionType::Cellular3G => 200,
            ConnectionType::Cellular4G => 50,
            ConnectionType::Cellular5G => 10,
            ConnectionType::WiFi => 30,
            ConnectionType::Ethernet => 5,
            ConnectionType::Unknown => 500,
        };

        NetworkStatus {
            connection_type: conn_type,
            downlink_kbps: avg_bw,
            rtt_ms: rtt,
            save_data: false,
            is_metered: conn_type.is_metered(),
            quality_score: conn_type.quality_score(),
            is_online: conn_type != ConnectionType::Offline,
        }
    }

    /// Suggest a timeout duration based on network quality
    pub fn suggested_timeout(&self) -> Duration {
        match self.quality_score {
            0 => Duration::from_secs(0),       // Offline — don't even try
            1..=20 => Duration::from_secs(60),  // Very slow — be very patient
            21..=40 => Duration::from_secs(30), // Slow
            41..=70 => Duration::from_secs(15), // Medium
            71..=90 => Duration::from_secs(10), // Good
            _ => Duration::from_secs(5),        // Excellent
        }
    }

    /// Suggest image quality based on network
    pub fn suggested_image_quality(&self) -> ImageQuality {
        if self.save_data {
            return ImageQuality::Low;
        }
        match self.quality_score {
            0..=14 => ImageQuality::Placeholder,
            15..=30 => ImageQuality::Low,
            31..=60 => ImageQuality::Medium,
            61..=80 => ImageQuality::High,
            _ => ImageQuality::Original,
        }
    }
}

/// Image quality levels for adaptive loading
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum ImageQuality {
    /// Don't load image, show placeholder
    Placeholder,
    /// Thumbnail / heavily compressed (~144p)
    Low,
    /// Medium quality (~480p)
    Medium,
    /// High quality (~1080p)
    High,
    /// Original quality
    Original,
}

impl ImageQuality {
    /// Max width in pixels for this quality level
    pub fn max_width(&self) -> u32 {
        match self {
            ImageQuality::Placeholder => 0,
            ImageQuality::Low => 144,
            ImageQuality::Medium => 480,
            ImageQuality::High => 1080,
            ImageQuality::Original => u32::MAX,
        }
    }

    /// Suggested JPEG quality (0-100)
    pub fn jpeg_quality(&self) -> u8 {
        match self {
            ImageQuality::Placeholder => 0,
            ImageQuality::Low => 30,
            ImageQuality::Medium => 60,
            ImageQuality::High => 80,
            ImageQuality::Original => 95,
        }
    }

    /// Preferred image format
    pub fn preferred_format(&self) -> &'static str {
        match self {
            ImageQuality::Placeholder => "none",
            ImageQuality::Low => "jpeg",
            ImageQuality::Medium => "webp",
            ImageQuality::High => "webp",
            ImageQuality::Original => "avif",
        }
    }
}

/// Bandwidth estimator that tracks actual transfer speeds
pub struct BandwidthEstimator {
    /// Recent samples: (bytes_transferred, duration_ms)
    samples: Mutex<Vec<(u64, u64)>>,
    /// Maximum samples to keep
    max_samples: usize,
}

impl BandwidthEstimator {
    pub fn new(max_samples: usize) -> Self {
        BandwidthEstimator {
            samples: Mutex::new(Vec::with_capacity(max_samples)),
            max_samples,
        }
    }

    /// Record a completed transfer
    pub fn record_transfer(&self, bytes: u64, duration_ms: u64) {
        if duration_ms == 0 {
            return;
        }
        if let Ok(mut samples) = self.samples.lock() {
            if samples.len() >= self.max_samples {
                samples.remove(0);
            }
            samples.push((bytes, duration_ms));
        }
    }

    /// Get estimated bandwidth in Kbps using weighted moving average
    /// Recent samples have more weight
    pub fn estimate_kbps(&self) -> u32 {
        let samples = match self.samples.lock() {
            Ok(s) => s.clone(),
            Err(_) => return 0,
        };

        if samples.is_empty() {
            return 0;
        }

        let mut weighted_sum: f64 = 0.0;
        let mut weight_total: f64 = 0.0;
        let len = samples.len();

        for (i, (bytes, duration_ms)) in samples.iter().enumerate() {
            let kbps = (*bytes as f64 * 8.0) / (*duration_ms as f64); // bits per ms = Kbps
            let weight = (i + 1) as f64 / len as f64; // More recent = higher weight
            weighted_sum += kbps * weight;
            weight_total += weight;
        }

        if weight_total > 0.0 {
            (weighted_sum / weight_total) as u32
        } else {
            0
        }
    }

    /// Clear all samples
    pub fn reset(&self) {
        if let Ok(mut samples) = self.samples.lock() {
            samples.clear();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_connection_type_quality() {
        assert_eq!(ConnectionType::Offline.quality_score(), 0);
        assert_eq!(ConnectionType::Cellular2G.quality_score(), 15);
        assert!(ConnectionType::WiFi.quality_score() > ConnectionType::Cellular3G.quality_score());
        assert!(ConnectionType::Cellular4G.quality_score() > ConnectionType::Cellular3G.quality_score());
    }

    #[test]
    fn test_connection_type_metered() {
        assert!(ConnectionType::Cellular4G.is_metered());
        assert!(ConnectionType::Cellular2G.is_metered());
        assert!(!ConnectionType::WiFi.is_metered());
        assert!(!ConnectionType::Ethernet.is_metered());
    }

    #[test]
    fn test_network_status_offline() {
        let status = NetworkStatus::offline();
        assert!(!status.is_online);
        assert_eq!(status.quality_score, 0);
        assert_eq!(status.downlink_kbps, 0);
    }

    #[test]
    fn test_network_status_from_type() {
        let status = NetworkStatus::from_connection_type(ConnectionType::Cellular4G);
        assert!(status.is_online);
        assert!(status.is_metered);
        assert!(status.downlink_kbps > 0);
        assert!(status.quality_score >= 70);
    }

    #[test]
    fn test_suggested_timeout() {
        let fast = NetworkStatus::from_connection_type(ConnectionType::WiFi);
        let slow = NetworkStatus::from_connection_type(ConnectionType::Cellular2G);
        assert!(fast.suggested_timeout() < slow.suggested_timeout());
    }

    #[test]
    fn test_image_quality_suggestions() {
        let status_2g = NetworkStatus::from_connection_type(ConnectionType::Cellular2G);
        let status_4g = NetworkStatus::from_connection_type(ConnectionType::Cellular4G);
        let status_wifi = NetworkStatus::from_connection_type(ConnectionType::WiFi);

        assert_eq!(status_2g.suggested_image_quality(), ImageQuality::Low);
        assert!(status_4g.suggested_image_quality().max_width() > status_2g.suggested_image_quality().max_width());
        assert!(status_wifi.suggested_image_quality().max_width() >= status_4g.suggested_image_quality().max_width());
    }

    #[test]
    fn test_save_data_overrides_quality() {
        let mut status = NetworkStatus::from_connection_type(ConnectionType::WiFi);
        status.save_data = true;
        assert_eq!(status.suggested_image_quality(), ImageQuality::Low);
    }

    #[test]
    fn test_bandwidth_estimator() {
        let estimator = BandwidthEstimator::new(10);

        // Simulate: 100KB transferred in 100ms = 8000 Kbps
        estimator.record_transfer(100_000, 100);
        let estimate = estimator.estimate_kbps();
        assert!(estimate > 0);

        // Simulate slower transfer
        estimator.record_transfer(10_000, 500);
        let new_estimate = estimator.estimate_kbps();
        // Should be lower due to slow sample having more recent weight
        assert!(new_estimate < estimate);
    }

    #[test]
    fn test_bandwidth_estimator_empty() {
        let estimator = BandwidthEstimator::new(10);
        assert_eq!(estimator.estimate_kbps(), 0);
    }

    #[test]
    fn test_bandwidth_estimator_reset() {
        let estimator = BandwidthEstimator::new(10);
        estimator.record_transfer(100_000, 100);
        assert!(estimator.estimate_kbps() > 0);

        estimator.reset();
        assert_eq!(estimator.estimate_kbps(), 0);
    }

    #[test]
    fn test_image_quality_formats() {
        assert_eq!(ImageQuality::Low.preferred_format(), "jpeg");
        assert_eq!(ImageQuality::Medium.preferred_format(), "webp");
        assert_eq!(ImageQuality::Original.preferred_format(), "avif");
    }
}
