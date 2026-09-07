import { openOverlay } from './overlay.js';
import { el, icon } from './ui.js';

export function openModal({ title, content, closeLabel = '关闭', onClose } = {}) {
  const backdrop = el('div', { class: 'modal-backdrop', role: 'presentation' });
  const dialog = el('section', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title || '对话框', tabindex: '-1' });
  const header = el('div', { class: 'modal__header' });
  header.append(el('h2', { class: 'modal__title', text: title || '' }));
  const closeBtn = el('button', { class: 'icon-button modal__close', type: 'button', 'aria-label': closeLabel });
  closeBtn.append(icon('close'));
  header.append(closeBtn);
  const body = el('div', { class: 'modal__body' });
  if (content instanceof Node) body.append(content); else if (typeof content === 'string') body.textContent = content;
  dialog.append(header, body);
  backdrop.append(dialog);
  let close;
  close = openOverlay(backdrop, { onClose, focusSelector: '.modal__close' });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('pointerdown', e => { if (e.target === backdrop) close(); });
  return close;
}
