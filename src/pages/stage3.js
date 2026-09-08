import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';
import { openModal } from '../core/modal.js';

const IMG = {
  north: './assets/photos/north-slope-local.jpg',
  ridge: './assets/photos/jiuwan-trail.jpg',
  watch4: './assets/photos/watchman-04-stage2.jpg',
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
    button.prepend(el('span', { class: 'photo__error', text: '原图暂时无法读取' }));
  }, { once: true });
  button.append(image, el('span', { class: 'photo__caption', text: caption }));
  button.addEventListener('click', () => openLightbox({ src, alt, caption }));
  return button;
}

function renderCountyHeader() {
  return el('header', { class: 'county-header' }, [
    el('div', { class: 'county-header__top' }, [
      el('a', { href: '#/news-2017', class: 'county-brand', text: '青垭县融媒体资料库' }),
      el('span', { text: '历史公开稿件 · 只读' }),
    ]),
    el('nav', { class: 'county-nav', 'aria-label': '资料库栏目' }, [
      el('span', { text: '要闻' }),
      el('span', { text: '社会' }),
      el('span', { text: '应急' }),
      el('span', { text: '乡镇' }),
      el('span', { class: 'is-active', text: '旧稿查询' }),
    ]),
  ]);
}

function renderArchiveHeader() {
  return el('header', { class: 'archive-header' }, [
    el('div', { class: 'archive-brand' }, [
      el('strong', { text: '青垭乡村游' }),
      el('span', { text: '网页快照 · 2016 年 6 月' }),
    ]),
    el('div', { class: 'archive-tabs' }, [
      el('span', { text: '首页' }),
      el('span', { class: 'is-active', text: '徒步线路' }),
      el('span', { text: '住宿' }),
      el('span', { text: '农家饭' }),
    ]),
  ]);
}

function oldComment(name, date, text) {
  return el('article', { class: 'old-comment' }, [
    el('div', { class: 'old-comment__meta' }, [
      el('strong', { text: name }),
      el('time', { text: date }),
    ]),
    el('p', { text }),
  ]);
}

function openCacheGate({ passwords, router }) {
  const form = el('form', { class: 'password-form archive-password' });
  form.append(
    el('p', { text: '这是事故后下线页面留下的镜像索引。归档程序沿用了旧安全告示的英文短码。' }),
    el('p', { class: 'password-clue', text: '归档备注：现在的北坡安全公告“旧版告示”一行仍保留英文标题。检索词录入时不用空格。' }),
  );
  const field = el('div', { class: 'field' });
  const label = el('label', { for: 'cache-password', text: '旧页访问码' });
  const input = el('input', {
    id: 'cache-password', class: 'input', autocomplete: 'off', autocapitalize: 'characters', spellcheck: 'false',
    placeholder: '输入旧版英文短码',
  });
  const error = el('p', { class: 'form-error', role: 'status' });
  field.append(label, input, error);
  const submit = el('button', { class: 'btn btn--primary', type: 'submit', text: '读取网页快照' });
  form.append(field, submit);

  let close;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = passwords.verify('noback', input.value);
    if (!result.ok) {
      input.setAttribute('aria-invalid', 'true');
      error.textContent = '访问码不对。旧安全公告里还留着原来的英文标题。';
      input.select();
      return;
    }
    close?.();
    toast('旧网页快照已读取');
    router.navigate('cache-2017');
  });
  close = openModal({ title: '2016 旧页面镜像', content: form });
  setTimeout(() => input.focus(), 0);
}

