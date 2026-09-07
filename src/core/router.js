function normalize(raw) {
  const value = String(raw || '').replace(/^#\/?/, '').trim();
  const [pathPart, queryString = ''] = value.split('?');
  const path = (pathPart || 'boot').replace(/^\/+|\/+$/g, '') || 'boot';
  return { path, query: new URLSearchParams(queryString) };
}

export function createRouter({ routes, canAccess = () => true, fallback = 'boot', onNavigate }) {
  let started = false;

  function resolve() {
    const request = normalize(globalThis.location?.hash || '');
    let path = routes.has(request.path) ? request.path : fallback;
    if (!canAccess(path)) path = fallback;
    return { path, query: request.query };
  }

  function render() {
    const current = resolve();
    onNavigate(current);
  }

  function navigate(path, { replace = false } = {}) {
    const safe = String(path || fallback).replace(/^#?\/?/, '');
    const hash = `#/${safe}`;
    if (globalThis.location?.hash === hash) return render();
    if (replace) globalThis.location?.replace?.(hash);
    else if (globalThis.location) globalThis.location.hash = hash;
  }

  function start() {
    if (started) return;
    started = true;
    globalThis.addEventListener?.('hashchange', render);
    render();
  }

  return { start, navigate, resolve, normalize };
}

export { normalize as normalizeRoute };
