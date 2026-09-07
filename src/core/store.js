import { reduceState } from './state.js';

export function createStore(initial, persistence) {
  let state = initial;
  const listeners = new Set();

  return {
    getState: () => state,
    dispatch(action) {
      state = reduceState(state, action);
      persistence?.save?.(state);
      listeners.forEach(fn => fn(state, action));
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
