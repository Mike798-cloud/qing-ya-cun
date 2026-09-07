import { STORAGE_KEY, makeInitialState, sanitizeState } from './state.js';

export function createStorage(adapter = globalThis.localStorage) {
  function load() {
    try {
      const raw = adapter?.getItem(STORAGE_KEY);
      if (!raw) return makeInitialState();
      return sanitizeState(JSON.parse(raw));
    } catch {
      return makeInitialState();
    }
  }

  function save(state) {
    try {
      adapter?.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
      return true;
    } catch {
      return false;
    }
  }

  function clear() {
    try {
      adapter?.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }

  return { load, save, clear };
}
