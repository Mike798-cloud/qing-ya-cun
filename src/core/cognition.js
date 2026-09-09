function markFlag(store, key) {
  const state = store.getState();
  if (!state.flags[key]) store.dispatch({ type: 'SET_FLAG', key, value: true });
}

export function recordContextualDiscovery({ store, path, query }) {
  const state = store.getState();
  const section = query?.get?.('section') || '';
  const topic = query?.get?.('topic') || '';
  const article = query?.get?.('article') || '';
  const coreView = {
    watchmen: !section || section === 'watchmen',
    safety: (!section || section === 'safety') && !article,
    'news-2017': !section && !article,
    'cache-2017': !section,
    'zhou-cheng': !section || section === '2017',
    'zhou-yougen': !section && !topic,
  };
  // Discovery eligibility follows what the player can already understand,
  // not the hidden chapter number. This matters when a player opens a public
  // source while a chat reply is still pending: if the prerequisite facts are
  // already known, that reading is meaningful and must not be discarded merely
  // because the author-side stage counter has not advanced yet.
  const rules = [
    ['post', Boolean(state.choices.stage1), 'cogLocationPost'],
    ['draft-1', Boolean(state.passwords.noweekend), 'cogLocationDraft'],
    ['watchmen', Boolean(coreView.watchmen) && Boolean(state.flags.cogLocationPost) && Boolean(state.flags.cogLocationDraft), 'cogWatchmen'],
    ['safety', Boolean(coreView.safety) && Boolean(state.flags.cogWatchmen), 'cogSafety'],
    ['news-2017', Boolean(coreView['news-2017']) && Boolean(state.flags.cogSafety), 'cogNews2017'],
    ['cache-2017', Boolean(coreView['cache-2017']) && Boolean(state.flags.cogNews2017) && Boolean(state.flags.nobackFound), 'cogCache2016'],
    ['zhou-cheng', Boolean(coreView['zhou-cheng']) && Boolean(state.flags.cogCache2016), 'cogZhouCheng'],
    ['zhou-yougen', Boolean(coreView['zhou-yougen']) && Boolean(state.flags.cogZhouCheng), 'cogZhouYougen'],
    ['watchman-04-detail', Boolean(state.flags.cogZhouYougen), 'cogWatchmanArchive'],
    ['second-book', Boolean(state.flags.cogWatchmanArchive) && Boolean(state.flags.lookbackFound), 'cogSecondBook'],
    ['aji-comment', state.stage >= 6, 'cogAjiComment'],
    ['final-draft', state.stage >= 6 && Boolean(state.choices.stage6) && Boolean(state.passwords.noreturn), 'cogFinalDraft'],
  ];

  for (const [id, eligible, flag] of rules) {
    if (path === id && eligible) markFlag(store, flag);
  }

  // An early visit is only browsing history, not understanding. Do not silently
  // promote an old page into the current clue chain when the player opens its
  // partner later. Once a question becomes relevant, the player must encounter
  // that source again through the now-meaningful in-world link. Legacy saves are
  // handled separately by backfillLegacyCognition().
}


export function backfillLegacyCognition({ store }) {
  const state = store.getState();
  // These flags were introduced after the original visited-page stage machine.
  // A save that has already reached a later stage has, by definition, passed the
  // corresponding old checks. Restore only facts supported by that save so an
  // existing player never has to reopen historical pages after an update.
  const legacy = [
    ['cogLocationPost', 'post', 2],
    ['cogLocationDraft', 'draft-1', 2],
    ['cogWatchmen', 'watchmen', 3],
    ['cogSafety', 'safety', 3],
    ['cogNews2017', 'news-2017', 4],
    ['cogCache2016', 'cache-2017', 4],
    ['cogZhouCheng', 'zhou-cheng', 5],
    ['cogZhouYougen', 'zhou-yougen', 5],
    ['cogWatchmanArchive', 'watchman-04-detail', 6],
    ['cogSecondBook', 'second-book', 6],
    ['cogAjiComment', 'aji-comment', 6],
    ['cogFinalDraft', 'final-draft', 7],
  ];
  for (const [flag, id, minStage] of legacy) {
    if (state.stage >= minStage && state.visited.includes(id)) markFlag(store, flag);
  }
}

export const storyEventDefinitions = [
  {
    stage: 2,
    ready: state => state.flags.cogWatchmen && state.flags.cogSafety,
    flag: 'stage2MessageReady',
    choice: 'stage2',
    preview: '四号这边不对。',
  },
  {
    stage: 4,
    ready: state => state.flags.cogZhouCheng,
    flag: 'stage4MessageReady',
    choice: 'stage4',
    preview: '你别再往下翻了。',
  },
  {
    stage: 5,
    ready: state => state.flags.cogWatchmanArchive,
    flag: 'stage5MessageReady',
    choice: 'stage5',
    preview: '不要去找第二本。',
  },
  {
    stage: 6,
    ready: state => state.flags.cogAjiComment,
    flag: 'stage6MessageReady',
    choice: 'stage6',
    preview: '别来四号后面。',
  },
];

export function getPendingStoryEvent(state) {
  return storyEventDefinitions.find(def => state.flags[def.flag] && !state.choices[def.choice]) || null;
}
