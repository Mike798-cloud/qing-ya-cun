import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  toilet:'./assets/photos/qingya-toilet-clean.jpg',
  food:'./assets/photos/qingya-food-clean.jpg',
  watch4:'./assets/photos/watchman-04-stage2.jpg',
  trail:'./assets/photos/jiuwan-trail.jpg',
};

function photo(src, alt, caption='', cls=''){
  const b=el('button',{class:`photo ${cls}`.trim(),type:'button','aria-label':caption?`${caption}，打开大图`:'打开图片'});
  const image=el('img',{src,alt,loading:'lazy',decoding:'async'});
  image.addEventListener('error',()=>{ b.classList.add('photo--failed'); image.remove(); if(!b.querySelector('.photo__error')) b.prepend(el('span',{class:'photo__error',text:'图片暂时没有加载出来'})); },{once:true});
  b.append(image); if(caption) b.append(el('span',{class:'photo__caption',text:caption}));
  b.addEventListener('click',()=>{ if(!b.classList.contains('photo--failed')) openLightbox({src,alt,caption}); }); return b;
}
function textLink(href,label,note=''){ const a=el('a',{class:'text-link',href:`#/${href}`}); a.append(el('span',{text:label})); if(note)a.append(el('small',{text:note})); return a; }

function restaurantHeader(){
  return el('header',{class:'restaurant-header restaurant-header--homemade'},[
    el('div',{class:'restaurant-strip',text:'青垭人家农家乐　　订桌电话：13X-XXXX-2876　　公交站往里约120米'}),
    el('div',{class:'restaurant-header__inner'},[
      el('a',{href:'#/food',class:'restaurant-brand'},[el('strong',{text:'青垭人家'}),el('span',{text:'柴火灶台饭 · 家常菜 · 住店请提前问'})]),
      el('div',{class:'restaurant-contact'},[el('b',{text:'今天开灶'}),el('small',{text:'10:30–20:00'})]),
    ]),
    el('nav',{class:'restaurant-nav','aria-label':'青垭人家页面导航'},[
      el('span',{class:'is-active',text:'首页'}),
      (()=>{const b=el('button',{class:'restaurant-nav-button',type:'button',text:'菜单价目'});b.addEventListener('click',()=>document.getElementById('menu')?.scrollIntoView({behavior:'smooth',block:'start'}));return b;})(),
      (()=>{const b=el('button',{class:'restaurant-nav-button',type:'button',text:'游客留言'});b.addEventListener('click',()=>document.getElementById('guestbook')?.scrollIntoView({behavior:'smooth',block:'start'}));return b;})(),
      el('span',{text:'住宿照片'}), el('a',{href:'#/qingya',text:'青垭村网站'}),
    ])
  ]);
}

function serviceHeader(){
  return el('header',{class:'public-service-header'},[
    el('div',{class:'public-service-header__top'},[
      el('a',{href:'#/service',class:'public-service-brand'},[el('strong',{text:'青垭村游客服务中心'}),el('span',{text:'QINGYA VILLAGE TOURIST SERVICE CENTER'})]),
      el('div',{class:'public-service-tel'},[el('span',{text:'服务游客　服务村民'}),el('strong',{text:'0836-7XXXXXX'})]),
    ]),
    el('nav',{class:'public-service-nav','aria-label':'游客服务中心栏目'},[
      el('span',{class:'is-active',text:'首页'}), el('span',{text:'景区介绍'}), el('span',{text:'交通指南'}), el('span',{text:'公共设施'}), el('span',{text:'应急服务'}), el('a',{href:'#/qingya',text:'青垭村'}),
    ])
  ]);
}

