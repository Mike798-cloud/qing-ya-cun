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
    const state = store.getState();
    for (const rule of stageRules) {
      if (rule.stage > state.stage && rule.when(state)) {
        store.dispatch({ type: 'SET_STAGE', stage: rule.stage });
        if (rule.unlock) unlock(rule.unlock);
      }
    }
  }

  return { isUnlocked, unlock, visit, evaluate };
}