export function renderNews2017({ passwords, router }) {
  const main = el('main', { id: 'app-main', class: 'county-site', tabindex: '-1' });
  main.append(renderCountyHeader());

  const page = el('div', { class: 'county-page' });
  const article = el('article', { class: 'county-article' });
  article.append(
    el('p', { class: 'county-kicker', text: '社会 · 户外安全' }),
    el('h1', { text: '北坡户外事故搜救工作结束' }),
    el('div', { class: 'county-byline' }, [
      el('time', { text: '2017-08-20 18:46' }),
      el('span', { text: '来源：青垭县应急联络组公开信息' }),
      el('span', { text: '稿件编号：QY20170820-17' }),
    ]),
    photo({
      src: IMG.north,
      alt: '阴天的山脊与陡坡，山谷间云层很低',
      caption: '北坡区域资料图 · 文中未刊登事故现场照片',
      className: 'photo--county',
    }),
    el('p', { text: '8 月 18 日下午，一支商业户外团共 11 人进入青垭村北坡旧返程区域。傍晚强降雨后，石沟水位上涨并出现局部坍塌，队伍失去正常通行条件。' }),
    el('p', { text: '当地组织人员与社会救援力量连夜开展搜寻。事故造成多人伤亡。参与带路的本地青年周成也在事故中死亡。' }),
    el('p', { text: '公开通报将事发区域表述为“未开发、未开放的北坡山地”，并再次提醒游客不要离开现有开放线路。有关经营活动与带队责任问题，由相关部门继续调查处理。' }),
    el('p', { class: 'county-edit-note', text: '编辑说明：本文为 2017 年网站留存版本。事故伤亡人员姓名按当年公开口径未完整刊载。' }),
  );

  const side = el('aside', { class: 'county-side' });
  side.append(
    el('section', { class: 'archive-index' }, [
      el('p', { class: 'county-kicker', text: '旧页面索引' }),
      el('h2', { text: '事故前还有一条旅游线路页' }),
      el('p', { text: '索引时间显示为 2016 年。原页面已下线，文字快照仍在。' }),
    ]),
  );
  const cacheButton = el('button', { class: 'btn btn--archive', type: 'button', text: '读取 2016 网页快照' });
  cacheButton.addEventListener('click', () => openCacheGate({ passwords, router }));
  side.querySelector('.archive-index').append(cacheButton);
  side.append(
    el('section', { class: 'county-related' }, [
      el('strong', { text: '当前安全公告' }),
      el('p', { text: '北坡旧返程目前已明确标注“不开放、不维护”。' }),
      el('a', { href: '#/safety', text: '回看现在的安全公告' }),
    ]),
  );

  page.append(article, side);

  const comments = el('section', { class: 'old-comments' });
  comments.append(
    el('div', { class: 'old-comments__head' }, [
      el('p', { class: 'county-kicker', text: '搜索引擎旧评论摘要' }),
      el('h2', { text: '事故前的游客留言' }),
      el('p', { text: '这些摘要来自已经失效的住宿、游记和线路页面，只保留了当年的公开文字。' }),
    ]),
    oldComment('路过青垭', '2016-05-03', '九弯走到后半程腿不太行，民宿老板说从北坡返程能少走几公里。那边有旧石料场和几个人像，路比主线窄。'),
    oldComment('六月雨', '2016-06-19', '跟当地带路的人走过一次北坡。晴天还行，过石沟以后不要拖时间。我们那天是从二号避险棚那边下来的。'),
    oldComment('麦穗', '2016-10-02', '民宿墙上以前贴过九弯的两种返程走法，北坡写的是“快捷返程”。后来再去就没看见那张纸了。'),
  );

  main.append(page, comments);
  return main;
}

function interludeMosaic() {
  const grid = el('div', { class: 'watchman-mosaic', 'aria-hidden': 'true' });
  const positions = [
    '22% 12%', '52% 8%', '70% 18%', '18% 50%',
    '48% 44%', '76% 48%', '24% 82%', '54% 78%',
    '82% 82%', '35% 30%', '66% 28%', '48% 62%',
  ];
  for (let i = 0; i < positions.length; i += 1) {
    grid.append(el('div', {
      class: `watchman-mosaic__tile watchman-mosaic__tile--${(i % 3) + 1}`,
      style: `background-image:url("${IMG.watch4}");background-position:${positions[i]};`,
    }));
  }
  return grid;
}

async function openArchivedPhoto({ interludes, audio }) {
  if (!interludes || !audio) {
    openLightbox({ src: IMG.watch4, alt: '四号看路人旧照片', caption: '2016 页面所附原图 · 四号看路人' });
    return;
  }
  await interludes.play({
    id: 'interlude-1-watchman4',
    duration: 2900,
    skippable: true,
    sound: 'interlude-1',
    render: interludeMosaic,
  });
  openLightbox({
    src: IMG.watch4,
    alt: '旧蓝工作服的水泥指路人像，底座写着四号',
    caption: '2016 页面所附原图 · 四号看路人',
  });
}