function heritageHeader(){
  return el('header',{class:'heritage-header'},[
    el('div',{class:'heritage-header__inner'},[
      el('a',{href:'#/watchmen',class:'heritage-brand'},[el('strong',{text:'青垭村志资料'}),el('span',{text:'旧物 · 老照片 · 口述记录'})]),
      el('span',{class:'heritage-update',text:'资料整理：2025 年冬'}),
    ]),
    el('nav',{class:'heritage-nav'},[el('span',{text:'村史'}),el('span',{text:'旧建筑'}),el('span',{class:'is-active',text:'看路人'}),el('span',{text:'老照片'}),el('a',{href:'#/qingya',text:'旅游服务网'})])
  ]);
}

function villageNoticeHeader(){
  return el('header',{class:'notice-gov-header'},[
    el('div',{class:'notice-gov-top'},[el('a',{href:'#/qingya',text:'青垭村旅游服务信息网'}),el('span',{text:'通知公告'})]),
    el('div',{class:'notice-gov-brand'},[el('strong',{text:'青垭村游客服务中心'}),el('span',{text:'信息公开 / 徒步安全'})]),
    el('nav',{class:'notice-gov-nav'},[el('span',{text:'首页'}),el('span',{text:'服务动态'}),el('span',{class:'is-active',text:'安全提醒'}),el('span',{text:'便民电话'})])
  ]);
}

export function renderService(){
  const main=el('main',{id:'app-main',class:'public-service-site public-service-site--old',tabindex:'-1'}); main.append(serviceHeader());
  const wrap=el('div',{class:'public-service-page'});
  wrap.append(
    el('div',{class:'service-old-tools'},[el('span',{text:'当前位置：首页 > 便民服务 > 公共设施'}),el('span',{text:'加入收藏　|　打印本页　|　服务台意见簿'})]),
    el('div',{class:'service-bulletin-strip'},[el('b',{text:'滚动公告：'}),el('span',{text:'九弯主线正常开放；下午山脊阵风较大。北坡旧返程不开放。公交末班 18:20，以站牌手写通知为准。'})]),
    el('section',{class:'service-old-banner'},[
      photo(IMG.trail,'青垭村远山与九弯山脊','','photo--service-hero'),
      el('p',{text:'文明旅游　安全第一　有事先到服务台问'}),
    ]),
    el('h1',{class:'service-page-title',text:'便民服务 / 公共设施'}),
    el('table',{class:'service-directory-table'},[
      el('thead',{},el('tr',{},[el('th',{text:'服务项目'}),el('th',{text:'地点'}),el('th',{text:'时间'}),el('th',{text:'电话 / 说明'})])),
      el('tbody',{},[
        ['公交问询','一层服务台','06:20–20:40','0836-7XXXX35'],
        ['公共厕所','一层东侧','06:20–20:40','免费'],
        ['饮用热水','一层服务台','开放时间内','请自带水杯'],
        ['手机充电','服务台右侧','开放时间内','插座数量有限'],
        ['失物登记','一层服务台','06:20–20:40','写登记簿'],
        ['应急联系','值班室','全天电话','0836-7XXXXXX'],
      ].map(row=>el('tr',{},row.map((x,i)=>el(i===0?'th':'td',{text:x})))))
    ])
  );
  const body=el('div',{class:'service-old-columns'});
  const article=el('article',{class:'public-service-article'});
  article.append(
    el('h2',{text:'公共卫生间'}),
    photo(IMG.toilet,'青垭村游客中心公共卫生间','游客中心一层公共卫生间','photo--service-main'),
    el('p',{text:'游客中心在公交站上方约 80 米。厕所、补水和充电都在一层。晚上跟末班公交差不多时间关门，节假日看客流延长。'}),
    el('table',{class:'public-service-table'},[el('tbody',{},[
      ['夜间照明','开放时间内有'],['冬季热水','11 月至次年 3 月'],['免费厕纸','每日补充'],['洗鞋水龙头','外墙北侧'],['手机信号','外墙东侧相对稳定']
    ].map(([a,b])=>el('tr',{},[el('th',{text:a}),el('td',{text:b})])))]),
    el('p',{class:'service-slogan service-slogan--plain',text:'山可以野，厕所不能野。—— 2025 年游客服务宣传语'}),
    el('h2',{text:'最近失物登记（未认领）'}),
    el('ul',{class:'service-lost-list'},[
      el('li',{text:'9月12日　黑色折叠伞 1 把　游客中心门口'}),
      el('li',{text:'9月10日　灰色保温杯 1 个　公交候车点'}),
      el('li',{text:'9月08日　登山杖单支　九弯起点牌旁'}),
      el('li',{text:'9月06日　儿童蓝色帽子　村口停车场'}),
    ]),
    el('h2',{text:'常见问题'}),
    el('dl',{class:'service-faq-list'},[
      el('dt',{text:'山里也有 4G 吗？'}),el('dd',{text:'村口大多时候有。沟谷和北坡不稳定，照片或轨迹显示的上传时间不能当成实时位置。'}),
      el('dt',{text:'晚上回来还能充电吗？'}),el('dd',{text:'游客中心关门后不提供室内充电。出发前先充好。'}),
      el('dt',{text:'能不能问北坡怎么走？'}),el('dd',{text:'工作人员只提供当前开放路线信息。旧路线不做方向指引。'}),
    ])
  );
  const aside=el('aside',{class:'service-info-side'},[
    el('h2',{text:'公交时刻（村口）'}),
    el('table',{class:'service-mini-table'},[el('tbody',{},[['06:40','县城→青垭'],['09:20','县城→青垭'],['13:10','青垭→县城'],['18:20','青垭→县城']].map(x=>el('tr',{},[el('td',{text:x[0]}),el('td',{text:x[1]})])))]),
    el('h2',{text:'值班电话'}),el('p',{text:'游客服务　0836-7XXXXXX'}),el('p',{text:'村卫生室　0836-7XXXX12'}),el('p',{text:'公交问询　0836-7XXXX35'}),
    el('h2',{text:'网页说明'}),el('p',{text:'页面由服务台电脑维护，营业时间或班次临时变化时，以门口手写牌为准。'}),
    el('p',{class:'service-old-small',text:'最后修改：2026-09-13 18:02　维护人：小罗'})
  ]);
  body.append(article,aside); wrap.append(body,el('footer',{class:'public-service-footer',text:'青垭村游客服务中心　地址：青垭村口公交站上行80米　本站内容仅作便民查询'})); main.append(wrap); return main;
}

