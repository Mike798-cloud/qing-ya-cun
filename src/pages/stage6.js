import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  back: './assets/photos/watchman-04-back.jpg',
};

function cacheHeader() {
  return el('header', { class: 'trail-cache-header' }, [
    el('div', { class: 'trail-cache-header__inner' }, [
      el('a', { class: 'trail-cache-brand', href: '#/profile' }, [
        el('strong', { text: '路迹' }),
        el('span', { text: '公开动态缓存' }),
      ]),
      el('div', { class: 'trail-cache-tabs' }, [
        el('span', { text: '动态' }),
        el('span', { class: 'is-active', text: '评论' }),
        el('span', { text: '轨迹' }),
      ]),
      el('span', { class: 'trail-cache-state', text: '只读缓存' }),
    ]),
  ]);
}

function cacheComment({ name, time, text, reply = false, children = [] }) {
  const row = el('article', { class: `trail-cache-comment${reply ? ' trail-cache-comment--reply' : ''}` });
  row.append(
    el('div', { class: 'trail-cache-avatar', text: name.slice(0, 1) }),
    el('div', { class: 'trail-cache-comment__body' }, [
      el('div', { class: 'trail-cache-comment__head' }, [
        el('strong', { text: name }),
        el('time', { text: time }),
      ]),
      el('p', { text }),
      ...children,
    ]),
  );
  return row;
}

function lostAttachment() {
  return el('div', { class: 'lost-attachment', role: 'group', 'aria-label': '原帖图片附件信息' }, [
    el('div', { class: 'lost-attachment__thumb' }, [
      el('span', { text: 'IMG' }),
      el('small', { text: '缩略图已失效' }),
    ]),
    el('div', { class: 'lost-attachment__meta' }, [
      el('strong', { text: '一号看路人.jpg' }),
      el('span', { text: '上传于 10:21 · 原图源站已失效' }),
      el('small', { text: '附件标题与原评论文本仍保留在评论缓存中。' }),
    ]),
  ]);
}

export function renderAjiComment({ store, audio }) {
  const main = el('main', { id: 'app-main', class: 'trail-cache-site', tabindex: '-1' });
  main.append(cacheHeader());

  const page = el('div', { class: 'trail-cache-page' });
  const thread = el('section', { class: 'trail-cache-thread' });
  thread.append(
    el('div', { class: 'trail-cache-path', text: '周末别找我 › 青垭九弯 / 北坡旧返程探路 › 评论缓存' }),
    el('header', { class: 'trail-cache-thread__head' }, [
      el('div', {}, [
        el('p', { class: 'trail-cache-kicker', text: '今天 · 评论已停止更新' }),
        el('h1', { text: '“有人看了我那条动态，也进北坡了。”' }),
      ]),
      el('a', { class: 'btn btn--quiet', href: '#/post', text: '回看原动态' }),
    ]),
    el('div', { class: 'trail-cache-original' }, [
      el('strong', { text: '周末别找我 · 10:09' }),
      el('p', { text: '到四号了。后面不走了。路完全烂掉。这一段不是推荐路线，也不要拿本条轨迹做导航。' }),
    ]),
  );

  const comments = el('div', { class: 'trail-cache-comments' });
  comments.append(
    cacheComment({
      name: '阿纪',
      time: '10:21',
      text: '哥们我看到你到四号了。我也从一号进来了。入口这边还能认，我照你刚才那条走，应该没问题吧？',
      children: [lostAttachment()],
    }),
    cacheComment({
      name: '周末别找我',
      time: '10:25',
      text: '别按旧线返回。你先别往前，能退就退。我回去找你。',
      reply: true,
    }),
    cacheComment({
      name: '阿纪',
      time: '10:31',
      text: '退不回刚才那个岔口了，信号也断断续续。二号附近是不是有个棚？',
    }),
    cacheComment({
      name: '周末别找我',
      time: '10:33',
      text: '有。能看见蓝铁皮就别再动。等我。',
      reply: true,
    }),
  );
  thread.append(comments);

  const side = el('aside', { class: 'trail-cache-side' }, [
    el('section', { class: 'trail-cache-note' }, [
      el('span', { text: '缓存区间' }),
      el('strong', { text: '10:21 → 10:33' }),
      el('p', { text: '本页仅保留这 12 分钟内的评论正文与回复关系。' }),
    ]),
    el('section', { class: 'trail-cache-note' }, [
      el('span', { text: '附件状态' }),
      el('p', { text: '阿纪 10:21 上传的原图源站已失效。缓存只保留附件名“一号看路人.jpg”和评论正文。' }),
    ]),
    el('section', { class: 'trail-cache-note trail-cache-note--soft' }, [
      el('span', { text: '关联记录' }),
      el('p', { text: '周航主页另有 1 条设备同步草稿记录，目前仍未恢复。' }),
    ]),
  ]);

  page.append(thread, side);
  main.append(page);

  return main;
}

