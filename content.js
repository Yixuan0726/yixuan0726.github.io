// Add finished documents to dist/uploads/ and set their relative paths here.
// Use paths such as 'uploads/eyedle.pdf' without a leading slash for GitHub Pages.
// Empty contact, document, video, playable, and gallery fields stay hidden.
// The résumé slot stays visible; add a PDF path to activate its links.
// KeepDribbling and The Grand Gamble use real game captures.
import { keepDribbling } from './keepdribbling.js';
export const portfolio = {
  name: 'Yixuan Yu',
  firstName: 'Yixuan',
  role: 'Game designer',
  introduction: 'I’m a game designer with a background in statistics. I turn personal experiences and abstract ideas into playful systems, exploring how players navigate uncertainty, respond to setbacks, and find their own rhythm through play.',
  about: [
    "I’m Yixuan Yu, a game designer with a background in statistics. My undergraduate studies at Capital University of Economics and Business in Beijing shape how I think about probability, uncertainty, and decision-making. In game design, I’m interested in making these ideas tangible through the choices players make.",
    "I’m curious about how people make sense of a game—what they notice, what they try, and how they find their own way to play. I enjoy questioning my assumptions and discovering how small changes in rules or feedback can lead to different experiences.",
    "Beyond making games, basketball is a big part of my life. I’ve served as captain and starting center of my university’s women’s basketball team. I’ve also spent four summers volunteering in rural schools and children’s programs, teaching lessons and helping organize activities."
  ],
  email: null,
  resume: null, // Optional PDF preview; keep the source Word download below.
  resumeWord: 'uploads/yixuan-yu-cv.docx',
  projects: [
    keepDribbling,
    {
      id: 'eyedle', number: '02', name: 'EyeDle',
      collaboration: 'solo',
      category: 'EYE INTERACTION × IDLE', color: 'green',
      tagline: 'A game that gives your eyes a break.',
      description: 'An eye-driven care station exploring a gentler rhythm of play.',
      cover: 'assets/eyedle/cover/cover-poster.png',
      coverVideo: 'assets/eyedle/cover/cover-loop.mp4',
      coverWidth: 1200, coverHeight: 750,
      coverAlt: 'A resting blue droplet in a hand-painted wooden workshop, with mint bottles on a conveyor',
      tags: ['Interaction design', 'Solo project'],
      documentation: null, video: null, playable: null, gallery: []
    },
    {
      id: 'statsshooter', number: '03', name: 'StatsShooter',
      collaboration: 'solo',
      category: 'STATISTICS × SHOOTER', color: 'purple',
      tagline: 'The odds are part of the arsenal.',
      description: 'A top-down shooter that turns statistical decisions into action.',
      cover: 'assets/cover-stats.svg', coverAlt: 'Graphic illustration of a lavender die and a crosshair',
      tags: ['Systems design', 'Solo project'],
      documentation: null, video: null, playable: null, gallery: []
    },
    {
      id: 'the-grand-gamble', number: '04', name: 'The Grand Gamble',
      collaboration: 'team',
      category: 'BLUFFING × CARD GAME', color: 'teal',
      tagline: 'A turn-based game of masks and bluffs.',
      role: 'Lead designer, programmer & scene builder',
      description: 'A turn-based bluffing card game against three AI opponents, with masks at stake in each round.',
      context: ['January 2026', '5-person team', 'Unity · C#'],
      contributions: [
        'Led game design, programmed the turn flow and AI bluffing decisions, and built the game scenes.',
        'Designed four AI decision states around cards, remaining masks, and personality. Used mask loss to raise the stakes of bluffing.'
      ],
      cover: 'assets/grand-gamble/gameplay.png', coverAlt: 'The Grand Gamble gameplay: the player selects cards against three AI opponents around a wooden table',
      coverType: 'screenshot', coverWidth: 1920, coverHeight: 1080,
      coverCaption: 'Gameplay capture — player turn.',
      tags: ['Team project', 'Global Game Jam 2026'],
      projectPage: 'https://globalgamejam.org/games/2026/grand-gamble-7',
      projectPageLabel: 'View GGJ entry',
      documentation: null, video: null, playable: null,
      galleryTitle: 'Gameplay', galleryType: 'screenshots',
      gallery: [
        { src: 'assets/grand-gamble/challenge.png', alt: 'The Grand Gamble gameplay after playing a card, with the next AI opponent deciding whether to challenge', caption: 'After a card is played, the next opponent decides whether to challenge.' }
      ]
    }
  ]
};
