// lib/db.js — DISABLED. All data now goes through Supabase 100%.
// This file is intentionally a no-op stub to avoid import errors.

export function getDb() {
  return {
    prepare: () => ({
      get: () => null,
      all: () => [],
      run: () => ({ changes: 0 })
    })
  };
}
