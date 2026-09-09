export function isFinalDraftNoticeEligible(state) {
  return Boolean(
    state
    && state.stage >= 6
    && state.choices?.stage6
    && !state.passwords?.noreturn
    && !state.flags?.finalDraftNoticeDismissed
    && !state.flags?.finalDraftNoticeAcknowledged
  );
}

export function shouldAcknowledgeFinalDraftNotice(path, state) {
  return path === 'profile' && isFinalDraftNoticeEligible(state);
}
