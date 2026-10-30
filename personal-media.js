// Personal photos stay local until the next requested publication.
// Replace or extend each photo list here when new media is selected.
const basketballPhotos = [
  {
    src: 'assets/personal/basketball-cover-selected.jpg',
    alt: 'Yixuan taking a group selfie with her university basketball team on the court.',
    caption: 'With my university basketball team.',
    width: 1707, height: 1280
  },
  {
    src: 'assets/personal/basketball-team.webp',
    alt: 'Our university basketball team together on the indoor court.',
    caption: 'A team photo on our university court.',
    width: 2753, height: 1280
  },
  {
    src: 'assets/personal/basketball-outdoor-team.jpg',
    alt: 'Our basketball team together in front of the blue university basketball competition banner.',
    caption: 'Together at a university basketball competition.',
    width: 1024, height: 764
  },
  {
    src: 'assets/personal/basketball-game-tipoff.jpg',
    alt: 'Players preparing to start a university basketball game on an outdoor court.',
    caption: 'On the court during a university basketball game.',
    width: 1702, height: 1276
  }
];

const volunteerPhotos = [
  {
    src: 'assets/personal/volunteer-group-selected.jpg',
    alt: 'Students and volunteers gathered for a group photo outside the school.',
    caption: 'With students and fellow volunteers at the school.',
    width: 1702, height: 1276
  },
  {
    src: 'assets/personal/volunteer-teaching-selected.jpg',
    alt: 'Yixuan teaching a lesson about weather to a classroom of children.',
    caption: 'Sharing a lesson about weather during volunteer teaching.',
    width: 1280, height: 1707
  }
];

export const personalMedia = {
  portrait: {
    src: 'assets/personal/yixuan-main-selected.png',
    alt: 'Yixuan sitting in a sunlit tram, holding a camera.',
    width: 1122,
    height: 1402
  },
  interests: [
    {
      id: 'basketball',
      title: 'Basketball',
      label: 'On the court',
      detail: 'Team captain · Starting center',
      description: 'I served as captain and starting center of my university’s women’s basketball team, helping organize training and competing with the team in university league games.',
      photo: basketballPhotos[0],
      photos: basketballPhotos
    },
    {
      id: 'volunteer-teaching',
      title: 'Volunteer Teaching',
      label: 'In the classroom',
      detail: '2023–2026 · Deputy team leader in 2026',
      description: 'From 2023 to 2026, I spent each summer volunteering in rural schools and children’s programs. In 2026, I served as deputy team leader, teaching lessons and helping coordinate activities, travel, and supplies.',
      photo: volunteerPhotos[0],
      photos: volunteerPhotos
    }
  ]
};

