import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  watch4: './assets/photos/watchman-04-hd.jpg',
  watch4Wide: './assets/photos/watchman-04-stage2.jpg',
  back: './assets/photos/watchman-04-back.jpg',
  book: './assets/photos/second-book.jpg',
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
    button.prepend(el('span', { class: 'photo__error', text: '这张资料图暂时读取失败' }));
  }, { once: true });
  button.append(image, el('span', { class: 'photo__caption', text: caption }));
  button.addEventListener('click', () => openLightbox({ src, alt, caption }));
  return button;
}

function mountainHeader() {
  return el('header', { class: 'mountain-archive-header' }, [
    el('div', { class: 'mountain-archive-header__top' }, [
      el('a', { class: 'mountain-archive-brand', href: '#/watchman-04-detail' }, [
        el('strong', { text: '四号_巡查资料' }),
        el('span', { text: 'QINGYA FIELD ARCHIVE / SCAN INDEX' }),
      ]),
      el('span', { class: 'mountain-archive-search', text: '只读目录' }),
    ]),
    el('nav', { class: 'mountain-archive-nav', 'aria-label': '山地环境资料库栏目' }, [
      el('span', { text: '首页' }),
      el('span', { class: 'is-active', text: '看路人' }),
      el('span', { text: '避险设施' }),
      el('span', { text: '自然环境' }),
      el('span', { text: '旧路线资料' }),
      el('span', { text: '志愿者记录' }),
    ]),
  ]);
}

function patrolRow(date, weather, action, note) {
  return el('div', { class: 'patrol-row' }, [
    el('time', { text: date }),
    el('span', { text: weather }),
    el('p', { text: action }),
    el('p', { text: note }),
  ]);
}

function interludeTwo() {
  const wall = el('div', { class: 'paper-scan-wall', 'aria-hidden': 'true' });
  const texts = [
    ['2019.04', '不要按旧线返回'],
    ['2020.03', '二号可避雨'],
    ['2021.11', '四号后不带人'],
    ['2022.06', '人够了就回头'],
    ['2024.04', '不要按旧线返回'],
    ['2025.01', '四号后不带人'],
    ['2019.07', '二号可避雨'],
    ['2023.08', '人够了就回头'],
  ];
  texts.forEach(([date, text], index) => {
    wall.append(el('div', { class: `scan-fragment scan-fragment--${(index % 4) + 1}` }, [
      el('span', { text: date }),
      el('strong', { text }),
      el('i', { text: index % 2 ? '已核 / 返程' : '巡查 / 记录' }),
    ]));
  });
  return wall;
}

async function playSecondBookInterlude({ interludes, audio }) {
  if (!interludes) return;
  await interludes.play({
    id: 'interlude-2-second-book',
    duration: 3200,
    skippable: true,
    sound: 'interlude-2',
    render: interludeTwo,
  });
}

async function openBackFolder({ store, router, interludes, audio }) {
  store.dispatch({ type: 'SET_FLAG', key: 'lookbackFound', value: true });
  await playSecondBookInterlude({ interludes, audio });
  router.navigate('second-book');
}

