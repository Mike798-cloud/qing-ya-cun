import { el } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  north: './assets/photos/north-slope-track.jpg',
  toilet: './assets/photos/qingya-toilet-clean.jpg',
  watch4: './assets/photos/watchman-04-stage2.jpg',
  back: './assets/photos/watchman-04-back.jpg',
  book: './assets/photos/second-book.jpg',
  village: './assets/photos/qingya-morning.jpg',
};

function rescueHeader() {
  return el('header', { class: 'rescue-header' }, [
    el('div', { class: 'rescue-header__inner' }, [
      el('a', { class: 'rescue-brand', href: '#/rescue-result' }, [
        el('strong', { text: '青垭县应急信息公开' }),
        el('span', { text: '山地搜救联合信息' }),
      ]),
      el('nav', { class: 'rescue-nav', 'aria-label': '应急信息栏目' }, [
        el('span', { text: '信息公开' }),
        el('span', { class: 'is-active', text: '搜救通报' }),
        el('span', { text: '安全提醒' }),
      ]),
      el('span', { class: 'rescue-status', text: '已结束' }),
    ]),
  ]);
}

function reportPhoto() {
  const button = el('button', {
    class: 'photo rescue-photo',
    type: 'button',
    'aria-label': '北坡区域资料图，打开大图',
  });
  const image = el('img', {
    src: IMG.north,
    alt: '阴天山谷中的旧山路与陡坡，远处被低云遮住',
    loading: 'lazy',
    decoding: 'async',
  });
  image.addEventListener('error', () => {
    button.classList.add('photo--failed');
    image.remove();
    button.prepend(el('span', { class: 'photo__error', text: '北坡资料图暂时无法读取' }));
  }, { once: true });
  button.append(
    image,
    el('span', { class: 'photo__caption', text: '北坡区域资料图 · 本通报不刊登遗体及个人物品现场照片' }),
  );
  button.addEventListener('click', () => openLightbox({
    src: IMG.north,
    alt: '阴天山谷中的旧山路与陡坡，远处被低云遮住',
    caption: '北坡区域资料图 · 搜救公开信息配图',
  }));
  return button;
}

function timelineItem(date, title, lines, tone = '') {
  const item = el('article', { class: `rescue-timeline__item${tone ? ` rescue-timeline__item--${tone}` : ''}` });
  item.append(
    el('time', { text: date }),
    el('div', { class: 'rescue-timeline__body' }, [
      el('h3', { text: title }),
      ...lines.map(line => el('p', { text: line })),
    ]),
  );
  return item;
}

function recallInterlude() {
  const recall = el('div', { class: 'ending-recall', 'aria-hidden': 'true' });
  const items = [
    [IMG.toilet, '外墙信号'],
    [IMG.watch4, '四号'],
    [IMG.back, '蓝铁皮'],
    [IMG.book, '第二本'],
    [IMG.north, '北坡'],
    [IMG.village, '青垭村'],
  ];
  items.forEach(([src, label], index) => {
    recall.append(el('figure', {
      class: `ending-recall__frame ending-recall__frame--${index + 1}`,
      style: `--recall-index:${index};`,
    }, [
      el('img', { src, alt: '' }),
      el('figcaption', { text: label }),
    ]));
  });
  recall.append(el('div', { class: 'ending-recall__line', text: '别再让它像一条路。' }));
  return recall;
}

async function goToEnding({ interludes, audio, router }) {
  if (interludes) {
    await interludes.play({
      id: 'interlude-3-ending',
      duration: 3300,
      skippable: true,
      sound: 'interlude-3',
      render: recallInterlude,
    });
  }
  router.navigate('ending');
}

