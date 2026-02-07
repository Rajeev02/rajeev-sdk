use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use pbkdf2::pbkdf2_hmac_array;
use rand::RngCore;
use sha2::Sha256;
use zeroize::Zeroize;

/// Number of PBKDF2 iterations for key derivation
const PBKDF2_ITERATIONS: u32 = 100_000;
/// Salt length in bytes
const SALT_LEN: usize = 32;
/// Nonce length for AES-256-GCM (96 bits)
const NONCE_LEN: usize = 12;
/// Derived key length (256 bits for AES-256)
const KEY_LEN: usize = 32;

/// Encryption result containing all data needed for decryption
#[derive(Debug)]
pub struct EncryptedData {
    pub ciphertext: Vec<u8>,
    pub nonce: [u8; NONCE_LEN],
    pub salt: [u8; SALT_LEN],
}

impl EncryptedData {
    /// Serialize to a single base64 string: salt || nonce || ciphertext
    pub fn to_base64(&self) -> String {
        let mut combined = Vec::with_capacity(SALT_LEN + NONCE_LEN + self.ciphertext.len());
        combined.extend_from_slice(&self.salt);
        combined.extend_from_slice(&self.nonce);
        combined.extend_from_slice(&self.ciphertext);
        BASE64.encode(&combined)
    }

    /// Deserialize from base64 string
    pub fn from_base64(encoded: &str) -> Result<Self, CryptoError> {
        let combined = BASE64
            .decode(encoded)
            .map_err(|_| CryptoError::DecodingFailed)?;

        if combined.len() < SALT_LEN + NONCE_LEN + 1 {
            return Err(CryptoError::InvalidData);
        }

        let mut salt = [0u8; SALT_LEN];
        salt.copy_from_slice(&combined[..SALT_LEN]);

        let mut nonce = [0u8; NONCE_LEN];
        nonce.copy_from_slice(&combined[SALT_LEN..SALT_LEN + NONCE_LEN]);

        let ciphertext = combined[SALT_LEN + NONCE_LEN..].to_vec();

        Ok(EncryptedData {
            ciphertext,
            nonce,
            salt,
        })
    }
}

#[derive(Debug, thiserror::Error)]
pub enum CryptoError {
    #[error("Encryption failed")]
    EncryptionFailed,
    #[error("Decryption failed — wrong key or corrupted data")]
    DecryptionFailed,
    #[error("Base64 decoding failed")]
    DecodingFailed,
    #[error("Invalid encrypted data format")]
    InvalidData,
    #[error("Key derivation failed")]
    KeyDerivationFailed,
}

/// Derive an AES-256 key from a master password/key using PBKDF2
fn derive_key(master_key: &str, salt: &[u8; SALT_LEN]) -> [u8; KEY_LEN] {
    pbkdf2_hmac_array::<Sha256, KEY_LEN>(master_key.as_bytes(), salt, PBKDF2_ITERATIONS)
}

/// Generate cryptographically secure random bytes
fn random_bytes<const N: usize>() -> [u8; N] {
    let mut bytes = [0u8; N];
    rand::rng().fill_bytes(&mut bytes);
    bytes
}

/// Encrypt plaintext using AES-256-GCM with PBKDF2 key derivation.
///
/// Returns encrypted data containing salt, nonce, and ciphertext.
/// Each call generates a unique salt and nonce, so encrypting the same
/// plaintext twice produces different outputs.
pub fn encrypt(plaintext: &str, master_key: &str) -> Result<EncryptedData, CryptoError> {
    let salt: [u8; SALT_LEN] = random_bytes();
    let nonce_bytes: [u8; NONCE_LEN] = random_bytes();

    // Derive key and immediately use it
    let mut derived_key = derive_key(master_key, &salt);

    let cipher =
        Aes256Gcm::new_from_slice(&derived_key).map_err(|_| CryptoError::EncryptionFailed)?;

    let nonce = Nonce::from_slice(&nonce_bytes);
    let ciphertext = cipher
        .encrypt(nonce, plaintext.as_bytes())
        .map_err(|_| CryptoError::EncryptionFailed)?;

    // Zeroize the derived key from memory immediately
    derived_key.zeroize();

    Ok(EncryptedData {
        ciphertext,
        nonce: nonce_bytes,
        salt,
    })
}

/// Decrypt ciphertext using AES-256-GCM with PBKDF2 key derivation.
///
/// Requires the same master key that was used for encryption.
pub fn decrypt(encrypted: &EncryptedData, master_key: &str) -> Result<String, CryptoError> {
    let mut derived_key = derive_key(master_key, &encrypted.salt);

    let cipher =
        Aes256Gcm::new_from_slice(&derived_key).map_err(|_| CryptoError::DecryptionFailed)?;

    let nonce = Nonce::from_slice(&encrypted.nonce);
    let plaintext = cipher
        .decrypt(nonce, encrypted.ciphertext.as_ref())
        .map_err(|_| CryptoError::DecryptionFailed)?;

    // Zeroize the derived key from memory immediately
    derived_key.zeroize();

    String::from_utf8(plaintext).map_err(|_| CryptoError::DecryptionFailed)
}

