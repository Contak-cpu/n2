export function createMockStorageAdapter(): {
  adapter: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void };
  store: Record<string, string>;
} {
  const store: Record<string, string> = {};
  const adapter = {
    getItem(key: string): string | null {
      return store[key] ?? null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
    },
    removeItem(key: string): void {
      delete store[key];
    },
  };
  return { adapter, store };
}
