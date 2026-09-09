import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  rescue: './assets/photos/rescue-2017.jpg',
  north: './assets/photos/north-slope-local.jpg',
};

function qv(query,key,fallback=''){ return query?.get?.(key)||fallback; }
function localHref(path,params={}){ const q=new URLSearchParams(); Object.entries(params).forEach(([k,v])=>{if(v)q.set(k,v)}); const t=q.toString(); return `#/${path}${t?`?${t}`:''}`; }

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

function memorialHeader(active='2017') {
  const nav=(key,label)=>el('a',{href:key==='2017'?'#/zhou-cheng':localHref('zhou-cheng',{section:key}),class:active===key?'is-active':'',text:label});
  return el('header', { class: 'memorial-header' }, [
    el('div', { class: 'memorial-header__inner' }, [
      el('a', { class: 'memorial-brand', href: localHref('zhou-cheng',{section:'home'}) }, [el('strong', { text: '青垭山地救援资料页' }),el('span', { text: '公开纪念与事故资料整理' })]),
      el('nav', { class: 'memorial-nav', 'aria-label': '救援资料栏目' }, [nav('home','救援记录'),nav('2017','2017 北坡'),nav('safety','安全资料')]),
    ]),
  ]);
}

function forumHeader(active='outdoor') {
  const nav=(key,label)=>el('a',{href:localHref('zhou-yougen',{section:key}),class:active===key?'is-active':'',text:label});
  return el('header', { class: 'local-forum-header' }, [
    el('div',{class:'forum-old-utility'},[el('span',{text:'欢迎回来，游客'}),el('span',{},[el('a',{href:localHref('zhou-yougen',{section:'search'}),text:'论坛搜索'}),el('span',{text:'　|　'}),el('a',{href:localHref('zhou-yougen',{section:'help'}),text:'帮助'}),el('span',{text:'　|　收藏本版　|　RSS'})]),el('span',{text:'在线 23 人　今日 12 帖'})]),
    el('div', { class: 'local-forum-header__hero' }, [el('div',{class:'forum-logo-lockup'},[el('strong', { text: '周有根的山里论坛' }),el('small',{text:'bbs.qyshan.com'})]),el('span', { text: '本地人 · 本地事 · 本地话' })]),
    el('nav', { class: 'local-forum-nav', 'aria-label': '村民交流板栏目' }, [nav('home','论坛首页'),nav('mountain','山里天地'),nav('outdoor','户外徒步'),nav('local','家乡风物'),nav('chat','闲聊杂谈'),nav('register','注册'),nav('login','登录')]),
  ]);
}

function factRow(label, text) {
  return el('div', { class: 'memorial-fact' }, [
    el('strong', { text: label }),
    el('p', { text }),
  ]);
}

