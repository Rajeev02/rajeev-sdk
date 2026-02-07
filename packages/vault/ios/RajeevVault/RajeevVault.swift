import Foundation
import React

@objc(RajeevVault)
class RajeevVault: NSObject, RCTBridgeModule {

    private var vault: RajeevVaultCore? = nil

    @objc static func moduleName() -> String! {
        return "RajeevVault"
    }

    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }

    // MARK: - Create

    @objc func create(_ config: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let appId = config["appId"] as? String else {
            reject("VAULT_INIT_ERROR", "appId is required", nil)
            return
        }

        let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
        let dbPath = (config["dbPath"] as? String) ?? "\(documentsPath)/\(appId).vault.db"
        let encryptionAlgo = (config["encryptionAlgo"] as? String) ?? "AES-256-GCM"
        let biometricAvailable = (config["biometricAvailable"] as? Bool) ?? false

        do {
            let vaultConfig = VaultConfig(
                appId: appId,
                dbPath: dbPath,
                encryptionAlgo: encryptionAlgo,
                biometricAvailable: biometricAvailable
            )
            vault = try RajeevVaultCore(config: vaultConfig)
            resolve(nil)
        } catch {
            reject("VAULT_INIT_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Store

    @objc func store(_ key: String, value: String, expiry: String?, biometricRequired: Bool, exportable: Bool, namespace: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let options = StoreOptions(
                expiry: expiry,
                biometricRequired: biometricRequired,
                exportable: exportable,
                namespace: namespace
            )
            try vault.store(key: key, value: value, options: options)
            resolve(nil)
        } catch {
            reject("VAULT_STORE_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Retrieve

    @objc func retrieve(_ key: String, namespace: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let value = try vault.retrieve(key: key, namespace: namespace)
            resolve(value)
        } catch {
            reject("VAULT_RETRIEVE_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Delete

    @objc func delete(_ key: String, namespace: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let result = try vault.delete(key: key, namespace: namespace)
            resolve(result)
        } catch {
            reject("VAULT_DELETE_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Exists

    @objc func exists(_ key: String, namespace: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let result = try vault.exists(key: key, namespace: namespace)
            resolve(result)
        } catch {
            reject("VAULT_EXISTS_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - List Keys

    @objc func listKeys(_ namespace: String?, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let keys = try vault.listKeys(namespace: namespace)
            resolve(keys)
        } catch {
            reject("VAULT_LIST_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - List Namespaces

    @objc func listNamespaces(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let namespaces = try vault.listNamespaces()
            resolve(namespaces)
        } catch {
            reject("VAULT_LIST_NS_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Wipe

    @objc func wipeNamespace(_ namespace: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            try vault.wipeNamespace(namespace: namespace)
            resolve(nil)
        } catch {
            reject("VAULT_WIPE_NS_ERROR", error.localizedDescription, error)
        }
    }

    @objc func wipeAll(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            try vault.wipeAll()
            resolve(nil)
        } catch {
            reject("VAULT_WIPE_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Stats

    @objc func getStats(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            let stats = try vault.getStats()
            resolve([
                "totalEntries": stats.totalEntries,
                "totalNamespaces": stats.totalNamespaces,
                "expiredEntries": stats.expiredEntries,
                "storageBytes": stats.storageBytes,
            ])
        } catch {
            reject("VAULT_STATS_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Cleanup

    @objc func cleanupExpired(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let vault = vault else {
            reject("VAULT_NOT_INIT", "Vault not initialized", nil)
            return
        }

        do {
            try vault.cleanupExpired()
            resolve(nil)
        } catch {
            reject("VAULT_CLEANUP_ERROR", error.localizedDescription, error)
        }
    }

    // MARK: - Static Utilities

    @objc func generateKey(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(generateEncryptionKey())
    }

    @objc func hash(_ input: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(hashValue(input: input))
    }

    @objc func verifyHash(_ input: String, hash: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        resolve(verifyHash(input: input, hash: hash))
    }
}
