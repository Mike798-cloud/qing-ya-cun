import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  rescue: './assets/photos/rescue-2017.jpg',
  north: './assets/photos/north-slope-local.jpg',
};

function photo({ src, alt, caption, className = '' }) {
  const button = el('button', {
    class: `photo ${className}`.trim(),
    type: 'button',
    'aria-label': `${caption}，打开大图`,
  });
  const image = el('img', { src, alt, loading: 'lazy', decoding: 'async' });
  image.addEventListener('error', () => {
    button.classList.add('photo--failed');
    image.remove();
    button.prepend(el('span', { class: 'photo__error', text: '这张旧图暂时读取失败' }));
  }, { once: true });
  button.append(image, el('span', { class: 'photo__caption', text: caption }));
  button.addEventListener('click', () => openLightbox({ src, alt, caption }));
  return button;
}

function memorialHeader() {
  return el('header', { class: 'memorial-header' }, [
    el('div', { class: 'memorial-header__inner' }, [
      el('a', { class: 'memorial-brand', href: '#/zhou-cheng' }, [
        el('strong', { text: '青垭山地救援资料页' }),
        el('span', { text: '公开纪念与事故资料整理' }),
      ]),
      el('nav', { class: 'memorial-nav', 'aria-label': '救援资料栏目' }, [
        el('span', { text: '救援记录' }),
        el('span', { class: 'is-active', text: '2017 北坡' }),
        el('span', { text: '安全资料' }),
      ]),
    ]),
  ]);
}

function forumHeader() {
  return el('header', { class: 'local-forum-header' }, [
    el('div', { class: 'local-forum-header__hero' }, [
      el('div',{class:'forum-logo-lockup'},[el('strong', { text: '周有根的山里论坛' }),el('small',{text:'bbs.qyshan.com'})]),
      el('span', { text: '本地人 · 本地事 · 本地话' }),
    ]),
    el('nav', { class: 'local-forum-nav', 'aria-label': '村民交流板栏目' }, [
      el('span', { text: '论坛首页' }),
      el('span', { text: '山里天地' }),
      el('span', { class: 'is-active', text: '户外徒步' }),
      el('span', { text: '家乡风物' }),
      el('span', { text: '闲聊杂谈' }),
      el('span', { text: '注册' }),
      el('span', { text: '登录' }),
    ]),
  ]);
}

function factRow(label, text) {
  return el('div', { class: 'memorial-fact' }, [
    el('strong', { text: label }),
    el('p', { text }),
  ]);
}

export function renderZhouCheng() {
  const main = el('main', { id: 'app-main', class: 'memorial-site', tabindex: '-1' });
  main.append(memorialHeader());

  const breadcrumb = el('div', { class: 'memorial-breadcrumb memorial-breadcrumb--provenance' }, [
    el('span', { text: '资料来源线：2017 事故旧新闻' }),
    el('span', { text: '›' }),
    el('strong', { text: '2018 周成资料补录' }),
  ]);

  const page = el('div', { class: 'memorial-page' });
  const article = el('article', { class: 'memorial-article' });
  article.append(
    el('p', { class: 'memorial-kicker', text: '2018 年补录 · 公开救援纪念资料' }),
    el('h1', { text: '周成（1989—2017）' }),
    el('p', { class: 'memorial-lead', text: '青垭山地救援志愿队 2018 年整理的公开纪念资料。本文依据当年参与搜救人员口述、公开通报和家属同意公开的部分记录编写。' }),
    photo({
      src: IMG.rescue,
      alt: '雨天山沟中几名救援人员沿湿滑石地前行',
      caption: '2017 北坡搜救资料图 · 图中人员并非周成本人',
      className: 'photo--memorial',
    }),
    el('p', { text: '周成是青垭村本地带路人员，熟悉九弯和北坡旧返程。2017 年 8 月 18 日，他随一支商业户外团进入北坡。下午天气转坏后，他提出原路返回。' }),
    el('p', { text: '外地领队担心天黑、包车等待和行程超时，坚持继续走较短的北坡返程。周成最后没有坚持把队伍拦下来。这一点，后来的事故材料没有替他回避。' }),
    el('p', { text: '石沟涨水以后，周成连续协助队员过沟。最后一次，他又折回去找一名掉队的人，随后遭遇局部坍塌，没有回来。' }),
    el('blockquote', { class: 'memorial-quote', text: '“他有责任。人也确实是回去救的。这两件事不冲突。”—— 2018 年救援纪念页留言整理' }),
  );

  const responsibility = el('section', { class: 'responsibility-note' });
  responsibility.append(
    el('h2', { text: '公开材料摘录' }),
    factRow('2016 旅游页存档', '页面标题保留“北坡快捷返程”，并写有旧石料场、二号避险棚等沿途位置。'),
    factRow('团员口述摘录', '天气转坏后，周成提过原路返回；队伍后来仍继续进入北坡返程。'),
    factRow('事故补录', '周成没有坚持阻止继续通行。该内容在纪念资料中原样保留。'),
    factRow('救援记录', '石沟涨水后，他协助队员过沟，随后折返寻找一名掉队者。'),
  );
  article.append(responsibility);

  const side = el('aside', { class: 'memorial-side' });
  side.append(
    el('section', {}, [
      el('span', { class: 'memorial-side__label', text: '相关人物' }),
      el('strong', { text: '周有根' }),
      el('p', { text: '周成的父亲。事故后多年在北坡附近拆游客绑的路条和旧标记。' }),
      el('a', { class: 'memorial-inline-link', href: '#/zhou-yougen', text: '查看：周有根关于北坡路条的公开回复 ›' }),
    ]),
    el('section', { class: 'memorial-side__context' }, [
      el('span', { class: 'memorial-side__label', text: '补录范围' }),
      el('p', { text: '本页只整理已公开的路线背景、责任记录与救援经过，不对事故之外的传闻作判断。' }),
    ]),
  );

  page.append(article, side);
  main.append(breadcrumb, page);
  return main;
}

