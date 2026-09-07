export const STORAGE_KEY = 'return-route:save:v1';
export const SAVE_VERSION = 1;

export const initialState = Object.freeze({
  version: SAVE_VERSION,
  stage: 0,
  visited: [],
  unlocked: ['boot'],
  flags: {},
  choices: {},
  passwords: {},
  messages: [],
  interludesSeen: [],
  settings: {
    audioEnabled: true,
    reducedMotion: false,
    textScale: 1,
  },
  meta: {
    createdAt: 0,
    updatedAt: 0,
    endingReached: false,
  },
});

function clone(value) {
  return typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

export function makeInitialState(now = Date.now()) {
  const state = clone(initialState);
  state.meta.createdAt = now;
  state.meta.updatedAt = now;
  return state;
}

export function sanitizeState(candidate, now = Date.now()) {
  const base = makeInitialState(now);
  if (!candidate || typeof candidate !== 'object') return base;

  const merged = {
    ...base,
    ...candidate,
    settings: { ...base.settings, ...(candidate.settings || {}) },
    meta: { ...base.meta, ...(candidate.meta || {}) },
  };

  merged.version = SAVE_VERSION;
  merged.stage = Number.isInteger(merged.stage) ? Math.max(0, Math.min(9, merged.stage)) : 0;
  merged.visited = uniqueStrings(merged.visited);
  merged.unlocked = uniqueStrings(merged.unlocked);
  if (!merged.unlocked.includes('boot')) merged.unlocked.unshift('boot');
  merged.interludesSeen = uniqueStrings(merged.interludesSeen);
  merged.flags = plainObject(merged.flags);
  merged.choices = plainObject(merged.choices);
  merged.passwords = plainObject(merged.passwords);
  merged.messages = Array.isArray(merged.messages) ? merged.messages.filter(isSafeMessage).slice(-300) : [];
  merged.settings.audioEnabled = Boolean(merged.settings.audioEnabled);
  merged.settings.reducedMotion = Boolean(merged.settings.reducedMotion);
  merged.settings.textScale = [0.9, 1, 1.1, 1.2].includes(merged.settings.textScale) ? merged.settings.textScale : 1;
  merged.meta.endingReached = Boolean(merged.meta.endingReached);
  merged.meta.createdAt = Number.isFinite(merged.meta.createdAt) && merged.meta.createdAt > 0 ? merged.meta.createdAt : now;
  merged.meta.updatedAt = now;
  return merged;
}

function uniqueStrings(value) {
  return Array.isArray(value) ? [...new Set(value.filter(v => typeof v === 'string' && v.length < 120))] : [];
}
function plainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}
function isSafeMessage(v) {
  return v && typeof v === 'object' && typeof v.id === 'string' && typeof v.text === 'string';
}

export function reduceState(state, action, now = Date.now()) {
  const next = sanitizeState(state, now);
  switch (action?.type) {
    case 'VISIT': {
      const id = String(action.id || '');
      if (id && !next.visited.includes(id)) next.visited.push(id);
      break;
    }
    case 'UNLOCK': {
      const ids = Array.isArray(action.ids) ? action.ids : [action.id];
      for (const raw of ids) {
        const id = String(raw || '');
        if (id && !next.unlocked.includes(id)) next.unlocked.push(id);
      }
      break;
    }
    case 'SET_STAGE':
      next.stage = Math.max(next.stage, Math.min(9, Math.max(0, Number(action.stage) || 0)));
      break;
    case 'SET_FLAG':
      if (action.key) next.flags[String(action.key)] = action.value;
      break;
    case 'SET_CHOICE':
      if (action.key) next.choices[String(action.key)] = String(action.value ?? '');
      break;
    case 'SET_PASSWORD_RESULT':
      if (action.key) next.passwords[String(action.key)] = Boolean(action.solved);
      break;
    case 'ADD_MESSAGE':
      if (isSafeMessage(action.message) && !next.messages.some(m => m.id === action.message.id)) {
        next.messages.push({ ...action.message });
        if (next.messages.length > 300) next.messages.splice(0, next.messages.length - 300);
      }
      break;
    case 'MARK_INTERLUDE': {
      const id = String(action.id || '');
      if (id && !next.interludesSeen.includes(id)) next.interludesSeen.push(id);
      break;
    }
    case 'SET_SETTING':
      if (Object.hasOwn(next.settings, action.key)) next.settings[action.key] = action.value;
      break;
    case 'ENDING_REACHED':
      next.meta.endingReached = true;
      break;
    default:
      break;
  }
  next.meta.updatedAt = now;
  return sanitizeState(next, now);
}
