/**
 * @rajeev02/vault - Type Definitions
 *
 * Universal secure storage for React Native, Web, Watch, Auto, IoT
 * Built by Rajeev Joshi (https://github.com/Rajeev02)
 */

/** Configuration for creating a vault instance */
export interface VaultConfig {
  /** Unique app identifier (e.g., 'com.myapp') */
  appId: string;

  /** Custom database path. Defaults to app-specific location */
  dbPath?: string;

  /** Encryption algorithm. Default: 'AES-256-GCM' */
  encryption?: 'AES-256-GCM';

  /** Whether biometric auth is available on this device */
  biometricAvailable?: boolean;
}

/** Options when storing a value */
export interface StoreOptions {
  /**
   * When the value should expire and auto-delete.
   * Format: "30m" (minutes), "24h" (hours), "7d" (days), "4w" (weeks)
   * Default: null (never expires)
   */
  expiry?: string | null;

  /**
   * Whether biometric authentication is required to read this value.
   * Default: false
   */
  biometricRequired?: boolean;

  /**
   * Whether this entry can be exported/backed up.
   * Set to false for highly sensitive data like PINs.
   * Default: true
   */
  exportable?: boolean;

  /**
   * Namespace to group related entries.
   * e.g., 'auth', 'payments', 'health'
   * Default: 'default'
   */
  namespace?: string;
}

/** Statistics about the vault */
export interface VaultStats {
  /** Total number of stored entries */
  totalEntries: number;

  /** Number of distinct namespaces */
  totalNamespaces: number;

  /** Number of expired entries pending cleanup */
  expiredEntries: number;

  /** Approximate storage used in bytes */
  storageBytes: number;
}

/** Error codes returned by the vault */
export enum VaultErrorCode {
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  KEY_NOT_FOUND = 'KEY_NOT_FOUND',
  KEY_EXPIRED = 'KEY_EXPIRED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  INVALID_CONFIG = 'INVALID_CONFIG',
  BIOMETRIC_REQUIRED = 'BIOMETRIC_REQUIRED',
  BIOMETRIC_FAILED = 'BIOMETRIC_FAILED',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
}

/** Custom error class for vault operations */
export class VaultError extends Error {
  public readonly code: VaultErrorCode;

  constructor(code: VaultErrorCode, message?: string) {
    super(message || code);
    this.name = 'VaultError';
    this.code = code;
  }
}

/** Internal native module interface (platform-specific) */
export interface NativeVaultModule {
  create(config: {
    appId: string;
    dbPath?: string;
    encryptionAlgo: string;
    biometricAvailable: boolean;
  }): Promise<void>;

  store(
    key: string,
    value: string,
    expiry: string | null,
    biometricRequired: boolean,
    exportable: boolean,
    namespace: string | null,
  ): Promise<void>;

  retrieve(key: string, namespace: string | null): Promise<string | null>;
  delete(key: string, namespace: string | null): Promise<boolean>;
  exists(key: string, namespace: string | null): Promise<boolean>;
  listKeys(namespace: string | null): Promise<string[]>;
  listNamespaces(): Promise<string[]>;
  wipeNamespace(namespace: string): Promise<void>;
  wipeAll(): Promise<void>;
  getStats(): Promise<VaultStats>;
  cleanupExpired(): Promise<void>;
  exportEntry(key: string, namespace: string | null): Promise<string | null>;
  importEntry(
    key: string,
    encryptedData: string,
    expiry: string | null,
    biometricRequired: boolean,
    exportable: boolean,
    namespace: string | null,
  ): Promise<void>;
  generateKey(): Promise<string>;
  hash(input: string): Promise<string>;
  verifyHash(input: string, hash: string): Promise<boolean>;
}
