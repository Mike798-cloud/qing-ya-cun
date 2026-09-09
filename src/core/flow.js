export function createFlow({ store, gates = {}, stageRules = [] }) {
  function isUnlocked(id) {
    const state = store.getState();
    if (state.unlocked.includes(id)) return true;
    const gate = gates[id];
    return typeof gate === 'function' ? Boolean(gate(state)) : false;
  }

  function unlock(ids) {
    const list = Array.isArray(ids) ? ids : [ids];
    store.dispatch({ type: 'UNLOCK', ids: list });
  }

  function visit(id) {
    store.dispatch({ type: 'VISIT', id });
    evaluate();
  }

  function evaluate() {
    // Re-read state after every advancement so already-discovered public pages
    // never leave the story stuck waiting for an unrelated extra navigation.
    let changed = true;
    let guard = 0;
    while (changed && guard < 12) {
      changed = false;
      guard += 1;
      for (const rule of stageRules) {
        const state = store.getState();
        if (rule.stage > state.stage && rule.when(state)) {
          store.dispatch({ type: 'SET_STAGE', stage: rule.stage });
          if (rule.unlock) unlock(rule.unlock);
          changed = true;
          break;
        }
      }
    }
  }

  return { isUnlocked, unlock, visit, evaluate };
}
