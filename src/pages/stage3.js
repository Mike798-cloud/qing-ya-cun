import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  north: './assets/photos/north-slope-local.jpg',
  ridge: './assets/photos/jiuwan-trail.jpg',
  watch4: './assets/photos/watchman-04-stage2.jpg',
  oldNew: './assets/ui/new-2016.gif',
  oldDivider: './assets/ui/trail-divider-2016.gif',
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
    button.prepend(el('span', { class: 'photo__error', text: '原图暂时无法读取' }));
  }, { once: true });
  button.append(image, el('span', { class: 'photo__caption', text: caption }));
  button.addEventListener('click', () => openLightbox({ src, alt, caption }));
  return button;
}

function renderCountyHeader(active='social') {
  const nav=(key,label)=>el('a',{href:localHref('news-2017',{section:key}),class:active===key?'is-active':'',text:label});
  return el('header', { class: 'county-header' }, [
    el('div', { class: 'county-header__top' }, [
      el('a', { href: localHref('news-2017',{section:'home'}), class: 'county-brand' }, [el('strong',{text:'青垭县融媒体中心'}),el('small',{text:'QINGYA COUNTY MEDIA CENTER'})]),
      el('div',{class:'county-top-tools'},[el('span',{text:'2024年6月14日　星期五'}),el('span',{text:'多云 22℃　|　新闻热线 0836-7XXXX01'}),el('span',{text:'设为首页　加入收藏　投稿邮箱'})]),
    ]),
    el('nav', { class: 'county-nav', 'aria-label': '资料库栏目' }, [
      nav('home','首页'),nav('headline','要闻'),nav('social','社会'),nav('travel','旅游'),nav('culture','文化'),nav('livelihood','民生'),nav('towns','乡镇'),nav('special','专题'),nav('video','视频'),
    ]),
  ]);
}

