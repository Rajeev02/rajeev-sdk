import { NativeModules, Platform } from 'react-native';
import type { NativeVaultModule } from './types';

/**
 * Get the native vault module for the current platform.
 *
 * Android: Uses JNI → Rust .so library
 * iOS: Uses C FFI → Rust .a static library
 * Web: Uses WASM → Rust compiled to WebAssembly
 */
function getNativeModule(): NativeVaultModule {
  const { RajeevVault } = NativeModules;

  if (!RajeevVault) {
    throw new Error(
      `@rajeev02/vault: Native module not found. ` +
        `Make sure you have run 'pod install' (iOS) or rebuilt the app (Android).\n\n` +
        `Platform: ${Platform.OS}\n` +
        `If you're on web, import from '@rajeev02/vault/web' instead.`,
    );
  }

  return RajeevVault as NativeVaultModule;
}

export const NativeBridge = {
  /**
   * Get the native module, lazy-loaded and cached
   */
  get module(): NativeVaultModule {
    return getNativeModule();
  },
};
