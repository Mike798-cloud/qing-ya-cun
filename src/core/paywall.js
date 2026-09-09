/**
 * 自愿支持弹层。
 * 交互与《松涛粮站》保持一致：1 元二维码、已完成支持 / 下次一定、三重记录。
 * 《返程线》仅调整文案、存储键与自动出现时机。
 */
const STORAGE_KEY = '_return_route_support';
const SESSION_KEY = '_return_route_support_session';
const COOKIE_KEY = '_return_route_support_flag';
const AUTO_KEY = '_return_route_support_prompt_seen';

function safeGet(storage, key) {
  try { return storage?.getItem?.(key) || ''; } catch { return ''; }
}
function safeSet(storage, key, value) {
  try { storage?.setItem?.(key, value); return true; } catch { return false; }
}
function getCookie(name) {
  try {
    const prefix = `${name}=`;
    for (const chunk of String(document.cookie || '').split(';')) {
      const item = chunk.trim();
      if (item.startsWith(prefix)) return item.slice(prefix.length);
    }
  } catch {}
  return '';
}
function setCookie(name, value, days) {
  try {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  } catch {}
}
function token() {
  const raw = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}_abc_studio`;
  try { return btoa(raw); } catch { return raw; }
}

export function createPaywall() {
  let autoTimer = 0;
  let previousFocus = null;
  let memoryAutoSeen = false;

  const api = {
    hasPaid() {
      return Boolean(
        safeGet(globalThis.localStorage, STORAGE_KEY) ||
        safeGet(globalThis.sessionStorage, SESSION_KEY) ||
        getCookie(COOKIE_KEY)
      );
    },

    hasAutoShown() {
      return Boolean(memoryAutoSeen || safeGet(globalThis.localStorage, AUTO_KEY));
    },

    markPaid() {
      const value = token();
      safeSet(globalThis.localStorage, STORAGE_KEY, value);
      safeSet(globalThis.sessionStorage, SESSION_KEY, value);
      setCookie(COOKIE_KEY, value, 365);
    },

    markAutoShown() {
      memoryAutoSeen = true;
      safeSet(globalThis.localStorage, AUTO_KEY, '1');
    },

    show(config = {}) {
      if (api.hasPaid()) return false;
      const existing = document.getElementById('paywall-overlay');
      if (existing) {
        existing.hidden = false;
        existing.style.display = 'flex';
        existing.classList.remove('paywall-closing');
        requestAnimationFrame(() => requestAnimationFrame(() => existing.classList.add('paywall-show')));
        existing.querySelector('.paywall-close')?.focus?.();
        return true;
      }
      api._createOverlay(config);
      return true;
    },

    hide() {
      const overlay = document.getElementById('paywall-overlay');
      if (!overlay || overlay.hidden) return;
      overlay.classList.add('paywall-closing');
      overlay.classList.remove('paywall-show');
      setTimeout(() => {
        overlay.style.display = 'none';
        overlay.hidden = true;
        overlay.classList.remove('paywall-closing');
        previousFocus?.focus?.();
      }, 400);
    },

    support() {
      api.markPaid();
      api.hide();
      api._showThanks();
    },

    cancelAuto() {
      if (autoTimer) clearTimeout(autoTimer);
      autoTimer = 0;
    },

    maybeAutoShow({ stage, path }) {
      api.cancelAuto();
      if (api.hasPaid() || api.hasAutoShown() || Number(stage) < 2) return false;
      // 第一轮村内资料调查已经展开，但还没有进入 2017 事故深层材料。
      // 只在普通公开网页停留时出现，避免打断聊天、密码输入和异常插页。
      const stablePages = new Set(['qingya', 'jiuwan', 'service', 'food', 'watchmen', 'safety']);
      if (!stablePages.has(path)) return false;
      autoTimer = setTimeout(() => {
        autoTimer = 0;
        if (api.hasPaid() || api.hasAutoShown()) return;
        if (document.querySelector('.interlude, .interlude-overlay, [aria-modal="true"]')) return;
        api.markAutoShown();
        api.show();
      }, 1100);
      return true;
    },

    _showThanks() {
      const old = document.querySelector('.paywall-toast');
      old?.remove?.();
      const toast = document.createElement('div');
      toast.className = 'paywall-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = '感谢你的支持。也谢谢你认真走到这里。';
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('show'), 50);
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 3000);
    },

    _createOverlay(config) {
      const cfg = {
        qrCode: 'https://mike798-cloud.github.io/songtao-grainstation/paycode.png',
        price: '1元',
        title: '支持《返程线》',
        studio: 'abc studio',
        ...config,
      };
      previousFocus = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'paywall-overlay';
      overlay.id = 'paywall-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'paywall-title');
      overlay.innerHTML = `
        <div class="paywall-card" role="document">
          <button class="paywall-close" type="button" title="关闭" aria-label="关闭支持弹层">&times;</button>
          <div class="paywall-card-inner">
            <div class="paywall-header">
              <div class="paywall-title-row">
                <span class="paywall-heart" aria-hidden="true">♡</span>
                <span class="paywall-title" id="paywall-title"></span>
                <span class="paywall-heart" aria-hidden="true">♡</span>
              </div>
              <div class="paywall-subtitle"></div>
            </div>
            <div class="paywall-body">
              <div class="paywall-qr-wrapper">
                <img alt="1元支持收款码" class="paywall-qr-img" />
                <div class="paywall-qr-glow"></div>
                <div class="paywall-qr-fallback" hidden>收款码暂时没有加载出来，请联网后重试。</div>
              </div>
              <div class="paywall-qr-tip">请用 <strong>某宝</strong> 扫码支持 <span class="paywall-price-inline"></span></div>
              <div class="paywall-message">
                <p class="paywall-msg-warm">你好，我是 abc studio 的独立开发者。</p>
                <p class="paywall-msg-body">《返程线》里的聊天、旧网页、路线资料和每一段交叉信息都反复调整过。<br>如果这段调查让你愿意继续看下去，也愿意支持 <strong>1元</strong>，<br>那会成为我继续做下一部作品的动力。</p>
                <p class="paywall-msg-cute">1块钱不多，但会让我知道，真的有人把这条“返程线”走完了。</p>
                <p class="paywall-msg-warm2">不支持也完全不影响后续内容。谢谢你愿意花时间玩到这里。</p>
              </div>
            </div>
            <div class="paywall-footer">
              <div class="paywall-hint"><span class="paywall-hint-icon">💡</span><span>支持记录独立于游戏存档；重新开始调查不会再次自动弹出。</span></div>
              <div class="paywall-btns">
                <button class="paywall-btn paywall-btn-support" type="button">已完成支持 ♡</button>
                <button class="paywall-btn paywall-btn-later" type="button">下次一定</button>
              </div>
            </div>
            <div class="paywall-studio"></div>
          </div>
        </div>`;

      overlay.querySelector('#paywall-title').textContent = cfg.title;
      overlay.querySelector('.paywall-subtitle').textContent = `${cfg.price} 自愿打赏 · 感谢支持`;
      overlay.querySelector('.paywall-price-inline').textContent = cfg.price;
      overlay.querySelector('.paywall-studio').textContent = cfg.studio;
      const qr = overlay.querySelector('.paywall-qr-img');
      const fallback = overlay.querySelector('.paywall-qr-fallback');
      qr.src = cfg.qrCode;
      qr.addEventListener('error', () => {
        qr.hidden = true;
        fallback.hidden = false;
      }, { once: true });
      overlay.querySelector('.paywall-close').addEventListener('click', api.hide);
      overlay.querySelector('.paywall-btn-later').addEventListener('click', api.hide);
      overlay.querySelector('.paywall-btn-support').addEventListener('click', api.support);
      overlay.addEventListener('click', event => {
        if (event.target === overlay) api.hide();
      });
      overlay.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); api.hide(); return; }
        if (event.key !== 'Tab') return;
        const focusables = [...overlay.querySelectorAll('button:not([disabled]), a[href], input:not([disabled])')].filter(x => !x.hidden);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      document.body.appendChild(overlay);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.classList.add('paywall-show');
        overlay.querySelector('.paywall-close')?.focus?.();
      }));
    },
  };

  return api;
}
