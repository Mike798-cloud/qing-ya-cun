export function createAudioManager({ store }) {
  const registry = new Map();
  let context = null;

  function enabled() { return Boolean(store.getState().settings.audioEnabled); }

  function register(id, src, options = {}) {
    registry.set(id, { src, volume: options.volume ?? 0.35, pool: [] });
  }

  async function play(id) {
    if (!enabled()) return false;
    const def = registry.get(id);
    if (!def || !def.src) return false;
    try {
      const audio = new Audio(def.src);
      audio.volume = Math.max(0, Math.min(1, def.volume));
      def.pool.push(audio);
      audio.addEventListener('ended', () => {
        const i = def.pool.indexOf(audio);
        if (i >= 0) def.pool.splice(i, 1);
      }, { once: true });
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }

  async function tone({ frequency = 440, duration = 0.08, volume = 0.025 } = {}) {
    if (!enabled() || !globalThis.AudioContext) return false;
    try {
      context ??= new AudioContext();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      osc.connect(gain).connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + duration + 0.02);
      return true;
    } catch {
      return false;
    }
  }

  function stopAll() {
    for (const def of registry.values()) {
      for (const audio of def.pool) {
        try { audio.pause(); audio.currentTime = 0; } catch {}
      }
      def.pool.length = 0;
    }
  }

  return { register, play, tone, stopAll };
}
