pub mod crypto;
pub mod storage;

use std::sync::Mutex;
use storage::StorageEngine;

// Generate UniFFI scaffolding for native targets (mobile/desktop)
#[cfg(not(target_arch = "wasm32"))]
uniffi::setup_scaffolding!();

// WASM bindings
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

/// Error types exposed via FFI
#[derive(Debug, thiserror::Error)]
pub enum VaultError {
    #[error("Encryption failed")]
    EncryptionFailed,
    #[error("Decryption failed")]
    DecryptionFailed,
    #[error("Key not found")]
    KeyNotFound,
    #[error("Key expired")]
    KeyExpired,
    #[error("Storage error: {msg}")]
    StorageError { msg: String },
    #[error("Invalid configuration: {msg}")]
    InvalidConfig { msg: String },
    #[error("Biometric authentication required")]
    BiometricRequired,
    #[error("Serialization error: {msg}")]
    SerializationError { msg: String },
}

impl From<storage::StorageError> for VaultError {
    fn from(e: storage::StorageError) -> Self {
        match e {
            storage::StorageError::KeyNotFound(_) => VaultError::KeyNotFound,
            storage::StorageError::KeyExpired(_) => VaultError::KeyExpired,
            storage::StorageError::BiometricRequired => VaultError::BiometricRequired,
            storage::StorageError::NotExportable => VaultError::StorageError {
                msg: "Entry is not exportable".to_string(),
            },
            storage::StorageError::DatabaseError(msg) => VaultError::StorageError { msg },
            storage::StorageError::SerializationError(msg) => VaultError::SerializationError { msg },
        }
    }
}

impl From<crypto::CryptoError> for VaultError {
    fn from(e: crypto::CryptoError) -> Self {
        match e {
            crypto::CryptoError::EncryptionFailed => VaultError::EncryptionFailed,
            crypto::CryptoError::DecryptionFailed => VaultError::DecryptionFailed,
            _ => VaultError::EncryptionFailed,
        }
    }
}

/// Configuration for the vault
pub struct VaultConfig {
    pub app_id: String,
    pub db_path: Option<String>,
    pub encryption_algo: String,
    pub biometric_available: bool,
}

/// Options for storing a value
pub struct StoreOptions {
    pub expiry: Option<String>,
    pub biometric_required: bool,
    pub exportable: bool,
    pub namespace: Option<String>,
}

/// A vault entry returned to the caller
pub struct VaultEntry {
    pub key: String,
    pub value: String,
    pub namespace: Option<String>,
    pub expires_at: Option<String>,
    pub biometric_required: bool,
    pub exportable: bool,
    pub created_at: String,
    pub updated_at: String,
}

/// Vault statistics
pub struct VaultStats {
    pub total_entries: u64,
    pub total_namespaces: u64,
    pub expired_entries: u64,
    pub storage_bytes: u64,
}

// ─── Free Functions (exposed via UniFFI namespace) ────────────────────────

/// Generate a new random encryption key (base64 encoded)
pub fn generate_encryption_key() -> String {
    crypto::generate_key()
}

/// Hash a value (one-way, with salt)
pub fn hash_value(input: String) -> String {
    crypto::hash_with_salt(&input)
}

/// Verify a value against a hash
pub fn verify_hash(input: String, hash: String) -> bool {
    crypto::verify_salted_hash(&input, &hash)
}

// ─── Main Vault Struct ────────────────────────────────────────────────────

/// The main vault interface exposed to all platforms
pub struct RajeevVault {
    engine: Mutex<StorageEngine>,
    #[allow(dead_code)]
    biometric_available: bool,
}