export function renderWatchman04Detail({ store, router, interludes, audio }) {
  const main = el('main', { id: 'app-main', class: 'mountain-archive-site', tabindex: '-1' });
  main.append(mountainHeader());

  const breadcrumb = el('div', { class: 'mountain-breadcrumb' }, [
    el('span', { text: '首页' }),
    el('span', { text: '›' }),
    el('span', { text: '看路人' }),
    el('span', { text: '›' }),
    el('strong', { text: '四号' }),
  ]);

  const page = el('div', { class: 'mountain-record-page' });
  const article = el('article', { class: 'mountain-record' });
  article.append(
    el('p', { class: 'mountain-kicker', text: '旧设施编号 QY-BP-04 · 最后更新 2025-01-18' }),
    el('h1', { text: '四号看路人' }),
    el('div', { class: 'mountain-meta' }, [
      el('span', { text: '位置：北坡旧线 · 废弃石料场上方' }),
      el('span', { text: '状态：留存，不属于开放线路' }),
    ]),
    photo({
      src: IMG.watch4,
      alt: '树林中一尊严重风化的旧水泥指路人像，右臂向外伸出',
      caption: '四号正面 · 2024 年巡查照片',
      className: 'photo--mountain-main',
    }),
    el('p', { text: '四号位于北坡旧返程的上段，靠近废弃石料场。右手缺两根手指，底座编号仍能辨认。后方隔着灌木能看见一块褪色的蓝铁皮，是旧避险棚拆剩的材料。' }),
    el('p', { text: '这尊水泥人像本身没有特殊用途。游客常把它当成北坡“走到哪了”的位置参照，所以村里巡查时会单独给它拍照。' }),
  );

  const detailGrid = el('section', { class: 'mountain-photo-grid' }, [
    photo({
      src: IMG.watch4Wide,
      alt: '四号看路人的全身与底座，底座上可见数字四',
      caption: '底座与编号 · 旧照片',
      className: 'photo--mountain-detail',
    }),
    photo({
      src: IMG.back,
      alt: '灌木后露出一块褪色的蓝色旧铁皮',
      caption: '四号后方环境 · 蓝铁皮仍在',
      className: 'photo--mountain-detail',
    }),
  ]);
  article.append(detailGrid);

  const patrol = el('section', { class: 'patrol-sheet' });
  patrol.append(
    el('div', { class: 'patrol-sheet__head' }, [
      el('div', {}, [
        el('span', { text: '北坡巡查记录 · 摘录' }),
        el('h2', { text: '四号附近历年处理情况' }),
      ]),
      el('small', { text: '公开版删去电话号码与个人姓名' }),
    ]),
    el('div', { class: 'patrol-row patrol-row--head' }, [
      el('strong', { text: '日期' }),
      el('strong', { text: '天气' }),
      el('strong', { text: '发现 / 处理' }),
      el('strong', { text: '备注' }),
    ]),
    patrolRow('2019.04.12', '晴', '拆除 3 条红布条', '四号后有新脚印'),
    patrolRow('2019.07.28', '阴', '清走食物包装', '疑似有人夜间经过'),
    patrolRow('2020.03.05', '雨', '清理倒伏木牌', '路面冲刷明显'),
    patrolRow('2021.11.17', '晴', '拆路条 5 条', '后方蓝铁皮被掀开过'),
    patrolRow('2022.06.03', '雾', '发现新的自制箭头', '当天拆除'),
    patrolRow('2023.08.21', '晴', '巡查册防水袋破损', '后方石缝进水，纸页受潮'),
    patrolRow('2024.04.09', '小雨', '再次发现路条', '拆除'),
    patrolRow('2025.01.14', '雪', '脚印较新，至少 2 人', '向上；未见同日下撤脚印'),
  );
  article.append(patrol);

  const side = el('aside', { class: 'mountain-record-side' });
  side.append(
    el('section', { class: 'mountain-note' }, [
      el('strong', { text: '现场提醒' }),
      el('p', { text: '不要攀爬，不要搂脖子。四号以后不属于开放徒步范围。' }),
    ]),
    el('section', { class: 'mountain-note' }, [
      el('strong', { text: '村民旧帖摘录 · 2023-09-16' }),
      el('blockquote', { text: '“后边别塞东西。湿了都粘一块，清起来麻烦。”' }),
    ]),
    el('section', { class: 'mountain-note mountain-note--key' }, [
      el('strong', { text: '旧附件目录' }),
      el('p', { text: '2025 年整理盘保留了四号巡查照片的原目录。文件按拍摄方位命名。' }),
      el('div', { class: 'mountain-file-list' }, [
        el('span', { text: 'front.jpg' }),
        el('span', { text: 'side.jpg' }),
        el('span', { text: 'base.jpg' }),
      ]),
    ]),
  );
  const backLink = el('button', { class: 'mountain-folder-link', type: 'button', text: 'look_back/　›' });
  backLink.addEventListener('click', () => openBackFolder({ store, router, interludes, audio }));
  side.querySelector('.mountain-note--key').append(backLink, el('small', { class: 'mountain-folder-note', text: '目录最后修改：2025-01-16' }));

  page.append(article, side);
  main.append(breadcrumb, page);
  return main;
}

function ledgerHeader() {
  return el('header', { class: 'ledger-header' }, [
    el('div', { class: 'ledger-header__inner' }, [
      el('div', { class: 'ledger-brand' }, [
        el('strong', { text: '北坡巡查资料 · 扫描件' }),
        el('span', { text: '来源：青垭村旧资料整理 · 2025' }),
      ]),
      el('span', { class: 'ledger-status', text: '只读' }),
    ]),
  ]);
}

