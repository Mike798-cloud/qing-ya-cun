import { el, icon, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';
import { openModal } from '../core/modal.js';
import { stage1 } from '../data/content.js';

const IMG = {
  bus: './assets/photos/qingya-bus-stop.jpg',
  village: './assets/photos/qingya-morning.jpg',
  trail: './assets/photos/jiuwan-ridge.jpg',
  wok: './assets/photos/qingya-food.jpg',
  watchman: './assets/photos/watchman-04.jpg',
};

function photo({ src, alt, caption, className = '' }) {
  const btn = el('button', { class: `photo ${className}`.trim(), type: 'button', 'aria-label': `${caption}，打开大图` });
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

function renderTrailHeader(active = '') {
  const header = el('header', { class: 'trail-header' });
  const inner = el('div', { class: 'trail-header__inner' });
  inner.append(
    el('a', { href: '#/profile', class: 'trail-logo', text: '路迹' }),
    el('nav', { class: 'trail-nav', 'aria-label': '路迹站点导航' }, [
      el('span', { class: active === 'discover' ? 'is-active' : '', text: '发现' }),
      el('span', { text: '路线' }),
      el('span', { text: '装备' }),
    ]),
    el('span', { class: 'trail-login', text: '游客浏览' }),
  );
  header.append(inner);
  return header;
}

function renderVillageHeader(active = '') {
  const header = el('header', { class: 'village-header' });
  const inner = el('div', { class: 'village-header__inner' });
  inner.append(
    el('a', { href: '#/qingya', class: 'village-brand' }, [
      el('strong', { text: '青垭村' }),
      el('span', { text: '游客服务信息' }),
    ]),
    el('nav', { class: 'village-nav', 'aria-label': '青垭村站点导航' }, [
      el('a', { href: '#/qingya', class: active === 'home' ? 'is-active' : '', text: '首页' }),
      el('a', { href: '#/jiuwan', class: active === 'route' ? 'is-active' : '', text: '徒步' }),
      el('span', { text: '住宿' }),
      el('span', { text: '吃饭' }),
      el('span', { text: '到村' }),
    ]),
  );
  header.append(inner);
  return header;
}

function addMessage(list, side, text, meta = '') {
  const row = el('div', { class: `msg-row msg-row--${side}` });
  const bubble = el('div', { class: 'msg-bubble' });
  bubble.append(el('p', { text }));
  if (meta) bubble.append(el('span', { class: 'msg-time', text: meta }));
  row.append(bubble);
  list.append(row);
}


function refreshChat(router) {
  router?.navigate?.('boot');
  requestAnimationFrame(() => document.querySelector('.chat-composer')?.scrollIntoView({ block: 'end', behavior: 'smooth' }));
}

export function renderBoot({ store, flow, audio, router }) {
  const main = el('main', { id: 'app-main', class: 'chat-page', tabindex: '-1' });
  const phone = el('section', { class: 'chat-shell', 'aria-label': '与周航的聊天' });
  const choice = store.getState().choices.stage1 || '';
  const top = el('header', { class: 'chat-topbar' });
  top.append(
    el('div', { class: 'chat-avatar', text: '航' }),
    el('div', { class: 'chat-person' }, [
      el('strong', { text: '周航' }),
      el('span', { text: choice ? '最后在线 10:26' : '手机在线' }),
    ]),
    el('a', { href: '#/profile', class: 'chat-profile-link', 'aria-label': '打开周航的公开主页' }, icon('help')),
  );

  const list = el('div', { class: 'chat-list' });
  addMessage(list, 'other', '到了。', '08:41');
  const busWrap = el('div', { class: 'msg-row msg-row--other' });
  busWrap.append(photo({ src: IMG.bus, alt: '山村路边的旧公交站', caption: '青垭公交站 · 08:42', className: 'photo--chat' }));
  list.append(busWrap);
  addMessage(list, 'other', '这个公交比我年龄大。', '08:42');
  addMessage(list, 'other', '村里饭量是不是对城市人有什么意见。', '09:17');
  const wokWrap = el('div', { class: 'msg-row msg-row--other' });
  wokWrap.append(photo({ src: IMG.wok, alt: '灶台上一口很大的铁锅', caption: '老板说这是“小锅” · 09:17', className: 'photo--chat photo--wide' }));
  list.append(wokWrap);

  const composer = el('div', { class: 'chat-composer' });
  if (!choice) {
    composer.append(el('p', { class: 'chat-composer__label', text: '回复' }));
    const options = [
      ['small-pot', '你不是一个人吗'],
      ['avoid-side', '先别乱走偏线'],
      ['more-photos', '多拍点图'],
    ];
    for (const [id, label] of options) {
      const b = el('button', { class: 'reply-option', type: 'button', text: label });
      b.addEventListener('click', () => {
        store.dispatch({ type: 'SET_CHOICE', key: 'stage1', value: id });
        flow.unlock(['profile', 'post', 'qingya', 'jiuwan']);
        audio.tone({ frequency: 510, duration: .07, volume: .018 });
        refreshChat(router);
      });
      composer.append(b);
    }
  } else {
    const labels = { 'small-pot': '你不是一个人吗', 'avoid-side': '先别乱走偏线', 'more-photos': '多拍点图' };
    addMessage(list, 'me', labels[choice], '09:18');
    addMessage(list, 'other', stage1.choiceReplies[choice], '09:18');
    addMessage(list, 'other', '今天九弯线。北边有条老返程，我顺便看看。不一定走。', '09:26');
    addMessage(list, 'other', '北坡这个路现场基本没了。但一路还能看到以前的东西。', '10:03');

    const watchWrap = el('div', { class: 'msg-row msg-row--other' });
    watchWrap.append(photo({ src: IMG.watchman, alt: '树林边一尊旧灰色人像，手臂朝外平伸', caption: '四号看路人 · 10:08', className: 'photo--chat photo--portrait photo--watchman' }));
    list.append(watchWrap);
    addMessage(list, 'other', '到四号了。后面不走了。路完全烂掉。', '10:09');
    addMessage(list, 'other', '艹。', '10:24');
    addMessage(list, 'other', '在吗', '10:24');
    addMessage(list, 'other', '我刚看到评论。有人看了我刚才那条动态，也进北坡了。', '10:25');
    addMessage(list, 'other', '他说看到我走到四号，觉得能过。', '10:25');
    addMessage(list, 'other', '别按我发的轨迹进来。', '10:25');
    addMessage(list, 'other', '我回去找他。', '10:26');
    addMessage(list, 'other', '如果十二点前没回，你直接报警。', '10:26');

    if (store.getState().flags.stage2MessageReady) {
      addMessage(list, 'other', '四号这边有点怪。', '10:37');
      addMessage(list, 'other', '路没了，但是东西还在。', '10:37');
      addMessage(list, 'other', '像有人不想让你找路，又不想让你彻底找不到。', '10:38');
      const bChoice = store.getState().choices.stage2 || '';
      if (!bChoice) {
        const stage2Box = el('div', { class: 'stage-message-choice' });
        [['come-back','你先回来'],['send-photo','拍照给我看'],['what-things','什么叫“东西还在”？']].forEach(([id,label])=>{
          const b=el('button',{class:'reply-option',type:'button',text:label});
          b.addEventListener('click',()=>{ store.dispatch({type:'SET_CHOICE',key:'stage2',value:id}); refreshChat(router); });
          stage2Box.append(b);
        });
        list.append(stage2Box);
      } else {
        const labels2={'come-back':'你先回来','send-photo':'拍照给我看','what-things':'什么叫“东西还在”？'};
        const replies2={'come-back':'准备撤。先把那个人找到。','send-photo':'等会发。别放大看，四号后面那块蓝铁皮有点怪。','what-things':'路条没了，箭头有人翻过来，棚子里还有新水。'};
        addMessage(list,'me',labels2[bChoice],'10:38');
        addMessage(list,'other',replies2[bChoice],'10:39');
      }
    }

    let state = store.getState();
    if (state.flags.stage4MessageReady) {
      addMessage(list, 'other', '你别再往下翻了。', '11:07');
      addMessage(list, 'other', '翻到周成就够了。', '11:07');
      addMessage(list, 'other', '再往后不是给你看的。', '11:08');
      const cChoice = state.choices.stage4 || '';
      if (!cChoice) {
        const stage4Box = el('div', { class: 'stage-message-choice' });
        [['where-now','你现在到底在哪'],['just-sent','你是刚发的吗'],['how-know','你怎么知道我查到哪了']].forEach(([id,label]) => {
          const b = el('button', { class: 'reply-option', type: 'button', text: label });
          b.addEventListener('click', () => {
            store.dispatch({ type: 'SET_CHOICE', key: 'stage4', value: id });
            refreshChat(router);
          });
          stage4Box.append(b);
        });
        list.append(stage4Box);
      } else {
        const labels4 = {
          'where-now': '你现在到底在哪',
          'just-sent': '你是刚发的吗',
          'how-know': '你怎么知道我查到哪了',
        };
        const replies4 = {
          'where-now': '我在路上。不是回来的路。',
          'just-sent': '信号会晚一点到。人也会。',
          'how-know': '你看见第四个的时候就该停了。',
        };
        addMessage(list, 'me', labels4[cChoice], '11:08');
        addMessage(list, 'other', replies4[cChoice], '11:09');
      }
      state = store.getState();
    }

    if (state.flags.stage5MessageReady) {
      addMessage(list, 'other', '不要去找第二本。', '11:26');
      addMessage(list, 'other', '第二本是给回来的人看的。', '11:26');
      addMessage(list, 'other', '你不是回来的人。', '11:27');
      const dChoice = state.choices.stage5 || '';
      if (!dChoice) {
        const stage5Box = el('div', { class: 'stage-message-choice' });
        [['what-book','第二本是什么'],['are-you','你到底是不是我哥'],['saw-yougen','我已经看到周有根的留言了']].forEach(([id,label]) => {
          const b = el('button', { class: 'reply-option', type: 'button', text: label });
          b.addEventListener('click', () => {
            store.dispatch({ type: 'SET_CHOICE', key: 'stage5', value: id });
            refreshChat(router);
          });
          stage5Box.append(b);
        });
        list.append(stage5Box);
      } else {
        const labels5 = {
          'what-book': '第二本是什么',
          'are-you': '你到底是不是我哥',
          'saw-yougen': '我已经看到周有根的留言了',
        };
        const replies5 = {
          'what-book': '你已经知道它在什么地方了，你只是还没承认。',
          'are-you': '我是。只是现在说出来不太像。',
          'saw-yougen': '他拆的是给活人看的。留下的不是。',
        };
        addMessage(list, 'me', labels5[dChoice], '11:27');
        addMessage(list, 'other', replies5[dChoice], '11:28');
      }
      state = store.getState();
    }

    if (state.flags.stage6MessageReady) {
      addMessage(list, 'other', '别来四号后面。', '11:42');
      addMessage(list, 'other', '不是找不到。', '11:42');
      addMessage(list, 'other', '是会看见。', '11:43');
      addMessage(list, 'other', '路不是错的。', '11:43');
      addMessage(list, 'other', '错的是有人把它又走成路了。', '11:43');
      const eChoice = state.choices.stage6 || '';
      if (!eChoice) {
        const stage6Box = el('div', { class: 'stage-message-choice' });
        [['bring-rescue','我会带人去找你'],['wait-me','你等我'],['who-maintains','到底是谁在维护北坡']].forEach(([id,label]) => {
          const b = el('button', { class: 'reply-option', type: 'button', text: label });
          b.addEventListener('click', () => {
            store.dispatch({ type: 'SET_CHOICE', key: 'stage6', value: id });
            refreshChat(router);
          });
          stage6Box.append(b);
        });
        list.append(stage6Box);
      } else {
        const labels6 = {
          'bring-rescue': '我会带人去找你',
          'wait-me': '你等我',
          'who-maintains': '到底是谁在维护北坡',
        };
        const replies6 = {
          'bring-rescue': '别按旧线带。',
          'wait-me': '来不及了。',
          'who-maintains': '先是他们。后来是谁都行。',
        };
        addMessage(list, 'me', labels6[eChoice], '11:44');
        addMessage(list, 'other', replies6[eChoice], '11:44');
      }
      state = store.getState();
    }

    if (state.meta.endingReached) {
      list.append(el('div', { class: 'chat-day-divider', text: '9 月 18 日' }));
      addMessage(list, 'other', '别再让它像一条路。', '06:18');
    }

    const stage7Ready = state.stage >= 7;
    const stage6Ready = state.stage >= 6;
    const stage5Ready = state.stage >= 5;
    const stage4Ready = state.stage >= 4;
    const stage3Ready = state.stage >= 3 && Boolean(state.choices.stage2);
    const stage4Replied = Boolean(state.choices.stage4);
    const stage5Replied = Boolean(state.choices.stage5);
    const stage6Replied = Boolean(state.choices.stage6);
    const finalDraftUnlocked = Boolean(state.passwords.noreturn);
    const finalDraftSeen = Boolean(state.flags.stage6DraftSeen);
    const endingReached = Boolean(state.meta.endingReached);
    let nextTitle = '周航 · 公开主页';
    let nextText = '今天 10:09 的轨迹还在。最后能直接确认的位置是“四号”。';
    let nextHref = '#/profile';
    let nextLabel = '打开公开主页';

    if (endingReached) {
      nextTitle = '';
      nextText = '';
      nextHref = '';
      nextLabel = '';
      composer.classList.add('chat-composer--ending');
    } else if (stage7Ready) {
      nextTitle = '青垭县应急信息公开';
      nextText = '搜救联合信息已更新至 9 月 17 日 18:40。';
      nextHref = '#/rescue-result';
      nextLabel = '查看搜救通报';
    } else if (stage6Ready && state.flags.stage6MessageReady && !stage6Replied) {
      nextTitle = '周航 · 新消息';
      nextText = '5 条未读。';
      nextHref = '';
      nextLabel = '';
    } else if (stage6Ready && stage6Replied && finalDraftSeen) {
      nextTitle = '未发布草稿 · 已恢复';
      nextText = '最后本地保存：11:18。';
      nextHref = '#/final-draft';
      nextLabel = '打开恢复条目';
    } else if (stage6Ready && stage6Replied && finalDraftUnlocked) {
      nextTitle = '未发布草稿 · 已恢复';
      nextText = '设备同步队列找到 1 条未发送记录。';
      nextHref = '#/final-draft';
      nextLabel = '打开恢复条目';
    } else if (stage6Ready && stage6Replied) {
      nextTitle = '周末别找我 · 草稿恢复';
      nextText = '主页出现 1 条设备同步恢复记录。';
      nextHref = '#/profile';
      nextLabel = '打开周航主页';
    } else if (stage6Ready) {
      nextTitle = '路迹 · 评论缓存';
      nextText = '10:21，账号“阿纪”在周航的北坡动态下留过一张附件。';
      nextHref = '#/aji-comment';
      nextLabel = '查看当天评论';
    } else if (stage5Ready && state.flags.stage5MessageReady && !stage5Replied) {
      nextTitle = '周航 · 新消息';
      nextText = '3 条未读。';
      nextHref = '';
      nextLabel = '';
    } else if (stage5Ready && stage5Replied) {
      nextTitle = '北坡巡查资料 · 第二本册子';
      nextText = '扫描附件仍可回看。';
      nextHref = '#/second-book';
      nextLabel = '打开扫描件';
    } else if (stage5Ready) {
      nextTitle = '青垭村 · 山地环境资料库';
      nextText = '四号看路人：旧设施编号 QY-BP-04，含历年巡查照片。';
      nextHref = '#/watchman-04-detail';
      nextLabel = '打开四号资料';
    } else if (stage4Ready && state.flags.stage4MessageReady && !stage4Replied) {
      nextTitle = '周航 · 新消息';
      nextText = '3 条未读。';
      nextHref = '';
      nextLabel = '';
    } else if (stage4Ready && stage4Replied) {
      nextTitle = '青垭村民交流板';
      nextText = '“北坡的路条到底能不能留？” · 旧帖仍可访问。';
      nextHref = '#/zhou-yougen';
      nextLabel = '回到旧帖';
    } else if (stage4Ready) {
      nextTitle = '青垭山地救援资料页';
      nextText = '2018 年补录：周成与 2017 北坡事故。';
      nextHref = '#/zhou-cheng';
      nextLabel = '打开补录资料';
    } else if (stage3Ready) {
      nextTitle = '青垭县融媒体资料库';
      nextText = '搜索结果：北坡 / 2017 · 历史公开稿件 1 条。';
      nextHref = '#/news-2017';
      nextLabel = '打开 2017 旧新闻';
    }

    if (!endingReached) {
      const nextChildren = [
        el('div', {}, [
          el('strong', { text: nextTitle }),
          el('p', { text: nextText }),
        ]),
      ];
      if (nextHref) nextChildren.push(el('a', { class: 'btn btn--primary', href: nextHref, text: nextLabel }));
      composer.append(el('div', { class: 'chat-next chat-next--source' }, nextChildren));
    }
  }

  phone.append(top, list, composer);
  main.append(phone);
  return main;
}

function openDraftPassword({ passwords, router }) {
  const content = el('form', { class: 'password-form' });
  const info = el('p', { text: '草稿箱由账号本人设置了一个本地口令。页面没有“提示问题”。' });
  const handle = el('p', { class: 'password-clue', text: '账号：周末别找我 · @noweekend' });
  const field = el('div', { class: 'field' });
  const label = el('label', { for: 'draft-password', text: '口令' });
  const input = el('input', { id: 'draft-password', class: 'input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: '输入口令' });
  const error = el('p', { class: 'form-error', role: 'status' });
  field.append(label, input, error);
  const submit = el('button', { class: 'btn btn--primary', type: 'submit', text: '打开草稿' });
  content.append(info, handle, field, submit);
  let close;
  content.addEventListener('submit', e => {
    e.preventDefault();
    const result = passwords.verify('noweekend', input.value);
    if (!result.ok) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = '口令不对。';
      input.select();
      return;
    }
    close?.();
    toast('草稿已解锁');
    router.navigate('draft-1');
  });
  close = openModal({ title: '未公开草稿', content });
  setTimeout(() => input.focus(), 0);
}

function openFinalDraftPassword({ passwords, router }) {
  const content = el('form', { class: 'password-form final-draft-password' });
  content.append(
    el('p', { text: '设备同步恢复出一条没有发布成功的草稿。恢复标签来自周航当天自己写的撤退备注，不沿用青垭旧公告的代码。' }),
    el('p', { class: 'password-clue', text: '别按旧线返回。' }),
    el('p', { class: 'fine-note', text: '标签格式：NO + 一个英文单词，不加空格。' }),
  );
  const field = el('div', { class: 'field' });
  const label = el('label', { for: 'final-draft-password', text: '恢复标签' });
  const input = el('input', { id: 'final-draft-password', class: 'input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false', placeholder: 'NO…' });
  const error = el('p', { class: 'form-error', role: 'status' });
  field.append(label, input, error);
  const submit = el('button', { class: 'btn btn--primary', type: 'submit', text: '恢复草稿' });
  content.append(field, submit);
  let close;
  content.addEventListener('submit', event => {
    event.preventDefault();
    const result = passwords.verify('noreturn', input.value);
    if (!result.ok) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = '这不是旧公告编号。看周航当天自己写的那句“别按旧线返回”。';
      input.select();
      return;
    }
    close?.();
    toast('最后草稿已恢复');
    router.navigate('final-draft');
  });
  close = openModal({ title: '未发布草稿 · 恢复', content });
  setTimeout(() => input.focus(), 0);
}

export function renderProfile({ store, passwords, router }) {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader('discover'));
  const wrap = el('div', { class: 'trail-wrap' });
  const profile = el('section', { class: 'profile-hero' });
  profile.append(
    el('div', { class: 'profile-avatar', text: '周' }),
    el('div', { class: 'profile-meta' }, [
      el('h1', { text: '周末别找我' }),
      el('p', { class: 'profile-handle', text: '@noweekend' }),
      el('p', { text: '普通上班族。周末走路。路线只记补给、岔口和哪里容易走错。' }),
      el('div', { class: 'profile-stats' }, [
        el('span', { text: '37 条轨迹' }),
        el('span', { text: '1,284 km' }),
        el('span', { text: '最后活跃 今天 10:26' }),
      ]),
    ])
  );

  const feed = el('section', { class: 'feed' });
  feed.append(el('h2', { text: '最近动态' }));
  const post = el('article', { class: 'feed-post' });
  post.append(
    el('div', { class: 'feed-post__meta', text: '今天 · 青垭村' }),
    el('h3', { text: '青垭九弯，北坡旧返程顺便看了一眼' }),
    el('p', { text: '主线正常。北坡那条老返程现场基本没了，后段废掉，我到四号折返。别照这个轨迹走。' }),
    photo({ src: IMG.trail, alt: '林间山路', caption: '轨迹记录中的现场图', className: 'photo--feed' }),
    el('div', { class: 'feed-actions' }, [
      pageLink('post', '查看完整轨迹', '5.02 h · 14.8 km'),
    ])
  );
  feed.append(post);

  const draftBox = el('section', { class: 'draft-entry' });
  draftBox.append(
    el('div', {}, [
      el('strong', { text: '未公开草稿 · 1' }),
      el('p', { text: store.getState().passwords.noweekend ? '已解锁。' : '仅自己可见。' }),
    ])
  );
  const draftButton = el('button', { class: 'btn', type: 'button', text: store.getState().passwords.noweekend ? '打开草稿' : '输入口令' });
  draftButton.addEventListener('click', () => {
    if (store.getState().passwords.noweekend) router.navigate('draft-1');
    else openDraftPassword({ passwords, router });
  });
  draftBox.append(draftButton);

  let recoveredDraftBox = null;
  if (store.getState().stage >= 6 && store.getState().choices.stage6) {
    recoveredDraftBox = el('section', { class: 'draft-entry draft-entry--recovered' });
    recoveredDraftBox.append(
      el('div', {}, [
        el('strong', { text: '未发布草稿 · 恢复 1' }),
        el('p', { text: store.getState().passwords.noreturn ? '已恢复 · 最后本地保存 11:18' : '设备同步队列 · 需要恢复标签' }),
      ]),
    );
    const recoveredButton = el('button', { class: 'btn', type: 'button', text: store.getState().passwords.noreturn ? '打开草稿' : '输入恢复标签' });
    recoveredButton.addEventListener('click', () => {
      if (store.getState().passwords.noreturn) router.navigate('final-draft');
      else openFinalDraftPassword({ passwords, router });
    });
    recoveredDraftBox.append(recoveredButton);
  }

  const aside = el('aside', { class: 'trail-aside' });
  aside.append(
    el('p', { class: 'eyebrow', text: '地点资料' }),
    el('h2', { text: '青垭村' }),
    el('p', { text: '县城北面约 42 公里，近几年因为“青垭九弯环线”在徒步圈里有一点热度。' }),
    pageLink('qingya', '查看青垭游客服务页'),
  );

  wrap.append(el('div', { class: 'trail-maincol' }, [profile, feed, draftBox, recoveredDraftBox].filter(Boolean)), aside);
  main.append(wrap);
  return main;
}

export function renderPost() {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader());
  const wrap = el('div', { class: 'track-page' });
  const head = el('section', { class: 'track-head' });
  head.append(
    el('p', { class: 'eyebrow', text: '周末别找我 · 今天' }),
    el('h1', { text: '青垭九弯 / 北坡旧返程探路' }),
    el('p', { class: 'track-lead', text: '公开轨迹记录。主线完成；北坡旧返程仅走到四号看路人，后段终止。' }),
  );
  const stats = el('div', { class: 'track-stats' }, [
    ['14.8', '公里'], ['5:02', '用时'], ['742', '累计爬升 / m'], ['10:34', '最后同步'],
  ].map(([n,l]) => el('div', {}, [el('strong', { text: n }), el('span', { text: l })])));

  const body = el('div', { class: 'track-body' });
  const article = el('article', { class: 'track-note' });
  article.append(
    el('h2', { text: '现场备注' }),
    el('p', { text: '九弯主线没问题。北坡入口还能认出来，进去以后旧路断得很厉害，前几年留下的东西倒是还在。' }),
    el('blockquote', { text: '10:09 · 到四号了。后面不走了。路完全烂掉。' }),
    el('p', { text: '这一段不是推荐路线，也不要拿本条轨迹做导航。' }),
    photo({ src: IMG.watchman, alt: '树木前一尊旧灰色人像，手臂朝外平伸', caption: '轨迹点 04 · “四号看路人”', className: 'photo--track photo--watchman' }),
    el('p', { class: 'sync-note', text: '同步说明：青垭北坡部分区域没有稳定移动信号，轨迹可能在回到有信号区域后才批量同步。' }),
  );
  const side = el('aside', { class: 'track-side' });
  side.append(
    el('div', { class: 'route-summary' }, [
      el('h2', { text: '经过点' }),
      el('ol', {}, [
        el('li', { text: '青垭游客中心' }),
        el('li', { text: '九弯主线北岔口' }),
        el('li', { text: '旧石料场口' }),
        el('li', { class: 'is-last', text: '四号看路人 · 折返' }),
      ]),
    ]),
    pageLink('jiuwan', '查看青垭九弯官方路线'),
  );
  body.append(article, side);
  wrap.append(head, stats, body);
  main.append(wrap);
  return main;
}