export function renderRescueResult({ store, interludes, audio, router }) {
  const main = el('main', { id: 'app-main', class: 'rescue-report-site', tabindex: '-1' });
  main.append(rescueHeader());

  const page = el('div', { class: 'rescue-report-page' });
  const article = el('article', { class: 'rescue-report' });
  article.append(
    el('p', { class: 'rescue-kicker', text: '联合通报 · 青垭村北坡人员搜救' }),
    el('h1', { text: '北坡失联人员搜救工作结束' }),
    el('div', { class: 'rescue-byline' }, [
      el('time', { text: '9 月 17 日 18:40' }),
      el('span', { text: '来源：青垭县应急联络组' }),
      el('span', { text: '信息编号：QY-0917-04' }),
    ]),
    reportPhoto(),
    el('p', { text: '9 月 14 日中午，青垭村北坡旧返程区域先后接到两名徒步人员失联信息。当地救援力量随后沿现有开放线路、旧石料场外围及石沟区域展开搜索。' }),
    el('p', { text: '搜救期间天气反复，北坡旧线多处没有连续可辨的人工路面。公开信息仅列人员发现位置和救援结果，不对个人行进轨迹之外的情况作推定。' }),
  );

  const timeline = el('section', { class: 'rescue-timeline' }, [
    el('h2', { text: '公开搜救进展' }),
    timelineItem('9 月 15 日 05:46', '二号旧避险棚下方找到一名失联徒步者', [
      '失联人员阿纪被找到时存在失温并伴有多处擦伤，意识清楚，经转运救治后无生命危险。',
      '周航未在同一位置被发现。搜救范围随后继续向四号看路人及石沟下游扩展。',
    ], 'safe'),
    timelineItem('9 月 15–16 日', '持续搜索四号及石沟区域', [
      '救援人员没有在阿纪附近发现第二名被困人员。阿纪所述“四号方向曾出现灯光”的情况未能形成可确认的第二名失联对象。',
      '现场旧路条、脚印与雨水冲刷痕迹无法单独用于判断具体人员的行进方向。',
    ]),
    timelineItem('9 月 17 日 14:20', '四号看路人后方石沟下游发现周航', [
      '搜救人员在石沟下游发现周航，经现场确认已无生命体征。',
      '现场未发现完整电子设备，仅找到损坏头灯、被水浸泡的记录纸及少量个人物品。',
    ], 'final'),
  ]);
  article.append(timeline);

  const side = el('aside', { class: 'rescue-report-side' }, [
    el('section', { class: 'rescue-summary' }, [
      el('span', { text: '人员状态' }),
      el('div', { class: 'rescue-person' }, [
        el('strong', { text: '阿纪' }),
        el('p', { text: '已获救，无生命危险' }),
      ]),
      el('div', { class: 'rescue-person rescue-person--zhou' }, [
        el('strong', { text: '周航' }),
        el('p', { text: '9 月 17 日找到，已无生命体征' }),
      ]),
    ]),
    el('section', { class: 'rescue-summary' }, [
      el('span', { text: '关于“另一盏头灯”' }),
      el('p', { text: '截至搜救结束，没有确认到对应的第二名失联人员。现有公开材料不足以判断那次灯光来自谁。' }),
    ]),
    el('section', { class: 'rescue-summary rescue-summary--quiet' }, [
      el('span', { text: '北坡提醒' }),
      el('p', { text: '北坡旧返程不属于开放线路。旧轨迹、旧标记和他人近期记录均不能作为通行依据。' }),
    ]),
  ]);

  const finish = el('button', { class: 'btn btn--rescue', type: 'button', text: '回到聊天' });
  finish.addEventListener('click', () => goToEnding({ interludes, audio, router }));
  side.append(finish);

  page.append(article, side);
  main.append(page);

  if (!store.getState().flags.stage7RescueSeen) {
    store.dispatch({ type: 'SET_FLAG', key: 'stage7RescueSeen', value: true });
  }
  return main;
}

function endingMessage(list, side, text, time) {
  const row = el('div', { class: `msg-row msg-row--${side}` });
  const bubble = el('div', { class: 'msg-bubble' });
  bubble.append(el('p', { text }));
  if (time) bubble.append(el('span', { class: 'msg-time', text: time }));
  row.append(bubble);
  list.append(row);
}

export function renderEnding({ store }) {
  const main = el('main', { id: 'app-main', class: 'chat-page ending-chat-page', tabindex: '-1' });
  const phone = el('section', { class: 'chat-shell ending-chat-shell', 'aria-label': '与周航的聊天' });
  const top = el('header', { class: 'chat-topbar' }, [
    el('div', { class: 'chat-avatar', text: '航' }),
    el('div', { class: 'chat-person' }, [
      el('strong', { text: '周航' }),
      el('span', { text: '最后在线 9 月 14 日 11:18' }),
    ]),
  ]);
  const list = el('div', { class: 'chat-list ending-chat-list' });
  endingMessage(list, 'other', '如果十二点前没回，你直接报警。', '9 月 14 日 10:26');
  endingMessage(list, 'other', '别来四号后面。', '9 月 14 日 11:42');
  endingMessage(list, 'other', '不是找不到。是会看见。', '9 月 14 日 11:42');
  list.append(el('div', { class: 'chat-day-divider', text: '9 月 18 日' }));
  endingMessage(list, 'other', '别再让它像一条路。', '06:18');

  phone.append(top, list);
  main.append(phone);

  if (!store.getState().meta.endingReached) {
    store.dispatch({ type: 'ENDING_REACHED' });
  }
  return main;
}
