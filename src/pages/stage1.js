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
  northTrack: './assets/photos/north-slope-local.jpg',
};

function qv(query, key, fallback = '') {
  return query?.get?.(key) || fallback;
}

function localHref(path, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => { if (value) search.set(key, value); });
  const suffix = search.toString();
  return `#/${path}${suffix ? `?${suffix}` : ''}`;
}

function photo({ src, alt, caption = '', className = '' }) {
  const btn = el('button', { class: `photo ${className}`.trim(), type: 'button', 'aria-label': caption ? `${caption}，打开大图` : '打开图片' });
  const eager = /photo--(?:trail-stream|portal-banner|route-article|track-record)/.test(className);
  const image = el('img', { src, alt, loading: eager ? 'eager' : 'lazy', decoding: 'async', ...(eager ? { fetchpriority: 'high' } : {}) });
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

function olderTrailPost({ date, place, text, stats = '' }) {
  return el('article', { class: 'trail-history-row' }, [
    el('time', { text: date }),
    el('div', {}, [
      el('strong', { text: place }),
      el('p', { text }),
      el('small', { text: stats }),
    ]),
  ]);
}

function renderTrailHeader(active = 'discover') {
  const header = el('header', { class: 'trail-header' });
  const inner = el('div', { class: 'trail-header__inner' });
  const navItem = (key, label) => el('a', { href: localHref('profile', { site: key }), class: active === key ? 'is-active' : '', text: label });
  inner.append(
    el('a', { href: '#/profile', class: 'trail-logo', text: '路迹' }),
    el('a', { href: localHref('profile', { site: 'search' }), class: 'trail-search trail-search--link', text: '搜索路线 / 地点 / 用户' }),
    el('nav', { class: 'trail-nav', 'aria-label': '路迹站点导航' }, [
      navItem('discover', '发现'),
      navItem('routes', '路线'),
      navItem('community', '社区'),
      navItem('gear', '装备'),
    ]),
    el('div', { class: 'trail-utility' }, [
      el('a', { href: localHref('profile', { site: 'download' }), text: '下载客户端' }),
      el('a', { href: localHref('profile', { site: 'correction' }), text: '路线纠错' }),
      el('span', { class: 'trail-login', text: '游客浏览' }),
    ]),
  );
  header.append(inner);
  return header;
}

function renderVillageHeader(active = 'home') {
  const header = el('header', { class: 'village-header village-header--portal' });
  const today = el('div', { class: 'village-datebar' }, [
    el('span', { text: '设为首页　|　加入收藏　|　联系我们' }),
    el('span', { text: '2026年9月14日　星期一　农历八月初四' }),
    el('span', { text: '游客咨询：0836-7XXXXXX　　今日访问：328' }),
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
  const navItem = (key, label) => el('a', { href: key === 'home' ? '#/qingya' : localHref('qingya', { section: key }), class: active === key ? 'is-active' : '', text: label });
  const nav = el('nav', { class: 'village-nav village-nav--portal', 'aria-label': '青垭村站点栏目' }, [
    navItem('home', '首页'),
    navItem('about', '走进青垭'),
    navItem('routes', '旅游线路'),
    navItem('stay', '住宿餐饮'),
    navItem('services', '游客服务'),
    navItem('notices', '通知公告'),
  ]);
  const ticker = el('div', { class: 'village-ticker' }, [
    el('b', { text: '站内公告：' }),
    el('span', { text: '九弯雨后路滑，请穿防滑鞋；村口自来水检修已结束。　　[09-08] 丰收节摊位报名还有 3 天。' }),
  ]);
  header.append(today, mast, nav, ticker);
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

function chatRouteLink(list, href, title, time = '') {
  const row = el('div', { class: 'msg-row msg-row--other' });
  row.append(avatar('msg-avatar'));
  const bubble = el('div', { class: 'msg-bubble msg-bubble--route-link' }, [
    el('span', { class: 'chat-route-link__app', text: '路迹' }),
    el('a', { href: `#/${href}`, class: 'chat-route-link__title', text: title }),
    el('small', { text: '周末别找我 · 今天更新' }),
  ]);
  if (time) bubble.append(el('span', { class: 'msg-time', text: time }));
  row.append(bubble);
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
  if (state.flags.stage2MessageReady && !state.choices.stage2) return { key: 'stage2', options: [['come-back','你先回来'],['send-photo','拍照给我看'],['what-things','这些东西是谁留的？']] };
  if (state.flags.stage4MessageReady && !state.choices.stage4) return { key: 'stage4', options: [['where-now','你现在到底在哪'],['just-sent','你是刚发的吗'],['how-know','你怎么知道我查到哪了']] };
  if (state.flags.stage5MessageReady && !state.choices.stage5) return { key: 'stage5', options: [['what-book','第二本是什么'],['are-you','你到底是不是我哥'],['saw-yougen','我已经看到周有根的留言了']] };
  if (state.flags.stage6MessageReady && !state.choices.stage6) return { key: 'stage6', options: [['bring-rescue','我现在就报警'],['wait-me','阿纪跟你在一起吗'],['who-maintains','你为什么又回四号']] };
  return null;
}

export function renderBoot({ store, flow, audio, router, paywall }) {
  const main = el('main', { id: 'app-main', class: 'chat-page', tabindex: '-1' });
  const app = el('section', { class: 'messenger-app', 'aria-label': '与周航的聊天' });
  const state = store.getState();
  const backControl = state.flags.lastPublicPath
    ? el('a', { class: 'chat-back', href: `#/${state.flags.lastPublicPath}`, 'aria-label': '返回刚才浏览的页面', text: '‹' })
    : el('span', { class: 'chat-back chat-back--empty', 'aria-hidden': 'true', text: '‹' });
  const top = el('header', { class: 'chat-topbar' }, [
    backControl,
    el('a', { href: '#/contact', class: 'chat-person-link', 'aria-label': '打开周航联系人资料' }, [
      avatar('chat-avatar'),
      el('div', { class: 'chat-person' }, [
        el('strong', { text: '周航' }),
        el('span', { text: state.meta.endingReached ? '最后在线 9月14日 11:18' : (state.choices.stage1 ? '最后在线 11:44' : '手机在线') }),
      ]),
    ]),
    el('div', { class: 'chat-top-actions' }, [
      el('span', { class: 'chat-top-icon', text: '⌕', 'aria-hidden': 'true' }),
      el('button', { class: 'chat-support-button', type: 'button', 'aria-label': '支持《返程线》1元', text: '♡' }),
      el('a', { href: '#/contact', class: 'chat-top-icon', 'aria-label': '联系人详情', text: '•••' }),
    ]),
  ]);
  const supportButton = top.querySelector('.chat-support-button');
  supportButton?.addEventListener('click', () => {
    if (!paywall) return;
    if (paywall.hasPaid()) {
      toast('已记录你的支持，感谢！');
      return;
    }
    paywall.markAutoShown();
    paywall.show();
  });

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
    chatRouteLink(list, 'post', '青垭九弯 / 北坡旧返程探路');
    chatMessage(list, 'other', '他说看到我走到四号，觉得能过。');
    chatMessage(list, 'other', '别按我发的轨迹进来。');
    chatMessage(list, 'other', '我回去找他。');
    chatMessage(list, 'other', '如果十二点前没回，你直接报警。', '10:26');
  }

  if (state.flags.stage2MessageReady) {
    chatMessage(list, 'other', '四号这边不对。', '10:37');
    chatMessage(list, 'other', '红布条断了一截，旁边还有新的。倒的箭头被人扶起来了。');
    chatMessage(list, 'other', '蓝铁皮边上有两瓶水，瓶身很新。', '10:38');
    if (state.choices.stage2) {
      const labels={'come-back':'你先回来','send-photo':'拍照给我看','what-things':'这些东西是谁留的？'};
      const replies={'come-back':'准备撤。先把那个人找到。','send-photo':'等会发。别放大看，四号后面那块蓝铁皮有点怪。','what-things':'断路条、扶起来的箭头、蓝铁皮边上的新水。先别管是谁放的。'};
      chatMessage(list,'me',labels[state.choices.stage2],'10:38');
      chatMessage(list,'other',replies[state.choices.stage2],'10:39');
    }
  }

  if (state.flags.stage4MessageReady) {
    chatMessage(list, 'other', '你别再往下翻了。', '11:07');
    chatMessage(list, 'other', '翻到周成就够了。');
    chatMessage(list, 'other', '别去找他爸。', '11:08');
    if (state.choices.stage4) {
      const labels={'where-now':'你现在到底在哪','just-sent':'你是刚发的吗','how-know':'你怎么知道我查到哪了'};
      const replies={'where-now':'二号棚附近。人找到了，能说话。你先别往北坡带人。','just-sent':'刚发。前面几条可能晚到了，这里信号一直跳。','how-know':'我不知道。……你刚才是不是在看周成？'};
      chatMessage(list,'me',labels[state.choices.stage4],'11:08');
      chatMessage(list,'other',replies[state.choices.stage4],'11:09');
    }
  }

  if (state.flags.stage5MessageReady) {
    chatMessage(list, 'other', '别点四号后面那个目录。', '11:26');
    chatMessage(list, 'other', '第二本是旧巡查册。放过很多年。');
    chatMessage(list, 'other', '你在家。别替我往回走。', '11:27');
    if (state.choices.stage5) {
      const labels={'what-book':'第二本是什么','are-you':'你到底是不是我哥','saw-yougen':'我已经看到周有根的留言了'};
      const replies={'what-book':'四号后面石缝里的旧册子。……我刚才是不是已经说过了？','are-you':'是。你先别来。其他的等我回去再吵。','saw-yougen':'他拆红布条和箭头。四号后面那本不是他放的。'};
      chatMessage(list,'me',labels[state.choices.stage5],'11:27');
      chatMessage(list,'other',replies[state.choices.stage5],'11:28');
    }
  }

  if (state.flags.stage6MessageReady) {
    chatMessage(list, 'other', '阿纪找到了。二号棚下面。脚扭了，能说话。', '11:42');
    chatMessage(list, 'other', '我给他留了灯。你报警就让他们从九弯主线进。');
    chatMessage(list, 'other', '别拿我那条轨迹带人。');
    chatMessage(list, 'other', '四号那边刚才还有一盏灯。');
    chatMessage(list, 'other', '我回去看一眼。只到四号。', '11:43');
    if (state.choices.stage6) {
      const labels={'bring-rescue':'我现在就报警','wait-me':'阿纪跟你在一起吗','who-maintains':'你为什么又回四号'};
      const replies={'bring-rescue':'报。让他们走九弯主线，别按我的轨迹。','wait-me':'他在二号棚。灯留给他了，我不在。','who-maintains':'那边有灯。看一眼就回。……这句我是不是说过了？'};
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

function renderTrailSiteSection(section, query) {
  const labels = { routes: '路线', community: '社区', gear: '装备', search: '搜索', download: '客户端', correction: '路线纠错' };
  const main = el('main', { id: 'app-main', class: 'trail-site trail-directory-site', tabindex: '-1' });
  main.append(renderTrailHeader(section === 'search' || section === 'download' || section === 'correction' ? 'discover' : section));
  const page = el('section', { class: 'trail-directory-page' });
  page.append(el('p', { class: 'trail-directory-crumb', text: `路迹 > ${labels[section] || '发现'}` }));
  if (section === 'routes') {
    const route = qv(query, 'route');
    const routes = {
      nanling:['南岭小环线','12.4 km','中等','林间小环线，最近一周有人反馈西侧木桥施工，按现场绕行牌走。'],
      greenway:['城西绿道','18.6 km','容易','城市绿道，补水点多，夜间部分路段照明一般。'],
      baishi:['白石坡','9.7 km','中等','短而陡，冬季结冰时平台会标记临时封闭。'],
    };
    if (route && routes[route]) {
      const r=routes[route];
      page.append(el('h1',{text:r[0]}),el('p',{text:`${r[1]} · ${r[2]}`}),el('p',{text:r[3]}),el('p',{class:'fine-note',text:'公开路线资料仅供出发前参考，临时封闭以现场公告为准。'}),el('a',{href:localHref('profile',{site:'routes'}),text:'‹ 返回热门路线'}));
    } else {
      page.append(el('h1', { text: '热门路线' }), el('p', { text: '路线按近期公开记录整理。没有连续底图或状态不明的旧路线不会出现在推荐列表。' }),
        el('table', { class: 'trail-directory-table' }, [el('tbody', {}, [
          ['青垭九弯环线','16.0 km','中等','最近 7 天 126 人记录','#/post'],
          ['南岭小环线','12.4 km','中等','最近 7 天 84 人记录',localHref('profile',{site:'routes',route:'nanling'})],
          ['城西绿道','18.6 km','容易','最近 7 天 391 人记录',localHref('profile',{site:'routes',route:'greenway'})],
          ['白石坡','9.7 km','中等','最近 7 天 63 人记录',localHref('profile',{site:'routes',route:'baishi'})],
        ].map(r=>el('tr',{},[el('td',{},el('a',{href:r[4],text:r[0]})),...r.slice(1,4).map(x=>el('td',{text:x}))])))]));
    }
  } else if (section === 'community') {
    const topic=qv(query,'topic');
    const topics={
      rain:['周末下雨，南岭还能走吗？','南岭西侧下雨后泥多，官方入口没有封就能走，但不熟路不要抄林间小径。'],
      water:['第一次走 15km 带多少水','天气凉也至少按自己平时饮水量准备。路线中有没有补水点要提前查，不要指望路上临时买。'],
      pole:['登山杖锁扣松了怎么处理','先清泥再锁紧。碳杖有裂纹别硬凑长线，临时胶带不等于修好了。'],
      night:['城西绿道夜跑照明情况','主路有灯，西河段两处树荫下很暗。夜跑还是自己带灯。'],
      wind:['九弯秋季风大吗','山脊风比村口大得多。下午更明显，帽子和外套别挂包外面。'],
    };
    if(topic && topics[topic]) page.append(el('h1',{text:topics[topic][0]}),el('p',{text:topics[topic][1]}),el('p',{class:'fine-note',text:'普通公开讨论 · 回复内容已折叠'}),el('a',{href:localHref('profile',{site:'community'}),text:'‹ 返回户外圈'}));
    else page.append(el('h1', { text: '户外圈' }), el('p', { text: '公开讨论按时间排序。请勿把他人的轨迹当作线路开放证明。' }),
      ...[['rain','周末下雨，南岭还能走吗？','28'],['water','第一次走 15km 带多少水','41'],['pole','登山杖锁扣松了怎么处理','17'],['night','城西绿道夜跑照明情况','63'],['wind','九弯秋季风大吗','22']].map(([id,title,n])=>el('p',{class:'trail-directory-row'},[el('a',{href:localHref('profile',{site:'community',topic:id}),text:title}),el('small',{text:`　回复 ${n}`})])));
  } else if (section === 'gear') {
    const article = qv(query, 'article');
    const gear = {
      '1':['雨衣比冲锋衣重要的三次经历','三次都是下午突然下雨。结论很普通：便宜雨衣不体面，但真下大雨时比“我应该还能撑一会儿”有用。'],
      '2':['鞋后跟磨脚到底是不是鞋的问题','先换袜子，再看鞋带，再看尺码。走十公里以后才发现的问题，不要靠创可贴硬撑二十公里。'],
      '3':['头灯备用电池应该放哪','别跟主灯放同一个湿袋里。长线至少留一组独立备用电池。'],
      '4':['离线地图下载前先做什么','确认下载的是当前开放路线，不要把旧轨迹截图当作离线地图。'],
    };
    if (article && gear[article]) page.append(el('h1',{text:gear[article][0]}),el('p',{text:gear[article][1]}),el('p',{class:'fine-note',text:'普通用户经验帖 · 评论已折叠'}),el('a',{href:localHref('profile',{site:'gear'}),text:'‹ 返回装备讨论'}));
    else page.append(el('h1', { text: '装备讨论' }), el('p', { text: '这里是普通用户经验，不是平台购买建议。' }),
      ...['雨衣比冲锋衣重要的三次经历','鞋后跟磨脚到底是不是鞋的问题','头灯备用电池应该放哪','离线地图下载前先做什么'].map((x,i)=>el('p',{class:'trail-directory-row'},[el('a',{href:localHref('profile',{site:'gear',article:String(i+1)}),text:x}),el('small',{text:`　${18+i*7} 条回复`})])));
  } else if (section === 'search') {
    page.append(el('h1', { text: '站内搜索' }), el('p', { text: '公开页面搜索示例：青垭、周末别找我、九弯。私密草稿不会出现在站内搜索。' }),
      el('div',{class:'trail-search-results'},[el('p',{text:'用户：周末别找我 @noweekend'}),el('p',{text:'地点：青垭村'}),el('p',{text:'路线：青垭九弯环线'})]));
  } else if (section === 'download') {
    page.append(el('h1',{text:'路迹客户端'}),el('p',{text:'当前网页为游客浏览模式。离线轨迹、草稿和设备恢复记录仅在对应设备本地存在。'}),el('p',{class:'trail-directory-row',text:'Android 8.6.2　2026-08-30 更新'}),el('p',{class:'trail-directory-row',text:'iOS 8.6.1　2026-08-27 更新'}));
  } else if (section === 'correction') {
    page.append(el('h1',{text:'路线纠错'}),el('p',{text:'平台只接受公开路线的地图错误、封闭信息和道路变更反馈。未开放区域不会因用户提交而变成推荐路线。'}),el('p',{class:'trail-directory-row',text:'纠错编号示例：路线名称 / 位置 / 现场照片 / 发生时间'}));
  } else {
    page.append(el('h1',{text:'发现'}),el('p',{text:'近期公开路线和用户动态。'}));
  }
  main.append(page); return main;
}

function renderTrailProfileView({ store, profileView }) {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader('discover'));
  const page = el('section',{class:'trail-profile-subpage'});
  const nav = el('nav',{class:'trail-tabs','aria-label':'用户主页栏目'},[
    el('a',{href:'#/profile',text:'动态'}),
    el('a',{href:localHref('profile',{view:'tracks'}),class:profileView==='tracks'?'is-active':'',text:'轨迹'}),
    el('a',{href:localHref('profile',{view:'favorites'}),class:profileView==='favorites'?'is-active':'',text:'收藏'}),
    el('a',{href:localHref('profile',{view:'about'}),class:profileView==='about'?'is-active':'',text:'关于'}),
  ]);
  page.append(el('header',{class:'trail-profile-subhead'},[avatar('profile-avatar-image'),el('div',{},[el('h1',{text:'周末别找我'}),el('p',{text:'@noweekend'})])]),nav);
  if (profileView === 'tracks') {
    const rows = [['青垭九弯 / 北坡旧返程探路','今天','3.2 km'],['城西绿道','2026-07-18','18.6 km'],['南岭小环线','2026-05-02','12.4 km'],['白石坡','2025-11-09','9.7 km']];
    page.append(el('h2',{text:'公开轨迹'}),...rows.map((r,i)=>el('div',{class:'trail-profile-list-row'},[i===0&&store.getState().choices.stage1?el('a',{href:'#/post',text:r[0]}):el('strong',{text:r[0]}),el('span',{text:r[1]}),el('span',{text:r[2]})])));
  } else if (profileView === 'favorites') {
    page.append(el('h2',{text:'公开收藏'}),...['南岭补水点整理','城西绿道夜间入口','白石坡冬季封闭说明'].map(x=>el('p',{class:'trail-profile-list-row',text:x})),el('p',{class:'fine-note',text:'私密收藏仅本人可见。'}));
  } else {
    page.append(el('h2',{text:'关于'}),el('p',{text:'普通上班族。周末走路。主要记录补给、岔口、天气和容易走错的地方。'}),el('dl',{class:'trail-user-facts'},[el('dt',{text:'注册'}),el('dd',{text:'2021-03'}),el('dt',{text:'公开轨迹'}),el('dd',{text:'37'}),el('dt',{text:'常用设备'}),el('dd',{text:'手机 + 头灯'})]));
  }
  main.append(page); return main;
}

export function renderProfile({ store, passwords, router, query }) {
  const siteSection = qv(query, 'site');
  const profileView = qv(query, 'view', 'activity');
  if (siteSection && siteSection !== 'discover') return renderTrailSiteSection(siteSection, query);
  if (profileView !== 'activity') return renderTrailProfileView({ store, profileView });
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
  stream.append(el('nav', { class: 'trail-tabs', 'aria-label': '用户主页栏目' }, [
    el('a', { href: '#/profile', class: 'is-active', text: '动态' }),
    el('a', { href: localHref('profile', { view: 'tracks' }), text: '轨迹' }),
    el('a', { href: localHref('profile', { view: 'favorites' }), text: '收藏' }),
    el('a', { href: localHref('profile', { view: 'about' }), text: '关于' }),
  ]));
  if (store.getState().choices.stage1) {
    const post = el('article', { class: 'trail-post-row' }, [
      el('div', { class: 'trail-post-row__head' }, [avatar('trail-post-avatar'), el('div', {}, [el('a', { href: '#/profile', class: 'trail-author-link', text: '周末别找我' }), el('span', { text: '今天 10:18 · 10:25 编辑 · 青垭村' })])]),
      el('p', { text: '青垭九弯主线正常。北坡老返程我只走到四号，后段路面已经散了，我在这里折返。' }),
      el('p', { class: 'trail-post-edit', text: '10:25 补：别照这个轨迹进北坡。有人已经按刚才同步的轨迹进去了，我回去找他。' }),
      photo({ src: IMG.trail, alt: '青垭九弯山路', className: 'photo--trail-stream' }),
      el('div', { class: 'trail-post-actions' }, [el('span', { text: '♡ 312' }), el('span', { text: '评论 46' }), pageLink('post', '轨迹详情')]),
    ]);
    stream.append(post);
  } else {
    stream.append(el('article', { class: 'trail-post-row trail-post-row--older' }, [
      el('div', { class: 'trail-post-row__head' }, [avatar('trail-post-avatar'), el('div', {}, [el('strong', { text: '周末别找我' }), el('span', { text: '上周日 · 城西绿道' })])]),
      el('p', { text: '下雨前走了 12 公里。新鞋后跟磨脚，先不夸。' }),
      el('div', { class: 'trail-post-actions' }, [el('span', { text: '♡ 87' }), el('span', { text: '评论 8' })]),
    ]));
  }

  stream.append(el('section', { class: 'trail-history' }, [
    el('h2', { text: '以前的动态' }),
    olderTrailPost({ date: '2026-07-18', place: '城西绿道 · 18.6 km', text: '热。水带少了。最后三公里靠便利店救命。', stats: '♡ 96　评论 11' }),
    olderTrailPost({ date: '2026-05-02', place: '南岭小环线 · 12.4 km', text: '没登顶。下午雷太密，撤得很值。', stats: '♡ 141　评论 23' }),
    olderTrailPost({ date: '2025-11-09', place: '白石坡 · 9.7 km', text: '风景不错。台阶不做人。', stats: '♡ 208　评论 34' }),
    olderTrailPost({ date: '2025-03-16', place: '东郊水库 · 14.1 km', text: '新鞋第二次。还是磨。鞋没错，可能是脚。', stats: '♡ 78　评论 7' }),
  ]));

  const privateArea = el('section', { class: 'trail-private-tools' });
  privateArea.append(el('h2', { text: '本机缓存' }));
  privateArea.append(el('p', { class: 'trail-private-note', text: '这个浏览器保留过该账号的本地草稿索引；正文仍需要本机口令。' }));
  const draftRow = el('div', { class: 'trail-private-row' }, [
    el('div', {}, [el('strong', { text: '私密草稿 · 10:11 自动保存' }), el('small', { text: store.getState().passwords.noweekend ? '1 条 · 口令已验证' : '1 条 · 本机口令' })]),
  ]);
  const draftButton = el('button', { type: 'button', class: 'trail-row-button', text: store.getState().passwords.noweekend ? '打开 ›' : '验证 ›' });
  draftButton.addEventListener('click', () => store.getState().passwords.noweekend ? router.navigate('draft-1') : openDraftPassword({ passwords, router }));
  draftRow.append(draftButton); if (store.getState().choices.stage1) privateArea.append(draftRow);
  if (store.getState().stage >= 6 && store.getState().choices.stage6) {
    const rec = el('div', { class: 'trail-private-row' }, [el('div', {}, [el('strong', { text: '设备恢复草稿' }), el('small', { text: store.getState().passwords.noreturn ? '1 条 · 已恢复' : '1 条 · 需要恢复标签' })])]);
    const b = el('button', { type: 'button', class: 'trail-row-button', text: store.getState().passwords.noreturn ? '打开 ›' : '恢复 ›' });
    b.addEventListener('click', () => store.getState().passwords.noreturn ? router.navigate('final-draft') : openFinalDraftPassword({ passwords, router }));
    rec.append(b); privateArea.append(rec);
  }
  if (store.getState().choices.stage1 || (store.getState().stage >= 6 && store.getState().choices.stage6)) stream.append(privateArea);
  const right = el('aside', { class: 'trail-profile-right' }, [
    el('h2', { text: '地点' }),
    el('div', { class: 'trail-place-row' }, [photo({ src: IMG.village, alt: '青垭村山谷', className: 'photo--trail-place' }), el('div', {}, [el('a', { href: '#/qingya', class: 'trail-place-link trail-place-link--secondary', text: '地点资料：青垭村' }), el('span', { text: '热门路线：青垭九弯环线' })])]),
    el('h2', { text: '附近路线' }),
    el('span', { class: 'trail-muted-row', text: '青垭九弯环线 · 16.0 km' }),
    el('span', { class: 'trail-muted-row', text: '南坡林道 · 8.4 km' }),
  ]);
  grid.append(left, stream, right); main.append(grid); return main;
}

function routeRecordFigure() {
  const figure = el('section', { class: 'track-record-figure', 'aria-label': '北坡探路离线轨迹记录' });
  const imageButton = photo({
    src: IMG.northTrack,
    alt: '青垭北坡一段被灌木和坡地切断的旧路现场',
    caption: '北坡探路段 · 设备离线记录配图',
    className: 'photo--track-record',
  });
  const points = el('ol', { class: 'track-record-points', 'aria-label': '本次轨迹时间记录' }, [
    el('li', {}, [el('time', { text: '09:26' }), el('div', {}, [el('strong', { text: '青垭村' }), el('span', { text: '开始记录' })])]),
    el('li', {}, [el('time', { text: '09:58' }), el('div', {}, [el('strong', { text: '九弯北岔口' }), el('span', { text: '离开官方主线' })])]),
    el('li', {}, [el('time', { text: '10:08' }), el('div', {}, [el('strong', { text: '四号看路人' }), el('span', { text: '最后现场照片' })])]),
    el('li', {}, [el('time', { text: '10:09' }), el('div', {}, [el('strong', { text: '折返' }), el('span', { text: '后段废掉，不继续' })])]),
  ]);
  figure.append(
    imageButton,
    el('p', { class: 'track-record-note', text: '北坡段没有可靠的连续道路底图。路迹只保留设备时间点和现场记录，不把旧轨迹画成一条看起来可以照走的线路。' }),
    points,
  );
  return figure;
}

export function renderPost({ store }) {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader());
  if (!store.getState().choices.stage1) {
    main.append(el('section', { class: 'trail-empty-state' }, [
      el('h1', { text: '这条轨迹还没有同步到公开页面' }),
      el('p', { text: '路迹只能读取已经上传到服务器的公开记录。离线记录会在设备重新联网后出现。' }),
      el('a', { href: '#/profile', text: '返回用户主页' }),
    ]));
    return main;
  }
  const wrap = el('div', { class: 'track-layout' });
  const article = el('article', { class: 'track-article' });
  article.append(
    el('div', { class: 'track-userline' }, [avatar('trail-post-avatar'), el('div', {}, [el('a', { href: '#/profile', class: 'trail-author-link', text: '周末别找我' }), el('span', { text: '今天 10:18 · 10:25 编辑 · 青垭村' })])]),
    el('h1', { text: '青垭九弯 / 北坡旧返程探路' }),
    el('p', { class: 'track-state', text: '公开轨迹 · 首次同步 10:18 · 最后同步 10:34' }),
    routeRecordFigure(),
    el('table', { class: 'track-data-table' }, [el('tbody', {}, [
      el('tr', {}, [el('th', { text: '记录距离' }), el('td', { text: '3.2 km' }), el('th', { text: '记录用时' }), el('td', { text: '0:43' })]),
      el('tr', {}, [el('th', { text: '累计爬升' }), el('td', { text: '238 m' }), el('th', { text: '最后同步' }), el('td', { text: '10:34' })]),
    ])]),
    el('h2', { text: '现场备注' }),
    el('p', { text: '九弯主线没问题。北坡入口还能认出来，进去以后旧路断得很厉害，前几年留下的东西倒是还在。' }),
    el('p', { class: 'track-quote', text: '10:09　到四号了。后面不走了。路完全烂掉。' }),
    photo({ src: IMG.watchman, alt: '树林里一尊旧水泥指路人像', className: 'photo--track-raw' }),
    el('p', { class: 'track-edit-note', text: '10:25 编辑：别照这个轨迹进北坡。有人已经按刚才同步的轨迹进去了，我回去找他。' }),
    el('div', { class: 'track-comment-entry' }, [
      ...(store.getState().stage >= 6 || store.getState().flags.cogAjiComment
        ? [el('a', { href: '#/aji-comment', text: '查看已恢复评论（46）' })]
        : [el('span', { class: 'track-comment-count', text: '评论 46' })]),
      el('span', { text: store.getState().stage >= 6 ? '10:21–10:33 的缓存可读取' : '按时间排序' }),
    ]),
  );
  const side = el('aside', { class: 'track-info-side' }, [
    el('h2', { text: '本次记录的最后位置' }),
    el('ol', { class: 'track-points' }, [
      el('li', { text: '青垭游客中心' }),
      el('li', { text: '九弯主线北岔口' }),
      el('li', { text: '旧石料场口' }),
      el('li', {}, [
        ...(store.getState().stage >= 2 ? [el('a', { href: '#/watchmen', text: '四号看路人 · 10:08' })] : [el('strong', { text: '四号看路人 · 10:08' })]),
        el('span', { text: '　随后折返' }),
      ]),
    ]),
    el('div', { class: 'track-sync-box' }, [el('strong', { text: '轨迹同步' }), el('p', { text: '北坡部分区域信号不稳定，离线轨迹会在重新联网后批量上传。' }), el('span', { class: 'sync-pulse', text: '同步记录已完成' })]),
    el('p', { class: 'track-side-source', text: '“四号看路人”是当地旧石料场设施名称，青垭村志有单独说明。' }),
  ]);
  wrap.append(article, side); main.append(wrap); return main;
}

export function renderDraft1({ store }) {
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
    ...(store.getState().stage >= 2 ? [el('p', { class: 'draft-source-followup' }, [
      el('span', { text: '草稿里提到的地点资料：' }),
      el('a', { href: '#/watchmen', text: '青垭村志 · 四号看路人' }),
    ])] : []),
    el('footer', { class: 'draft-foot' }, [el('span', { text: '未发布' }), el('a', { href: '#/profile', text: '返回草稿箱' })]),
  );
  main.append(wrap); return main;
}

const VILLAGE_NOTICES = [
  { id:'20260912', date:'2026-09-12', title:'关于村口自来水管网检修的通知', body:['9月13日 08:00—12:00，村口东侧自来水支管进行检修。游客中心一层卫生间不受影响，老街东头两户民宿可能短时停水。','施工完成后如出现短时水质浑浊，请放水数分钟后再使用。'] },
  { id:'20260910', date:'2026-09-10', title:'青垭村秋季森林防火值班表', body:['9月10日起进入秋季森林防火值班期。村口、九弯起点和老杉林口安排轮值巡查。','游客进入开放徒步路线请勿携带明火，吸烟后请确认烟头完全熄灭。'] },
  { id:'20260908', date:'2026-09-08', title:'丰收节摊位报名截至本周五', body:['本月丰收节摊位报名截至9月11日17:00。农产品、手工食品和村民自制物件均可到村委会登记。','游客摊位暂不接受现场报名。'] },
  { id:'20260905', date:'2026-09-05', title:'村卫生室九月坐诊时间', body:['周一、周三、周五 08:30—17:00 坐诊；周末仅处理简单外伤和常用药咨询。','严重外伤请直接联系县医院或拨打急救电话。'] },
  { id:'20260901', date:'2026-09-01', title:'秋季徒步与降雨天气安全提示', body:['九弯开放主线雨后木阶、石阶较滑，请根据天气调整行程。历史游记中出现的北坡旧返程不属于当前开放线路。','游客中心只提供当前开放路线信息，不提供旧路线方向指引。'], related:'safety' },
  { id:'20260828', date:'2026-08-28', title:'九弯环线雨后安全提醒', body:['连续降雨后九弯山脊风大，南侧下坡泥泞。建议穿防滑鞋并预留返程时间。','下午出现雷雨时请按现有主线尽快下撤。'] },
  { id:'20260823', date:'2026-08-23', title:'本周六村口篮球场暂停使用', body:['村口篮球场本周六用于丰收节舞台搭建，全天暂停使用。','周日早上恢复。'] },
  { id:'20260815', date:'2026-08-15', title:'2026 年秋季民宿联系电话汇总', body:['青垭人家、山腰客栈、老街民宿等经营户秋季电话已重新核对。','周末房间紧张，建议提前电话确认，不建议只看旧网页价格。'] },
  { id:'20260731', date:'2026-07-31', title:'关于游客车辆停放的说明', body:['游客车辆统一停放村口停车场，不要进入老街窄巷。','夜间停车请勿堵住消防通道。'] },
  { id:'20260718', date:'2026-07-18', title:'村口公交站候车点临时调整', body:['道路修补期间，原候车点向县城方向移动约80米。','末班车时间仍为18:20。'] },
  { id:'20260629', date:'2026-06-29', title:'九弯沿线饮水点维护完成', body:['游客中心和九弯起点两处饮水点已完成清洗维护。','山脊途中没有固定补水点，请出发前备足饮水。'] },
  { id:'20260512', date:'2026-05-12', title:'关于文明采摘野果的提醒', body:['村边果树和茶地大多有经营户，请勿自行采摘。','山里不认识的果子也不要尝。'] },
];

function renderVillageArticle(notice) {
  const main=el('main',{id:'app-main',class:'village-site village-portal-site',tabindex:'-1'});
  main.append(renderVillageHeader('notices'));
  const page=el('article',{class:'village-local-article'},[
    el('p',{class:'village-local-crumb'},[el('a',{href:'#/qingya',text:'首页'}),el('span',{text:' ＞ '}),el('a',{href:localHref('qingya',{section:'notices'}),text:'通知公告'}),el('span',{text:' ＞ 正文'})]),
    el('h1',{text:notice.title}),
    el('p',{class:'village-local-meta',text:`发布时间：${notice.date}　来源：青垭村村民委员会　浏览：${260 + Number(notice.id.slice(-2))*7}`}),
    ...notice.body.map(x=>el('p',{text:x})),
    notice.related ? el('p',{class:'village-local-related'},[el('strong',{text:'相关详细资料：'}),el('a',{href:`#/${notice.related}`,text:'北坡旧返程线路安全提醒'})]) : null,
    el('div',{class:'village-local-tools'},[el('a',{href:localHref('qingya',{section:'notices'}),text:'返回公告列表'}),el('button',{type:'button',text:'打印本页','aria-label':'打印本页'})]),
  ].filter(Boolean));
  page.querySelector('button')?.addEventListener('click',()=>globalThis.print?.());
  main.append(page, el('footer',{class:'village-footer',text:'青垭村村民委员会　网页维护：游客服务中心'})); return main;
}

function renderVillageSection(section, query) {
  const titles={about:'走进青垭',routes:'旅游线路',stay:'住宿餐饮',services:'游客服务',notices:'通知公告'};
  const main=el('main',{id:'app-main',class:'village-site village-portal-site',tabindex:'-1'});
  main.append(renderVillageHeader(section));
  const page=el('section',{class:'village-local-section'});
  page.append(el('p',{class:'village-local-crumb'},[el('a',{href:'#/qingya',text:'首页'}),el('span',{text:` ＞ ${titles[section]||''}`})]),el('h1',{text:titles[section]||'青垭村'}));
  if(section==='about'){
    page.append(el('p',{text:'青垭村位于群山之间，常住人口不多。村里主要经营茶、笋干、蜂蜜和季节性乡村旅游。游客中心、村卫生室和公交候车点都在村口。'}),
      el('h2',{text:'村情资料'}),el('table',{class:'village-local-table'},[el('tbody',{},[['海拔','约980米'],['常住人口','约620人'],['村内公交','每日4班（节假日另行调整）'],['开放徒步','青垭九弯环线']].map(r=>el('tr',{},[el('th',{text:r[0]}),el('td',{text:r[1]})])))]),
      el('h2',{text:'村志旧物'}),el('p',{},[el('span',{text:'旧石料场、水泥“看路人”、老广播喇叭等资料由村志小组单独整理。'}),el('a',{href:'#/watchmen',text:'查看村志旧物资料 ›'})]));
  } else if(section==='routes'){
    const route=qv(query,'route');
    if(route){ const data={river:['溪谷散步线','约3.5公里','村口—小桥—溪边茶地—村口，适合半日散步。雨后溪边石头滑。'],tea:['茶田短线','约2.8公里','村口向东经过茶田和老供销社旧址，不进入山脊区域。'],ridge:['南坡观景短线','约6.2公里','只到南坡观景点后原路返回。下午风大时不建议上去。']}[route]; page.append(el('h2',{text:data?.[0]||'线路资料'}),el('p',{text:data?.[1]||''}),el('p',{text:data?.[2]||''}),el('a',{href:localHref('qingya',{section:'routes'}),text:'返回线路列表'})); }
    else page.append(el('table',{class:'village-local-table village-route-list'},[el('tbody',{},[
      ['青垭九弯环线','约16公里 / 5–7小时',el('a',{href:'#/jiuwan',text:'查看详情'})],['溪谷散步线','约3.5公里 / 1–2小时',el('a',{href:localHref('qingya',{section:'routes',route:'river'}),text:'查看详情'})],['茶田短线','约2.8公里 / 1小时',el('a',{href:localHref('qingya',{section:'routes',route:'tea'}),text:'查看详情'})],['南坡观景短线','约6.2公里 / 2–3小时',el('a',{href:localHref('qingya',{section:'routes',route:'ridge'}),text:'查看详情'})],
    ].map(r=>el('tr',{},[el('th',{text:r[0]}),el('td',{text:r[1]}),el('td',{},r[2])])))]),el('p',{class:'village-local-note',text:'历史旧路线不列入当前旅游线路目录。'}));
  } else if(section==='stay'){
    const stay=qv(query,'stay');
    if(stay){ const data={hillside:['山腰客栈','8间客房，周末需提前电话确认。早餐07:00起。'],oldstreet:['老街民宿','5间客房，老屋改造，无电梯。晚上22:30后请轻声。'],teahouse:['茶田小院','3间客房，只接受电话预订。'] }[stay]; page.append(el('h2',{text:data?.[0]||'经营户资料'}),el('p',{text:data?.[1]||''}),el('p',{text:'联系电话以村口游客中心登记本为准。'}),el('a',{href:localHref('qingya',{section:'stay'}),text:'返回住宿餐饮'})); }
    else page.append(el('table',{class:'village-local-table'},[el('tbody',{},[
      ['青垭人家农家乐','柴火饭 / 简单住宿',el('a',{href:'#/food',text:'经营户网站'})],['山腰客栈','住宿 / 早餐',el('a',{href:localHref('qingya',{section:'stay',stay:'hillside'}),text:'查看'})],['老街民宿','住宿',el('a',{href:localHref('qingya',{section:'stay',stay:'oldstreet'}),text:'查看'})],['茶田小院','住宿 / 茶',el('a',{href:localHref('qingya',{section:'stay',stay:'teahouse'}),text:'查看'})],
    ].map(r=>el('tr',{},[el('th',{text:r[0]}),el('td',{text:r[1]}),el('td',{},r[2])])))]),el('p',{text:'价格和空房以经营户当天电话回复为准，本站不提供在线订房。'}));
  } else if(section==='services'){
    page.append(el('h2',{text:'村口便民服务'}),el('table',{class:'village-local-table'},[el('tbody',{},[['游客咨询','游客服务中心一层'],['公共卫生间','游客服务中心一层'],['公交候车','村口站牌'],['停车','村口停车场'],['简单外伤','村卫生室']].map(r=>el('tr',{},[el('th',{text:r[0]}),el('td',{text:r[1]})])))]),el('p',{},[el('span',{text:'详细班次、失物登记和公共设施信息请到游客服务中心网站查询。'}),el('a',{href:'#/service',text:'打开游客服务中心 ›'})]));
  } else if(section==='notices'){
    page.append(el('div',{class:'village-notice-index'},VILLAGE_NOTICES.map(n=>el('div',{class:'portal-news-row'},[el('time',{text:n.date}),el('a',{href:localHref('qingya',{notice:n.id}),text:n.title})]))));
  }
  main.append(page,el('footer',{class:'village-footer',text:'青垭村村民委员会　网页维护：游客服务中心　资料如有变动以现场公告为准'})); return main;
}

export function renderQingya({ flow, query }) {
  const noticeId=qv(query,'notice');
  if(noticeId){ const notice=VILLAGE_NOTICES.find(n=>n.id===noticeId); if(notice) return renderVillageArticle(notice); }
  const section=qv(query,'section');
  if(section && section!=='home') return renderVillageSection(section, query);
  const main = el('main', { id: 'app-main', class: 'village-site village-portal-site', tabindex: '-1' });
  main.append(renderVillageHeader('home'));
  const shell = el('div', { class: 'village-portal' });
  const banner = el('div', { class: 'village-portal-banner' }, [
    photo({ src: IMG.village, alt: '青垭村山谷与村落', className: 'photo--portal-banner' }),
    el('div', { class: 'village-portal-banner__text' }, [el('strong', { text: '青山不远　日子很近' }), el('span', { text: '青垭村欢迎您' })]),
  ]);
  const columns = el('div', { class: 'village-portal-columns' });
  const news = el('section', { class: 'portal-news' }, [el('h2', { text: '最新公告' })]);
  VILLAGE_NOTICES.forEach(n => {
    const row = el('div', { class: 'portal-news-row' }, [el('time', { text: n.date })]);
    row.append(el('a', { href: localHref('qingya', { notice: n.id }), text: n.title }));
    if (['20260908','20260901'].includes(n.id)) row.append(el('em', { class: 'portal-new', text: '新' }));
    news.append(row);
  });
  const route = el('section', { class: 'portal-route' }, [
    el('h2', { text: '推荐线路' }),
    el('div', { class: 'portal-route__body' }, [photo({ src: IMG.trail, alt: '青垭九弯山脊路线', className: 'photo--portal-route' }), el('div', {}, [el('strong', { text: '青垭九弯环线' }), el('p', { text: '约16公里　5–7小时　难度：中等' }), el('a', { href: '#/jiuwan', text: '线路介绍 ›' })])]),
  ]);
  const villageLife = el('section', { class: 'portal-plain-section' }, [
    el('h2', { text: '村里这些天' }),
    el('table', { class: 'portal-plain-table' }, [el('tbody', {}, [
      ['9月13日','老街东头水沟清淤，上午车辆绕行。'],
      ['9月11日','村口晒谷场下午借给小学做活动。'],
      ['9月09日','两家民宿恢复营业，电话见游客中心登记本。'],
      ['9月06日','蜂蜜新货到村供销点，数量不多。'],
      ['9月02日','公交末班仍为18:20，国庆期间另行通知。'],
    ].map(([a,b]) => el('tr', {}, [el('th', { text: a }), el('td', { text: b })])) )]),
    el('p', { class: 'portal-maintain-note', text: '※ 本栏由村委会办公室随手更新，错别字请电话说，不用专门发邮件。' }),
  ]);
  const left = el('div', { class: 'portal-maincol' }, [news, route, villageLife]);
  const side = el('aside', { class: 'portal-side' }, [
    el('section', { class: 'portal-box portal-weather' }, [el('h2', { text: '今日青垭' }), el('strong', { text: '17–24℃　多云' }), el('p', { text: '山脊阵风 4–5 级。下午局部有短时阵雨。' })]),
    el('section', { class: 'portal-box' }, [el('h2', { text: '便民信息' }),
      el('a', { href: '#/service', text: '游客中心 / 公共卫生间' }),
      el('a', { href: '#/food', class: 'portal-secondary-link', text: '餐饮：青垭人家农家乐（今日营业）' }),
      el('span', { text: '村口停车：小车 38 位' }), el('span', { text: '末班公交：18:20' })]),
    el('section', { class: 'portal-box' }, [el('h2', { text: '常用电话' }), el('p', { text: '游客服务　0836-7XXXXXX' }), el('p', { text: '村卫生室　0836-7XXXX12' }), el('p', { text: '公交问询　0836-7XXXX35' })]),
    el('section', { class: 'portal-box' }, [el('h2', { text: '村志资料' }), el('span', { text: '旧建筑、老照片与村史口述资料由村志小组另行整理。' }), el('a',{href:'#/watchmen',text:'旧物资料入口 ›'})]),
  ].filter(Boolean));
  columns.append(left, side);
  shell.append(banner, el('div', { class: 'portal-welcome' }, [el('strong', { text: '青垭村 · 山与人的相遇' }), el('p', { text: '青垭村位于群山之间，海拔约 980 米。村里有农田、溪谷、老杉树林，以及一条沿山脊绕行的九弯环线。' })]), columns,
    el('section', { class: 'portal-links' }, [el('strong', { text: '友情链接：' }), el('span', { text: '青垭县文旅信息　|　天气服务　|　公交查询　|　森林防火' })]),
    el('footer', { class: 'village-footer' }, [
      el('span', { text: '青垭村村民委员会　网页维护：游客服务中心　最后更新：2026-09-12 17:36' }),
      el('span', { text: '今日：328　昨日：291　累计：036821　　建议使用 IE9 以上 / 1366×768 浏览（旧说明未删除）' }),
      el('small', { text: '本站部分栏目资料由各经营户自行提供，如电话有变请以门口公告为准。' }),
    ]));
  main.append(shell); return main;
}

export function renderJiuwan({ flow }) {
  const main = el('main', { id: 'app-main', class: 'village-site route-guide-site', tabindex: '-1' });
  main.append(renderVillageHeader('routes'));
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
    el('p', { class: 'route-small-print', text: '北坡历史线路不属于本路线。相关安全资料由游客服务中心另页发布。' }),
  );
  main.append(wrap); return main;
}