export function renderDraft1() {
  const main = el('main', { id: 'app-main', class: 'trail-site', tabindex: '-1' });
  main.append(renderTrailHeader());
  const wrap = el('article', { class: 'draft-page' });
  wrap.append(
    el('p', { class: 'draft-label', text: '未公开草稿 · 自动保存 10:11' }),
    el('h1', { text: '青垭九弯 / 北坡返程线（别跟）' }),
    el('p', { text: '九弯主线正常。北坡那个老返程现在基本不算路。' }),
    el('p', { text: '我从北岔口进去，能认出旧石料场、看路人和一截蓝铁皮。到四号以后路面已经散了，我在这里折返。' }),
    el('p', { text: '如果轨迹同步出去，别把北坡这一截当成推荐。后段废掉，正在撤。' }),
    el('p', { text: '回去以后把这段从公开轨迹里裁掉。' }),
    el('div', { class: 'draft-foot' }, [
      el('span', { text: '状态：未发布' }),
      el('a', { href: '#/post', text: '返回公开动态' }),
    ]),
  );
  main.append(wrap);
  return main;
}

export function renderQingya({ flow }) {
  const main = el('main', { id: 'app-main', class: 'village-site', tabindex: '-1' });
  main.append(renderVillageHeader('home'));
  const hero = el('section', { class: 'village-hero' });
  hero.append(
    photo({ src: IMG.village, alt: '清晨山谷与山脊', caption: '青垭 · 北坡方向', className: 'photo--hero' }),
    el('div', { class: 'village-hero__copy' }, [
      el('p', { class: 'eyebrow', text: '青垭欢迎你' }),
      el('h1', { text: '路不多，弯很多。' }),
      el('p', { text: '青垭村位于县城北侧山区。来走九弯、吃灶台饭、住一晚。下山以后膝盖还能不能算自己的，本村不作保证。' }),
      el('a', { class: 'btn btn--village', href: '#/jiuwan', text: '查看青垭九弯' }),
    ])
  );

  const info = el('section', { class: 'village-grid' });
  info.append(
    el('article', { class: 'village-column' }, [
      el('p', { class: 'eyebrow', text: '本周提示' }),
      el('h2', { text: '北坡旧线路不开放' }),
      el('p', { text: '“北坡返程线”为历史路线名称，目前不属于青垭开放徒步线路。请以九弯主线标识为准，不要跟随旧轨迹、旧路条进入北坡。' }),
      pageLink('jiuwan', '九弯路线与难度说明'),
    ]),
    el('article', { class: 'village-column' }, [
      el('p', { class: 'eyebrow', text: '吃饭' }),
      el('h2', { text: '灶台饭' }),
      el('p', { text: '两个人点小锅。三个人也点小锅。你非要点大锅，我们不拦。' }),
      el('small', { text: '本店不再回答“一个人能不能吃完大锅”，上个月已经回答十七次。' }),
      ...(flow?.isUnlocked('food') ? [pageLink('food', '查看店家页面')] : []),
    ]),
    el('article', { class: 'village-column' }, [
      el('p', { class: 'eyebrow', text: '公共服务' }),
      el('h2', { text: '游客中心卫生间' }),
      el('p', { text: '冬季热水、免费厕纸、洗鞋水龙头，外墙附近手机信号相对稳定。' }),
      el('small', { text: '山可以野，厕所不能野。' }),
      ...(flow?.isUnlocked('service') ? [pageLink('service', '查看游客服务详情')] : []),
    ]),
  );
  main.append(hero, info);
  return main;
}

