import { el, icon, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';
import { openModal } from '../core/modal.js';
import { stage1 } from '../data/content.js';

const IMG = {
  avatar: './assets/photos/zhou-hang-avatar.jpg',
  bus: './assets/photos/qingya-bus-stop.jpg',
  village: './assets/photos/qingya-village.jpg',
  trail: './assets/photos/jiuwan-trail.jpg',
  wok: './assets/photos/qingya-food-clean.jpg',
  watchman: './assets/photos/watchman-04.jpg',
};

function photo({ src, alt, caption = '', className = '' }) {
  const btn = el('button', { class: `photo ${className}`.trim(), type: 'button', 'aria-label': caption ? `${caption}，打开大图` : '打开图片' });
  const image = el('img', { src, alt, loading: 'lazy', decoding: 'async' });
  image.addEventListener('error', () => {
    btn.classList.add('photo--failed');
    image.remove();
    if (!btn.querySelector('.photo__error')) btn.prepend(el('span', { class: 'photo__error', text: '图片暂时没有加载出来' }));
  }, { once: true });
  btn.append(image);
  if (caption) btn.append(el('span', { class: 'photo__caption', text: caption }));
  btn.addEventListener('click', () => openLightbox({ src, alt, caption }));
  return btn;
}

function pageLink(href, label, note = '') {
  const a = el('a', { class: 'text-link', href: `#/${href}` });
  a.append(el('span', { text: label }));
  if (note) a.append(el('small', { text: note }));
  return a;
}

function avatar(className = '') {
  return el('img', { class: `zhou-avatar ${className}`.trim(), src: IMG.avatar, alt: '', loading: 'eager', decoding: 'async' });
}

function renderTrailHeader(active = '') {
  const header = el('header', { class: 'trail-header' });
  const inner = el('div', { class: 'trail-header__inner' });
  inner.append(
    el('a', { href: '#/profile', class: 'trail-logo', text: '路迹' }),
    el('div', { class: 'trail-search', text: '搜索路线 / 地点 / 用户' }),
    el('nav', { class: 'trail-nav', 'aria-label': '路迹站点导航' }, [
      el('span', { class: active === 'discover' ? 'is-active' : '', text: '发现' }),
      el('span', { text: '路线' }),
      el('span', { text: '社区' }),
      el('span', { text: '装备' }),
    ]),
    el('span', { class: 'trail-login', text: '游客浏览' }),
  );
  header.append(inner);
  return header;
}

function renderVillageHeader(active = '', flow) {
  const header = el('header', { class: 'village-header village-header--portal' });
  const today = el('div', { class: 'village-datebar' }, [
    el('span', { text: '青垭村旅游服务信息网' }),
    el('span', { text: '2026年9月14日　星期一' }),
    el('span', { text: '游客咨询：0836-7XXXXXX' }),
  ]);
  const mast = el('div', { class: 'village-masthead' }, [
    el('a', { href: '#/qingya', class: 'village-brand' }, [
      el('strong', { text: '青垭村' }),
      el('span', { text: '旅游服务信息网' }),
    ]),
    el('div', { class: 'village-masthead__weather' }, [
      el('strong', { text: '17–24℃' }),
      el('span', { text: '多云　山脊风大' }),
    ]),
  ]);
  const navItem = (id, label, key = '') => {
    if (id === 'qingya' || id === 'jiuwan' || flow?.isUnlocked(id)) return el('a', { href: `#/${id}`, class: active === key ? 'is-active' : '', text: label });
    return el('span', { text: label, class: 'is-disabled' });
  };
  const nav = el('nav', { class: 'village-nav village-nav--portal', 'aria-label': '青垭村站点导航' }, [
    navItem('qingya', '首页', 'home'), navItem('jiuwan', '九弯徒步', 'route'), navItem('food', '吃住青垭', 'food'),
    navItem('service', '游客服务', 'service'), navItem('watchmen', '村志旧物', 'watchmen'), navItem('safety', '通知公告', 'safety'),
  ]);
  header.append(today, mast, nav);
  return header;
}

function chatMessage(list, side, text, time = '') {
  const row = el('div', { class: `msg-row msg-row--${side}` });
  if (side === 'other') row.append(avatar('msg-avatar'));
  const bubble = el('div', { class: 'msg-bubble' });
  bubble.append(el('p', { text }));
  if (time) bubble.append(el('span', { class: 'msg-time', text: time }));
  row.append(bubble);
  list.append(row);
}

function chatImage(list, src, alt, time, cls = '') {
  const row = el('div', { class: 'msg-row msg-row--other msg-row--image' });
  row.append(avatar('msg-avatar'));
  const wrap = el('div', { class: 'chat-image-wrap' });
  wrap.append(photo({ src, alt, className: `photo--chat-raw ${cls}`.trim() }), el('span', { class: 'chat-image-time', text: time }));
  row.append(wrap);
  list.append(row);
}

function chatDay(list, label) { list.append(el('div', { class: 'chat-day-divider', text: label })); }

function rerenderChat(router) {
  router?.navigate?.('boot');
  requestAnimationFrame(() => document.querySelector('.chat-bottom')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
}

function quickReply(composer, options, onPick) {
  const strip = el('div', { class: 'quick-replies', 'aria-label': '快捷回复' });
  options.forEach(([id, label]) => {
    const b = el('button', { class: 'quick-reply', type: 'button', text: label });
    b.addEventListener('click', () => onPick(id));
    strip.append(b);
  });
  composer.append(strip);
}

function appendChatComposer(composer) {
  composer.append(el('div', { class: 'chat-inputbar' }, [
    el('button', { type: 'button', class: 'chat-tool chat-tool--voice', 'aria-label': '语音', text: '⌁' }),
    el('div', { class: 'chat-inputfake', text: '发送消息…' }),
    el('button', { type: 'button', class: 'chat-tool', 'aria-label': '表情', text: '☺' }),
    el('button', { type: 'button', class: 'chat-tool', 'aria-label': '更多', text: '＋' }),
  ]));
}

function chooseActiveReply(state) {
  if (!state.choices.stage1) return { key: 'stage1', options: [['small-pot','你不是一个人吗'],['avoid-side','先别乱走偏线'],['more-photos','多拍点图']] };
  if (state.flags.stage2MessageReady && !state.choices.stage2) return { key: 'stage2', options: [['come-back','你先回来'],['send-photo','拍照给我看'],['what-things','什么叫“东西还在”？']] };
  if (state.flags.stage4MessageReady && !state.choices.stage4) return { key: 'stage4', options: [['where-now','你现在到底在哪'],['just-sent','你是刚发的吗'],['how-know','你怎么知道我查到哪了']] };
  if (state.flags.stage5MessageReady && !state.choices.stage5) return { key: 'stage5', options: [['what-book','第二本是什么'],['are-you','你到底是不是我哥'],['saw-yougen','我已经看到周有根的留言了']] };
  if (state.flags.stage6MessageReady && !state.choices.stage6) return { key: 'stage6', options: [['bring-rescue','我会带人去找你'],['wait-me','你等我'],['who-maintains','到底是谁在维护北坡']] };
  return null;
}

export function renderBoot({ store, flow, audio, router }) {
  const main = el('main', { id: 'app-main', class: 'chat-page', tabindex: '-1' });
  const app = el('section', { class: 'messenger-app', 'aria-label': '与周航的聊天' });
  const state = store.getState();
  const top = el('header', { class: 'chat-topbar' }, [
    el('button', { class: 'chat-back', type: 'button', 'aria-label': '返回', text: '‹' }),
    el('a', { href: '#/contact', class: 'chat-person-link', 'aria-label': '打开周航联系人资料' }, [
      avatar('chat-avatar'),
      el('div', { class: 'chat-person' }, [
        el('strong', { text: '周航' }),
        el('span', { text: state.meta.endingReached ? '最后在线 9月14日 11:18' : (state.choices.stage1 ? '最后在线 11:44' : '手机在线') }),
      ]),
    ]),
    el('div', { class: 'chat-top-actions' }, [
      el('span', { class: 'chat-top-icon', text: '⌕', 'aria-hidden': 'true' }),
      el('a', { href: '#/contact', class: 'chat-top-icon', 'aria-label': '联系人详情', text: '•••' }),
    ]),
  ]);

  const list = el('div', { class: 'chat-list' });
  chatDay(list, '今天 08:41');
  chatMessage(list, 'other', '到了。');
  chatImage(list, IMG.bus, '青垭村公交站旁的旧公交车与站牌', '08:42');
  chatMessage(list, 'other', '这个公交比我年龄大。');
  chatMessage(list, 'other', '村里饭量是不是对城市人有什么意见。', '09:17');
  chatImage(list, IMG.wok, '山村饭馆灶台上的大铁锅', '09:17', 'photo--chat-wide');

  if (state.choices.stage1) {
    const labels = { 'small-pot': '你不是一个人吗', 'avoid-side': '先别乱走偏线', 'more-photos': '多拍点图' };
    chatMessage(list, 'me', labels[state.choices.stage1], '09:18');
    chatMessage(list, 'other', stage1.choiceReplies[state.choices.stage1]);
    chatMessage(list, 'other', '今天九弯线。北边有条老返程，我顺便看看。', '09:26');
    chatMessage(list, 'other', '不一定走。');
    chatMessage(list, 'other', '北坡这个路现场基本没了。');
    chatMessage(list, 'other', '但一路还能看到以前的东西。', '10:03');
    chatImage(list, IMG.watchman, '树林里一尊旧水泥指路人像，手臂朝外平伸', '10:08', 'photo--chat-portrait');
    chatMessage(list, 'other', '到四号了。后面不走了。路完全烂掉。', '10:09');
    chatMessage(list, 'other', '艹。', '10:24');
    chatMessage(list, 'other', '在吗');
    chatMessage(list, 'other', '我刚看到评论。有人看了我刚才那条动态，也进北坡了。', '10:25');
    chatMessage(list, 'other', '他说看到我走到四号，觉得能过。');
    chatMessage(list, 'other', '别按我发的轨迹进来。');
    chatMessage(list, 'other', '我回去找他。');
    chatMessage(list, 'other', '如果十二点前没回，你直接报警。', '10:26');
  }

  if (state.flags.stage2MessageReady) {
    chatMessage(list, 'other', '四号这边有点怪。', '10:37');
    chatMessage(list, 'other', '路没了，但是东西还在。');
    chatMessage(list, 'other', '像有人不想让你找路，又不想让你彻底找不到。', '10:38');
    if (state.choices.stage2) {
      const labels={'come-back':'你先回来','send-photo':'拍照给我看','what-things':'什么叫“东西还在”？'};
      const replies={'come-back':'准备撤。先把那个人找到。','send-photo':'等会发。别放大看，四号后面那块蓝铁皮有点怪。','what-things':'路条没了，箭头有人翻过来，棚子里还有新水。'};
      chatMessage(list,'me',labels[state.choices.stage2],'10:38');
      chatMessage(list,'other',replies[state.choices.stage2],'10:39');
    }
  }

  if (state.flags.stage4MessageReady) {
    chatMessage(list, 'other', '你别再往下翻了。', '11:07');
    chatMessage(list, 'other', '翻到周成就够了。');
    chatMessage(list, 'other', '再往后不是给你看的。', '11:08');
    if (state.choices.stage4) {
      const labels={'where-now':'你现在到底在哪','just-sent':'你是刚发的吗','how-know':'你怎么知道我查到哪了'};
      const replies={'where-now':'我在路上。不是回来的路。','just-sent':'信号会晚一点到。人也会。','how-know':'你看见第四个的时候就该停了。'};
      chatMessage(list,'me',labels[state.choices.stage4],'11:08');
      chatMessage(list,'other',replies[state.choices.stage4],'11:09');
    }
  }

  if (state.flags.stage5MessageReady) {
    chatMessage(list, 'other', '不要去找第二本。', '11:26');
    chatMessage(list, 'other', '第二本是给回来的人看的。');
    chatMessage(list, 'other', '你不是回来的人。', '11:27');
    if (state.choices.stage5) {
      const labels={'what-book':'第二本是什么','are-you':'你到底是不是我哥','saw-yougen':'我已经看到周有根的留言了'};
      const replies={'what-book':'你已经知道它在什么地方了，你只是还没承认。','are-you':'我是。只是现在说出来不太像。','saw-yougen':'他拆的是给活人看的。留下的不是。'};
      chatMessage(list,'me',labels[state.choices.stage5],'11:27');
      chatMessage(list,'other',replies[state.choices.stage5],'11:28');
    }
  }

  if (state.flags.stage6MessageReady) {
    chatMessage(list, 'other', '别来四号后面。', '11:42');
    chatMessage(list, 'other', '不是找不到。');
    chatMessage(list, 'other', '是会看见。');
    chatMessage(list, 'other', '路不是错的。');
    chatMessage(list, 'other', '错的是有人把它又走成路了。', '11:43');
    if (state.choices.stage6) {
      const labels={'bring-rescue':'我会带人去找你','wait-me':'你等我','who-maintains':'到底是谁在维护北坡'};
      const replies={'bring-rescue':'别按旧线带。','wait-me':'来不及了。','who-maintains':'先是他们。后来是谁都行。'};
      chatMessage(list,'me',labels[state.choices.stage6],'11:44');
      chatMessage(list,'other',replies[state.choices.stage6],'11:44');
    }
  }

  if (state.meta.endingReached) {
    chatDay(list, '9 月 18 日');
    chatMessage(list, 'other', '别再让它像一条路。', '06:18');
  }

  const composer = el('footer', { class: 'chat-composer' });
  const pending = chooseActiveReply(state);
  if (pending) quickReply(composer, pending.options, id => {
    store.dispatch({ type: 'SET_CHOICE', key: pending.key, value: id });
    if (pending.key === 'stage1') flow.unlock(['contact','profile','post','qingya','jiuwan']);
    audio.play?.('message');
    rerenderChat(router);
  });
  if (!state.meta.endingReached) appendChatComposer(composer);
  const bottom = el('div', { class: 'chat-bottom', 'aria-hidden': 'true' });
  app.append(top, list, composer, bottom);
  main.append(app);
  return main;
}

export function renderContact() {
  const main = el('main', { id: 'app-main', class: 'contact-page', tabindex: '-1' });
  const shell = el('section', { class: 'contact-shell' });
  shell.append(
    el('header', { class: 'contact-topbar' }, [
      el('a', { href: '#/boot', class: 'contact-back', text: '‹' }),
      el('strong', { text: '联系人资料' }),
      el('span', { text: '•••' }),
    ]),
    el('section', { class: 'contact-profile' }, [
      avatar('contact-avatar'),
      el('h1', { text: '周航' }),
      el('p', { text: '备注：哥' }),
      el('div', { class: 'contact-actions' }, [
        el('a', { href: '#/boot', text: '消息' }), el('span', { text: '语音通话' }), el('span', { text: '视频通话' }),
      ]),
    ]),
    el('div', { class: 'contact-list' }, [
      el('div', { class: 'contact-row' }, [el('span', { text: '手机号' }), el('strong', { text: '138 •••• 9217' })]),
      el('a', { href: '#/profile', class: 'contact-row contact-row--link' }, [
        el('span', { text: '公开主页' }), el('div', {}, [el('strong', { text: '路迹 · 周末别找我' }), el('small', { text: '@noweekend' })]), el('b', { text: '›' }),
      ]),
      el('div', { class: 'contact-row' }, [el('span', { text: '共享位置' }), el('strong', { text: '暂不可用' })]),
      el('div', { class: 'contact-row' }, [el('span', { text: '媒体、链接和文件' }), el('strong', { text: '18' })]),
    ]),
    el('footer', { class: 'contact-foot' }, [el('a', { href: '#/boot', text: '返回聊天' })]),
  );
  main.append(shell);
  return main;
}

function openDraftPassword({ passwords, router }) {
  const content = el('form', { class: 'password-form password-form--trail' });
  content.append(
    el('p', { text: '草稿箱启用了本机口令。' }),
    el('p', { class: 'password-clue', text: '账号：周末别找我　@noweekend' }),
  );
  const field = el('div', { class: 'field' });
  const label = el('label', { for: 'draft-password', text: '口令' });
  const input = el('input', { id: 'draft-password', class: 'input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: '输入口令' });
  const error = el('p', { class: 'form-error', role: 'status' });
  field.append(label, input, error);
  const submit = el('button', { class: 'btn btn--primary', type: 'submit', text: '验证' });
  content.append(field, submit);
  let close;
  content.addEventListener('submit', e => {
    e.preventDefault();
    const result = passwords.verify('noweekend', input.value);
    if (!result.ok) { input.setAttribute('aria-invalid', 'true'); error.textContent = '口令不对。'; input.select(); return; }
    close?.(); router.navigate('draft-1');
  });
  close = openModal({ title: '私密草稿', content });
  setTimeout(() => input.focus(), 0);
}

function openFinalDraftPassword({ passwords, router }) {
  const content = el('form', { class: 'password-form final-draft-password' });
  content.append(
    el('p', { text: '设备同步记录里找到一条未发送草稿。恢复标签来自周航当天自己的撤退备注。' }),
    el('p', { class: 'password-clue', text: '别按旧线返回。' }),
    el('p', { class: 'fine-note', text: '标签格式：NO + 一个英文单词。' }),
  );
  const field = el('div', { class: 'field' });
  const label = el('label', { for: 'final-draft-password', text: '恢复标签' });
  const input = el('input', { id: 'final-draft-password', class: 'input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'NO…' });
  const error = el('p', { class: 'form-error', role: 'status' });
  field.append(label, input, error);
  const submit = el('button', { class: 'btn btn--primary', type: 'submit', text: '恢复' });
  content.append(field, submit);
  let close;
  content.addEventListener('submit', event => {
    event.preventDefault();
    const result = passwords.verify('noreturn', input.value);
    if (!result.ok) { input.setAttribute('aria-invalid', 'true'); error.textContent = '标签不匹配。'; input.select(); return; }
    close?.(); router.navigate('final-draft');
  });
  close = openModal({ title: '草稿恢复', content });
  setTimeout(() => input.focus(), 0);
}

export function renderProfile({ store, passwords, router }) {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader('discover'));
  const grid = el('div', { class: 'trail-profile-grid' });
  const left = el('aside', { class: 'trail-profile-side' }, [
    avatar('profile-avatar-image'),
    el('h1', { text: '周末别找我' }),
    el('p', { class: 'profile-handle', text: '@noweekend' }),
    el('p', { text: '普通上班族。周末走路。主要记补给、岔口和哪里容易走错。' }),
    el('dl', { class: 'trail-user-facts' }, [
      el('dt', { text: '关注' }), el('dd', { text: '72' }),
      el('dt', { text: '粉丝' }), el('dd', { text: '1.4万' }),
      el('dt', { text: '轨迹' }), el('dd', { text: '37' }),
    ]),
    el('a', { href: '#/contact', class: 'plain-back-link', text: '‹ 联系人资料' }),
  ]);
  const stream = el('section', { class: 'trail-stream' });
  stream.append(el('nav', { class: 'trail-tabs' }, [el('span', { class: 'is-active', text: '动态' }), el('span', { text: '轨迹' }), el('span', { text: '收藏' }), el('span', { text: '关于' })]));
  const post = el('article', { class: 'trail-post-row' }, [
    el('div', { class: 'trail-post-row__head' }, [avatar('trail-post-avatar'), el('div', {}, [el('strong', { text: '周末别找我' }), el('span', { text: '今天 10:09 · 青垭村' })])]),
    el('p', { text: '青垭九弯主线正常。北坡老返程我只走到四号，后段废掉，正在撤。别照这个轨迹走。' }),
    photo({ src: IMG.trail, alt: '青垭九弯山路', className: 'photo--trail-stream' }),
    el('div', { class: 'trail-post-actions' }, [el('span', { text: '♡ 312' }), el('span', { text: '评论 46' }), pageLink('post', '轨迹详情')]),
  ]);
  stream.append(post);

  const privateArea = el('section', { class: 'trail-private-tools' });
  privateArea.append(el('h2', { text: '仅自己可见' }));
  const draftRow = el('div', { class: 'trail-private-row' }, [
    el('div', {}, [el('strong', { text: '私密草稿' }), el('small', { text: store.getState().passwords.noweekend ? '1 条 · 已解锁' : '1 条 · 本机口令' })]),
  ]);
  const draftButton = el('button', { type: 'button', class: 'trail-row-button', text: store.getState().passwords.noweekend ? '打开 ›' : '验证 ›' });
  draftButton.addEventListener('click', () => store.getState().passwords.noweekend ? router.navigate('draft-1') : openDraftPassword({ passwords, router }));
  draftRow.append(draftButton); privateArea.append(draftRow);
  if (store.getState().stage >= 6 && store.getState().choices.stage6) {
    const rec = el('div', { class: 'trail-private-row' }, [el('div', {}, [el('strong', { text: '设备恢复草稿' }), el('small', { text: store.getState().passwords.noreturn ? '1 条 · 已恢复' : '1 条 · 需要恢复标签' })])]);
    const b = el('button', { type: 'button', class: 'trail-row-button', text: store.getState().passwords.noreturn ? '打开 ›' : '恢复 ›' });
    b.addEventListener('click', () => store.getState().passwords.noreturn ? router.navigate('final-draft') : openFinalDraftPassword({ passwords, router }));
    rec.append(b); privateArea.append(rec);
  }
  stream.append(privateArea);
  const right = el('aside', { class: 'trail-profile-right' }, [
    el('h2', { text: '地点' }),
    el('a', { href: '#/qingya', class: 'trail-place-row' }, [photo({ src: IMG.village, alt: '青垭村山谷', className: 'photo--trail-place' }), el('div', {}, [el('strong', { text: '青垭村' }), el('span', { text: '热门路线：青垭九弯环线' })])]),
    el('h2', { text: '附近路线' }),
    el('span', { class: 'trail-muted-row', text: '青垭九弯环线 · 16.0 km' }),
    el('span', { class: 'trail-muted-row', text: '南坡林道 · 8.4 km' }),
  ]);
  grid.append(left, stream, right); main.append(grid); return main;
}

function routeMap() {
  const map = el('div', { class: 'track-map', 'aria-label': '青垭九弯轨迹示意' });
  map.append(
    el('div', { class: 'track-map__terrain' }),
    el('div', { class: 'track-map__svg-wrap', html: '<svg class="track-map__svg" viewBox="0 0 600 300" role="img" aria-label="九弯主线和北坡探路轨迹"><path class="track-map__mainline" d="M70,235 C110,175 160,85 240,92 C330,100 350,195 445,160 C500,140 525,105 548,80"></path><path class="track-map__oldline" d="M239,92 C220,55 175,48 145,65 C110,86 104,130 92,152"></path><circle cx="92" cy="152" r="7" class="track-map__stop"></circle></svg>' }),
    el('span', { class: 'track-map__label track-map__label--start', text: '青垭村' }),
    el('span', { class: 'track-map__label track-map__label--four', text: '四号 · 折返' }),
  );
  return map;
}

export function renderPost() {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader());
  const wrap = el('div', { class: 'track-layout' });
  const article = el('article', { class: 'track-article' });
  article.append(
    el('div', { class: 'track-userline' }, [avatar('trail-post-avatar'), el('div', {}, [el('strong', { text: '周末别找我' }), el('span', { text: '今天 10:09 · 青垭村' })])]),
    el('h1', { text: '青垭九弯 / 北坡旧返程探路' }),
    el('p', { class: 'track-state', text: '公开轨迹 · 最后同步 10:34' }),
    routeMap(),
    el('table', { class: 'track-data-table' }, [el('tbody', {}, [
      el('tr', {}, [el('th', { text: '距离' }), el('td', { text: '14.8 km' }), el('th', { text: '用时' }), el('td', { text: '5:02' })]),
      el('tr', {}, [el('th', { text: '累计爬升' }), el('td', { text: '742 m' }), el('th', { text: '最后同步' }), el('td', { text: '10:34' })]),
    ])]),
    el('h2', { text: '现场备注' }),
    el('p', { text: '九弯主线没问题。北坡入口还能认出来，进去以后旧路断得很厉害，前几年留下的东西倒是还在。' }),
    el('p', { class: 'track-quote', text: '10:09　到四号了。后面不走了。路完全烂掉。' }),
    photo({ src: IMG.watchman, alt: '树林里一尊旧水泥指路人像', className: 'photo--track-raw' }),
    el('p', { text: '这一段不是推荐路线，也不要拿本条轨迹做导航。' }),
  );
  const side = el('aside', { class: 'track-info-side' }, [
    el('h2', { text: '经过点' }),
    el('ol', { class: 'track-points' }, [el('li', { text: '青垭游客中心' }), el('li', { text: '九弯主线北岔口' }), el('li', { text: '旧石料场口' }), el('li', { text: '四号看路人 · 折返' })]),
    el('div', { class: 'track-sync-box' }, [el('strong', { text: '轨迹同步' }), el('p', { text: '北坡部分区域信号不稳定，离线轨迹会在重新联网后批量上传。' }), el('span', { class: 'sync-pulse', text: '同步记录已完成' })]),
    pageLink('jiuwan', '青垭九弯官方线路'),
  ]);
  wrap.append(article, side); main.append(wrap); return main;
}

export function renderDraft1() {
  const main = el('main', { id: 'app-main', class: 'trail-site trail-private-page', tabindex: '-1' });
  main.append(renderTrailHeader());
  const wrap = el('article', { class: 'draft-page draft-page--platform' });
  wrap.append(
    el('div', { class: 'draft-toolbar' }, [el('span', { text: '私密草稿' }), el('span', { text: '自动保存 10:11' })]),
    el('h1', { text: '青垭九弯 / 北坡返程线（别跟）' }),
    el('p', { text: '九弯主线正常。北坡那个老返程现在基本不算路。' }),
    el('p', { text: '我从北岔口进去，能认出旧石料场、看路人和一截蓝铁皮。到四号以后路面已经散了，我在这里折返。' }),
    el('p', { text: '如果轨迹同步出去，别把北坡这一截当成推荐。后段废掉，正在撤。' }),
    el('p', { text: '回去以后把这段从公开轨迹里裁掉。' }),
    el('footer', { class: 'draft-foot' }, [el('span', { text: '未发布' }), el('a', { href: '#/profile', text: '返回草稿箱' })]),
  );
  main.append(wrap); return main;
}

export function renderQingya({ flow }) {
  const main = el('main', { id: 'app-main', class: 'village-site village-portal-site', tabindex: '-1' });
  main.append(renderVillageHeader('home', flow));
  const shell = el('div', { class: 'village-portal' });
  const banner = el('div', { class: 'village-portal-banner' }, [
    photo({ src: IMG.village, alt: '青垭村山谷与村落', className: 'photo--portal-banner' }),
    el('div', { class: 'village-portal-banner__text' }, [el('strong', { text: '青山不远　日子很近' }), el('span', { text: '青垭村欢迎您' })]),
  ]);
  const columns = el('div', { class: 'village-portal-columns' });
  const news = el('section', { class: 'portal-news' }, [el('h2', { text: '最新公告' })]);
  const notices = [
    ['09-01','北坡旧线路不开放','safety','新'], ['08-28','九弯环线雨后安全提醒','',''], ['08-15','2026 年秋季民宿联系电话汇总','',''],
    ['07-31','关于游客车辆停放的说明','',''], ['07-18','村口公交站候车点临时调整','',''], ['06-29','九弯沿线饮水点维护完成','',''],
    ['05-12','关于文明采摘野果的提醒','',''], ['04-30','五一假期游客服务时间延长','',''],
  ];
  notices.forEach(([date,title,id,badge]) => {
    const row = el('div', { class: 'portal-news-row' }, [el('time', { text: `2026-${date}` })]);
    if (id && flow?.isUnlocked(id)) row.append(el('a', { href: `#/${id}`, text: title })); else row.append(el('span', { text: title }));
    if (badge) row.append(el('em', { class: 'portal-new', text: badge }));
    news.append(row);
  });
  const route = el('section', { class: 'portal-route' }, [
    el('h2', { text: '推荐线路' }),
    el('div', { class: 'portal-route__body' }, [photo({ src: IMG.trail, alt: '青垭九弯山脊路线', className: 'photo--portal-route' }), el('div', {}, [el('strong', { text: '青垭九弯环线' }), el('p', { text: '约16公里　5–7小时　难度：中等' }), el('a', { href: '#/jiuwan', text: '线路介绍 ›' })])]),
  ]);
  const left = el('div', { class: 'portal-maincol' }, [news, route]);
  const side = el('aside', { class: 'portal-side' }, [
    el('section', { class: 'portal-box portal-weather' }, [el('h2', { text: '今日青垭' }), el('strong', { text: '17–24℃　多云' }), el('p', { text: '山脊阵风 4–5 级。下午局部有短时阵雨。' })]),
    el('section', { class: 'portal-box' }, [el('h2', { text: '便民信息' }),
      flow?.isUnlocked('service') ? el('a', { href: '#/service', text: '游客中心 / 公共卫生间' }) : el('span', { text: '游客中心 / 公共卫生间' }),
      flow?.isUnlocked('food') ? el('a', { href: '#/food', text: '吃饭：青垭人家农家乐' }) : el('span', { text: '吃饭：青垭人家农家乐' }),
      el('span', { text: '村口停车：小车 38 位' }), el('span', { text: '末班公交：18:20' })]),
    el('section', { class: 'portal-box' }, [el('h2', { text: '常用电话' }), el('p', { text: '游客服务　0836-7XXXXXX' }), el('p', { text: '村卫生室　0836-7XXXX12' }), el('p', { text: '公交问询　0836-7XXXX35' })]),
    flow?.isUnlocked('watchmen') ? el('section', { class: 'portal-box' }, [el('h2', { text: '村志资料' }), el('a', { href: '#/watchmen', text: '旧石料场“看路人” ›' })]) : null,
  ].filter(Boolean));
  columns.append(left, side);
  shell.append(banner, el('div', { class: 'portal-welcome' }, [el('strong', { text: '青垭村 · 山与人的相遇' }), el('p', { text: '青垭村位于群山之间，海拔约 980 米。村里有农田、溪谷、老杉树林，以及一条沿山脊绕行的九弯环线。' })]), columns,
    el('section', { class: 'portal-links' }, [el('strong', { text: '友情链接：' }), el('span', { text: '青垭县文旅信息　|　天气服务　|　公交查询　|　森林防火' })]),
    el('footer', { class: 'village-footer', text: '青垭村村民委员会　网页维护：游客服务中心　最后更新 2026-09-01' }));
  main.append(shell); return main;
}

export function renderJiuwan({ flow }) {
  const main = el('main', { id: 'app-main', class: 'village-site route-guide-site', tabindex: '-1' });
  main.append(renderVillageHeader('route', flow));
  const wrap = el('article', { class: 'route-guide route-guide--portal' });
  wrap.append(
    el('p', { class: 'route-guide__crumb', text: '首页 ＞ 旅游线路 ＞ 徒步线路 ＞ 青垭九弯环线' }),
    el('header', { class: 'route-article-head' }, [el('h1', { text: '青垭九弯环线' }), el('p', { text: '发布时间：2026-08-15　来源：青垭村游客服务中心　浏览：1826' })]),
    photo({ src: IMG.trail, alt: '青垭九弯山脊路线', className: 'photo--route-article' }),
    el('table', { class: 'route-fact-table' }, [el('tbody', {}, [
      el('tr', {}, [el('th', { text: '线路里程' }), el('td', { text: '约 16 公里' }), el('th', { text: '建议用时' }), el('td', { text: '5–7 小时' })]),
      el('tr', {}, [el('th', { text: '累计爬升' }), el('td', { text: '约 780 米' }), el('th', { text: '适合季节' }), el('td', { text: '3–11 月' })]),
      el('tr', {}, [el('th', { text: '起终点' }), el('td', { text: '青垭村游客中心' }), el('th', { text: '难度' }), el('td', { text: '中等' })]),
    ])]),
    el('h2', { text: '线路说明' }),
    el('p', { text: '从游客中心旁主线路牌出发，依次经过一号弯、老杉树林、山脊观景点和南侧下坡后回村。开放主线路牌连续，雨后木阶和石阶较滑。' }),
    el('p', { text: '“北坡返程线”为历史路线名称，不属于当前开放线路，也不作为九弯环线的备用返程。' }),
    el('h2', { text: '青垭徒步四级（村民版）' }),
    el('table', { class: 'route-level-table' }, [el('tbody', {}, [
      ['一级','还能一路聊天。'],['二级','开始没人说话。'],['三级','下坡的时候开始问还有多远。'],['四级','回家以后想卖装备。']
    ].map(([a,b]) => el('tr', {}, [el('th', { text: a }), el('td', { text: b })])))]),
    el('p', { class: 'route-small-print', text: '本评价由本村民宿经营户、历年来访游客及两名膝关节长期不好的村民共同整理，仅作参考。北坡旧路线不参与评级。' }),
    el('h2', { text: '出发前' }),
    el('ul', { class: 'route-bullet-list' }, [el('li', { text: '村口游客中心可补水、充电并询问当天路况。' }), el('li', { text: '山区移动信号不连续，请提前下载离线地图。' }), el('li', { text: '如遇降雨或天色较晚，请沿当前开放主线返回。' })]),
    el('div', { class: 'route-attachments' }, [el('strong', { text: '附件下载' }), el('span', { text: '青垭九弯线路图（PDF）' }), el('span', { text: '公交时刻表（2026.08）' })]),
    flow?.isUnlocked('safety') ? el('p', {}, [el('a', { href: '#/safety', text: '相关：北坡旧返程线路安全提醒 ›' })]) : null,
  );
  main.append(wrap); return main;
}