function recoveryHeader() {
  return el('header', { class: 'draft-recovery-header' }, [
    el('div', { class: 'draft-recovery-header__inner' }, [
      el('a', { href: '#/profile', class: 'draft-recovery-brand' }, [
        el('strong', { text: '路迹' }),
        el('span', { text: '草稿恢复' }),
      ]),
      el('span', { class: 'draft-recovery-status', text: '未发布 · 只读' }),
    ]),
  ]);
}

function draftLine(time, text, emphasis = false) {
  return el('div', { class: `recovery-line${emphasis ? ' recovery-line--emphasis' : ''}` }, [
    el('time', { text: time }),
    el('p', { text }),
  ]);
}

function recoveryPhoto() {
  const button = el('button', { class: 'photo recovery-photo', type: 'button', 'aria-label': '四号后方蓝铁皮旧资料图，打开大图' });
  const image = el('img', {
    src: IMG.back,
    alt: '灌木与枝条后露出一块褪色的蓝色旧铁皮',
    loading: 'lazy',
    decoding: 'async',
  });
  image.addEventListener('error', () => {
    button.classList.add('photo--failed');
    image.remove();
    button.prepend(el('span', { class: 'photo__error', text: '这张旧资料图暂时读取失败' }));
  }, { once: true });
  button.append(image, el('span', { class: 'photo__caption', text: '四号后方旧资料图 · 用来确认“蓝铁皮”位置，不是周航最后拍摄的照片' }));
  button.addEventListener('click', () => openLightbox({
    src: IMG.back,
    alt: '灌木与枝条后露出一块褪色的蓝色旧铁皮',
    caption: '四号后方旧资料图 · 资料库存档',
  }));
  return button;
}

export function renderFinalDraft({ store }) {
  const main = el('main', { id: 'app-main', class: 'draft-recovery-site', tabindex: '-1' });
  main.append(recoveryHeader());

  const page = el('div', { class: 'draft-recovery-page' });
  const article = el('article', { class: 'recovered-draft' });
  article.append(
    el('p', { class: 'recovered-draft__kicker', text: '设备同步队列 · 恢复条目 01 / 01' }),
    el('h1', { text: '未发布草稿' }),
    el('div', { class: 'recovered-draft__meta' }, [
      el('span', { text: '账号：周末别找我' }),
      el('span', { text: '最后本地保存：11:18' }),
      el('span', { text: '发布状态：未发送' }),
    ]),
    el('p', { class: 'recovered-draft__intro', text: '这不是一篇写完的动态。恢复出来的是周航手机里几次自动保存的短句，时间顺序来自本地草稿队列。弱网环境下，它们没有成功发布。' }),
    el('section', { class: 'recovery-lines' }, [
      draftLine('10:54', '找到人了。在二号棚下面。脚扭了，手一直抖，能说话。'),
      draftLine('10:58', '先让他待棚里别动。我给他留灯。救援从主路进会慢一点，但比跟旧线快。'),
      draftLine('11:03', '他一直跟我道歉，说看到我到四号就觉得能走。别骂他。换我也可能这么判断。'),
      draftLine('11:09', '四号那边还有一盏头灯。刚才亮了一下。阿纪说他进来的时候没看见别人。'),
      draftLine('11:11', '我再回一次。只到四号。'),
      draftLine('11:18', '我现在知道周成为什么又回去了。\n你看见有人在路上，就会觉得不能不回去。\n可这条路最坏的地方就是，它会一直让你觉得前面还有人。', true),
    ]),
  );

  const side = el('aside', { class: 'draft-recovery-side' }, [
    el('section', { class: 'recovery-fact' }, [
      el('span', { text: '10:54–11:03' }),
      el('strong', { text: '本地保存片段 A' }),
      el('p', { text: '连续 3 次自动保存。文本完整，未发现对应图片附件。' }),
    ]),
    el('section', { class: 'recovery-fact' }, [
      el('span', { text: '11:09–11:11' }),
      el('strong', { text: '本地保存片段 B' }),
      el('p', { text: '2 次自动保存。服务器端没有同步成功记录。' }),
    ]),
    el('section', { class: 'recovery-fact recovery-fact--uncertain' }, [
      el('span', { text: '缺失附件' }),
      el('p', { text: '这一段草稿没有照片、视频或第二个人的身份信息。设备同步队列里也没有对应附件。' }),
    ]),
    recoveryPhoto(),
    ...(store.getState().stage >= 7 ? [el('a', { class: 'btn btn--rescue-link', href: '#/rescue-result', text: '查看搜救信息' })] : []),
  ]);

  page.append(article, side);
  main.append(page);

  if (!store.getState().flags.stage6DraftSeen) {
    store.dispatch({ type: 'SET_FLAG', key: 'stage6DraftSeen', value: true });
  }

  return main;
}
