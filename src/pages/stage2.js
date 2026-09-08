import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  toilet:'./assets/photos/qingya-toilet-clean.jpg',
  food:'./assets/photos/qingya-food-clean.jpg',
  watch4:'./assets/photos/watchman-04-stage2.jpg',
  trail:'./assets/photos/jiuwan-trail.jpg',
};

function photo(src, alt, caption, cls=''){
  const b=el('button',{class:`photo ${cls}`.trim(),type:'button','aria-label':`${caption}，打开大图`});
  const image=el('img',{src,alt,loading:'lazy',decoding:'async'});
  image.addEventListener('error',()=>{
    b.classList.add('photo--failed');
    image.remove();
    if(!b.querySelector('.photo__error')) b.prepend(el('span',{class:'photo__error',text:'图片暂时没有加载出来'}));
  },{once:true});
  b.append(image,el('span',{class:'photo__caption',text:caption}));
  b.addEventListener('click',()=>{ if(!b.classList.contains('photo--failed')) openLightbox({src,alt,caption}); });
  return b;
}

function textLink(href,label,note=''){
  const a=el('a',{class:'text-link',href:`#/${href}`});
  a.append(el('span',{text:label}));
  if(note) a.append(el('small',{text:note}));
  return a;
}

function villageOfficialHeader(active=''){
  return el('header',{class:'village-header'},[
    el('div',{class:'village-utility'},el('div',{class:'village-utility__inner'},[
      el('span',{text:'青垭村旅游服务信息网'}),el('span',{text:'游客服务电话 0836-7XXXXXX'})
    ])),
    el('div',{class:'village-header__inner'},[
      el('a',{href:'#/qingya',class:'village-brand'},[el('strong',{text:'青垭村'}),el('span',{text:'山里日子，也可以很好。'})]),
      el('nav',{class:'village-nav','aria-label':'青垭村站点导航'},[
        el('a',{href:'#/qingya',text:'首页'}),
        el('a',{href:'#/jiuwan',text:'九弯徒步'}),
        el('a',{href:'#/food',class:active==='food'?'is-active':'',text:'吃住青垭'}),
        el('a',{href:'#/service',class:active==='service'?'is-active':'',text:'游客服务'}),
        el('a',{href:'#/watchmen',class:active==='watchmen'?'is-active':'',text:'旧物记'}),
      ])
    ])
  ]);
}

function restaurantHeader(){
  return el('header',{class:'restaurant-header'},[
    el('div',{class:'restaurant-header__inner'},[
      el('a',{href:'#/food',class:'restaurant-brand'},[
        el('strong',{text:'青垭人家'}),
        el('span',{text:'柴火灶台饭 · 家常菜'}),
      ]),
      el('div',{class:'restaurant-contact'},[
        el('span',{text:'订桌 13X-XXXX-2876'}),
        el('small',{text:'中午 10:30 开灶'}),
      ]),
    ]),
    el('nav',{class:'restaurant-nav','aria-label':'青垭人家页面导航'},[
      el('span',{class:'is-active',text:'本店首页'}),
      (()=>{const b=el('button',{class:'restaurant-nav-button',type:'button',text:'今天吃什么'});b.addEventListener('click',()=>document.getElementById('menu')?.scrollIntoView({behavior:'smooth',block:'start'}));return b;})(),
      (()=>{const b=el('button',{class:'restaurant-nav-button',type:'button',text:'游客留言'});b.addEventListener('click',()=>document.getElementById('guestbook')?.scrollIntoView({behavior:'smooth',block:'start'}));return b;})(),
      el('a',{href:'#/qingya',text:'回青垭村网站'}),
    ])
  ]);
}

