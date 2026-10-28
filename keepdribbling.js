// Case study assembled from the author's design documents, CV and Unity project.
// Local source notes and version differences are recorded in README.md.
export const keepDribbling = {
  id: 'keepdribbling', number: '01', name: 'KeepDribbling',
  collaboration: 'solo', category: 'BASKETBALL × NARRATIVE', color: 'orange',
  tagline: 'Fall. Pick it up. Keep going.',
  description: 'A basketball runner about finding your way back after injury.',
  overview: 'KeepDribbling is a single-player narrative basketball runner about returning to play after injury. Players keep the ball moving through two stages of obstacles, timed reactions, and physical confrontation before taking a final shot. Dropping the ball interrupts that momentum: players must go back, retrieve it, and continue.',
  role: 'Solo game designer & developer',
  context: ['Unity · C# · Blender', 'Browser & Windows', 'Single-player'],
  contributions: [
    'Designed and developed the gameplay, level progression, narrative systems, UI, and final shooting sequence.',
    'Implemented dribbling, lane changes, obstacle encounters, and quick-time events. Connected completion time, turnovers, and the final shot to five endings.',
    'Integrated a Hyper3D-generated base character, then manually rigged it and worked on its animation in Blender.'
  ],
  cover: 'assets/keepdribbling/start-screen.jpg',
  coverAlt: 'KeepDribbling start screen with the title, a basketball court, and Start and Exit buttons',
  coverType: 'screenshot', coverWidth: 1920, coverHeight: 1080,
  coverCaption: 'KeepDribbling — in-game start screen.',
  webBuild: 'games/keepdribbling/index.html',
  tags: ['Game design', 'Solo project'],
  video: 'https://vimeo.com/1195910124', videoLabel: 'Watch on Vimeo',
  videoFile: 'uploads/keepdribbling-gameplay.mp4',
  videoPoster: 'assets/keepdribbling/stage-two.jpg',
  videoCaption: 'Full gameplay walkthrough · 5:52 · two stages, the final shot, and an ending.',
  download: 'https://github.com/Yixuan0726/yixuan0726.github.io/releases/download/keepdribbling-demo-v1/keepdribbling-windows.zip', downloadLabel: 'Download Windows demo',
  downloadNote: 'Windows · ZIP, 140 MB. Extract the whole folder, then open KeepDribbling.exe.',
  documentation: 'uploads/keepdribbling-portfolio.pdf',
  documentPreview: true,
  playable: null, gallery: [],
  caseStudy: [
    {
      id: 'concept', nav: 'Design idea', kicker: '01 / Design intention', title: 'Make the setback playable.',
      quote: 'How can the interruption, repetition, and uncertainty of recovery become part of the player’s actions?',
      paragraphs: [
        'I built the game around maintaining possession, reading threats, and recovering the ball after a mistake. A turnover interrupts progress without ending the journey. Returning for the ball makes persistence something the player does.',
        'Temple Run informed the continuous movement and obstacle-reading structure. Basketball added possession and the rhythm of dribbling. Shaolin Soccer inspired exaggerated physical encounters: slimes, oversized training dummies, and martial artists make pressure visible, sometimes absurd, and playable.'
      ]
    },
    {
      id: 'gameplay', nav: 'Core loop', kicker: '02 / Core interaction', title: 'Keep possession. Recover your rhythm.',
      steps: [
        { title: 'Read', text: 'Notice the approaching obstacle and the space available.' },
        { title: 'Respond', text: 'Change lanes or complete the on-screen timing prompt.' },
        { title: 'Recover', text: 'After a turnover, move back toward the loose ball.' },
        { title: 'Continue', text: 'Regain possession and carry that momentum forward.' }
      ],
      paragraphs: [
        'A/D or the left/right arrow keys move between lanes. Quick-time events (QTEs) ask the player to react within a timing window. Successful responses give feedback; a Perfect response can provide a temporary speed increase.',
        'The first stage introduces fixed input associations. The second adds randomized prompts, moving opponents, and combined actions. The same basic goal — keep the ball — demands progressively different decisions.'
      ]
    },
    {
      id: 'stage-one', nav: 'Stage 01', kicker: '03 / Level design', title: 'Stage 01 — Rebuilding control.',
      paragraphs: ['The first stage translates internal hesitation and physical limitations into obstacles. Each encounter introduces a readable response before those responses appear in changing sequences.'],
      image: { src: 'assets/keepdribbling/stage-one.jpg', alt: 'KeepDribbling first stage with a dribbling player, slime obstacle, and tutorial prompt', caption: 'Stage 01: an obstacle introduction connects an action prompt with the recovery theme.' },
      encounters: [
        { name: 'Slime', action: 'Respond to the timing prompt to pass; a missed response causes a turnover.', meaning: 'The hesitation between intending a movement and trusting the body to perform it.' },
        { name: 'Practice dummy', action: 'Complete a single timing response. Failure interrupts the run and requires ball retrieval.', meaning: 'A familiar drill becomes demanding when confidence in ordinary movement has been lost.' },
        { name: 'Large training dummy', action: 'Commit to the prompt as an oversized obstacle approaches.', meaning: 'Anticipated physical contact grows into an exaggerated threat.' },
        { name: 'Push board', action: 'Move into the open lane. The board covers two lanes, so a single lane change may not be enough.', meaning: 'A decision to change direction must be supported by a deliberate movement.' },
        { name: 'Floor spikes', action: 'Read the blocked lane and move sideways before reaching it.', meaning: 'Discomfort and hesitation interrupt progress even as confidence begins to return.' }
      ]
    },
    {
      id: 'stage-two', nav: 'Stage 02', kicker: '04 / Level design', title: 'Stage 02 — Facing outside pressure.',
      paragraphs: ['The second stage shifts attention toward opponents and environmental interference. Familiar reactions become sequences that require anticipation, timing, and control of space.'],
      image: { src: 'assets/keepdribbling/two-step-dodge.jpg', alt: 'KeepDribbling second-stage Undercut tutorial showing a martial artist and instructions for a two-step evasion', caption: 'The Undercut introduces a two-step response: notice the threat, then time the evasion.' },
      encounters: [
        { name: 'The Undercut', action: 'Complete two prompts: first notice the approaching threat, then wait for the next cue and evade the kick. A wrong or missed response causes a turnover.', meaning: 'An opponent’s lower-body movement demands sustained attention, rather than one reflex.' },
        { name: 'Elbow defender', action: 'Use the defender’s delayed lane tracking to create separation. If still aligned at the attack point, respond to a QTE to withstand the encounter.', meaning: 'The player can create space through movement or react when contact cannot be avoided.' },
        { name: 'Smoker', action: 'Move to the outer lane opposite the smoker and use Shift for a burst. Hitting the smoker causes a turnover; remaining in the middle without a burst slows the player.', meaning: 'An external disturbance breaks the rhythm and asks the player to identify a safe route.' }
      ]
    },
    {
      id: 'pacing', nav: 'Teaching & pacing', kicker: '05 / Teaching through play', title: 'Introduce, repeat, combine.',
      paragraphs: [
        'Tutorial encounters pause the run and bring the obstacle into focus, pairing instructions with narrative context. After the individual mechanics are introduced, randomized encounters test recognition and execution.',
        'Obstacle spacing decreases with progression. The second stage uses wider minimum spacing to allow its longer, multi-step actions to resolve before the next encounter demands attention.',
        'Repetition supports the theme: the player keeps returning to the task of regaining control. I designed this as a metaphor for persistence, with the obstacles carrying the narrative through interaction.'
      ]
    },
    {
      id: 'final-shot', nav: 'Final shot', kicker: '06 / The final encounter', title: 'Bring the journey back to the court.',
      paragraphs: ['The runner sequence leads to a final shooting encounter. A defender, a visible countdown, and the need to regain possession place the accumulated pressure into one basketball situation. The outcome of this stage is considered alongside the run’s time and turnovers.'],
      image: { src: 'assets/keepdribbling/final-shot.jpg', alt: 'KeepDribbling final shooting stage showing the player, a defender, the hoop, and a countdown', caption: 'The final shooting stage — the player returns to a basketball court under time pressure.' }
    },
    {
      id: 'endings', nav: 'Five endings', kicker: '07 / Narrative system', title: 'Five ways to read the journey.',
      paragraphs: ['I used the final shot, time, and turnovers to move beyond a single win-or-lose result. Each ending offers a different interpretation of effort, imperfection, and persistence.'],
      endings: [
        { name: 'Standard', theme: 'Accepting imperfect growth.', condition: 'Make the final shot within the time budget with 1–5 turnovers.' },
        { name: '99%', theme: 'Effort does not guarantee the final result.', condition: 'Finish without making the final shot, regardless of the earlier run.' },
        { name: 'Devil’s Bargain', theme: 'Persistence can become destructive.', condition: 'Make the final shot within the time budget with more than 5 turnovers.' },
        { name: 'Anomaly', theme: 'Progress can happen at a different pace.', condition: 'Make the final shot after the time budget, with at least one turnover.' },
        { name: 'Hidden: TAS', theme: 'The tension of an unattainable ideal.', condition: 'Make the final shot with zero turnovers. This takes priority over the time-based endings.' }
      ],
      note: 'The current default time budget is 7 minutes. A missed final shot is evaluated first, followed by zero turnovers, overtime, and then turnover count.'
    },
    {
      id: 'development', nav: 'Development', kicker: '08 / Making the game', title: 'From individual scripts to shared systems.',
      paragraphs: [
        'As my first game project, KeepDribbling began with level-specific behavior and hardcoded values spread across scripts. Repeated logic made shared adjustments difficult, so I refactored recurring behavior into common C# base classes.',
        'Obstacle provides shared behavior; Trap handles QTE encounters; LaneObstacle handles lane collision rules. Specialized obstacles extend those foundations with two-step prompts, delayed lane tracking, or smoke-specific movement effects.',
        'For the character, I generated a base model with Hyper3D, then manually rigged it and worked on the animations in Blender. Skeleton setup, animation curves, and integration remained substantial parts of the production work.'
      ]
    },
    {
      id: 'reflection', nav: 'Reflection', kicker: '09 / Reflection', title: 'What I would carry forward.',
      paragraphs: [
        'The character movement still has stiffness. Although hesitation can be read alongside the recovery theme, animation quality remains an area to refine. This project taught me to distinguish an expressive intention from a production limitation.',
        'Generating a base asset did not remove the work of rigging, animation, and integration. In future projects, I would prototype movement and camera behavior with simpler assets earlier, reserve more time for animation refinement, and build shared behavior before expanding the obstacle set.'
      ]
    }
  ]
};
