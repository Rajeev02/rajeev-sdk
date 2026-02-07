/**
 * @rajeev02/vault
 *
 * Universal Secure Storage for React Native
 * AES-256-GCM encrypted, cross-platform (Android, iOS, Web, Watch, Auto, IoT)
 *
 * Built with Rust core for maximum security and performance.
 *
 * @author Rajeev Joshi (https://github.com/Rajeev02)
 * @license MIT
 *
 * @example
 * ```typescript
 * import { Vault } from '@rajeev02/vault';
 *
 * const vault = await Vault.create({ appId: 'com.myapp' });
 *
 * // Store
 * await vault.set('token', 'my-secret', { expiry: '24h' });
 *
 * // Retrieve
 * const token = await vault.get('token');
 *
 * // Namespaces
 * const payments = vault.namespace('payments');
 * await payments.set('upi_pin', '1234', { biometricRequired: true });
 *
 * // JSON helpers
 * await vault.setJSON('user', { name: 'Rajeev', role: 'admin' });
 * const user = await vault.getJSON<User>('user');
 * ```
 */

// Core
export { Vault } from './vault';

// Types
export {
  VaultConfig,
  StoreOptions,
  VaultStats,
  VaultError,
  VaultErrorCode,
} from './types';

// React Hooks
export {
  useVault,
  useVaultValue,
  useVaultJSON,
  useVaultStats,
} from './hooks';
