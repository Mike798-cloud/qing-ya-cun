import { openModal } from './modal.js';
import { el } from './ui.js';

export function openSettings({ store, onReset }) {
  const state = store.getState();
  const panel = el('div', { class: 'page-stack' });

  const soundRow = el('div', { class: 'field' });
  soundRow.append(el('label', { for: 'setting-audio', text: '声音' }));
  const sound = el('select', { id: 'setting-audio', class: 'input' });
  sound.append(el('option', { value: 'on', text: '开启' }), el('option', { value: 'off', text: '关闭' }));
  sound.value = state.settings.audioEnabled ? 'on' : 'off';
  sound.addEventListener('change', () => store.dispatch({ type: 'SET_SETTING', key: 'audioEnabled', value: sound.value === 'on' }));
  soundRow.append(sound);

  const textRow = el('div', { class: 'field' });
  textRow.append(el('label', { for: 'setting-text', text: '文字大小' }));
  const scale = el('select', { id: 'setting-text', class: 'input' });
  for (const [value, label] of [['0.9','较小'],['1','标准'],['1.1','较大'],['1.2','最大']]) scale.append(el('option', { value, text: label }));
  scale.value = String(state.settings.textScale);
  scale.addEventListener('change', () => {
    store.dispatch({ type: 'SET_SETTING', key: 'textScale', value: Number(scale.value) });
    document.documentElement.style.fontSize = `${16 * Number(scale.value)}px`;
  });
  textRow.append(scale);


  const motionRow = el('div', { class: 'field' });
  motionRow.append(el('label', { for: 'setting-motion', text: '动画效果' }));
  const motion = el('select', { id: 'setting-motion', class: 'input' });
  motion.append(
    el('option', { value: 'standard', text: '标准' }),
    el('option', { value: 'reduced', text: '减少动画' }),
  );
  motion.value = state.settings.reducedMotion ? 'reduced' : 'standard';
  motion.addEventListener('change', () => {
    const reduced = motion.value === 'reduced';
    store.dispatch({ type: 'SET_SETTING', key: 'reducedMotion', value: reduced });
    document.documentElement.dataset.reducedMotion = reduced ? 'true' : 'false';
  });
  motionRow.append(motion);

  const resetBtn = el('button', { class: 'btn', type: 'button', text: '清除本机进度并重新开始' });
  resetBtn.addEventListener('click', () => onReset?.());

  panel.append(soundRow, textRow, motionRow, el('div', { class: 'notice', text: '作品会在本机保存调查进度。清除浏览器站点数据也会移除存档。' }), resetBtn);
  return openModal({ title: '阅读与声音', content: panel });
}
