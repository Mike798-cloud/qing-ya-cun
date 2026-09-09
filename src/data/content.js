export const routeDefinitions = new Map([
  ['boot', { id: 'boot', title: '周航', kind: 'chat' }],
  ['contact', { id: 'contact', title: '周航 · 联系人资料', kind: 'contact' }],
  ['profile', { id: 'profile', title: '周末别找我', kind: 'trail' }],
  ['post', { id: 'post', title: '青垭九弯 · 轨迹记录', kind: 'trail' }],
  ['draft-1', { id: 'draft-1', title: '未公开草稿', kind: 'trail' }],
  ['qingya', { id: 'qingya', title: '青垭村', kind: 'village' }],
  ['jiuwan', { id: 'jiuwan', title: '青垭九弯环线', kind: 'village' }],
  ['service', { id: 'service', title: '游客服务中心', kind: 'village' }],
  ['food', { id: 'food', title: '青垭灶台饭', kind: 'village' }],
  ['watchmen', { id: 'watchmen', title: '看路人专题', kind: 'village' }],
  ['safety', { id: 'safety', title: '北坡安全公告', kind: 'village' }],
  ['news-2017', { id: 'news-2017', title: '2017 北坡事故旧新闻', kind: 'county' }],
  ['cache-2017', { id: 'cache-2017', title: '北坡快捷返程 · 2016 网页快照', kind: 'archive' }],
  ['zhou-cheng', { id: 'zhou-cheng', title: '周成 · 2017 北坡资料补录', kind: 'memorial' }],
  ['zhou-yougen', { id: 'zhou-yougen', title: '周有根 · 北坡路条旧帖', kind: 'forum' }],
  ['watchman-04-detail', { id: 'watchman-04-detail', title: '四号看路人 · 高清资料', kind: 'mountain-archive' }],
  ['second-book', { id: 'second-book', title: '第二本册子 · 扫描件', kind: 'field-ledger' }],
  ['aji-comment', { id: 'aji-comment', title: '阿纪 · 北坡动态缓存', kind: 'trail-cache' }],
  ['final-draft', { id: 'final-draft', title: '周航 · 最后未发布草稿', kind: 'draft-recovery' }],
  ['rescue-result', { id: 'rescue-result', title: '北坡失联人员搜救工作结束', kind: 'rescue' }],
  ['ending', { id: 'ending', title: '周航', kind: 'ending' }],
]);

export const passwordDefinitions = {
  noweekend: { answer: 'NOWEEKEND', unlock: ['draft-1'], stage: 1 },
  noreturn: { answer: 'NORETURN', unlock: ['final-draft'], stage: 6 },
};

// Public internet pages are never stage-locked. Stage rules only advance story time/events.
export const stageRules = [
  { stage: 1, when: state => state.visited.includes('boot') },
  { stage: 2, when: state => Boolean(state.passwords.noweekend) && state.visited.includes('draft-1') && ['post','qingya','jiuwan'].every(id=>state.visited.includes(id)) },
  { stage: 3, when: state => state.stage >= 2 && Boolean(state.choices.stage2) && ['watchmen','safety'].every(id => state.visited.includes(id)) },
  { stage: 4, when: state => state.stage >= 3 && state.visited.includes('news-2017') && state.visited.includes('cache-2017') },
  { stage: 5, when: state => state.stage >= 4 && Boolean(state.choices.stage4) && ['zhou-cheng','zhou-yougen'].every(id => state.visited.includes(id)) },
  { stage: 6, when: state => state.stage >= 5 && Boolean(state.choices.stage5) && state.visited.includes('second-book') },
  { stage: 7, when: state => state.stage >= 6 && Boolean(state.choices.stage6) && Boolean(state.passwords.noreturn) && state.visited.includes('final-draft') },
];

// Only truly private/time-based destinations are gated. Everything public stays reachable.
export const gates = {
  'draft-1': state => Boolean(state.passwords.noweekend),
  'final-draft': state => Boolean(state.passwords.noreturn),
  'rescue-result': state => state.stage >= 7,
  'ending': state => state.stage >= 7 && state.visited.includes('rescue-result') && state.interludesSeen.includes('interlude-3-ending'),
};

export const stage1 = {
  brother: {
    name: '周航',
    handle: '@noweekend',
    account: '周末别找我',
  },
  choiceReplies: {
    'small-pot': '我点的“小锅”。老板看我的眼神像我少报了三个人。',
    'avoid-side': '知道。老返程就看一眼，不对就撤。',
    'more-photos': '行。你负责回家以后从两百张树里找重点。',
  },
};
