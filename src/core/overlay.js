let lastFocused = null;
let activeClose = null;

function overlayRoot() { return document.getElementById('overlay-root'); }
function focusables(root) {
  return [...root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')]
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

function trapKeydown(event, root, close) {
  if (event.key === 'Escape') { event.preventDefault(); close(); return; }
  if (event.key !== 'Tab') return;
  const items = focusables(root);
  if (!items.length) { event.preventDefault(); root.focus(); return; }
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

export function closeOverlay() {
  activeClose?.();
}

export function openOverlay(node, { onClose, focusSelector } = {}) {
  const root = overlayRoot();
  if (!root) return () => {};
  activeClose?.();
  lastFocused = document.activeElement;
  root.replaceChildren(node);
  document.body.style.overflow = 'hidden';

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    root.replaceChildren();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handler, true);
    activeClose = null;
    onClose?.();
    if (lastFocused instanceof HTMLElement && document.contains(lastFocused)) lastFocused.focus();
  };
  activeClose = close;
  const handler = e => trapKeydown(e, node, close);
  document.addEventListener('keydown', handler, true);
  requestAnimationFrame(() => {
    const target = focusSelector ? node.querySelector(focusSelector) : focusables(node)[0];
    (target || node).focus?.();
  });
  return close;
}