/// Encrypt plaintext and return as a single base64 string
pub fn encrypt_to_base64(plaintext: &str, master_key: &str) -> Result<String, CryptoError> {
    let encrypted = encrypt(plaintext, master_key)?;
    Ok(encrypted.to_base64())
}

/// Decrypt from a base64 string
pub fn decrypt_from_base64(encoded: &str, master_key: &str) -> Result<String, CryptoError> {
    let encrypted = EncryptedData::from_base64(encoded)?;
    decrypt(&encrypted, master_key)
}

/// Generate a random encryption key (base64 encoded)
pub fn generate_key() -> String {
    let key: [u8; KEY_LEN] = random_bytes();
    BASE64.encode(key)
}

/// Hash a value using SHA-256 with a random salt (for non-reversible storage)
pub fn hash_with_salt(input: &str) -> String {
    use sha2::{Digest, Sha256};
    let salt: [u8; 16] = random_bytes();
    let mut hasher = Sha256::new();
    hasher.update(&salt);
    hasher.update(input.as_bytes());
    let hash = hasher.finalize();

    let mut combined = Vec::with_capacity(16 + 32);
    combined.extend_from_slice(&salt);
    combined.extend_from_slice(&hash);
    BASE64.encode(&combined)
}

/// Verify a value against a salted hash
pub fn verify_salted_hash(input: &str, stored_hash: &str) -> bool {
    use sha2::{Digest, Sha256};
    let combined = match BASE64.decode(stored_hash) {
        Ok(v) => v,
        Err(_) => return false,
    };

    if combined.len() != 48 {
        // 16 (salt) + 32 (hash)
        return false;
    }

    let salt = &combined[..16];
    let expected_hash = &combined[16..];

    let mut hasher = Sha256::new();
    hasher.update(salt);
    hasher.update(input.as_bytes());
    let computed_hash = hasher.finalize();

    // Constant-time comparison to prevent timing attacks
    constant_time_eq(expected_hash, &computed_hash)
}

/// Constant-time byte comparison to prevent timing attacks
fn constant_time_eq(a: &[u8], b: &[u8]) -> bool {
    if a.len() != b.len() {
        return false;
    }
    let mut result = 0u8;
    for (x, y) in a.iter().zip(b.iter()) {
        result |= x ^ y;
    }
    result == 0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt_roundtrip() {
        let plaintext = "Hello, Rajeev! This is a secret 🔐";
        let key = "my-super-secret-master-key-2024";

        let encrypted = encrypt(plaintext, key).unwrap();
        let decrypted = decrypt(&encrypted, key).unwrap();

        assert_eq!(plaintext, decrypted);
    }

    #[test]
    fn test_encrypt_decrypt_base64_roundtrip() {
        let plaintext = "UPI PIN: 1234";
        let key = "vault-master-key";

        let encoded = encrypt_to_base64(plaintext, key).unwrap();
        let decoded = decrypt_from_base64(&encoded, key).unwrap();

        assert_eq!(plaintext, decoded);
    }

    #[test]
    fn test_wrong_key_fails() {
        let plaintext = "secret data";
        let key = "correct-key";
        let wrong_key = "wrong-key";

        let encrypted = encrypt(plaintext, key).unwrap();
        let result = decrypt(&encrypted, wrong_key);

        assert!(result.is_err());
    }

    #[test]
    fn test_different_encryptions_produce_different_output() {
        let plaintext = "same input";
        let key = "same key";

        let enc1 = encrypt_to_base64(plaintext, key).unwrap();
        let enc2 = encrypt_to_base64(plaintext, key).unwrap();

        // Same plaintext + key should produce DIFFERENT ciphertext (random salt + nonce)
        assert_ne!(enc1, enc2);

        // But both should decrypt to the same value
        assert_eq!(decrypt_from_base64(&enc1, key).unwrap(), plaintext);
        assert_eq!(decrypt_from_base64(&enc2, key).unwrap(), plaintext);
    }

    #[test]
    fn test_generate_key() {
        let key1 = generate_key();
        let key2 = generate_key();
        assert_ne!(key1, key2);
        assert!(!key1.is_empty());
    }

    #[test]
    fn test_hash_and_verify() {
        let input = "password123";
        let hash = hash_with_salt(input);

        assert!(verify_salted_hash(input, &hash));
        assert!(!verify_salted_hash("wrong-password", &hash));
    }

    #[test]
    fn test_empty_string_encrypt_decrypt() {
        let plaintext = "";
        let key = "key";

        let encrypted = encrypt_to_base64(plaintext, key).unwrap();
        let decrypted = decrypt_from_base64(&encrypted, key).unwrap();

        assert_eq!(plaintext, decrypted);
    }

    #[test]
    fn test_unicode_encrypt_decrypt() {
        let plaintext = "हिंदी में गुप्त डेटा 🇮🇳 தமிழ் বাংলা";
        let key = "unicode-key-🔑";

        let encrypted = encrypt_to_base64(plaintext, key).unwrap();
        let decrypted = decrypt_from_base64(&encrypted, key).unwrap();

        assert_eq!(plaintext, decrypted);
    }
}
