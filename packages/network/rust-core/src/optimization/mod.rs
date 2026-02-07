use flate2::read::{GzDecoder, GzEncoder};
use flate2::Compression;
use std::io::Read;

#[derive(Debug, thiserror::Error)]
pub enum CompressionError {
    #[error("Compression failed: {0}")]
    CompressFailed(String),
    #[error("Decompression failed: {0}")]
    DecompressFailed(String),
}

/// Compress data using gzip
pub fn compress(data: &[u8]) -> Result<Vec<u8>, CompressionError> {
    let mut encoder = GzEncoder::new(data, Compression::default());
    let mut compressed = Vec::new();
    encoder
        .read_to_end(&mut compressed)
        .map_err(|e| CompressionError::CompressFailed(e.to_string()))?;
    Ok(compressed)
}

/// Decompress gzip data
pub fn decompress(data: &[u8]) -> Result<Vec<u8>, CompressionError> {
    let mut decoder = GzDecoder::new(data);
    let mut decompressed = Vec::new();
    decoder
        .read_to_end(&mut decompressed)
        .map_err(|e| CompressionError::DecompressFailed(e.to_string()))?;
    Ok(decompressed)
}

/// Compress a string and return base64-encoded result
pub fn compress_string(input: &str) -> Result<String, CompressionError> {
    let compressed = compress(input.as_bytes())?;
    Ok(base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        &compressed,
    ))
}

/// Decompress a base64-encoded gzip string
pub fn decompress_string(input: &str) -> Result<String, CompressionError> {
    let compressed = base64::Engine::decode(&base64::engine::general_purpose::STANDARD, input)
        .map_err(|e| CompressionError::DecompressFailed(e.to_string()))?;
    let decompressed = decompress(&compressed)?;
    String::from_utf8(decompressed)
        .map_err(|e| CompressionError::DecompressFailed(e.to_string()))
}

/// Check if compression would be beneficial (data > 1KB and compresses well)
pub fn should_compress(data: &[u8]) -> bool {
    if data.len() < 1024 {
        return false; // Too small to benefit
    }
    // Quick check: try compressing and see if it's at least 20% smaller
    if let Ok(compressed) = compress(data) {
        compressed.len() < (data.len() * 80 / 100)
    } else {
        false
    }
}

/// Get compression ratio (0.0 to 1.0, lower = better compression)
pub fn compression_ratio(original: &[u8], compressed: &[u8]) -> f64 {
    if original.is_empty() {
        return 1.0;
    }
    compressed.len() as f64 / original.len() as f64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compress_decompress_roundtrip() {
        let original = b"Hello, Rajeev! This is test data that should compress well. \
                         Repeated content helps compression. Repeated content helps compression.";
        let compressed = compress(original).unwrap();
        let decompressed = decompress(&compressed).unwrap();
        assert_eq!(original.to_vec(), decompressed);
    }

    #[test]
    fn test_compress_string_roundtrip() {
        let original = "JSON API response with lots of repeated keys and values";
        let compressed = compress_string(original).unwrap();
        let decompressed = decompress_string(&compressed).unwrap();
        assert_eq!(original, decompressed);
    }

    #[test]
    fn test_compression_reduces_size() {
        // Repetitive data should compress well
        let data = "abcdefg".repeat(1000);
        let compressed = compress(data.as_bytes()).unwrap();
        assert!(compressed.len() < data.len());
    }

    #[test]
    fn test_should_compress_small_data() {
        let small = b"tiny";
        assert!(!should_compress(small));
    }

    #[test]
    fn test_should_compress_large_repetitive_data() {
        let large = "repetitive data ".repeat(200);
        assert!(should_compress(large.as_bytes()));
    }

    #[test]
    fn test_compression_ratio() {
        let original = b"test data for ratio calculation";
        let compressed = compress(original).unwrap();
        let ratio = compression_ratio(original, &compressed);
        assert!(ratio > 0.0);
        assert!(ratio <= 2.0); // Small data might not compress well
    }

    #[test]
    fn test_empty_data() {
        let compressed = compress(b"").unwrap();
        let decompressed = decompress(&compressed).unwrap();
        assert!(decompressed.is_empty());
    }

    #[test]
    fn test_unicode_compression() {
        let hindi = "namaste duniya! yah ek pariksha hai. ".repeat(100);
        let compressed = compress_string(&hindi).unwrap();
        let decompressed = decompress_string(&compressed).unwrap();
        assert_eq!(hindi, decompressed);
    }
}