function renderArchiveHeader(active='trails') {
  const nav=(key,label)=>el('a',{href:localHref('cache-2017',{section:key}),class:active===key?'is-active':'',text:label});
  return el('header', { class: 'archive-header archive-header--2016' }, [
    el('div', { class: 'archive-old-utility' }, [
      el('span', { text: '青垭乡村旅游信息站' }),
      el('span', { text: '建议使用 1024×768 分辨率浏览' }),
      el('span', { text: '您是第 03816 位访客' }),
    ]),
    el('div', { class: 'archive-brand' }, [el('strong', { text: '青垭乡村游' }),el('span', { text: '吃农家饭 · 走山里路 · 住一晚也行' })]),
    el('img', { class: 'archive-divider-gif', src: IMG.oldDivider, alt: '', 'aria-hidden': 'true' }),
    el('div', { class: 'archive-tabs' }, [nav('home','网站首页'),nav('trails','徒步线路'),nav('food','农家乐'),nav('stay','住宿电话'),nav('guestbook','游客留言'),nav('contact','联系我们')]),
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

function archiveSearch({ store, router }) {
  const form = el('form', { class: 'county-archive-search', role: 'search' });
  form.append(
    el('label', { for: 'archive-query', text: '站内历史搜索' }),
    el('p', { text: '可搜年份、地点、标题关键词或旧页面编号。' }),
  );
  const row = el('div', { class: 'county-archive-search__row' });
  const input = el('input', { id: 'archive-query', type: 'search', autocomplete: 'off', placeholder: '输入：北坡 / 2017 / 失联 / 页面编号' });
  const button = el('button', { type: 'submit', text: '搜 索' });
  row.append(input, button);
  const result = el('div', { class: 'county-archive-results', 'aria-live': 'polite' });
  form.append(row, result);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const raw = input.value.trim();
    const q = raw.toUpperCase().replace(/\s+/g, '');
    result.replaceChildren();
    const relevant = ['北坡','2017','失联','搜救','QY-NB-2018','NOBACK'].some(k => q.includes(k));
    if (relevant) {
      store.dispatch({ type: 'SET_FLAG', key: 'nobackFound', value: true });
      result.append(
        el('p', { text: `“${raw || '北坡'}” 共找到 6 条历史结果：` }),
        el('div',{class:'county-search-row'},[el('span',{text:'2025-11-03'}),el('a',{href:localHref('news-2017',{section:'social',article:'northfire2025'}),text:'北坡林区秋冬季森林防火巡查'}),el('small',{text:'社会'})]),
        el('div',{class:'county-search-row'},[el('span',{text:'2023-07-18'}),el('a',{href:localHref('news-2017',{section:'travel',article:'northclosed2023'}),text:'关于北坡区域禁止游客进入的再次提醒'}),el('small',{text:'旅游'})]),
        el('div',{class:'county-search-row'},[el('span',{text:'2017-08-20'}),el('a',{href:'#/news-2017',text:'北坡户外事故搜救工作结束'}),el('small',{text:'社会'})]),
        el('div',{class:'county-search-row county-search-row--old'},[el('span',{text:'2016-06-12'}),el('a',{href:'#/cache-2017',text:'九弯环线 · 北坡快捷返程（旧网页镜像）'}),el('small',{text:'已下线'})]),
        el('div',{class:'county-search-row'},[el('span',{text:'2016-04-02'}),el('a',{href:localHref('news-2017',{section:'travel',article:'spring2016'}),text:'青垭春季乡村游线路推荐'}),el('small',{text:'旅游'})]),
        el('div',{class:'county-search-row'},[el('span',{text:'2015-10-09'}),el('a',{href:localHref('news-2017',{section:'culture',article:'autumn2015'}),text:'九弯秋季摄影路线进入最佳观赏期'}),el('small',{text:'文化'})]),
      );
    } else {
      result.append(el('p', { text: `“${raw}” 没有找到相关历史页面。可换地点、年份或标题词。` }));
    }
  });
  return form;
}

const COUNTY_ARTICLES={
  fire:{title:'青垭县部署秋季森林防火工作',date:'2024-06-13 09:08',cat:'要闻',body:'会议要求各乡镇及时清理重点林区可燃物，开放景区入口继续开展明火检查和宣传。'},
  hospital:{title:'县医院新增周末门诊号源',date:'2024-06-12 16:22',cat:'民生',body:'县医院本月起增加周六上午普通内科、外科门诊号源，急诊安排不变。'},
  road:{title:'东桥道路施工本周五结束',date:'2024-06-11 11:36',cat:'社会',body:'东桥路面维修进入收尾阶段，公交线路预计周五恢复原停靠点。'},
  harvest:{title:'三河镇稻谷进入集中收割期',date:'2024-06-10 14:05',cat:'乡镇',body:'近期连续晴天，当地种植户开始集中收割，农机服务点延长作业时间。'},
  festival:{title:'青垭村丰收节下周开幕',date:'2024-06-09 08:40',cat:'旅游',body:'活动设置农产品摊位、村民篮球赛和简易摄影展，游客车辆统一停放村口。'},
  bus:{title:'县城2路公交调整末班时间',date:'2024-06-08 17:10',cat:'民生',body:'因夏季客流变化，2路公交末班延后十分钟，具体站点时刻以站牌公告为准。'},
  northfire2025:{title:'北坡林区秋冬季森林防火巡查',date:'2025-11-03 10:20',cat:'社会',body:'秋冬季防火巡查覆盖北坡林区外围和开放步道交界处。巡查人员再次提醒游客不要从旧便道进入未开放区域。'},
  northclosed2023:{title:'关于北坡区域禁止游客进入的再次提醒',date:'2023-07-18 15:40',cat:'旅游',body:'近期发现个别游客参考旧游记寻找北坡旧返程区域。相关区域不在开放线路范围内，旧路条和历史轨迹均不能作为通行依据。'},
  spring2016:{title:'青垭春季乡村游线路推荐',date:'2016-04-02 09:10',cat:'旅游',body:'春季乡村游以九弯、茶田和村口老街为主要内容。本文为普通线路推荐稿，部分旧链接已经失效。'},
  autumn2015:{title:'九弯秋季摄影路线进入最佳观赏期',date:'2015-10-09 08:55',cat:'文化',body:'近期九弯山脊能见度较好，清晨云海出现频率增加。摄影游客请沿当年公开线路活动。'},
};

const COUNTY_EXTRAS={
  headline:['县政府召开防汛专题会议','重点项目建设进度通报','高考考点周边交通临时管制'],
  social:['夜间噪声整治持续开展','城区新增两处非机动车停放区','夏季用电安全入户宣传'],
  travel:['九弯步道雨后恢复开放','周末乡村游公交加开一班','县文旅发布文明出行提醒'],
  culture:['县摄影协会夏季采风开始','老电影院史料征集','图书馆地方志阅览室开放'],
  livelihood:['老年食堂试运行','城区供水管网检修完成','暑期儿童门诊增开'],
  towns:['青垭村开展沟渠清淤','三河镇农机集中检修','东岭村新茶上市'],
  special:['森林防火专题','防汛抗旱专题','乡村振兴专题'],
  video:['青垭一周新闻 06.14','九弯云海延时','县城夜市消防检查'],
};

function titlesForCountySection(section){
  return {home:'首页',headline:'要闻',social:'社会',travel:'旅游',culture:'文化',livelihood:'民生',towns:'乡镇',special:'专题',video:'视频'}[section]||'青垭新闻';
}

function renderCountyLocal(query){
  const section=qv(query,'section','home'); const articleId=qv(query,'article');
  const active={headline:'headline',social:'social',travel:'travel',culture:'culture',livelihood:'livelihood',towns:'towns',special:'special',video:'video'}[section]||'home';
  const main=el('main',{id:'app-main',class:'county-site',tabindex:'-1'}); main.append(renderCountyHeader(active));
  if(articleId){
    let a=COUNTY_ARTICLES[articleId];
    if(!a && articleId.startsWith('extra-')){
      const parts=articleId.split('-'); const key=parts[1]; const index=Number(parts[2]); const title=COUNTY_EXTRAS[key]?.[index];
      if(title) a={title,date:`2024-06-${String(7-index).padStart(2,'0')} 10:${20+index}0`,cat:titlesForCountySection(key),body:'这是青垭县融媒体中心的普通栏目稿件。页面保留标题、发布时间和简要正文，不包含北坡调查所需的新材料。'};
    }
    if(a){ const article=el('article',{class:'county-local-article'},[el('p',{class:'county-breadcrumb',text:`当前位置：首页 > ${a.cat} > 正文`}),el('h1',{text:a.title}),el('div',{class:'county-byline'},[el('time',{text:a.date}),el('span',{text:'来源：青垭县融媒体中心'}),el('span',{text:'编辑：王宁'})]),el('p',{text:a.body}),el('p',{text:'以上为本站公开信息，转载请注明来源。'}),el('a',{href:localHref('news-2017',{section:active}),text:'返回栏目列表'})]); main.append(article); return main; }
  }
  const page=el('section',{class:'county-channel-page'}); const titles={home:'青垭新闻',headline:'要闻',social:'社会',travel:'旅游',culture:'文化',livelihood:'民生',towns:'乡镇',special:'专题',video:'视频'}; page.append(el('div',{class:'county-breadcrumb',text:`当前位置：首页 > ${titles[section]||'首页'}`}),el('h1',{text:titles[section]||'青垭新闻'}));
  const common=[['fire','青垭县部署秋季森林防火工作','06-13'],['hospital','县医院新增周末门诊号源','06-12'],['road','东桥道路施工本周五结束','06-11'],['harvest','三河镇稻谷进入集中收割期','06-10'],['festival','青垭村丰收节下周开幕','06-09'],['bus','县城2路公交调整末班时间','06-08']];
  const extras=COUNTY_EXTRAS[section]||[];
  page.append(el('div',{class:'county-channel-list'},common.map(([id,title,date])=>el('p',{},[el('span',{text:`2024-${date}`}),el('a',{href:localHref('news-2017',{section,article:id}),text:title})]))),...extras.map((x,i)=>el('p',{},[el('span',{text:`2024-06-${String(7-i).padStart(2,'0')}`}),el('a',{href:localHref('news-2017',{section,article:`extra-${section}-${i}`}),text:x})])));
  if(section==='home') page.append(el('section',{class:'county-archive-entry'},[el('h2',{text:'历史资料检索'}),el('p',{text:'旧稿件可按年份、地点和标题词检索。'}),el('a',{href:'#/news-2017',text:'进入历史稿件检索 / 当前旧稿'})]));
  main.append(page,el('footer',{class:'county-old-footer'},[el('span',{text:'青垭县融媒体中心版权所有'}),el('span',{text:'新闻热线：0836-7XXXX01　投稿邮箱：news@qingya.example'})])); return main;
}

function renderArchiveLocal(query){
  const section=qv(query,'section','home'); const article=qv(query,'article'); const main=el('main',{id:'app-main',class:'archive-site',tabindex:'-1'}); main.append(renderArchiveHeader(section)); const page=el('section',{class:'archive-local-page'}); const titles={home:'网站首页',trails:'徒步线路',food:'农家乐',stay:'住宿电话',guestbook:'游客留言',contact:'联系我们'}; page.append(el('h1',{text:titles[section]||'青垭乡村游'}));
  if(article){ const data={day:['九弯环线一日走法','从村口出发走完整九弯，晴天一般需要5—7小时。下午天气不稳时不要拖到天黑。'],forest:['老杉树林拍照点','老杉林在开放主线旁，上午逆光少。不要为拍照离开现有步道。'],view:['村口到观景台怎么走','从村口按九弯主线路牌上行，沿途岔口以正式路牌为准。'],rain:['雨天别走石沟','连续降雨时石沟水位变化快，不建议进入沟谷旧便道。']}[article]; page.replaceChildren(el('h1',{text:data?.[0]||'旧页面'}),el('p',{text:data?.[1]||'该旧页面内容未完整保留。'}),el('p',{class:'archive-status',text:'页面状态：2016 年镜像文本，图片附件未全部保留。'}),el('a',{href:localHref('cache-2017',{section:'trails'}),text:'返回徒步线路'})); main.append(page); return main; }
  if(section==='home') page.append(el('p',{text:'欢迎来青垭。本站由几家民宿、农家乐和村里热心人一起维护，更新不一定及时，出发前最好再打电话问。'}),el('h2',{text:'最新更新'}),
    el('p',{class:'archive-index-row'},[el('a',{href:'#/cache-2017',text:'2016-06-12　北坡步道情况说明'})]),
    el('p',{class:'archive-index-row'},[el('a',{href:localHref('cache-2017',{section:'trails',article:'day'}),text:'2016-05-20　九弯环线一日走法'})]),
    el('p',{class:'archive-index-row'},[el('a',{href:localHref('cache-2017',{section:'trails',article:'forest'}),text:'2016-04-03　新增3张北坡照片'})]),
    el('p',{class:'archive-index-row'},[el('a',{href:localHref('cache-2017',{section:'guestbook'}),text:'2016-01-18　网友：看见了不一样的风景'})]));
  else if(section==='trails') page.append(el('p',{text:'本站2016年徒步线路目录。以下文字按最后一次网页抓取保留。'}),el('p',{class:'archive-index-row'},[el('a',{href:'#/cache-2017',text:'九弯环线 · 北坡快捷返程'}),el('span',{text:'　2016-06-12'})]),...[['day','九弯环线一日走法　2016-05-20'],['forest','老杉树林拍照点　2016-04-11'],['view','村口到观景台怎么走　2015-10-03'],['rain','雨天别走石沟　2015-07-19']].map(([id,x])=>el('p',{class:'archive-index-row'},[el('a',{href:localHref('cache-2017',{section:'trails',article:id}),text:x})])));
  else if(section==='food') page.append(el('p',{text:'2016年合作经营户：青垭人家、老街饭馆、山腰客栈。部分电话已经变更。'}),el('p',{text:'青垭人家：柴火饭、土鸡、腊肉。原在线菜单链接已失效。'}));
  else if(section==='stay') page.append(el('table',{class:'archive-contact-table'},[el('tbody',{},[['青垭人家','138****6658'],['山腰客栈','139****2180'],['老街民宿','135****4902']].map(r=>el('tr',{},[el('th',{text:r[0]}),el('td',{text:r[1]})])))]),el('p',{text:'※ 这是2016年号码，镜像站不保证现在仍可使用。'}));
  else if(section==='guestbook') page.append(oldComment('小林','2016-06-15','北坡晴天走过一次，石沟那段别磨蹭。'),oldComment('成都来客','2016-07-02','住青垭人家，老板说下雨就老实走主线。'),oldComment('阿东','2016-09-19','四号拍照挺怪但其实就是水泥人。'),el('p',{text:'留言提交功能已随原站关闭。'}));
  else page.append(el('p',{text:'原站联系邮箱：qytravel2012@example.invalid'}),el('p',{text:'原维护电话已停止公开。本站为历史镜像，不接受新咨询。'}));
  main.append(page,el('footer',{class:'archive-footnote'},[el('strong',{text:'镜像说明'}),el('p',{text:'旧站链接可能失效；目录内容只反映当年网页状态。'})])); return main;
}

export function renderNews2017({ store, router, query }) {
  const section=qv(query,'section'); const articleParam=qv(query,'article');
  if(section || articleParam) return renderCountyLocal(query);
  const main = el('main', { id: 'app-main', class: 'county-site', tabindex: '-1' });
  main.append(renderCountyHeader('social'));

  const crumb = el('div', { class: 'county-breadcrumb' }, [
    el('span', { text: '当前位置：首页 > 社会 > 户外安全 > 正文' }),
    el('span', { text: '网站编辑部值班电话：0836-7XXXX01' }),
  ]);
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
    el('div',{class:'county-article-tools'},[el('span',{text:'【字体：大 中 小】'}),el('span',{text:'打印'}),el('span',{text:'关闭窗口'}),el('span',{text:'编辑：李明'})]),
  );

  const side = el('aside', { class: 'county-side' });
  side.append(
    el('section',{class:'county-normal-news'},[
      el('h2',{text:'本地新闻'}),
      ...[['fire','青垭县部署秋季森林防火工作'],['hospital','县医院新增周末门诊号源'],['road','东桥道路施工本周五结束'],['harvest','三河镇稻谷进入集中收割期'],['festival','青垭村丰收节下周开幕'],['bus','县城2路公交调整末班时间']].map(([id,x],i)=>el('p',{},[el('span',{text:`06-${13-i}`}),el('a',{href:localHref('news-2017',{section:'social',article:id}),text:x})]))
    ]),
    el('section',{class:'county-ranking'},[el('h2',{text:'一周排行'}),...['暴雨蓝色预警解除','开学季校车线路公布','九弯步道雨后恢复开放','县图书馆延长开放时间','老年食堂试运行'].map((x,i)=>el('p',{text:`${i+1}. ${x}`}))]),
    el('section', { class: 'archive-index' }, [
      el('p', { class: 'county-kicker', text: '旧页面索引' }),
      el('h2', { text: '2016 年“徒步线路”分类仍有旧索引' }),
      el('p', { text: '原页面已经下线，索引服务器只保留标题、页面编号和文字快照。' }),
    ]),
  );
  side.querySelector('.archive-index').append(archiveSearch({ store, router }));
  side.append(
    el('section', { class: 'county-related county-related--plain' }, [
      el('strong', { text: '索引备注' }),
      el('p', { text: '旧索引的抓取时间早于 2017 年事故。页面编号和标题仍可用于上方历史检索。' }),
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

  main.append(crumb, page, comments, el('footer',{class:'county-old-footer'},[
    el('span',{text:'青垭县融媒体中心版权所有　未经许可不得转载'}),
    el('span',{text:'网站建设：青垭县信息中心　建议 1024×768 以上分辨率'}),
    el('span',{text:'旧稿件存档系统保留历史页面，内容以原发布时间为准'}),
  ]));
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

export function renderCache2017({ store, interludes, audio, query }) {
  const section=qv(query,'section');
  if(section) return renderArchiveLocal(query);
  const main = el('main', { id: 'app-main', class: 'archive-site', tabindex: '-1' });
  main.append(renderArchiveHeader('trails'));

  const banner = el('section', { class: 'archive-banner' }, [
    photo({ src: IMG.ridge, alt: '山脊和山谷', caption: '青垭九弯 · 2016 资料图', className: 'photo--archive-banner' }),
    el('div', { class: 'archive-banner__copy' }, [
      el('span', { text: '青垭徒步线路推荐' }),
      el('h1', { text: '九弯环线 · 两种返程走法' }),
      el('p', { text: '页面更新：2016-06-12　天气好再走北坡' }),
    ]),
  ]);

  const body = el('div', { class: 'archive-body' });
  const article = el('article', { class: 'archive-article' });
  article.append(
    el('p', { class: 'archive-status', text: '※ 以下内容来自 2016 年网页镜像。页面链接和电话已停止使用。' }),
    el('div', { class: 'archive-old-heading' }, [el('h2', { text: '北坡快捷返程' }), el('img', { src: IMG.oldNew, class: 'archive-new-gif', alt: 'NEW' })]),
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
      el('strong', { text: '本站说明' }),
      el('p', { text: '本页由青垭村几家民宿和农家乐共同整理，路线情况以当天村口问询为准。' }),
    ]),
    el('section', {}, [
      el('strong', { text: '页面状态' }),
      el('p', { text: '2017 年事故后停止公开访问。' }),
    ]),
    el('section', {}, [
      el('strong', { text: '镜像信息' }),
      el('p', { text: '原页面所属栏目：徒步线路。页面标题与正文按最后一次抓取版本保留。' }),
    ]),
    el('section',{class:'archive-old-list'},[el('strong',{text:'同栏目还有'}),el('p',{text:'九弯环线一日走法（2016-05-20）'}),el('p',{text:'老杉树林拍照点（2016-04-11）'}),el('p',{text:'村口到观景台怎么走（2015-10-03）'}),el('p',{text:'雨天别走石沟（2015-07-19）'})]),
    el('section',{class:'archive-old-list'},[el('strong',{text:'住宿电话（旧）'}),el('p',{text:'青垭人家　138****6658'}),el('p',{text:'山腰客栈　139****2180'}),el('p',{text:'老街民宿　135****4902'})]),
    el('section', { class: 'archive-next-record' }, [
      el('strong', { text: '事故后续资料' }),
      el('p', { text: '2018 年公开救援资料中有一条当时带路人周成的补录记录。' }),
      el('a', { href: '#/zhou-cheng', text: '打开：周成 · 2017 北坡资料补录 ›' }),
    ]),
  );

  body.append(article, side);

  const conclusion = el('section', { class: 'archive-footnote' }, [
    el('strong', { text: '归档状态' }),
    el('p', { text: '最后抓取：2017-08-21 07:12。原页面随后停止公开访问；图片附件与文字快照保留在旧索引中。' }),
  ]);

  main.append(banner, body, el('section',{class:'archive-guest-old'},[el('strong',{text:'游客留言摘录'}),oldComment('小林','2016-06-15','北坡晴天走过一次，石沟那段别磨蹭。'),oldComment('成都来客','2016-07-02','住青垭人家，老板说下雨就老实走主线。'),oldComment('阿东','2016-09-19','四号拍照挺怪但其实就是水泥人。')]), conclusion);
  return main;
}