impl RajeevVault {
    /// Create a new vault instance
    pub fn new(config: VaultConfig) -> Result<Self, VaultError> {
        // Derive master key from app_id (in production, this would use platform keystore)
        let master_key = format!("rajeev-vault-{}-master", config.app_id);

        let db_path = config
            .db_path
            .unwrap_or_else(|| format!("{}.vault.db", config.app_id));

        let engine = StorageEngine::new(&db_path, &master_key).map_err(|e| {
            VaultError::StorageError {
                msg: e.to_string(),
            }
        })?;

        Ok(RajeevVault {
            engine: Mutex::new(engine),
            biometric_available: config.biometric_available,
        })
    }

    /// Helper to lock the engine
    fn lock_engine(&self) -> Result<std::sync::MutexGuard<'_, StorageEngine>, VaultError> {
        self.engine.lock().map_err(|e| VaultError::StorageError {
            msg: format!("Lock poisoned: {}", e),
        })
    }

    /// Store a key-value pair
    pub fn store(
        &self,
        key: String,
        value: String,
        options: StoreOptions,
    ) -> Result<(), VaultError> {
        let engine = self.lock_engine()?;
        engine
            .store(
                &key,
                &value,
                options.namespace.as_deref(),
                options.expiry.as_deref(),
                options.biometric_required,
                options.exportable,
            )
            .map_err(VaultError::from)
    }

    /// Retrieve a value by key
    pub fn retrieve(&self, key: String, namespace: Option<String>) -> Result<Option<String>, VaultError> {
        let engine = self.lock_engine()?;
        engine
            .retrieve(&key, namespace.as_deref(), true)
            .map_err(VaultError::from)
    }

    /// Delete a key
    pub fn delete(&self, key: String, namespace: Option<String>) -> Result<bool, VaultError> {
        let engine = self.lock_engine()?;
        engine
            .delete(&key, namespace.as_deref())
            .map_err(VaultError::from)
    }

    /// Check if a key exists
    pub fn exists(&self, key: String, namespace: Option<String>) -> Result<bool, VaultError> {
        let engine = self.lock_engine()?;
        engine
            .exists(&key, namespace.as_deref())
            .map_err(VaultError::from)
    }

    /// List all keys in a namespace
    pub fn list_keys(&self, namespace: Option<String>) -> Result<Vec<String>, VaultError> {
        let engine = self.lock_engine()?;
        engine
            .list_keys(namespace.as_deref())
            .map_err(VaultError::from)
    }

    /// List all namespaces
    pub fn list_namespaces(&self) -> Result<Vec<String>, VaultError> {
        let engine = self.lock_engine()?;
        engine.list_namespaces().map_err(VaultError::from)
    }

    /// Wipe all entries in a namespace
    pub fn wipe_namespace(&self, namespace: String) -> Result<(), VaultError> {
        let engine = self.lock_engine()?;
        engine
            .wipe_namespace(&namespace)
            .map_err(VaultError::from)
    }

    /// Wipe everything — nuclear option
    pub fn wipe_all(&self) -> Result<(), VaultError> {
        let engine = self.lock_engine()?;
        engine.wipe_all().map_err(VaultError::from)
    }

    /// Get storage statistics
    pub fn get_stats(&self) -> Result<VaultStats, VaultError> {
        let engine = self.lock_engine()?;
        let stats = engine.get_stats().map_err(VaultError::from)?;
        Ok(VaultStats {
            total_entries: stats.total_entries,
            total_namespaces: stats.total_namespaces,
            expired_entries: stats.expired_entries,
            storage_bytes: stats.storage_bytes,
        })
    }

    /// Clean up expired entries
    pub fn cleanup_expired(&self) -> Result<(), VaultError> {
        let engine = self.lock_engine()?;
        engine.cleanup_expired().map_err(VaultError::from)?;
        Ok(())
    }

    /// Export an entry (encrypted)
    pub fn export_entry(
        &self,
        key: String,
        namespace: Option<String>,
    ) -> Result<Option<String>, VaultError> {
        let engine = self.lock_engine()?;
        engine
            .export_entry(&key, namespace.as_deref())
            .map_err(VaultError::from)
    }

    /// Import an encrypted entry
    pub fn import_entry(
        &self,
        key: String,
        encrypted_data: String,
        options: StoreOptions,
    ) -> Result<(), VaultError> {
        let engine = self.lock_engine()?;
        engine
            .import_entry(
                &key,
                &encrypted_data,
                options.namespace.as_deref(),
                options.expiry.as_deref(),
                options.biometric_required,
                options.exportable,
            )
            .map_err(VaultError::from)
    }
}

