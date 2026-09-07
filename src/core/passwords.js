const normalize = value => String(value || '').trim().toUpperCase().replace(/[\s_-]+/g, '');

export function createPasswordSystem({ store, definitions = {} }) {
  function verify(key, value) {
    const def = definitions[key];
    if (!def) return { ok: false, code: 'UNKNOWN_GATE' };
    if (store.getState().passwords[key]) return { ok: true, code: 'ALREADY_SOLVED', unlock: def.unlock || [] };
    if (normalize(value) !== normalize(def.answer)) return { ok: false, code: 'WRONG' };
    store.dispatch({ type: 'SET_PASSWORD_RESULT', key, solved: true });
    if (def.unlock?.length) store.dispatch({ type: 'UNLOCK', ids: def.unlock });
    if (def.stage) store.dispatch({ type: 'SET_STAGE', stage: def.stage });
    return { ok: true, code: 'SOLVED', unlock: def.unlock || [] };
  }

  return { verify, normalize };
}