function renderMemorialSection(section,query){
  const main=el('main',{id:'app-main',class:'memorial-site',tabindex:'-1'}); main.append(memorialHeader(section)); const page=el('section',{class:'memorial-local-page'}); const entry=qv(query,'entry');
  const records={training:['2024 秋季志愿队山地培训名单','本次培训包括基础绳结、失温处置和夜间联络。公开页只保留活动摘要，不公开个人电话。'],water:['2022 雨季石沟水位观察记录','连续降雨期间按固定观察点记录水位。记录用于救援训练，不作为游客路线通行建议。'],cold:['2020 九弯失温游客救助简报','一名游客傍晚在开放主线出现失温症状，经现场保温后转运，无生命危险。'],drill:['2019 夏季山地救援演练记录','演练范围位于开放区域外围，内容包括队伍联络、伤员转运和夜间照明。'],rain:['雨季石沟区域观察须知','雨季石沟水位变化快，救援观察记录不能被当作游客可行线路说明。'],hypothermia:['失温处置基础流程','先隔离湿冷环境、补充保温并尽快联络专业救援，避免让失温人员继续独自行走。'],night:['夜间搜救队伍联络规范','夜间搜索以明确分区和联络点为准，个人灯光只能作为现场观察，不能单独确认身份。'],tracks:['游客公开轨迹不能替代开放线路标识','公开轨迹只说明某个设备曾记录过路径，不代表路线目前开放、连续或安全。']};
  if(entry && records[entry]){page.append(el('h1',{text:records[entry][0]}),el('p',{text:records[entry][1]}),el('p',{class:'fine-note',text:'青垭山地救援资料页 · 公开摘要'}),el('a',{href:localHref('zhou-cheng',{section}),text:'‹ 返回栏目'}));}
  else if(section==='home') page.append(el('h1',{text:'公开救援记录'}),...[[ '2024','training','2024 秋季志愿队山地培训名单'],['2022','water','2022 雨季石沟水位观察记录'],['2020','cold','2020 九弯失温游客救助简报'],['2019','drill','2019 夏季山地救援演练记录']].map(([year,id,x])=>el('p',{class:'memorial-index-row'},[el('span',{text:year}),el('a',{href:localHref('zhou-cheng',{section:'home',entry:id}),text:x})])),el('p',{class:'memorial-index-row'},[el('span',{text:'2018'}),el('a',{href:'#/zhou-cheng',text:'周成 · 2017北坡资料补录'})]));
  else page.append(el('h1',{text:'山地安全资料'}),...[[ 'rain','雨季石沟区域观察须知'],['hypothermia','失温处置基础流程'],['night','夜间搜救队伍联络规范'],['tracks','游客公开轨迹不能替代开放线路标识']].map(([id,x])=>el('p',{class:'memorial-index-row'},[el('a',{href:localHref('zhou-cheng',{section:'safety',entry:id}),text:x})])),el('p',{text:'本栏目为救援志愿队公开资料，不提供未开放路线方向。'}));
  main.append(page); return main;
}

const FORUM_TOPICS={
  rain:{title:'[置顶] 九弯雨后路况集中帖',author:'版主小杨',body:'昨晚下过雨，木阶湿，南侧下坡泥多。今天走九弯的回来统一在这里补路况。'},
  sunrise:{title:'山顶看日出几点出发合适',author:'小满',body:'想看日出的话别摸黑走不熟的岔路。官方主线起点到观景点按自己速度留时间。'},
  bus:{title:'公交末班到底是18:10还是18:20',author:'走不动了',body:'站牌写18:20，旧帖子有人说18:10。今天问了司机还是18:20。节假日另算。'},
  pole:{title:'谁捡到一根黑色登山杖',author:'小陈',body:'九弯起点牌旁边落了一根黑色折叠杖，手柄有红绳。捡到麻烦放游客中心。'},
  honey:{title:'今年蜂蜜有人团吗',author:'阿姨来了',body:'村口供销点说这周新到一批，想一起买的下面留数量。'},
  snake:{title:'九弯有没有蛇（认真问）',author:'不怕但怕',body:'有，但白天人多一般会避。别拿树枝乱翻草丛。'},
  frost:{title:'山上今年第一场霜大概什么时候',author:'山里人',body:'往年十月下旬开始看得到，山脊比村里早。早上走木阶注意滑。'},
  tree:{title:'老杉林那边有树倒了',author:'阿林',body:'昨天风大倒了一棵，压到旁边但没有堵住开放主线。村里已经报了清理。'},
  creek:{title:'谁知道溪沟水现在大不大',author:'老杨',body:'这两天没大雨，村口这边正常。山里沟谷情况别拿村口水量直接推。'},
  radio:{title:'老街哪家还能修收音机',author:'小周',body:'供销社后面王师傅偶尔还修，先去问，零件不一定有。'},
  bamboo:{title:'今年笋干多少钱一斤',author:'阿姨来了',body:'各家晒法不一样，村口供销点今天标的是28到36，别拿去年的帖子当价目。'},
  basketball:{title:'村口篮球场周六是不是占用',author:'球还我',body:'丰收节搭台，周六全天占用。周日早上拆完就能打。'},
  dog:{title:'谁家的黄狗又跑公交站了',author:'司机老陈',body:'青垭人家那只。它不咬人，但喜欢跟着等车的人坐。'},
  tv:{title:'旧电视有人要吗',author:'家里腾地方',body:'21寸老电视，能开机，遥控器找不到。自己来搬，别问包不包送。'},
};

