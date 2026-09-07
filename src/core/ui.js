export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2).toLowerCase(), value);
    else if (key === 'dataset' && typeof value === 'object') Object.assign(node.dataset, value);
    else if (value === true) node.setAttribute(key, '');
    else node.setAttribute(key, String(value));
  }
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child == null) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function icon(name) {
  const paths = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sound: '<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M16 9c1 .9 1.5 1.9 1.5 3S17 14.1 16 15"/><path d="M18.8 6.8c1.8 1.5 2.7 3.2 2.7 5.2s-.9 3.7-2.7 5.2"/>',
    mute: '<path d="M4 10v4h4l5 4V6L8 10H4z"/><path d="M17 9l5 6M22 9l-5 6"/>',
    text: '<path d="M5 7V4h14v3M12 4v16M8 20h8"/>',
    reset: '<path d="M4 4v6h6"/><path d="M5.5 9a8 8 0 1 1-1 6"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    help: '<path d="M9.5 9a3 3 0 1 1 4.7 2.5c-1.2.7-2.2 1.4-2.2 3"/><path d="M12 18h.01"/><circle cx="12" cy="12" r="9"/>',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths[name] || paths.help;
  return svg;
}

export function toast(message, { duration = 2600 } = {}) {
  let region = document.querySelector('.toast-region');
  if (!region) {
    region = el('div', { class: 'toast-region', 'aria-live': 'polite', 'aria-atomic': 'false' });
    document.body.append(region);
  }
  const item = el('div', { class: 'toast', role: 'status', text: message });
  region.append(item);
  setTimeout(() => item.remove(), duration);
}
