import { NativeBridge } from './native-bridge';
import {
  VaultConfig,
  StoreOptions,
  VaultStats,
  VaultError,
  VaultErrorCode,
} from './types';

/**
 * 🔐 Rajeev Vault — Universal Secure Storage
 *
 * AES-256-GCM encrypted storage that works across all platforms.
 * Built with Rust core for maximum security and performance.
 *
 * @example
 * ```typescript
 * import { Vault } from '@rajeev02/vault';
 *
 * // Create vault
 * const vault = await Vault.create({ appId: 'com.myapp' });
 *
 * // Store securely
 * await vault.set('token', 'my-secret-value', { expiry: '24h' });
 *
 * // Retrieve
 * const token = await vault.get('token');
 *
 * // Use namespaces
 * await vault.namespace('payments').set('upi_pin', '1234', {
 *   biometricRequired: true,
 *   exportable: false,
 * });
 * ```
 *
 * @author Rajeev Joshi (https://github.com/Rajeev02)
 */
export class Vault {
  private initialized = false;
  private config: VaultConfig;
  private currentNamespace: string | null = null;

  private constructor(config: VaultConfig) {
    this.config = config;
  }

  /**
   * Create a new Vault instance.
   * This is the main entry point — use this instead of `new Vault()`.
   *
   * @param config - Vault configuration
   * @returns Initialized Vault instance
   *
   * @example
   * ```typescript
   * const vault = await Vault.create({
   *   appId: 'com.myapp',
   *   biometricAvailable: true,
   * });
   * ```
   */
  static async create(config: VaultConfig): Promise<Vault> {
    const vault = new Vault(config);

    try {
      await NativeBridge.module.create({
        appId: config.appId,
        dbPath: config.dbPath,
        encryptionAlgo: config.encryption || 'AES-256-GCM',
        biometricAvailable: config.biometricAvailable ?? false,
      });
      vault.initialized = true;
    } catch (error) {
      throw new VaultError(
        VaultErrorCode.INVALID_CONFIG,
        `Failed to initialize vault: ${error}`,
      );
    }

    return vault;
  }

  /**
   * Ensure the vault is initialized before any operation
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new VaultError(
        VaultErrorCode.NOT_INITIALIZED,
        'Vault not initialized. Call Vault.create() first.',
      );
    }
  }

  // ─── Core Operations ─────────────────────────────────────────────

  /**
   * Store a value securely.
   *
   * @param key - Unique key for the value
   * @param value - String value to encrypt and store
   * @param options - Storage options (expiry, biometric, namespace)
   *
   * @example
   * ```typescript
   * // Simple store
   * await vault.set('token', 'eyJhbG...');
   *
   * // With expiry
   * await vault.set('otp', '4829', { expiry: '5m' });
   *
   * // With biometric protection
   * await vault.set('pin', '1234', {
   *   biometricRequired: true,
   *   exportable: false,
   * });
   *
   * // Store JSON
   * await vault.set('user', JSON.stringify({ name: 'Rajeev', role: 'admin' }));
   * ```
   */
  async set(key: string, value: string, options?: StoreOptions): Promise<void> {
    this.ensureInitialized();

    const ns = options?.namespace ?? this.currentNamespace;

    await NativeBridge.module.store(
      key,
      value,
      options?.expiry ?? null,
      options?.biometricRequired ?? false,
      options?.exportable ?? true,
      ns,
    );
  }

  /**
   * Retrieve a decrypted value.
   * Returns null if the key doesn't exist or has expired.
   *
   * @param key - Key to retrieve
   * @param namespace - Optional namespace override
   * @returns Decrypted value or null
   *
   * @example
   * ```typescript
   * const token = await vault.get('token');
   * if (token) {
   *   console.log('Got token:', token);
   * } else {
   *   console.log('Token not found or expired');
   * }
   *
   * // Get JSON
   * const userJson = await vault.get('user');
   * const user = userJson ? JSON.parse(userJson) : null;
   * ```
   */
  async get(key: string, namespace?: string): Promise<string | null> {
    this.ensureInitialized();
    const ns = namespace ?? this.currentNamespace;
    return NativeBridge.module.retrieve(key, ns);
  }

  /**
   * Get a value, parsed as JSON.
   * Convenience method that combines get() + JSON.parse().
   *
   * @param key - Key to retrieve
   * @param namespace - Optional namespace override
   * @returns Parsed object or null
   */
  async getJSON<T = unknown>(key: string, namespace?: string): Promise<T | null> {
    const raw = await this.get(key, namespace);
    if (raw === null) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Store a value as JSON.
   * Convenience method that combines JSON.stringify() + set().
   */
  async setJSON<T>(key: string, value: T, options?: StoreOptions): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.set(key, serialized, options);
  }

  /**
   * Delete a key from the vault.
   *
   * @param key - Key to delete
   * @param namespace - Optional namespace override
   * @returns true if the key was deleted, false if not found
   */
  async delete(key: string, namespace?: string): Promise<boolean> {
    this.ensureInitialized();
    const ns = namespace ?? this.currentNamespace;
    return NativeBridge.module.delete(key, ns);
  }

