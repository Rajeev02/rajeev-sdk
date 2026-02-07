package com.rajeevsdk.vault

import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule

/**
 * React Native native module for @rajeev02/vault
 *
 * This bridges the TypeScript API to the Rust vault core via JNI.
 * The Rust library (librajeev_vault_core.so) is loaded automatically.
 */
@ReactModule(name = RajeevVaultModule.NAME)
class RajeevVaultModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "RajeevVault"

        init {
            System.loadLibrary("rajeev_vault_core")
        }
    }

    override fun getName(): String = NAME

    // ─── Native (Rust via JNI) method declarations ──────────────────

    private external fun nativeCreate(
        appId: String,
        dbPath: String,
        encryptionAlgo: String,
        biometricAvailable: Boolean
    )

    private external fun nativeStore(
        key: String,
        value: String,
        expiry: String?,
        biometricRequired: Boolean,
        exportable: Boolean,
        namespace: String?
    )

    private external fun nativeRetrieve(key: String, namespace: String?): String?
    private external fun nativeDelete(key: String, namespace: String?): Boolean
    private external fun nativeExists(key: String, namespace: String?): Boolean
    private external fun nativeListKeys(namespace: String?): Array<String>
    private external fun nativeListNamespaces(): Array<String>
    private external fun nativeWipeNamespace(namespace: String)
    private external fun nativeWipeAll()
    private external fun nativeGetStats(): String // Returns JSON
    private external fun nativeCleanupExpired()
    private external fun nativeExportEntry(key: String, namespace: String?): String?
    private external fun nativeImportEntry(
        key: String,
        encryptedData: String,
        expiry: String?,
        biometricRequired: Boolean,
        exportable: Boolean,
        namespace: String?
    )
    private external fun nativeGenerateKey(): String
    private external fun nativeHash(input: String): String
    private external fun nativeVerifyHash(input: String, hash: String): Boolean

    // ─── React Native bridge methods ────────────────────────────────

    @ReactMethod
    fun create(config: ReadableMap, promise: Promise) {
        try {
            val appId = config.getString("appId") ?: throw Exception("appId required")
            val dbPath = if (config.hasKey("dbPath")) config.getString("dbPath")
                else reactApplicationContext.filesDir.absolutePath + "/$appId.vault.db"
            val encryptionAlgo = if (config.hasKey("encryptionAlgo"))
                config.getString("encryptionAlgo") else "AES-256-GCM"
            val biometricAvailable = if (config.hasKey("biometricAvailable"))
                config.getBoolean("biometricAvailable") else false

            nativeCreate(appId, dbPath!!, encryptionAlgo!!, biometricAvailable)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_INIT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun store(
        key: String,
        value: String,
        expiry: String?,
        biometricRequired: Boolean,
        exportable: Boolean,
        namespace: String?,
        promise: Promise
    ) {
        try {
            nativeStore(key, value, expiry, biometricRequired, exportable, namespace)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_STORE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun retrieve(key: String, namespace: String?, promise: Promise) {
        try {
            val value = nativeRetrieve(key, namespace)
            promise.resolve(value)
        } catch (e: Exception) {
            promise.reject("VAULT_RETRIEVE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun delete(key: String, namespace: String?, promise: Promise) {
        try {
            val result = nativeDelete(key, namespace)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("VAULT_DELETE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun exists(key: String, namespace: String?, promise: Promise) {
        try {
            val result = nativeExists(key, namespace)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("VAULT_EXISTS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun listKeys(namespace: String?, promise: Promise) {
        try {
            val keys = nativeListKeys(namespace)
            val array = Arguments.createArray()
            keys.forEach { array.pushString(it) }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("VAULT_LIST_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun listNamespaces(promise: Promise) {
        try {
            val namespaces = nativeListNamespaces()
            val array = Arguments.createArray()
            namespaces.forEach { array.pushString(it) }
            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("VAULT_LIST_NS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun wipeNamespace(namespace: String, promise: Promise) {
        try {
            nativeWipeNamespace(namespace)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_WIPE_NS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun wipeAll(promise: Promise) {
        try {
            nativeWipeAll()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_WIPE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun getStats(promise: Promise) {
        try {
            val statsJson = nativeGetStats()
            // Parse JSON and return as ReadableMap
            val map = Arguments.createMap()
            val json = org.json.JSONObject(statsJson)
            map.putInt("totalEntries", json.getInt("total_entries"))
            map.putInt("totalNamespaces", json.getInt("total_namespaces"))
            map.putInt("expiredEntries", json.getInt("expired_entries"))
            map.putDouble("storageBytes", json.getDouble("storage_bytes"))
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("VAULT_STATS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun cleanupExpired(promise: Promise) {
        try {
            nativeCleanupExpired()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_CLEANUP_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun exportEntry(key: String, namespace: String?, promise: Promise) {
        try {
            val data = nativeExportEntry(key, namespace)
            promise.resolve(data)
        } catch (e: Exception) {
            promise.reject("VAULT_EXPORT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun importEntry(
        key: String,
        encryptedData: String,
        expiry: String?,
        biometricRequired: Boolean,
        exportable: Boolean,
        namespace: String?,
        promise: Promise
    ) {
        try {
            nativeImportEntry(key, encryptedData, expiry, biometricRequired, exportable, namespace)
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("VAULT_IMPORT_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun generateKey(promise: Promise) {
        try {
            val key = nativeGenerateKey()
            promise.resolve(key)
        } catch (e: Exception) {
            promise.reject("VAULT_KEYGEN_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun hash(input: String, promise: Promise) {
        try {
            val hash = nativeHash(input)
            promise.resolve(hash)
        } catch (e: Exception) {
            promise.reject("VAULT_HASH_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun verifyHash(input: String, hash: String, promise: Promise) {
        try {
            val result = nativeVerifyHash(input, hash)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("VAULT_VERIFY_ERROR", e.message, e)
        }
    }
}
