import { createStorage } from './core/storage.js';
import { createStore } from './core/store.js';
import { createRouter } from './core/router.js';
import { createFlow } from './core/flow.js';
import { createPasswordSystem } from './core/passwords.js';
import { createAudioManager } from './core/audio.js';
import { createInterludePlayer } from './core/interlude.js';
import { openSettings } from './core/settings.js';
import { el, icon, toast } from './core/ui.js';
import { routeDefinitions, passwordDefinitions, stageRules, gates } from './data/content.js';
import { renderBoot, renderProfile, renderPost, renderDraft1, renderQingya, renderJiuwan } from './pages/stage1.js';
import { renderService, renderFood, renderWatchmen, renderSafety } from './pages/stage2.js';
import { renderNews2017, renderCache2017 } from './pages/stage3.js';
import { renderZhouCheng, renderZhouYougen } from './pages/stage4.js';
import { renderWatchman04Detail, renderSecondBook } from './pages/stage5.js';
import { renderAjiComment, renderFinalDraft } from './pages/stage6.js';
import { renderRescueResult, renderEnding } from './pages/stage7.js';

const storage = createStorage();
const store = createStore(storage.load(), storage);
const flow = createFlow({ store, gates, stageRules });
const passwords = createPasswordSystem({ store, definitions: passwordDefinitions });
const audio = createAudioManager({ store });
audio.register('message', './assets/audio/message.wav', { volume: 0.24 });
audio.register('interlude-1', './assets/audio/interlude-1.wav', { volume: 0.22 });
audio.register('interlude-2', './assets/audio/interlude-2.wav', { volume: 0.2 });
audio.register('interlude-3', './assets/audio/interlude-3.wav', { volume: 0.18 });
const interludes = createInterludePlayer({ store, audio });

const pageRenderers = new Map([
  ['boot', renderBoot], ['profile', renderProfile], ['post', renderPost],
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

function render() {
  applySettings();
  const { path } = router.resolve();
  flow.visit(path);
  const def = routeDefinitions.get(path);
  document.body.dataset.site = def?.kind || '';
  document.title = def?.title || '返程线';
  const renderer = pageRenderers.get(path) || renderBoot;
  const shell = el('div', { class: 'immersive-shell' });
  shell.append(renderer({ store, flow, passwords, audio, interludes, router }));
  if (path !== 'ending') shell.append(renderTools());
  app.replaceChildren(shell);
  requestAnimationFrame(() => document.getElementById('app-main')?.focus({ preventScroll: true }));
}

const router = createRouter({ routes: routeDefinitions, canAccess: id => flow.isUnlocked(id), fallback: 'boot', onNavigate: render });
router.start();
window.__RETURN_ROUTE__ = { store, flow, passwords, audio, interludes, router };