function foodComment(name,date,text,reply=''){
  return el('article',{class:'restaurant-comment'},[
    el('div',{class:'restaurant-comment__meta'},[el('strong',{text:name}),el('time',{text:date})]),el('p',{text}), reply?el('blockquote',{text:`店家：${reply}`}):null
  ].filter(Boolean));
}

export function renderFood(){
  const main=el('main',{id:'app-main',class:'restaurant-site',tabindex:'-1'}); main.append(restaurantHeader());
  const shell=el('div',{class:'restaurant-page'});
  shell.append(
    el('div',{class:'restaurant-flash-line'},[el('b',{text:'★ 今日正常营业 ★'}),el('span',{text:'土鸡要现烧，赶时间的请先电话说。'})]),
    el('div',{class:'restaurant-photo-strip'},[photo(IMG.food,'柴火灶上的一口大铁锅','','photo--restaurant-hero'),el('div',{class:'restaurant-photo-strip__copy'},[el('h1',{text:'青垭人家农家乐'}),el('p',{text:'柴火灶台饭　土鸡　腊肉　时蔬'}),el('strong',{text:'订桌：13X-XXXX-2876'}),el('span',{text:'地址：青垭村公交站往里约120米'})])]),
    el('div',{class:'restaurant-main-grid'},[
      el('div',{class:'restaurant-content'},[
        el('section',{id:'menu',class:'restaurant-menu'},[
          el('h2',{text:'菜单价目（2026 年秋）'}),
          el('table',{class:'restaurant-menu-table'},[el('thead',{},el('tr',{},[el('th',{text:'锅'}),el('th',{text:'建议人数'}),el('th',{text:'内容'}),el('th',{text:'价格'})])),el('tbody',{},[
            ['小锅','2–3 人','土鸡 / 排骨任选 + 两样时蔬','88 元起'],['大锅','4–6 人','肉菜加量 + 豆腐 + 时蔬','148 元起'],['加大锅','6 人以上','提前半小时说，临时不保证','到店问'],['腊肉炒笋','1–3 人','本地笋干，咸淡可说','48 元'],['野菜炒蛋','1–3 人','当天有什么炒什么','28 元'],['家常豆腐','1–3 人','不辣也可以','22 元']
          ].map(row=>el('tr',{},row.map((x,i)=>el(i===0?'th':'td',{text:x})))))]),
          el('p',{class:'restaurant-menu-note',text:'米饭免费续。腊肉和香肠按当天有货情况。一个人来也有炒菜。'})
        ]),
        el('div',{class:'restaurant-paper-note'},[el('b',{text:'老板贴在收银台旁边的纸'}),el('p',{text:'两个人点小锅。三个人也点小锅。你非要点大锅，我们不拦。'}),el('p',{text:'本店不再回答“一个人能不能吃完大锅”，上个月已经回答十七次。'}),el('small',{text:'能吃完当然也卖，但真不建议。'})]),
        el('section',{id:'guestbook',class:'restaurant-guestbook'},[
          el('h2',{text:'游客留言'}),el('p',{class:'guestbook-note',text:'店里忙的时候几天才回一次。留言内容只保留最近三个月。'}),
          foodComment('山野小熊','2026-08-12','老板，小锅三个人吃够吗？','够。刚走完九弯先吃，不够再加菜。'),
          foodComment('成都周末跑','2026-08-17','门口那条狗会咬人吗？','不会。会跟着你看你吃。'),
          foodComment('林里有风','2026-08-21','晚上七点半到还有饭吗？','有桌就有。八点以后先打电话。'),
          foodComment('南门小赵','2026-08-29','能不能只点土豆不点锅？','能。你来饭馆又不是考试。'),
          foodComment('青垭回头客','2026-09-03','去年那个酸萝卜还有吗？','今年也有。'),
          foodComment('路口有人','2026-09-14','今天上午一个人来吃小锅，真能吃完吗？看照片感觉比脸盆还大。','能。小锅别看着大，真没你们想的那么夸张。'),
          foodComment('阿海','2026-09-07','小锅能不能打包？','汤别打。山路上漏一包你自己受不了。'),
          foodComment('周末来哪儿','2026-09-08','本地土豆绝了，米饭吃了三碗。','下回来提前说，周末桌少。'),
          foodComment('不想下山','2026-09-09','有没有素菜？','有。青菜、豆腐、土豆都能炒。'),
          foodComment('小孟','2026-09-10','停车收费吗？','店门口别停。村口停车场问游客中心。'),
          foodComment('远山','2026-09-12','早上七点能吃早餐吗？','住宿客人可以。路过的不一定。'),
          foodComment('膝盖已废','2026-09-13','九弯走完回来还能点大锅吗？','先坐下。你现在问什么我都说能。'),
          foodComment('匿名游客','2026-08-02','老板能开发票吗？','能，吃完跟收银说。'),
          foodComment('一家四口','2026-08-05','小朋友不吃辣。','提前说，辣椒最后放。'),
          foodComment('骑车路过','2026-08-09','有打气筒吗？','有一个旧的，在门后面。'),
        ])
      ]),
      el('aside',{class:'restaurant-aside'},[
        el('h2',{text:'本店信息'}),el('dl',{},[el('dt',{text:'午饭'}),el('dd',{text:'10:30–14:00'}),el('dt',{text:'晚饭'}),el('dd',{text:'16:30–20:00'}),el('dt',{text:'付款'}),el('dd',{text:'现金 / 手机支付'}),el('dt',{text:'停车'}),el('dd',{text:'村口停车场'})]),
        el('h2',{text:'老板说'}),el('p',{text:'赶早爬山可以来装一壶热水。晚上回得太晚就别问还能不能开火，能开也不一定等你。'}),
        el('h2',{text:'网站公告'}),el('p',{class:'restaurant-aside-oldnote',text:'2018-06：手机订餐二维码已失效，别扫。电话没变。'}),
        el('h2',{text:'友情链接'}),el('span',{text:'青垭村旅游服务信息网'}),el('span',{text:'青垭公交时刻（村口公告）'}),el('span',{text:'附近民宿电话汇总'})
      ])
    ]),
    el('footer',{class:'restaurant-footer'},[
      el('span',{text:'青垭人家农家乐　网页由侄子帮忙维护　最后改：2026-09-02'}),
      el('span',{text:'您是第 012883 位来访者　　QQ 留言功能 2019 年起停用'}),
      el('small',{text:'网页有问题不要留言，直接跟老板说，老板再找我。—— 网站维护'}),
    ])
  );
  main.append(shell); return main;
}