function ledgerEntry(date, lines, note = '') {
  const entry = el('article', { class: 'ledger-entry' });
  entry.append(el('time', { text: date }));
  const body = el('div', { class: 'ledger-entry__body' });
  lines.forEach(line => body.append(el('p', { text: line })));
  if (note) body.append(el('span', { class: 'ledger-entry__note', text: note }));
  entry.append(body);
  return entry;
}

export function renderSecondBook({ store, audio }) {
  const main = el('main', { id: 'app-main', class: 'field-ledger-site', tabindex: '-1' });
  main.append(ledgerHeader());

  const wrap = el('div', { class: 'ledger-page' });
  const intro = el('section', { class: 'ledger-intro' });
  intro.append(
    el('p', { class: 'ledger-kicker', text: '附件目录 /inspection/QY-BP-04/look_back/scan02 · 共 23 张扫描' }),
    el('h1', { text: '第二本册子' }),
    el('p', { text: '北坡巡查的人以前会把当天的简短记录写在小册子里，装进防水袋，放回四号后方石缝。前一本写满后又换过一本，资料整理时大家顺口叫它“第二本”。它不是官方执法记录，也不是谁一个人的日记，大部分内容只是日期、天气和几句处理情况。' }),
    el('p', { text: '2025 年 1 月，防水袋裂开，这本册子进水后才被带回村里扫描。纸上的几种笔迹没有逐一确认身份，能确定的只有：这些记录跨了很多年。' }),
  );

  const cover = photo({
    src: IMG.book,
    alt: '泥地和枯叶之间一本严重受潮的旧线装册子',
    caption: '第二本册子 · 收回前现场照片',
    className: 'photo--ledger-cover',
  });

  const scan = el('section', { class: 'ledger-scan' });
  scan.append(
    el('div', { class: 'ledger-scan__top' }, [
      el('span', { text: '扫描页 06–15 / 23' }),
      el('small', { text: '原件有水渍、粘连与缺角；下列文字按可辨部分录入' }),
    ]),
    ledgerEntry('2019.04.12', [
      '三号到四号之间红布条 3。全拆。',
      '四号后两串脚印。一串往上，一串往回。',
    ]),
    ledgerEntry('2019.07.28', [
      '二号棚里两瓶矿泉水，新。不是村里补的。',
      '留一瓶，另一瓶带回看日期。',
    ]),
    ledgerEntry('2020.03.05', [
      '倒下的旧箭头又立起来了。',
      '木头是旧的，钉子新。拆。',
    ]),
    ledgerEntry('2021.11.17', [
      '四号后蓝铁皮被掀开过。',
      '里面没东西。压回去。',
    ]),
    ledgerEntry('2022.06.03', [
      '石沟口红布条 5。结法不一样。',
      '像不是一个人绑的。全拆。',
    ]),
    ledgerEntry('2023.08.21', [
      '二号棚又有水。四号后边有人塞纸。',
      '纸湿透，能看的抄下来。别留。',
    ]),
    ledgerEntry('2024.04.09', [
      '箭头又有。不是原来那块木头。',
      '朝北。拆。',
    ]),
    ledgerEntry('2025.01.14', [
      '雪后脚印新，至少两个人。往上。',
      '到四号停了。没见同日往下的脚印。',
    ], '页边另有一行字，墨水受潮：人够了就回头。'),
  );

  const conclusion = el('aside', { class: 'ledger-conclusion' }, [
    el('section', {}, [
      el('strong', { text: '扫描范围' }),
      el('p', { text: '本次公开的是 2019–2025 年间仍可辨认的部分页。若干页因进水粘连没有录入，日期并不连续。' }),
    ]),
    el('section', {}, [
      el('strong', { text: '笔迹说明' }),
      el('p', { text: '现存页能看出几种不同笔迹和墨色。整理时没有逐一确认书写者，也没有能够连续对应到同一个人的署名。' }),
    ]),
    el('section', { class: 'ledger-margin-note' }, [
      el('span', { text: '册子中重复最多的一句' }),
      el('blockquote', { text: '不要按旧线返回。' }),
    ]),
  ]);

  wrap.append(intro, cover, scan, conclusion);
  main.append(wrap);

  return main;
}