function serviceHeader(){
  return el('header',{class:'public-service-header'},[
    el('div',{class:'public-service-header__top'},[
      el('a',{href:'#/service',class:'public-service-brand'},[
        el('strong',{text:'青垭村游客服务中心'}),
        el('span',{text:'QINGYA VISITOR SERVICE'}),
      ]),
      el('span',{class:'public-service-tel',text:'值班电话 0836-7XXXXXX'}),
    ]),
    el('nav',{class:'public-service-nav','aria-label':'游客服务中心栏目'},[
      el('span',{class:'is-active',text:'公共服务'}),
      el('span',{text:'交通问询'}),
      el('span',{text:'应急联系'}),
      el('a',{href:'#/qingya',text:'青垭村首页'}),
    ])
  ]);
}

function heritageHeader(){
  return el('header',{class:'heritage-header'},[
    el('div',{class:'heritage-header__inner'},[
      el('a',{href:'#/watchmen',class:'heritage-brand'},[
        el('strong',{text:'青垭旧物志'}),
        el('span',{text:'村里还留着的一些东西'}),
      ]),
      el('a',{href:'#/qingya',class:'heritage-back',text:'返回青垭村旅游服务网'}),
    ]),
    el('nav',{class:'heritage-nav'},[
      el('span',{text:'旧建筑'}),el('span',{class:'is-active',text:'看路人'}),el('span',{text:'老照片'}),el('span',{text:'村口旧物'})
    ])
  ]);
}

export function renderService(){
  const main=el('main',{id:'app-main',class:'public-service-site',tabindex:'-1'});
  main.append(serviceHeader());

  const intro=el('section',{class:'public-service-intro'},[
    el('p',{class:'public-service-breadcrumb',text:'首页 / 公共服务 / 游客中心公共卫生间'}),
    el('div',{class:'public-service-title'},[
      el('div',{},[
        el('span',{text:'公共卫生间 · 村口游客中心一层'}),
        el('h1',{text:'游客中心公共卫生间'}),
        el('p',{text:'位置就在公交站上方，进山前可以补水、洗鞋、充电。冬天热水会开，但别指望像城里洗浴中心。'}),
      ]),
      el('dl',{class:'public-service-hours'},[
        el('dt',{text:'开放'}),el('dd',{text:'06:20–20:40'}),
        el('dt',{text:'位置'}),el('dd',{text:'村口游客中心一层'}),
      ])
    ]),
  ]);

  const body=el('div',{class:'public-service-body'});
  const article=el('article',{class:'public-service-article'});
  const facilityRows=[
    ['夜间照明','开放时间内保持照明，末班车后关闭。'],
    ['冬季热水','11 月至次年 3 月开放，水温以当天设备为准。'],
    ['免费厕纸','每日早、中、晚三次补充，缺了直接去前台说。'],
    ['洗鞋水龙头','在外墙北侧，请不要把泥鞋放进洗手池。'],
    ['手机信号','外墙东侧相对稳定；进入山里以后不作保证。'],
  ].map(([a,b])=>el('tr',{},[el('th',{text:a}),el('td',{text:b})]));
  const facilityTable=el('table',{class:'public-service-table'},[
    el('tbody',{},facilityRows)
  ]);
  article.append(
    photo(IMG.toilet,'干净的山村游客中心公共卫生间','游客中心公共卫生间 · 2026.08','photo--service-main'),
    el('section',{class:'public-service-section'},[
      el('h2',{text:'现有设施'}),
      facilityTable
    ]),
    el('div',{class:'service-slogan'},[
      el('span',{text:'游客中心卫生间服务口号'}),
      el('strong',{text:'山可以野，厕所不能野。'})
    ]),
    el('section',{class:'service-faq'},[
      el('h2',{text:'游客最近问过'}),
      el('div',{class:'service-faq-row'},[
        el('strong',{text:'“厕所外墙为什么老有人举着手机？”'}),
        el('p',{text:'值班员：那一侧信号好一点。有人发照片，有人等轨迹同步，不是在拍厕所。'})
      ]),
      el('div',{class:'service-faq-row'},[
        el('strong',{text:'“山里也有 4G 吗？”'}),
        el('p',{text:'值班员：村口大多时候有。北坡、旧石料场和沟谷不稳定，别拿上传时间当人在山里的实时位置。'})
      ]),
    ])
  );
  const aside=el('aside',{class:'public-service-aside'},[
    el('h2',{text:'进山前可以在这里处理'}),
    el('ul',{},[
      el('li',{text:'补充饮水'}),el('li',{text:'给手机和充电宝充电'}),el('li',{text:'询问当天主线情况'}),el('li',{text:'借用简易雨衣（数量有限）'})
    ]),
    el('p',{class:'public-service-note',text:'北坡旧返程不属于游客中心推荐线路。工作人员不会为旧线路提供方向指引。'}),
    textLink('qingya','返回青垭村首页')
  ]);
  body.append(article,aside);
  main.append(intro,body,el('footer',{class:'public-service-footer',text:'青垭村游客服务中心 · 信息更新 2026-09'}));
  return main;
}

