import { openOverlay } from './overlay.js';
import { el, icon } from './ui.js';

export function openLightbox({ src, alt = '', caption = '' }) {
  const backdrop = el('div', { class: 'lightbox-backdrop' });
  const wrap = el('figure', { class: 'lightbox', role: 'dialog', 'aria-modal': 'true', 'aria-label': caption || alt || '图片预览', tabindex: '-1' });
  const imgWrap = el('div', { class: 'lightbox__image-wrap' });
  const image = el('img', { class: 'lightbox__image', src, alt });
  imgWrap.append(image);
  const cap = el('figcaption', { class: 'lightbox__caption', text: caption });
  const closeBtn = el('button', { class: 'icon-button lightbox__close', type: 'button', 'aria-label': '关闭图片预览' });
  closeBtn.append(icon('close'));
  wrap.append(imgWrap, cap);
  backdrop.append(wrap, closeBtn);
  const close = openOverlay(backdrop, { focusSelector: '.lightbox__close' });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('pointerdown', e => { if (e.target === backdrop) close(); });
  return close;
}
