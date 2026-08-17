export function reducedMotionRequested(search = window.location.search): boolean {
  return new URLSearchParams(search).get('motion') === 'reduce';
}

export function shouldReduceMotion(): boolean {
  return reducedMotionRequested() || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