export function renderFood(){
  const main=el('main',{id:'app-main',class:'restaurant-site',tabindex:'-1'});
  main.append(restaurantHeader());

  const hero=el('section',{class:'restaurant-hero'});
  hero.append(
    photo(IMG.food,'山村饭馆灶台上一口热气腾腾的大铁锅','灶台饭 · 午饭开灶','photo--restaurant-hero'),
    el('div',{class:'restaurant-hero__copy'},[
      el('span',{text:'青垭村 · 公交站往里 120 米'}),
      el('h1',{text:'灶台饭'}),
      el('p',{text:'本地土鸡、腊肉、豆腐和当季菜。锅按人数点，别看着灶大就逞强。'}),
      el('p',{class:'restaurant-open',text:'午饭 10:30–14:00　晚饭 16:30–20:00'}),
    ])
  );

  const body=el('div',{class:'restaurant-body'});
  const content=el('div',{class:'restaurant-content'});
  content.append(
    el('section',{id:'menu',class:'restaurant-menu'},[
      el('div',{class:'restaurant-section-head'},[
        el('h2',{text:'锅怎么点'}),
        el('span',{text:'菜每天会换，人数不会。'})
      ]),
      el('div',{class:'restaurant-menu-row'},[el('strong',{text:'小锅'}),el('span',{text:'2–3 人'}),el('p',{text:'土鸡或排骨任选一种，配两样时蔬。'}),el('em',{text:'88 元起'})]),
      el('div',{class:'restaurant-menu-row'},[el('strong',{text:'大锅'}),el('span',{text:'4–6 人'}),el('p',{text:'肉菜分量增加，默认多加一份豆腐。'}),el('em',{text:'148 元起'})]),
      el('div',{class:'restaurant-menu-row'},[el('strong',{text:'加大锅'}),el('span',{text:'6 人以上'}),el('p',{text:'请提前半小时说，临时来不一定有锅。'}),el('em',{text:'到店问'})]),
    ]),
    el('div',{class:'restaurant-owner-note'},[
      el('strong',{text:'老板贴在收银台旁边的纸'}),
      el('p',{text:'两个人点小锅。三个人也点小锅。你非要点大锅，我们不拦。'}),
      el('p',{text:'本店不再回答“一个人能不能吃完大锅”，上个月已经回答十七次。'}),
      el('small',{text:'一个人来也有炒菜，不用为了证明自己点整口锅。'})
    ]),
    el('section',{id:'guestbook',class:'restaurant-guestbook'},[
      el('div',{class:'restaurant-section-head'},[
        el('h2',{text:'游客留言'}),
        el('span',{text:'店里有空才回，不保证当天。'})
      ]),
      el('article',{class:'restaurant-comment'},[
        el('div',{class:'restaurant-comment__meta'},[el('strong',{text:'山野小熊'}),el('time',{text:'2026-08-12'})]),
        el('p',{text:'老板，小锅三个人吃够吗？'}),
        el('blockquote',{text:'店家：够。你们要是刚走完九弯，先吃，不够再加菜。'})
      ]),
      el('article',{class:'restaurant-comment'},[
        el('div',{class:'restaurant-comment__meta'},[el('strong',{text:'路口有人'}),el('time',{text:'2026-09-14'})]),
        el('p',{text:'今天上午背黑包、拿着手机看旧地图那个男生是不是一个人来的？问了北坡吗？'}),
        el('blockquote',{text:'店家：一个人。吃完问了以前北坡从哪边回，问完就走了。没说要走那边。'})
      ]),
      el('article',{class:'restaurant-comment'},[
        el('div',{class:'restaurant-comment__meta'},[el('strong',{text:'周末来哪儿'}),el('time',{text:'2026-05-21'})]),
        el('p',{text:'本地土豆绝了，米饭吃了三碗。'}),
        el('blockquote',{text:'店家：下回来提前说，周末桌少。'})
      ])
    ])
  );

  const aside=el('aside',{class:'restaurant-aside'},[
    el('section',{},[
      el('h2',{text:'到店信息'}),
      el('dl',{},[
        el('dt',{text:'地址'}),el('dd',{text:'青垭村公交站往里约 120 米'}),
        el('dt',{text:'订桌'}),el('dd',{text:'13X-XXXX-2876'}),
        el('dt',{text:'付款'}),el('dd',{text:'现金 / 手机支付都可以'}),
        el('dt',{text:'停车'}),el('dd',{text:'村口停车场，店门口别堵路'}),
      ])
    ]),
    el('section',{},[
      el('h2',{text:'老板说'}),
      el('p',{text:'赶早爬山可以先来装一壶热水。晚上回得太晚就别问还能不能开火，能开也不一定等你。'})
    ]),
    textLink('qingya','返回青垭村旅游服务信息网')
  ]);
  body.append(content,aside);
  main.append(hero,body,el('footer',{class:'restaurant-footer'},[
    el('strong',{text:'青垭人家'}),el('span',{text:'本地食材 · 柴火灶 · 人多提前说'})
  ]));
  return main;
}