export function renderWatchmen(){
  const main=el('main',{id:'app-main',class:'heritage-site',tabindex:'-1'}); main.append(heritageHeader());
  const page=el('div',{class:'heritage-page'});
  const article=el('article',{class:'heritage-article'});
  article.append(
    el('p',{class:'heritage-crumb',text:'首页 ＞ 旧物 ＞ 旧石料场 ＞ 看路人'}),
    el('header',{class:'heritage-title'},[el('h1',{text:'旧石料场留下的六尊“看路人”'}),el('p',{text:'资料整理：青垭村志小组　2025-12-18　照片来源：村民旧照与游客公开照片'})]),
    el('p',{text:'“看路人”是上世纪石料场留下的钢筋水泥指路人像，等身或略高，手臂朝着不同方向。早年工人就这么叫，后来游客也跟着叫。它们不是神像，村里也没有祭拜传统。'}),
    photo(IMG.watch4,'树林边一尊旧水泥指路人像，右手伸出','四号看路人 · 2024 年秋','photo--heritage-main'),
    el('h2',{text:'一至三号'}),
    el('p',{text:'一号脸保存最好，旧蓝工作服仍能辨认，手指向山下。二号脸部油漆脱落严重，眼睛位置剩下一块颜色很深的黑漆。三号的嘴是早年游客补画的，位置偏低，后来清理过几次仍有痕迹。'}),
    el('h2',{text:'四号'}),
    el('p',{text:'四号位于旧石料场上方。右手缺两根手指，底座编号最清楚，后方隔着灌木能看见一截旧蓝铁皮。因为位置好认，早年的游记和现在的安全资料都常拿“四号”当位置参照。'}),
    el('div',{class:'heritage-caption-note'},[el('strong',{text:'资料注'}),el('p',{text:'四号以后的地表在几次暴雨后变化明显，不属于当前开放徒步范围。'})]),
    el('h2',{text:'五号和六号'}),
    el('p',{text:'五号身体略向前倾，周围杂草高，从远处看容易被误认为真人站在坡边。六号在 2013 年暴雨后倒伏，此后没有修复。网上偶尔写“第六尊失踪”，实际就是倒了。'}),
    el('h2',{text:'为什么村里单独写一页说明'}),
    el('p',{text:'这几年有人给水泥人放水果、插香、系红布。工作人员清理时经常被问“是不是当地习俗”。不是。请不要自行给旧设施添加宗教含义，也不要把临时布条留在北坡。'}),
    el('p',{class:'heritage-warning-line',text:'可以拍照。不要攀爬。不要搂脖子。水泥的，倒下来比人重。'}),
    textLink('safety','安全资料：北坡旧返程线路安全提醒')
  );
  const side=el('aside',{class:'heritage-side-index'},[el('h2',{text:'本页目录'}),el('span',{text:'一至三号'}),el('strong',{text:'四号'}),el('span',{text:'五号和六号'}),el('span',{text:'游客须知'}),el('h2',{text:'其他旧物'}),el('span',{text:'旧石料场铁牌'}),el('span',{text:'村口旧广播喇叭'}),el('span',{text:'九弯老里程碑'}),el('span',{text:'村口旧电影海报框'}),el('span',{text:'老供销社木牌'}),el('span',{text:'1987年修桥纪念碑'})]);
  page.append(article,side); main.append(page,el('footer',{class:'heritage-footer',text:'青垭村志资料　仅作地方旧物记录　如有旧照片可联系游客服务中心'})); return main;
}