function renderForumLocal(query){
  const section=qv(query,'section','home'); const topic=qv(query,'topic'); const active=['mountain','outdoor','local','chat'].includes(section)?section:'home';
  const main=el('main',{id:'app-main',class:'local-forum-site',tabindex:'-1'}); main.append(forumHeader(active));
  if(topic && FORUM_TOPICS[topic]){ const t=FORUM_TOPICS[topic]; const board={mountain:'山里天地',outdoor:'户外徒步',local:'家乡风物',chat:'闲聊杂谈'}[active]||'论坛首页'; const thread=el('section',{class:'forum-thread forum-thread--ordinary'},[el('header',{class:'forum-thread__head'},[el('div',{},[el('p',{class:'forum-path',text:`论坛首页 › ${board}`}),el('h1',{text:t.title}),el('p',{text:`楼主：${t.author}　发表于 2024-10-08`})])]),forumPost({name:t.author,date:'2024-10-08 08:16',text:t.body,likes:'赞 12'}),forumPost({name:'山脚下',date:'2024-10-08 09:02',text:'收到。下午回来再补一条。',likes:'赞 2'}),el('a',{href:localHref('zhou-yougen',{section:active}),text:`‹ 返回${board}`})]); main.append(thread); return main; }
  const page=el('section',{class:'forum-local-page'});
  if(section==='register') page.append(el('h1',{text:'注册新会员'}),el('p',{text:'本站自2022年起停止开放注册。老账号可继续登录，游客可浏览公开版块。'}),el('a',{href:localHref('zhou-yougen',{section:'home'}),text:'返回论坛首页'}));
  else if(section==='login') page.append(el('h1',{text:'会员登录'}),el('p',{text:'账号登录服务暂不对镜像访客开放。公开帖子可直接浏览。'}),el('a',{href:localHref('zhou-yougen',{section:'home'}),text:'返回论坛首页'}));
  else if(section==='search') page.append(el('h1',{text:'论坛搜索'}),el('p',{text:'可搜索公开主题标题和用户名。旧附件可能已失效。'}),el('div',{class:'forum-search-demo'},[el('strong',{text:'常见搜索：'}),el('a',{href:'#/zhou-yougen',text:'周有根 / 北坡路条'}),el('span',{text:'　九弯　公交　蜂蜜'})]));
  else if(section==='help') page.append(el('h1',{text:'论坛帮助'}),el('p',{text:'游客可浏览公开帖子。回复、引用和收藏需要老账号登录；注册功能已经关闭。'}));
  else { const boardTitle={home:'论坛首页',mountain:'山里天地',outdoor:'户外徒步',local:'家乡风物',chat:'闲聊杂谈'}[section]||'论坛首页'; page.append(el('h1',{text:boardTitle})); const topics=section==='outdoor'||section==='home' ? [['rain',FORUM_TOPICS.rain.title],['sunrise',FORUM_TOPICS.sunrise.title],['bus',FORUM_TOPICS.bus.title],['road','北坡的路条到底能不能留？'],['pole',FORUM_TOPICS.pole.title],['snake',FORUM_TOPICS.snake.title]] : section==='mountain' ? [['frost',FORUM_TOPICS.frost.title],['tree',FORUM_TOPICS.tree.title],['creek',FORUM_TOPICS.creek.title]] : section==='local' ? [['honey',FORUM_TOPICS.honey.title],['radio',FORUM_TOPICS.radio.title],['bamboo',FORUM_TOPICS.bamboo.title]] : [['basketball',FORUM_TOPICS.basketball.title],['dog',FORUM_TOPICS.dog.title],['tv',FORUM_TOPICS.tv.title]]; const targetSection=section==='home'?'outdoor':section; page.append(el('table',{class:'forum-topic-table'},[el('tbody',{},topics.map(([id,title],i)=>el('tr',{},[el('td',{}, id==='road'?el('a',{href:'#/zhou-yougen',text:title}):el('a',{href:localHref('zhou-yougen',{section:targetSection,topic:id}),text:title})),el('td',{text:i%2?'山里人':'游客'}),el('td',{text:`${7+i*6} / ${260+i*137}`})])))])); }
  main.append(page); return main;
}