export function renderCache2017({ interludes, audio }) {
  const main = el('main', { id: 'app-main', class: 'archive-site', tabindex: '-1' });
  main.append(renderArchiveHeader());

  const banner = el('section', { class: 'archive-banner' }, [
    photo({ src: IMG.ridge, alt: '山脊和山谷', caption: '青垭九弯 · 2016 资料图', className: 'photo--archive-banner' }),
    el('div', { class: 'archive-banner__copy' }, [
      el('span', { text: '2016 夏季线路' }),
      el('h1', { text: '九弯环线 · 两种返程走法' }),
      el('p', { text: '网页快照时间：2016-06-12 09:31' }),
    ]),
  ]);

  const body = el('div', { class: 'archive-body' });
  const article = el('article', { class: 'archive-article' });
  article.append(
    el('p', { class: 'archive-status', text: '旧页面内容 · 已下线 · 仅供历史查阅' }),
    el('h2', { text: '北坡快捷返程' }),
    el('p', { text: '九弯环线全程约 16 公里。走到北岔口后，如体力不足或需要赶下午班车，可改走北坡快捷返程，较主线约缩短 4 公里。' }),
    el('p', { text: '北坡返程经过旧石料场、二号避险棚和“看路人”旧设施，最后接回村口方向。晴天可走；连续降雨、石沟涨水时不建议进入。' }),
    el('div', { class: 'archive-route-facts' }, [
      el('div', {}, [el('span', { text: '预计减少' }), el('strong', { text: '约 4 公里' })]),
      el('div', {}, [el('span', { text: '途中经过' }), el('strong', { text: '石料场 / 避险棚' })]),
      el('div', {}, [el('span', { text: '线路属性' }), el('strong', { text: '快捷返程' })]),
    ]),
    el('blockquote', { class: 'archive-note', text: '“腿不行了就别硬绕九弯，天气好时从北坡下来会近一点。”—— 页面原文中的经营户提示' }),
    el('p', { text: '页面底部原有一张“四号看路人”照片。图片文件仍在归档服务器，说明文字为“走到四号以后留意石沟，不要在雨天逗留”。' }),
  );

  const photoButton = el('button', { class: 'archived-photo-button', type: 'button' }, [
    el('span', { class: 'archived-photo-button__thumb', style: `background-image:url("${IMG.watch4}")` }),
    el('span', { class: 'archived-photo-button__copy' }, [
      el('strong', { text: '附件：四号看路人.jpg' }),
      el('small', { text: '原图 1 张 · 查看归档文件' }),
    ]),
  ]);
  photoButton.addEventListener('click', () => openArchivedPhoto({ interludes, audio }));
  article.append(photoButton);

  const side = el('aside', { class: 'archive-side' });
  side.append(
    el('section', {}, [
      el('strong', { text: '页面发布方' }),
      el('p', { text: '青垭乡村旅游经营户联合信息页' }),
    ]),
    el('section', {}, [
      el('strong', { text: '页面状态' }),
      el('p', { text: '2017 年事故后停止公开访问。' }),
    ]),
    el('section', {}, [
      el('strong', { text: '与现在页面的差异' }),
      el('p', { text: '现在的青垭游客页明确写着：北坡旧返程不开放、不维护，也不属于九弯主线。' }),
    ]),
    el('a', { class: 'text-link', href: '#/zhou-cheng', text: '相关资料：2018 救援纪念补录' }),
    el('a', { class: 'text-link', href: '#/news-2017', text: '返回 2017 事故旧新闻' }),
    el('a', { class: 'text-link', href: '#/safety', text: '对照现在的北坡安全公告' }),
  );

  body.append(article, side);

  const conclusion = el('section', { class: 'archive-footnote' }, [
    el('strong', { text: '归档状态' }),
    el('p', { text: '最后抓取：2017-08-21 07:12。原页面随后停止公开访问；图片附件与文字快照保留在旧索引中。' }),
  ]);

  main.append(banner, body, conclusion);
  return main;
}
