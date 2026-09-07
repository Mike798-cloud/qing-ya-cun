import { el, toast } from '../core/ui.js';
import { openLightbox } from '../core/lightbox.js';

const IMG = {
  toilet:'./assets/photos/qingya-toilet-clean.jpg',
  food:'./assets/photos/qingya-food.jpg',
  watch4:'./assets/photos/watchman-04-stage2.jpg',
  trail:'./assets/photos/jiuwan-ridge.jpg',
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
function header(active=''){
  return el('header',{class:'village-header'},el('div',{class:'village-header__inner'},[
    el('a',{href:'#/qingya',class:'village-brand'},[el('strong',{text:'青垭村'}),el('span',{text:'游客服务信息'})]),
    el('nav',{class:'village-nav','aria-label':'青垭村站点导航'},[
      el('a',{href:'#/qingya',text:'首页'}), el('a',{href:'#/jiuwan',text:'徒步'}),
      el('a',{href:'#/service',class:active==='service'?'is-active':'',text:'游客服务'}),
      el('a',{href:'#/food',class:active==='food'?'is-active':'',text:'吃饭'}),
      el('a',{href:'#/watchmen',class:active==='watchmen'?'is-active':'',text:'看路人'}),
    ])
  ]));
}
function next(href,label){return el('a',{class:'text-link stage-next',href:`#/${href}`,text:label});}

export function renderService(){
  const main=el('main',{id:'app-main',class:'village-site',tabindex:'-1'}); main.append(header('service'));
  const wrap=el('article',{class:'info-page'});
  wrap.append(
    el('p',{class:'eyebrow',text:'游客服务中心 · 公共卫生间'}),
    el('h1',{text:'本村自己评的五星厕所'}),
    el('p',{class:'info-lead',text:'山里有些地方没信号，有些地方没热水。游客中心这间尽量都给你留着。'}),
    photo(IMG.toilet,'青垭游客服务中心公共卫生间','游客中心公共卫生间 · 村口','photo--info'),
    el('div',{class:'facility-list'},[
      ['夜间照明','天黑以后仍开放到末班车前。'],['冬季热水','水温不保证烫，保证不是山泉原温。'],['免费厕纸','补货时间写在门后。'],['洗鞋水龙头','请不要在洗手池里冲整双登山鞋。'],['手机信号','外墙东侧相对稳定，进山后不作保证。']
    ].map(([a,b])=>el('div',{class:'facility-row'},[el('strong',{text:a}),el('span',{text:b})]))),
    el('blockquote',{class:'village-quote',text:'山可以野，厕所不能野。'}),
    el('p',{class:'fine-note',text:'服务说明：北坡、石料场旧路及林间沟谷信号不稳定。轨迹记录和图片可能在回到村口以后才集中同步。'}),
    next('watchmen','继续看：村里为什么单独做了“看路人”说明')
  ); main.append(wrap); return main;
}

export function renderFood(){
  const main=el('main',{id:'app-main',class:'village-site',tabindex:'-1'}); main.append(header('food'));
  const wrap=el('article',{class:'info-page'});
  wrap.append(el('p',{class:'eyebrow',text:'青垭人家 · 灶台饭'}),el('h1',{text:'先说人数，再说锅。'}),
    photo(IMG.food,'灶台上一口装满菜的大铁锅','灶台饭 · 小锅实拍','photo--info'),
    el('div',{class:'menu-lines'},[
      el('p',{text:'两个人点小锅。'}),el('p',{text:'三个人也点小锅。'}),el('p',{text:'你非要点大锅，我们不拦。'})
    ]),
    el('p',{class:'fine-note',text:'本店不再回答“一个人能不能吃完大锅”，上个月已经回答十七次。'}),
    el('section',{class:'review-strip'},[
      el('strong',{text:'游客问：'}),el('span',{text:'老板，今天上午那个背黑包、拍旧路线的人是不是一个人？'}),
      el('strong',{text:'店家回复：'}),el('span',{text:'一个人。吃完问了北坡以前从哪边回，问完就走了。没说要走那边。'})
    ]),
    next('watchmen','返回调查：看路人专题')
  ); main.append(wrap); return main;
}

export function renderWatchmen({store,flow}){
  const main=el('main',{id:'app-main',class:'village-site',tabindex:'-1'}); main.append(header('watchmen'));
  const wrap=el('article',{class:'info-page info-page--wide'});
  const grid=el('div',{class:'watch-grid'});
  const items=[
    ['一号','脸保存最好，旧蓝工作服。手朝山下。'],['二号','脸部油漆掉得多，只剩一只眼睛颜色很深。'],['三号','嘴是早年游客补画的，画歪了。'],['四号','右手缺两根手指。底座编号还看得清。'],['五号','身体略向前倾，草高时远看很像有人。'],['六号','2013 年暴雨后倒伏，未修复。']
  ];
  items.forEach(([n,d],i)=>{
    const card=el('article',{class:`watch-card ${i===3?'watch-card--focus':''}`});
    if(i===3) card.append(photo(IMG.watch4,'树林边一尊旧水泥指路人像，右手向外平伸','四号看路人 · 旧石料场北侧','photo--watch-card'));
    card.append(el('h2',{text:n}),el('p',{text:d})); grid.append(card);
  });
  wrap.append(el('p',{class:'eyebrow',text:'旧石料场遗留设施'}),el('h1',{text:'六尊“看路人”'}),
    el('p',{class:'info-lead',text:'上世纪石料场留下的水泥指路人像。不是神像，也没有祭拜传统。近几年总有人给它们插香、放水果，清理起来很麻烦。'}),
    grid,
    el('div',{class:'plain-rules'},[
      el('p',{text:'可以拍照。不要攀爬。'}),
      el('p',{text:'不要搂脖子。水泥的，倒下来比人重。'}),
      el('p',{text:'四号以后不属于开放徒步范围。'})
    ]),
    next('safety','下一条：北坡安全公告')
  );
  main.append(wrap); return main;
}

export function renderSafety({store,flow,audio}){
  const main=el('main',{id:'app-main',class:'village-site',tabindex:'-1'}); main.append(header());
  const wrap=el('article',{class:'info-page'});
  wrap.append(el('p',{class:'eyebrow',text:'徒步安全 · 2026 年更新'}),el('h1',{text:'北坡旧返程：不要按旧轨迹重走'}),
    photo(IMG.trail,'林间狭窄步道','九弯主线与北坡岔口附近','photo--info'),
    el('div',{class:'safety-copy'},[
      el('p',{text:'“北坡返程线”是历史路线名称，目前不开放、不维护，也不纳入青垭徒步难度评级。'}),
      el('p',{text:'旧帖子里的路条、箭头、轨迹截图和里程记录都可能已经失效。看到“以前有人走过”，不代表今天仍然能走。'}),
      el('p',{text:'尤其不要因为刚看到别人上传了轨迹，就照着同一条旧线进入北坡。山里部分区域无稳定信号，上传时间不等于拍摄时间。'})
    ]),
    el('aside',{class:'notice notice--warning'},[
      el('strong',{text:'遇到旧标记怎么办？'}),el('p',{text:'留在开放主线，不要自行验证旧路是否还能通过。'})
    ]),
    el('div',{class:'old-warning-strip'},[
      el('span',{text:'旧版告示 · 2018'}),
      el('strong',{text:'NO BACK · 请勿按旧线返回'}),
      el('small',{text:'旧版页面编号 QY-NB-2018；现已由本页替代。'})
    ]),
    el('a',{class:'btn btn--primary',href:'#/boot',text:'回到周航的聊天'})
  );
  if(!store.getState().flags.stage2MessageReady){
    store.dispatch({type:'SET_FLAG',key:'stage2MessageReady',value:true});
    audio.play?.('message'); toast('周航发来新消息');
  }
  main.append(wrap); return main;
}