export function renderSafety({store,audio}){
  const main=el('main',{id:'app-main',class:'village-notice-site',tabindex:'-1'}); main.append(villageNoticeHeader());
  const wrap=el('article',{class:'village-notice-page'});
  wrap.append(
    el('p',{class:'village-notice-breadcrumb',text:'首页 ＞ 通知公告 ＞ 徒步安全'}),
    el('header',{class:'village-notice-title'},[el('h1',{text:'关于北坡旧返程线路的安全提醒'}),el('p',{text:'发布时间：2026-09-01　来源：青垭村游客服务中心　浏览：2274'})]),
    el('div',{class:'notice-doc-number',text:'青垭游服〔2026〕09-01'}),
    el('p',{text:'近期有游客依据历史游记、旧轨迹截图进入北坡旧返程区域。现就相关情况提醒如下：'}),
    el('p',{text:'一、“北坡返程线”为历史路线名称，目前不开放、不维护，也不纳入青垭徒步难度评级。'}),
    el('p',{text:'二、旧帖子里的路条、箭头、轨迹截图和里程记录均可能已失效。看到“以前有人走过”，不代表今天仍然能走。'}),
    el('p',{text:'三、尤其不要因为刚看到他人上传轨迹，就照着同一条旧线进入北坡。北坡部分区域无稳定信号，上传时间不等于拍摄时间。'}),
    el('p',{text:'四、遇到旧路条、自制箭头等标记，请留在当前开放主线，不要自行验证旧路，也不要重新绑路条或扶正旧箭头。'}),
    photo(IMG.trail,'青垭九弯主线附近的山脊步道','九弯主线与北坡岔口附近','photo--notice-main'),
    el('div',{class:'old-warning-strip'},[el('span',{text:'2018 年旧版安全告示'}),el('strong',{text:'NO BACK · 请勿按旧线返回'}),el('small',{text:'旧版页面编号 QY-NB-2018；现已由本页替代。'})]),
    el('div',{class:'notice-history-links'},[
      el('strong',{text:'历年相关信息'}),
      el('a',{href:'#/news-2017',text:'2017-08-20　北坡户外事故搜救工作结束'}),
      el('span',{text:'2018-05-11　旧返程线路停止推荐说明（原链接已失效）'})
    ]),
    el('section',{class:'notice-normal-list'},[el('strong',{text:'近期安全提醒'}),el('span',{text:'2026-08-28　九弯环线雨后木阶湿滑提醒'}),el('span',{text:'2026-08-19　山区雷雨天气临时避让说明'}),el('span',{text:'2026-07-31　暑期游客车辆停放与夜间进山提醒'}),el('span',{text:'2026-07-09　森林防火期禁止携带明火进山'})]),
    el('p',{class:'notice-signature',text:'青垭村游客服务中心\n2026年9月1日'}),
    el('footer',{class:'village-notice-foot'},[el('span',{text:'返回通知列表'}),el('span',{text:'打印本页'}),el('span',{text:'关闭窗口'})])
  );
  main.append(wrap);
  return main;
}