export function renderJiuwan({ flow }) {
  const main = el('main', { id: 'app-main', class: 'village-site', tabindex: '-1' });
  main.append(renderVillageHeader('route'));
  const wrap = el('div', { class: 'route-page' });
  wrap.append(
    el('section', { class: 'route-title' }, [
      el('p', { class: 'eyebrow', text: '开放徒步线路' }),
      el('h1', { text: '青垭九弯环线' }),
      el('p', { text: '约 16 公里 · 累计爬升约 780 米 · 建议 5–7 小时。雨后下坡湿滑。' }),
    ]),
    photo({ src: IMG.trail, alt: '林间步道', caption: '九弯主线林间段', className: 'photo--route' }),
  );

  const difficulty = el('section', { class: 'difficulty' });
  difficulty.append(el('h2', { text: '青垭徒步四级' }));
  const levels = [
    ['一级', '还能一路聊天。'],
    ['二级', '开始没人说话。'],
    ['三级', '下坡的时候开始问还有多远。'],
    ['四级', '回家以后想卖装备。'],
  ];
  for (const [a,b] of levels) difficulty.append(el('div', { class: 'difficulty-row' }, [el('strong', { text: a }), el('span', { text: b })]));
  difficulty.append(el('p', { class: 'difficulty-note', text: '本评价由本村民宿经营户、历年来访游客及两名膝关节长期不好的村民共同整理，仅作参考。' }));

  const safety = el('section', { class: 'route-safety' });
  safety.append(
    el('h2', { text: '路线范围' }),
    el('p', { text: '当前开放线路为九弯环线主线。北坡旧返程不参与难度评级，也不属于开放路线。' }),
    el('p', { text: '不要依据历史帖子、旧轨迹截图或树上的旧布条改变路线。遇到岔口时，以现有木牌和主线里程牌为准。' }),
    ...(flow?.isUnlocked('watchmen') ? [pageLink('watchmen', '看路人专题')] : []),
    ...(flow?.isUnlocked('safety') ? [pageLink('safety', '北坡安全公告')] : []),
    el('a', { class: 'text-link', href: '#/profile', text: '返回“周末别找我”的轨迹记录' }),
  );

  wrap.append(difficulty, safety);
  main.append(wrap);
  return main;
}