function forumPost({ name, badge = '', date, text, quote = '', likes = '' }) {
  const post = el('article', { class: 'forum-post' });
  const avatar = el('div', { class: 'forum-avatar', text: name.slice(0, 1) });
  const head = el('div', { class: 'forum-post__head' }, [
    el('strong', { text: name }),
    badge ? el('span', { class: 'forum-badge', text: badge }) : null,
    el('time', { text: date }),
  ].filter(Boolean));
  const body = el('div', { class: 'forum-post__body' });
  if (quote) body.append(el('blockquote', { class: 'forum-quote', text: quote }));
  body.append(el('p', { text }));
  if (likes) body.append(el('span', { class: 'forum-likes', text: likes }));
  post.append(avatar, el('div', {}, [head, body]));
  return post;
}

export function renderZhouYougen({ store, audio }) {
  const main = el('main', { id: 'app-main', class: 'local-forum-site', tabindex: '-1' });
  main.append(forumHeader());

  const thread = el('div', { class: 'forum-thread' });
  const threadHead = el('header', { class: 'forum-thread__head' }, [
    el('div', {}, [
      el('p', { class: 'forum-path', text: '首页 › 徒步和路 › 旧帖' }),
      el('h1', { text: '北坡的路条到底能不能留？' }),
      el('p', { text: '发帖时间：2021-04-19 · 最后回复：2024-10-07' }),
    ]),
    el('span', { class: 'forum-thread__tag', text: '旧帖' }),
  ]);
  thread.append(threadHead);

  thread.append(
    forumPost({
      name: '山里慢点',
      date: '2021-04-19 21:12',
      text: '上周走九弯，看见北岔口附近又有人绑红布条。有人说是给后来的人认路，也有人说村里有个大爷见一根拆一根。到底为什么？',
      likes: '赞 18',
    }),
    forumPost({
      name: '周有根',
      badge: '青垭村民',
      date: '2021-04-20 06:54',
      quote: '“绑着方便后来的人认路。”',
      text: '别绑。开放的路有牌子。没牌子的地方，你给它绑出一串来，别人就当那也是路。',
      likes: '赞 71',
    }),
    forumPost({
      name: '麦田飞过',
      date: '2021-04-20 08:16',
      text: '大爷我绑的是环保可降解路条。',
      likes: '赞 9',
    }),
    forumPost({
      name: '周有根',
      badge: '青垭村民',
      date: '2021-04-20 08:43',
      text: '降解之前也得拆。',
      likes: '赞 133',
    }),
    forumPost({
      name: '麦田飞过',
      date: '2021-04-20 09:02',
      text: '我明年还来绑。',
      likes: '赞 4',
    }),
    forumPost({
      name: '周有根',
      badge: '青垭村民',
      date: '2021-04-20 09:11',
      text: '你来。',
      likes: '赞 201',
    }),
    forumPost({
      name: '南坡小刘',
      date: '2023-09-15 17:40',
      text: '去年见过周叔在旧石料场那边拆箭头，游客还跟他吵了一架。他什么也没解释。后来才知道周成是他儿子。',
      likes: '赞 56',
    }),
    forumPost({
      name: '爬完就吃',
      date: '2023-09-16 09:08',
      text: '四号后边石缝有人塞过东西，是村里放的吗？',
      likes: '赞 11',
    }),
    forumPost({
      name: '周有根',
      badge: '青垭村民',
      date: '2023-09-16 09:26',
      text: '不是。后边别塞东西。湿了都粘一块，清起来麻烦。',
      likes: '赞 84',
    }),
    forumPost({
      name: '周有根',
      badge: '青垭村民',
      date: '2024-10-07 07:28',
      quote: '“不留个标记，真出事了不是更难找吗？”',
      text: '搜救要留什么，救援的人知道。你们绑一根我拆一根。骂我也拆。山又不欠你一条路。',
      likes: '赞 318',
    }),
  );

  const side = el('aside', { class: 'forum-side' });
  side.append(
    photo({
      src: IMG.north,
      alt: '阴天的北坡山脊与林间旧路区域',
      caption: '北坡北岔口附近 · 村民常拆旧路条的区域',
      className: 'photo--yougen',
    }),
    el('section', { class: 'forum-profile' }, [
      el('h2', { text: '周有根' }),
      el('p', { text: '青垭村民。周成的父亲。事故后多年在北坡附近拆游客留下的路条、临时箭头和不属于开放线路的标记。' }),
      el('p', { class: 'forum-profile__plain', text: '他不是巡山管理员，也没有后台权限。大部分时候只是自己去拆。' }),
    ]),
    el('section', { class: 'forum-side-note forum-side-note--next' }, [
      el('strong', { text: '版主补充' }),
      el('p', { text: '北坡不是当前开放线路。帖子里提到的红布条、自制箭头均不属于村里设置的正式标记。' }),
      el('p', { text: '版务合并：关于“四号后边塞东西”的旧图和巡查记录，已移到村志资料盘 QY-BP-04。' }),
      el('a', { href: '#/watchman-04-detail', text: 'QY-BP-04：四号附近历年巡查记录 ›' }),
    ]),
  );

  const layout = el('div', { class: 'forum-layout' }, [thread, side]);
  main.append(layout);

  return main;
}