  /**
   * Check if a key exists (and is not expired).
   *
   * @param key - Key to check
   * @param namespace - Optional namespace override
   * @returns true if key exists and is valid
   */
  async has(key: string, namespace?: string): Promise<boolean> {
    this.ensureInitialized();
    const ns = namespace ?? this.currentNamespace;
    return NativeBridge.module.exists(key, ns);
  }

  // ─── Namespace Operations ─────────────────────────────────────────

  /**
   * Create a namespace-scoped vault view.
   * All operations on the returned object are scoped to this namespace.
   *
   * @param name - Namespace name
   * @returns Namespace-scoped vault
   *
   * @example
   * ```typescript
   * const payments = vault.namespace('payments');
   * await payments.set('upi_pin', '1234');
   * await payments.set('card_last4', '4242');
   *
   * const health = vault.namespace('health');
   * await health.set('blood_group', 'O+');
   *
   * // Keys don't collide across namespaces
   * await vault.namespace('a').set('key', 'value-a');
   * await vault.namespace('b').set('key', 'value-b');
   * ```
   */
  namespace(name: string): NamespacedVault {
    this.ensureInitialized();
    return new NamespacedVault(this, name);
  }

  /**
   * List all keys in a namespace.
   *
   * @param namespace - Namespace to list (default namespace if not specified)
   * @returns Array of key names
   */
  async keys(namespace?: string): Promise<string[]> {
    this.ensureInitialized();
    const ns = namespace ?? this.currentNamespace;
    return NativeBridge.module.listKeys(ns);
  }

  /**
   * List all namespaces in the vault.
   *
   * @returns Array of namespace names
   */
  async namespaces(): Promise<string[]> {
    this.ensureInitialized();
    return NativeBridge.module.listNamespaces();
  }

  // ─── Destructive Operations ───────────────────────────────────────

  /**
   * Delete all entries in a namespace.
   *
   * @param namespace - Namespace to wipe
   */
  async wipeNamespace(namespace: string): Promise<void> {
    this.ensureInitialized();
    await NativeBridge.module.wipeNamespace(namespace);
  }

  /**
   * ⚠️ Delete EVERYTHING in the vault. Cannot be undone.
   * Typically used during logout.
   *
   * @example
   * ```typescript
   * async function logout() {
   *   await vault.wipeAll();
   *   navigation.reset('LoginScreen');
   * }
   * ```
   */
  async wipeAll(): Promise<void> {
    this.ensureInitialized();
    await NativeBridge.module.wipeAll();
  }

  // ─── Utility Operations ───────────────────────────────────────────

  /**
   * Get storage statistics.
   *
   * @returns Stats including entry count, namespaces, storage size
   */
  async stats(): Promise<VaultStats> {
    this.ensureInitialized();
    return NativeBridge.module.getStats();
  }

  /**
   * Clean up expired entries. Call periodically to reclaim space.
   */
  async cleanup(): Promise<void> {
    this.ensureInitialized();
    await NativeBridge.module.cleanupExpired();
  }

  // ─── Static Utilities ─────────────────────────────────────────────

  /**
   * Generate a cryptographically secure random key.
   * Useful for creating encryption keys, API tokens, etc.
   *
   * @returns Base64-encoded random key
   */
  static async generateKey(): Promise<string> {
    return NativeBridge.module.generateKey();
  }

  /**
   * Hash a value (one-way). Useful for storing passwords.
   *
   * @param input - Value to hash
   * @returns Salted hash string
   */
  static async hash(input: string): Promise<string> {
    return NativeBridge.module.hash(input);
  }

  /**
   * Verify a value against a hash.
   *
   * @param input - Value to verify
   * @param hash - Hash to verify against
   * @returns true if the value matches the hash
   */
  static async verifyHash(input: string, hash: string): Promise<boolean> {
    return NativeBridge.module.verifyHash(input, hash);
  }
}

/**
 * A namespace-scoped view of the vault.
 * All operations are automatically scoped to the namespace.
 */
class NamespacedVault {
  private vault: Vault;
  private name: string;

  constructor(vault: Vault, name: string) {
    this.vault = vault;
    this.name = name;
  }

  async set(key: string, value: string, options?: Omit<StoreOptions, 'namespace'>): Promise<void> {
    return this.vault.set(key, value, { ...options, namespace: this.name });
  }

  async get(key: string): Promise<string | null> {
    return this.vault.get(key, this.name);
  }

  async getJSON<T = unknown>(key: string): Promise<T | null> {
    return this.vault.getJSON<T>(key, this.name);
  }

  async setJSON<T>(key: string, value: T, options?: Omit<StoreOptions, 'namespace'>): Promise<void> {
    return this.vault.setJSON(key, value, { ...options, namespace: this.name });
  }

  async delete(key: string): Promise<boolean> {
    return this.vault.delete(key, this.name);
  }

  async has(key: string): Promise<boolean> {
    return this.vault.has(key, this.name);
  }

  async keys(): Promise<string[]> {
    return this.vault.keys(this.name);
  }

  async wipe(): Promise<void> {
    return this.vault.wipeNamespace(this.name);
  }
}
