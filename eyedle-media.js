// Source documentation, transparent art, and short gameplay demonstrations.
// Image IDs and block IDs are stable in eyedle-document-data.js.
export const eyedleMedia = {
  replacements: {
    'eyedle-image-03': { src: 'assets/eyedle/transparent/core-loop.svg', alt: 'Care, workshop and exploration loop, including the first-routine reward and long-term completion requirements.', width: 1520, height: 980.4 },
    'eyedle-image-12': { src: 'assets/eyedle/transparent/filter-l1.png', alt: 'Filter design — Level 1', width: 1254, height: 1254 },
    'eyedle-image-13': { src: 'assets/eyedle/transparent/filter-l2.png', alt: 'Filter design — Level 2', width: 1254, height: 1254 },
    'eyedle-image-14': { src: 'assets/eyedle/transparent/filter-l3.png', alt: 'Filter design — Level 3', width: 1254, height: 1254 },
    'eyedle-image-15': { src: 'assets/eyedle/transparent/mixer-l1.png', alt: 'Mixer design — Level 1', width: 1254, height: 1254 },
    'eyedle-image-16': { src: 'assets/eyedle/transparent/mixer-l2.png', alt: 'Mixer design — Level 2', width: 1254, height: 1254 },
    'eyedle-image-17': { src: 'assets/eyedle/transparent/mixer-l3.png', alt: 'Mixer design — Level 3', width: 1254, height: 1254 },
    'eyedle-image-18': { src: 'assets/eyedle/transparent/bottler-l1.png', alt: 'Bottler design — Level 1', width: 1254, height: 1254 },
    'eyedle-image-19': { src: 'assets/eyedle/transparent/bottler-l2.png', alt: 'Bottler design — Level 2', width: 1254, height: 1254 },
    'eyedle-image-20': { src: 'assets/eyedle/transparent/bottler-l3.png', alt: 'Bottler design — Level 3', width: 1254, height: 1254 },
  },
  insertions: [
    {
      id: 'worker-search-video', after: 'eyedle-block-053', type: 'video',
      title: 'Worker allocation in action', label: '24 seconds · Gameplay excerpt',
      src: 'uploads/eyedle/search-dispatch-focus.mp4', poster: 'uploads/eyedle/search-dispatch-focus.jpg',
      width: 720, height: 1640, alt: 'Dispatch workers, pause production while both are away, collect a reward, and resume production when a worker returns',
      caption: 'Dispatch → production pause → claim rewards → return to work. Edited prototype footage; the eight-hour wait is skipped and marked on screen.'
    },
    {
      id: 'voice-guidance-video', after: 'eyedle-block-076', type: 'video', wide: true,
      title: 'Audio cues in action', label: '9.6 seconds · Sound on',
      src: 'uploads/eyedle/voice-guidance-natural.mp4', poster: 'uploads/eyedle/voice-guidance-natural.jpg',
      width: 720, height: 800, alt: 'Listen to spoken direction cues while the player moves their eyes and the game responds',
      caption: 'Play with sound to hear the directional prompts. Edited prototype demonstration with simulated sensor input; the game and player footage remain synchronized.'
    },
    {
      id: 'care-focus', after: 'eyedle-block-024', type: 'loop',
      src: 'uploads/eyedle/fresh/care-focus.mp4', poster: 'uploads/eyedle/fresh/care-focus.jpg', gif: 'uploads/eyedle/fresh/care-focus.gif',
      width: 720, height: 870, alt: 'The water drop changes size as near–far focus targets are completed',
      caption: 'Near–far focus shift · Fresh game capture at normal speed, with simulated distance input.'
    },
    {
      id: 'automated-production', after: 'eyedle-block-039', type: 'loop',
      src: 'uploads/eyedle/fresh/automated-production.mp4', poster: 'uploads/eyedle/fresh/automated-production.jpg', gif: 'uploads/eyedle/fresh/automated-production.gif',
      width: 720, height: 1114, alt: 'The upgraded automated line filters, mixes, bottles, and adds finished bottles to storage',
      caption: 'Upgraded automated production line · Fresh game capture at normal speed; all three machines at Level 2 in a staged demo save.'
    },
    {
      id: 'filter-upgrade', after: 'eyedle-section-3-7', type: 'loop',
      src: 'uploads/eyedle/fresh/filter-upgrade-fx.mp4', poster: 'uploads/eyedle/fresh/filter-upgrade-fx.jpg', gif: 'uploads/eyedle/fresh/filter-upgrade-fx.gif',
      width: 828, height: 720, alt: 'Purchase a Level 2 filter with a bounce, expanding glow, sparkles, and a level-up badge',
      caption: 'Filter Level 1 → Level 2 · In-game upgrade animation at normal speed; staged demo balance: 12 → 4 coins.'
    },
    {
      id: 'tracking-recovery', after: 'eyedle-section-4-1', type: 'loop',
      src: 'uploads/eyedle/fresh/tracking-recovery.mp4', poster: 'uploads/eyedle/fresh/tracking-recovery.jpg', gif: 'uploads/eyedle/fresh/tracking-recovery.gif',
      width: 720, height: 870, alt: 'Tracking is lost, progress pauses, then the same care step continues after recovery',
      caption: 'Tracking lost → pause → resume · Fresh game capture at normal speed, with simulated tracking input.'
    }
  ]
};