export function renderWatchmen(){
  const main=el('main',{id:'app-main',class:'heritage-site',tabindex:'-1'});
  main.append(heritageHeader());
  const wrap=el('article',{class:'heritage-article'});
  wrap.append(
    el('p',{class:'heritage-crumb',text:'青垭旧物志 / 旧石料场 / 看路人'}),
    el('header',{class:'heritage-title'},[
      el('span',{text:'旧石料场遗留设施 · 村内资料整理'}),
      el('h1',{text:'六尊“看路人”'}),
      el('p',{text:'上世纪石料场留下的钢筋水泥指路人像。早年工人叫它们“看路人”，名字就这么留下来了。它们不是神像，村里也没有祭拜传统。'})
    ]),
    el('div',{class:'heritage-lead-photo'},[
      photo(IMG.watch4,'树林边一尊旧水泥指路人像，右手向外平伸','四号看路人 · 旧石料场北侧','photo--heritage-main'),
      el('p',{text:'现在游客见得最多的是四号。右手缺两根手指，底座编号还在，后面能看到一截旧蓝铁皮。'})
    ]),
    el('section',{class:'heritage-index'},[
      el('h2',{text:'现存情况'}),
      el('div',{class:'heritage-index-row'},[el('strong',{text:'一号'}),el('p',{text:'脸保存最好，旧蓝工作服，一只手指向山下。'})]),
      el('div',{class:'heritage-index-row'},[el('strong',{text:'二号'}),el('p',{text:'脸部油漆掉得多，只剩一只眼睛的黑色颜料还很深。'})]),
      el('div',{class:'heritage-index-row'},[el('strong',{text:'三号'}),el('p',{text:'嘴是早年游客补画的，位置画歪。村里后来清过几次，没有完全清掉。'})]),
    ]),
    el('section',{class:'heritage-focus'},[
      el('div',{class:'heritage-focus__number'},[el('span',{text:'04'}),el('strong',{text:'四号'})]),
      el('div',{class:'heritage-focus__copy'},[
        el('h2',{text:'北坡旧线最后一尊保存较完整的“看路人”'}),
        el('p',{text:'右手缺两根手指。底座编号清楚，背后的旧蓝铁皮是石料场时期留下的小棚外墙。四号以后地表变化较大，不属于开放徒步范围。'})
      ])
    ]),
    el('section',{class:'heritage-index heritage-index--tail'},[
      el('div',{class:'heritage-index-row'},[el('strong',{text:'五号'}),el('p',{text:'身体略向前倾，周围杂草高，远景时很容易被误认成真人站在坡边。'})]),
      el('div',{class:'heritage-index-row'},[el('strong',{text:'六号'}),el('p',{text:'2013 年暴雨后倒伏，未修复。不是“失踪”，就是倒了。'})]),
    ]),
    el('section',{class:'heritage-rules'},[
      el('h2',{text:'村里为什么专门写这一页'}),
      el('p',{text:'这几年有人给水泥人放水果、插香、系红布。清理起来很麻烦，也容易让后来的人误会这里有什么民俗。没有。'}),
      el('p',{text:'可以拍照。不要攀爬。不要搂脖子。水泥的，倒下来比人重。'}),
      el('p',{text:'四号以后不属于开放徒步范围。'}),
      textLink('safety','北坡旧返程安全公告','为什么旧轨迹尤其不能跟')
    ])
  );
  main.append(wrap,el('footer',{class:'heritage-footer',text:'青垭旧物志 · 内容由村民和游客旧照片整理'}));
  return main;
}

