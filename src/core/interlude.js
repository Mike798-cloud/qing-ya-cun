import { openOverlay } from './overlay.js';
import { el } from './ui.js';

export function createInterludePlayer({ store, audio }) {
  async function play({ id, duration = 3000, render, sound, skippable = true }) {
    if (!id || store.getState().interludesSeen.includes(id)) return { skipped: true, seen: true };
    const backdrop = el('div', { class: 'interlude-backdrop', role: 'dialog', 'aria-modal': 'true', 'aria-label': '短暂插页', tabindex: '-1' });
    const area = el('div', { class: 'interlude' });
    const content = el('div', { class: 'interlude__content' });
    const rendered = render?.();
    if (rendered instanceof Node) content.append(rendered);
    area.append(content);
    backdrop.append(area);
    let close;
    let done = false;
    const finish = resolve => {
      if (done) return;
      done = true;
      store.dispatch({ type: 'MARK_INTERLUDE', id });
      close?.();
      resolve({ skipped: false, seen: false });
    };

    return new Promise(resolve => {
      if (skippable) {
        const skip = el('button', { class: 'btn btn--quiet interlude__skip', type: 'button', text: '跳过' });
        backdrop.append(skip);
        skip.addEventListener('click', () => finish(resolve));
      }
      close = openOverlay(backdrop, { onClose: () => { if (!done) { done = true; store.dispatch({ type: 'MARK_INTERLUDE', id }); resolve({ skipped: true, seen: false }); } } });
      if (sound) audio?.play?.(sound);
      setTimeout(() => finish(resolve), Math.max(500, duration));
    });
  }
  return { play };
}
