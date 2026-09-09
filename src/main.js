import { createStorage } from './core/storage.js';
import { createStore } from './core/store.js';
import { createRouter } from './core/router.js';
import { createFlow } from './core/flow.js';
import { createPasswordSystem } from './core/passwords.js';
import { createAudioManager } from './core/audio.js';
import { createInterludePlayer } from './core/interlude.js';
import { recordContextualDiscovery, backfillLegacyCognition, storyEventDefinitions, getPendingStoryEvent } from './core/cognition.js';
import { openSettings } from './core/settings.js';
import { createPaywall } from './core/paywall.js';
import { isCommentCacheNoticeEligible, shouldAcknowledgeCommentCacheNotice, isFinalDraftNoticeEligible, shouldAcknowledgeFinalDraftNotice } from './core/notifications.js';
import { el, icon, toast } from './core/ui.js';
import { routeDefinitions, passwordDefinitions, stageRules, gates } from './data/content.js';
import { renderBoot, renderContact, renderProfile, renderPost, renderDraft1, renderQingya, renderJiuwan } from './pages/stage1.js';
import { renderService, renderFood, renderWatchmen, renderSafety } from './pages/stage2.js';
import { renderNews2017, renderCache2017 } from './pages/stage3.js';
import { renderZhouCheng, renderZhouYougen } from './pages/stage4.js';
import { renderWatchman04Detail, renderSecondBook } from './pages/stage5.js';
import { renderAjiComment, renderFinalDraft } from './pages/stage6.js';
import { renderRescueResult, renderEnding } from './pages/stage7.js';

const storage = createStorage();
const store = createStore(storage.load(), storage);
const flow = createFlow({ store, gates, stageRules });
backfillLegacyCognition({ store });
const passwords = createPasswordSystem({ store, definitions: passwordDefinitions });
const audio = createAudioManager({ store });
audio.register('message', './assets/audio/message.wav', { volume: 0.24 });
audio.register('interlude-1', './assets/audio/interlude-1.wav', { volume: 0.22 });
audio.register('interlude-2', './assets/audio/interlude-2.wav', { volume: 0.2 });
audio.register('interlude-3', './assets/audio/interlude-3.wav', { volume: 0.18 });
const interludes = createInterludePlayer({ store, audio });
const paywall = createPaywall();

const pageRenderers = new Map([
  ['boot', renderBoot], ['contact', renderContact], ['profile', renderProfile], ['post', renderPost],
  ['draft-1', renderDraft1], ['qingya', renderQingya], ['jiuwan', renderJiuwan],
  ['service', renderService], ['food', renderFood], ['watchmen', renderWatchmen], ['safety', renderSafety],
  ['news-2017', renderNews2017], ['cache-2017', renderCache2017],
  ['zhou-cheng', renderZhouCheng], ['zhou-yougen', renderZhouYougen],
  ['watchman-04-detail', renderWatchman04Detail], ['second-book', renderSecondBook],
  ['aji-comment', renderAjiComment], ['final-draft', renderFinalDraft],
  ['rescue-result', renderRescueResult], ['ending', renderEnding],
]);
const app = document.getElementById('app');

function applySettings() {
  const { settings } = store.getState();
  document.documentElement.style.fontSize = `${16 * settings.textScale}px`;
  document.documentElement.dataset.reducedMotion = settings.reducedMotion ? 'true' : 'false';
}

function renderTools() {
  const tools = el('div', { class: 'game-tools', 'aria-label': '阅读设置' });
  const sound = el('button', { class: 'icon-button tool-button', type: 'button', 'aria-label': store.getState().settings.audioEnabled ? '关闭声音' : '开启声音' });
  sound.append(icon(store.getState().settings.audioEnabled ? 'sound' : 'mute'));
  sound.addEventListener('click', () => {
    const next = !store.getState().settings.audioEnabled;
    store.dispatch({ type: 'SET_SETTING', key: 'audioEnabled', value: next });
    toast(next ? '声音已开启' : '声音已关闭');
    render();
  });
  const settings = el('button', { class: 'icon-button tool-button', type: 'button', 'aria-label': '阅读设置' });
  settings.append(icon('text'));
  settings.addEventListener('click', () => openSettings({
    store,
    onReset: () => {
      if (!confirm('确定清除本机全部调查进度？')) return;
      storage.clear(); location.hash = '#/boot'; location.reload();
    },
  }));
  tools.append(sound, settings);
  return tools;
}

function syncStoryEvents() {
  for (const check of storyEventDefinitions) {
    const now = store.getState();
    if (now.stage >= check.stage && check.ready(now) && !now.flags[check.flag]) {
      store.dispatch({ type: 'SET_FLAG', key: check.flag, value: true });
      // Legacy/recovered saves may already contain the player's reply but miss
      // the corresponding ready flag. Backfill silently in that case.
      if (!now.choices[check.choice]) {
        audio.play?.('message');
        toast('周航发来新消息');
      }
    }
  }
}

function renderUnreadChatNotice(path) {
  if (path === 'boot' || path === 'contact') return null;
  const pending = getPendingStoryEvent(store.getState());
  if (!pending) return null;

  const notice = el('aside', {
    class: 'chat-unread-notice',
    role: 'status',
    'aria-label': '周航发来未读消息',
  });
  const open = el('button', {
    class: 'chat-unread-notice__open',
    type: 'button',
    'aria-label': '打开与周航的聊天',
  }, [
    el('span', { class: 'chat-unread-notice__avatar', text: '周' }),
    el('span', { class: 'chat-unread-notice__copy' }, [
      el('strong', { text: '周航' }),
      el('small', { text: pending.preview }),
    ]),
    el('span', { class: 'chat-unread-notice__time', text: '刚刚' }),
  ]);
  open.addEventListener('click', () => router.navigate('boot'));
  notice.append(open);
  return notice;
}


