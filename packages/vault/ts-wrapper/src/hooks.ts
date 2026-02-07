import { useCallback, useEffect, useRef, useState } from 'react';
import { Vault } from './vault';
import type { VaultConfig, StoreOptions, VaultStats } from './types';

/**
 * React hook to create and manage a Vault instance.
 *
 * @param config - Vault configuration
 * @returns Vault instance and loading state
 *
 * @example
 * ```tsx
 * function App() {
 *   const { vault, isReady, error } = useVault({ appId: 'com.myapp' });
 *
 *   if (!isReady) return <LoadingScreen />;
 *   if (error) return <ErrorScreen error={error} />;
 *
 *   return <MainApp vault={vault!} />;
 * }
 * ```
 */
export function useVault(config: VaultConfig) {
  const [vault, setVault] = useState<Vault | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    Vault.create(config)
      .then((v) => {
        setVault(v);
        setIsReady(true);
      })
      .catch((e) => {
        setError(e);
        setIsReady(true);
      });
  }, [config.appId]);

  return { vault, isReady, error };
}

/**
 * React hook to read a value from the vault reactively.
 * Re-reads when the key or namespace changes.
 *
 * @param vault - Vault instance
 * @param key - Key to read
 * @param namespace - Optional namespace
 * @returns Value, loading state, and refresh function
 *
 * @example
 * ```tsx
 * function TokenDisplay({ vault }: { vault: Vault }) {
 *   const { value, isLoading, refresh } = useVaultValue(vault, 'auth_token');
 *
 *   if (isLoading) return <Text>Loading...</Text>;
 *
 *   return (
 *     <View>
 *       <Text>Token: {value ?? 'Not set'}</Text>
 *       <Button title="Refresh" onPress={refresh} />
 *     </View>
 *   );
 * }
 * ```
 */
export function useVaultValue(
  vault: Vault | null,
  key: string,
  namespace?: string,
) {
  const [value, setValue] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!vault) return;
    setIsLoading(true);
    try {
      const result = await vault.get(key, namespace);
      setValue(result);
      setError(null);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, [vault, key, namespace]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { value, isLoading, error, refresh };
}

/**
 * React hook to read a JSON value from the vault.
 *
 * @example
 * ```tsx
 * interface UserProfile {
 *   name: string;
 *   email: string;
 * }
 *
 * function Profile({ vault }: { vault: Vault }) {
 *   const { data, isLoading } = useVaultJSON<UserProfile>(vault, 'profile');
 *
 *   if (isLoading) return <Text>Loading...</Text>;
 *   return <Text>Hello, {data?.name ?? 'Guest'}</Text>;
 * }
 * ```
 */
export function useVaultJSON<T = unknown>(
  vault: Vault | null,
  key: string,
  namespace?: string,
) {
  const { value, isLoading, error, refresh } = useVaultValue(vault, key, namespace);

  const data = value ? (JSON.parse(value) as T) : null;

  return { data, isLoading, error, refresh };
}

/**
 * React hook to get vault statistics.
 *
 * @example
 * ```tsx
 * function VaultInfo({ vault }: { vault: Vault }) {
 *   const { stats, isLoading } = useVaultStats(vault);
 *
 *   return (
 *     <Text>
 *       Entries: {stats?.totalEntries ?? 0}
 *       Size: {stats?.storageBytes ?? 0} bytes
 *     </Text>
 *   );
 * }
 * ```
 */
export function useVaultStats(vault: Vault | null) {
  const [stats, setStats] = useState<VaultStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!vault) return;
    setIsLoading(true);
    try {
      const s = await vault.stats();
      setStats(s);
    } finally {
      setIsLoading(false);
    }
  }, [vault]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, isLoading, refresh };
}