// ─── WASM Exports ─────────────────────────────────────────────────────────

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn wasm_generate_encryption_key() -> String {
    generate_encryption_key()
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn wasm_hash_value(input: &str) -> String {
    crypto::hash_with_salt(input)
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen]
pub fn wasm_verify_hash(input: &str, hash: &str) -> bool {
    crypto::verify_salted_hash(input, hash)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_vault() -> RajeevVault {
        RajeevVault::new(VaultConfig {
            app_id: "test-app".to_string(),
            db_path: Some(":memory:".to_string()),
            encryption_algo: "AES-256-GCM".to_string(),
            biometric_available: false,
        })
        .unwrap()
    }

    #[test]
    fn test_vault_store_retrieve() {
        let vault = create_test_vault();

        vault
            .store(
                "token".to_string(),
                "secret-123".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: None,
                },
            )
            .unwrap();

        let value = vault.retrieve("token".to_string(), None).unwrap();
        assert_eq!(value, Some("secret-123".to_string()));
    }

    #[test]
    fn test_vault_namespaces() {
        let vault = create_test_vault();

        vault
            .store(
                "key".to_string(),
                "value-auth".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: Some("auth".to_string()),
                },
            )
            .unwrap();

        vault
            .store(
                "key".to_string(),
                "value-pay".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: Some("payments".to_string()),
                },
            )
            .unwrap();

        let v1 = vault
            .retrieve("key".to_string(), Some("auth".to_string()))
            .unwrap();
        let v2 = vault
            .retrieve("key".to_string(), Some("payments".to_string()))
            .unwrap();

        assert_eq!(v1, Some("value-auth".to_string()));
        assert_eq!(v2, Some("value-pay".to_string()));
    }

    #[test]
    fn test_vault_wipe_all() {
        let vault = create_test_vault();

        vault
            .store(
                "k1".to_string(),
                "v1".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: None,
                },
            )
            .unwrap();

        vault.wipe_all().unwrap();
        let stats = vault.get_stats().unwrap();
        assert_eq!(stats.total_entries, 0);
    }

    #[test]
    fn test_free_functions() {
        let key = generate_encryption_key();
        assert!(!key.is_empty());

        let hash = hash_value("password".to_string());
        assert!(verify_hash("password".to_string(), hash.clone()));
        assert!(!verify_hash("wrong".to_string(), hash));
    }

    #[test]
    fn test_vault_delete() {
        let vault = create_test_vault();

        vault
            .store(
                "temp".to_string(),
                "value".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: None,
                },
            )
            .unwrap();

        assert!(vault.delete("temp".to_string(), None).unwrap());
        assert_eq!(vault.retrieve("temp".to_string(), None).unwrap(), None);
    }

    #[test]
    fn test_vault_exists() {
        let vault = create_test_vault();

        vault
            .store(
                "exists-key".to_string(),
                "value".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: None,
                },
            )
            .unwrap();

        assert!(vault.exists("exists-key".to_string(), None).unwrap());
        assert!(!vault.exists("no-key".to_string(), None).unwrap());
    }

    #[test]
    fn test_vault_unicode() {
        let vault = create_test_vault();

        vault
            .store(
                "hindi".to_string(),
                "namaste duniya".to_string(),
                StoreOptions {
                    expiry: None,
                    biometric_required: false,
                    exportable: true,
                    namespace: None,
                },
            )
            .unwrap();

        let value = vault.retrieve("hindi".to_string(), None).unwrap();
        assert_eq!(value, Some("namaste duniya".to_string()));
    }
}