export function renderSafety({store,audio}){
  const main=el('main',{id:'app-main',class:'village-notice-site',tabindex:'-1'});
  main.append(villageOfficialHeader());
  const wrap=el('article',{class:'village-notice-page'});
  wrap.append(
    el('p',{class:'village-notice-breadcrumb',text:'首页 / 通知公告 / 徒步安全'}),
    el('header',{class:'village-notice-title'},[
      el('span',{text:'徒步安全 · 2026 年更新'}),
      el('h1',{text:'关于北坡旧返程线路的安全提醒'}),
      el('p',{text:'发布日期：2026-09-01　　信息来源：青垭村游客服务中心'})
    ]),
    photo(IMG.trail,'青垭九弯主线附近的山脊步道','九弯主线与北坡岔口附近','photo--notice-main'),
    el('div',{class:'village-notice-copy'},[
      el('p',{text:'“北坡返程线”是历史路线名称，目前不开放、不维护，也不纳入青垭徒步难度评级。'}),
      el('p',{text:'旧帖子里的路条、箭头、轨迹截图和里程记录都可能已经失效。看到“以前有人走过”，不代表今天仍然能走。'}),
      el('p',{text:'尤其不要因为刚看到别人上传了轨迹，就照着同一条旧线进入北坡。山里部分区域无稳定信号，上传时间不等于拍摄时间。'}),
      el('h2',{text:'遇到旧标记怎么办'}),
      el('p',{text:'留在开放主线，不要自行验证旧路是否还能通过。不要重新绑路条、扶正旧箭头，也不要把个人轨迹当作公共路线发布。'})
    ]),
    el('div',{class:'old-warning-strip'},[
      el('span',{text:'旧版告示 · 2018'}),
      el('strong',{text:'NO BACK · 请勿按旧线返回'}),
      el('small',{text:'旧版页面编号 QY-NB-2018；现已由本页替代。'})
    ]),
    el('div',{class:'village-notice-foot'},[
      textLink('qingya','返回青垭村首页'),
      el('a',{class:'text-link',href:'#/boot',text:'回到周航的聊天'})
    ])
  );
  if(!store.getState().flags.stage2MessageReady){
    store.dispatch({type:'SET_FLAG',key:'stage2MessageReady',value:true});
    audio.play?.('message'); toast('周航发来新消息');
  }
  main.append(wrap);
  return main;
}
