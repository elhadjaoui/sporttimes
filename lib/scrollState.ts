// Shared scroll state — updated by ScrollTrigger in section components,
// read by R3F scenes inside useFrame (which runs outside React's render
// cycle so a plain mutable object is the right shape here).

export const scrollState = {
  /** 0 → 1 as the hero section scrolls from "locked in viewport" to
   *  "fully scrolled past." Drives the hero camera dolly + pitch level-out. */
  heroProgress: 0,
  /** 0 → 1 for the whole page. */
  pageProgress: 0,
};