function acknowledgeCommentCacheNoticeForPath(path) {
  const state = store.getState();
  if (shouldAcknowledgeCommentCacheNotice(path, state)) {
    store.dispatch({ type: 'SET_FLAG', key: 'commentCacheNoticeAcknowledged', value: true });
  }
}

function renderCommentCacheNotice() {
  const state = store.getState();
  if (!isCommentCacheNoticeEligible(state)) return null;

  if (!state.flags.commentCacheNoticeAnnounced) {
    store.dispatch({ type: 'SET_FLAG', key: 'commentCacheNoticeAnnounced', value: true });
    audio.play?.('message');
  }

  const notice = el('aside', {
    class: 'trail-cache-notice',
    role: 'status',
    'aria-label': '路迹评论缓存恢复通知',
  });
  const open = el('button', {
    class: 'trail-cache-notice__open',
    type: 'button',
    'aria-label': '打开周航轨迹的评论缓存',
  }, [
    el('span', { class: 'trail-cache-notice__app', text: '路迹 · 缓存恢复' }),
    el('strong', { text: '评论缓存已恢复 10:21–10:33' }),
    el('small', { text: '“周末别找我”这条轨迹有 4 条可读取回复' }),
  ]);
  open.addEventListener('click', () => {
    store.dispatch({ type: 'SET_FLAG', key: 'commentCacheNoticeAcknowledged', value: true });
    router.navigate('aji-comment');
  });
  notice.append(open);
  return notice;
}

function acknowledgeFinalDraftNoticeForPath(path) {
  const state = store.getState();
  if (shouldAcknowledgeFinalDraftNotice(path, state)) {
    store.dispatch({ type: 'SET_FLAG', key: 'finalDraftNoticeAcknowledged', value: true });
  }
}

function renderFinalDraftNotice() {
  const state = store.getState();
  if (!isFinalDraftNoticeEligible(state)) return null;

  if (!state.flags.finalDraftNoticeAnnounced) {
    store.dispatch({ type: 'SET_FLAG', key: 'finalDraftNoticeAnnounced', value: true });
    audio.play?.('message');
  }

  const notice = el('aside', {
    class: 'trail-draft-notice',
    role: 'status',
    'aria-label': '路迹发现未发送草稿',
  });
  const copy = el('button', {
    class: 'trail-draft-notice__open',
    type: 'button',
    'aria-label': '打开路迹主页查看未发送草稿',
  }, [
    el('span', { class: 'trail-draft-notice__app', text: '路迹 · 设备同步' }),
    el('strong', { text: '发现 1 条未发送草稿' }),
    el('small', { text: '来自周航手机的本地自动保存记录' }),
  ]);
  const dismiss = el('button', {
    class: 'trail-draft-notice__dismiss',
    type: 'button',
    text: '忽略',
    'aria-label': '忽略这条草稿通知',
  });

  copy.addEventListener('click', () => {
    store.dispatch({ type: 'SET_FLAG', key: 'finalDraftNoticeAcknowledged', value: true });
    router.navigate('profile');
  });
  dismiss.addEventListener('click', () => {
    store.dispatch({ type: 'SET_FLAG', key: 'finalDraftNoticeDismissed', value: true });
    render();
  });
  notice.append(copy, dismiss);
  return notice;
}

function render() {
  applySettings();
  const { path, query } = router.resolve();
  const queryString = query?.toString?.() || '';
  const publicPath = queryString ? `${path}?${queryString}` : path;
  if (!['boot', 'contact'].includes(path) && store.getState().flags.lastPublicPath !== publicPath) {
    store.dispatch({ type: 'SET_FLAG', key: 'lastPublicPath', value: publicPath });
  }
  recordContextualDiscovery({ store, path, query });
  flow.visit(path);
  syncStoryEvents();
  acknowledgeCommentCacheNoticeForPath(path);
  acknowledgeFinalDraftNoticeForPath(path);
  const def = routeDefinitions.get(path);
  document.body.dataset.site = def?.kind || '';
  document.title = def?.title || '返程线';
  const renderer = pageRenderers.get(path) || renderBoot;
  const shell = el('div', { class: 'immersive-shell' });
  shell.append(renderer({ store, flow, passwords, audio, interludes, router, query, paywall }));
  const unreadChatNotice = renderUnreadChatNotice(path);
  if (unreadChatNotice) shell.append(unreadChatNotice);
  const commentCacheNotice = renderCommentCacheNotice();
  if (commentCacheNotice) shell.append(commentCacheNotice);
  const finalDraftNotice = renderFinalDraftNotice();
  if (finalDraftNotice) shell.append(finalDraftNotice);
  if (path === 'boot') shell.append(renderTools());
  app.replaceChildren(shell);
  paywall.maybeAutoShow({ stage: store.getState().stage, path });
  requestAnimationFrame(() => document.getElementById('app-main')?.focus({ preventScroll: true }));
}

const router = createRouter({ routes: routeDefinitions, canAccess: id => !gates[id] || flow.isUnlocked(id), fallback: 'boot', onNavigate: render });
router.start();
window.__RETURN_ROUTE__ = { store, flow, passwords, audio, interludes, router, paywall };