export function renderZhouCheng({query}={}) {
  const section=qv(query,'section');
  if(section && section!=='2017') return renderMemorialSection(section,query);
  const main = el('main', { id: 'app-main', class: 'memorial-site', tabindex: '-1' });
  main.append(memorialHeader('2017'));

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
    el('section',{class:'memorial-side__plainlist'},[el('span',{class:'memorial-side__label',text:'同类公开资料'}),el('p',{text:'2019 夏季山地救援演练记录'}),el('p',{text:'2020 九弯失温游客救助简报'}),el('p',{text:'2022 雨季石沟水位观察记录'}),el('p',{text:'2024 秋季志愿队培训名单'})]),
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
  const userMeta = el('small',{class:'forum-user-meta',text: badge ? '注册：2013-05　来自：青垭　积分：286' : '注册：2018-09　积分：43'});
  const head = el('div', { class: 'forum-post__head' }, [
    el('span',{class:'forum-floor',text:'发表于'}),
    badge ? el('span', { class: 'forum-badge', text: badge }) : null,
    el('time', { text: date }),
    el('span',{text:'　只看该作者　回复　引用'}),
  ].filter(Boolean));
  const body = el('div', { class: 'forum-post__body' });
  if (quote) body.append(el('blockquote', { class: 'forum-quote', text: quote }));
  body.append(el('p', { text }));
  if (likes) body.append(el('span', { class: 'forum-likes', text: likes }));
  post.append(el('aside',{class:'forum-user-cell'},[avatar,el('strong',{text:name}),userMeta]), el('div', {class:'forum-post-cell'}, [head, body]));
  return post;
}

export function renderZhouYougen({ store, audio, query }) {
  const section=qv(query,'section'); const topic=qv(query,'topic');
  if(section || topic) return renderForumLocal(query);
  const main = el('main', { id: 'app-main', class: 'local-forum-site', tabindex: '-1' });
  main.append(forumHeader('outdoor'));

  const board = el('section',{class:'forum-board-index'},[
    el('div',{class:'forum-board-title'},[el('strong',{text:'青垭闲话 » 户外徒步'}),el('span',{text:'今日：12　主题：286　帖子：1943'})]),
    el('table',{class:'forum-topic-table'},[el('tbody',{},[
      ['[置顶] 九弯雨后路况集中帖','版主小杨','2024-10-08','88 / 3120'],
      ['山顶看日出几点出发合适','小满','2024-10-08','14 / 506'],
      ['公交末班到底是18:10还是18:20','走不动了','2024-10-08','21 / 788'],
      ['北坡的路条到底能不能留？','山里慢点','2024-10-07','36 / 4211'],
      ['谁捡到一根黑色登山杖','小陈','2024-10-06','7 / 260'],
      ['今年蜂蜜有人团吗','阿姨来了','2024-10-05','19 / 633'],
      ['九弯有没有蛇（认真问）','不怕但怕','2024-10-04','31 / 1102'],
    ].map((r,i)=>{ const ids=['rain','sunrise','bus','road','pole','honey','snake']; return el('tr',{class:i===3?'is-current':''},[el('td',{},i===3?el('a',{href:'#/zhou-yougen',text:r[0]}):el('a',{href:localHref('zhou-yougen',{section:'outdoor',topic:ids[i]}),text:r[0]})),el('td',{text:r[1]}),el('td',{text:r[2]}),el('td',{text:r[3]})]); }))]),
  ]);
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
  main.append(board,layout,el('footer',{class:'forum-old-footer',text:'Powered by QYBBS 2.1　GMT+8　页面生成 0.021 秒　联系我们 | 清除Cookies | 手机版'}));

  return main;
}
