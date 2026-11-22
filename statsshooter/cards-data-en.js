// The default Unity four-slot build, including its two starting route choices.
// Card names, levels, and availability follow EducationShopCards, EducationDataCards,
// EducationHighVarianceCards, EducationActionCards, and CardText.
window.statsShooterCards = [
  {
    id: 413, name: 'Base Firepower', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Adds 4 base damage per level, up to 12 total.', availability: 'Standard shop stock',
  },
  {
    id: 414, name: 'Fire Rate', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Adds 15% base fire rate per level. Level bonuses add together.', availability: 'Standard shop stock',
  },
  {
    id: 415, name: 'Precision Fire', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Adds 10 percentage points of critical hit chance per level. Critical hits deal double damage.', availability: 'Standard shop stock',
  },
  {
    id: 416, name: 'Light Steps', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Adds 8% base movement speed per level. Level bonuses add together.', availability: 'Standard shop stock',
  },
  {
    id: 417, name: 'Maximum Health', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Each purchase raises maximum health by 1 and immediately restores 1 health.', availability: 'Standard shop stock',
  },
  {
    id: 418, name: 'Guardian Shield', category: 'Basic Card', route: 'General', maxLevel: 1, slots: 0,
    description: 'Gain a shield immediately. It blocks one hit and takes 30 seconds of combat to recharge. Holds one charge.', availability: 'Standard shop stock',
  },
  {
    id: 419, name: 'Self Repair', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'While below full health, restore 1 health every 30, 25, or 20 seconds of combat, depending on level. Reaching full health resets the timer.', availability: 'Standard shop stock',
  },
  {
    id: 420, name: 'Calibration Rate', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Each level cuts the interval between right-click calibrations by 0.05 seconds, from 0.50 down to 0.35 seconds.', availability: 'Standard shop stock',
  },
  {
    id: 424, name: 'Stop Shot', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Move for 1 second, then stop to charge the next damaging volley. It gains 20%, 40%, or 60% damage depending on level. Moving again cancels the charge.', availability: 'Standard shop stock',
  },
  {
    id: 425, name: 'Strong Enemy', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Shots deal 20%, 40%, or 60% extra damage to Wind, Thundercloud, and the Storm Boss, depending on level.', availability: 'Standard shop stock',
  },
  {
    id: 426, name: 'Lucky Drop', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'Each kill has a 10%, 20%, or 30% chance to drop one extra coin for you to collect, depending on level.', availability: 'Standard shop stock',
  },
  {
    id: 427, name: 'Kill Recovery', category: 'Basic Card', route: 'General', maxLevel: 3, slots: 0,
    description: 'While below full health, restore 1 health per 50, 40, or 30 kills, depending on level. Each heal starts an 8-second combat cooldown. Full health resets kill progress.', availability: 'Standard shop stock',
  },
  {
    id: 429, name: 'Battle Record', category: 'Basic Card', route: 'General', maxLevel: 1, slots: 0,
    description: 'After purchase, each kill adds 0.1 percentage points to your damage bonus for the run. The bonus caps at 40% after 400 kills.', availability: 'First 7 shop visits',
  },
  {
    id: 430, name: 'Stop Shot Mastery', category: 'Basic Card', route: 'General', maxLevel: 1, slots: 0,
    description: 'After purchase, every 3 damaging charged stop shots adds 2 percentage points to the Stop Shot bonus, up to 30 extra percentage points per run.', availability: 'Own Stop Shot',
  },
  {
    id: 431, name: 'Flawless Advance', category: 'Basic Card', route: 'General', maxLevel: 1, slots: 0,
    description: 'After purchase, completing a combat segment in which you deal damage and lose no health grants 2% movement speed, up to 10% per run.', availability: 'First 7 shop visits',
  },

  {
    id: 406, name: 'Narrower Sampling', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 0,
    description: 'Choose the automatic rifle. With the mean in 18–22, live variance of 60, 12, or 0.30 or lower unlocks tiers I, II, and III respectively. The rifle can hit 2 enemies at tier I and 3 at tiers II and III. At tier III, piercing retains full damage.', availability: 'Free starting choice',
  },
  {
    id: 400, name: 'Wider Sampling', category: 'Data Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 0,
    description: 'Choose the close-range shotgun. It starts with 5 pellets, a range of 6, and a base shot interval of 0.8 seconds. With the mean in 18–22, reaching a live variance of 140, 240, or 360 upgrades it to 7 pellets, 9 pellets, or a 25-pellet ring.', availability: 'Free starting choice',
  },
  {
    id: 435, name: 'Precision Sampling', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Narrows the raw sampling bands from 12–16 or 24–28 to 16–20 or 20–24. Each band is equally likely. Averaging and Center Compression apply afterward.', availability: 'Rifle route shop stock',
  },
  {
    id: 436, name: 'Eight-measurement Average', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Averages 8 independent draws per observation, reducing theoretical variance to one-eighth of the raw distribution’s variance. The base shot interval is 0.474 seconds. Only one averaging card can be equipped.', availability: 'Rifle route shop stock',
  },
  {
    id: 437, name: '64-measurement Average', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Averages 64 independent draws per observation, reducing theoretical variance to one-sixty-fourth of the raw distribution’s variance. The base shot interval is 0.642 seconds. Only one averaging card can be equipped.', availability: 'Complete 6 combat segments with hits and own Eight-measurement Average',
  },
  {
    id: 438, name: 'Center Compression', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Halves the distance between each new observation and 20, reducing its theoretical variance to one-quarter of the previous value. If an averaging card is equipped, it applies first.', availability: 'Complete 6 combat segments with hits and own Precision Sampling or Eight-measurement Average',
  },
  {
    id: 410, name: 'Concentrated Calibration', category: 'Data Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Right-click to replace one value, prioritizing a return to the valid mean range. With the mean in 18–22, choose the replacement that lowers six-slot variance as much as possible while keeping the mean in range.', availability: 'Rifle route Rule SP',
  },
  {
    id: 439, name: 'Tail Sampling', category: 'Data Card', route: 'High-variance Shotgun', maxLevel: 2, slots: 1,
    description: 'Level I draws from 1–5 or 35–39. Level II draws from 0–2 or 38–40. Both bands are equally likely. The upgrade keeps its existing slot.', availability: 'Level II requires 6 completed combat segments with hits',
  },
  {
    id: 401, name: 'Tail Probability', category: 'Data Card', route: 'High-variance Shotgun', maxLevel: 3, slots: 1,
    description: 'At levels I, II, and III, a draw has a 20%, 40%, or 60% chance to return an endpoint. When it does, 0 and 40 are equally likely.', availability: 'Level III requires 6 completed combat segments with hits',
  },
  {
    id: 421, name: 'Extreme Selection', category: 'Data Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Draws 3 independent candidates for each new observation and keeps the one farthest from 20. Ties are broken at random.', availability: 'Shotgun route shop stock',
  },
  {
    id: 404, name: 'Variance-preserving Calibration', category: 'Data Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Right-click to replace one value, prioritizing a return to the valid mean range. With the mean in 18–22, choose the replacement that raises six-slot variance as much as possible while keeping the mean in range.', availability: 'Shotgun route shop stock',
  },

  {
    id: 408, name: 'Stable Damage', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 3, slots: 0,
    description: 'Adds 25% damage per level while six-slot variance is at most 40. The bonus pauses above that threshold.', availability: 'Rifle route shop stock',
  },
  {
    id: 423, name: 'Consecutive Fire', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 3, slots: 0,
    description: 'Gain a damage stack if the mean is in 18–22 both before firing and after the hit. Each stack adds 1%, 2%, or 3% damage depending on level, up to 10 stacks. An out-of-range mean clears the stacks. Misses keep them.', availability: 'Rifle route shop stock',
  },
  {
    id: 411, name: 'Steady Fire Control', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Activates after 6 consecutive hits with a post-hit mean in 18–22 and variance at most 1. Grants 15% fire rate and converts expected critical damage into a fixed damage bonus. Ends if the mean leaves the range or variance exceeds 2.', availability: 'Theoretical variance of new observations is at most 0.8',
  },
  {
    id: 432, name: 'Piercing Bounty', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'If a tier II or III rifle bullet damages three enemies, two extra coins drop at the third enemy. The effect has a 3-second cooldown.', availability: 'Reach rifle tier II during the run',
  },
  {
    id: 433, name: 'Piercing Echo', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'If a tier II or III rifle bullet damages at least two enemies, fires a piercing follow-up in the same direction 0.15 seconds later. It deals 50% of the triggering shot’s damage and writes no sample.', availability: 'Reach rifle tier II during the run',
  },
  {
    id: 434, name: 'Stop Shock', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Landing a damaging shot within 0.4 seconds of a charged stop creates a shockwave of radius 3. It deals 50% of the ordinary shot’s base damage and knocks back enemies. The boss is immune to knockback.', availability: 'Own Stop Shot on the rifle route',
  },
  {
    id: 450, name: 'Ricochet', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 0,
    description: 'At rifle tier II or III with the mean in 18–22, shots bounce off one wall and keep piercing. Each volley writes up to one sample.', availability: 'Reach rifle tier II this run',
  },
  {
    id: 451, name: 'Double-wall Circuit', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Raises the bounce limit from one to two at rifle tier II or above. Shares one equipped slot with Prism Corridor. Switching between them puts the other card in reserve.', availability: 'Own Ricochet',
  },
  {
    id: 452, name: 'Ricochet Mark', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Bounced hits slow ordinary enemies by 25% for 1 second. Further hits refresh the duration. Bosses are immune. Shares one equipped slot with Wall Afterglow.', availability: 'Own Ricochet',
  },
  {
    id: 453, name: 'Reflection Focus', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'The first damaging hit after a bounce gains 25% damage, once per shot. Shares one equipped slot with Dual Ricochet.', availability: 'Own Ricochet',
  },
  {
    id: 454, name: 'Prism Corridor', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Automatically replaces Double-wall Circuit in its slot. Shots bounce up to five times at live tier III and twice at tier II, returning to five on reaching tier III again. Mark and Focus need their own equipped slots. Each volley writes up to one sample.', availability: 'Reach rifle tier III this run and own Double-wall Circuit and at least one of Ricochet Mark or Reflection Focus. Reserve cards count toward purchase requirements',
  },
  {
    id: 455, name: 'Wall Afterglow', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Replaces Ricochet Mark. Each bounce leaves a radius-1.2 light spot for 1.2 seconds. Ordinary enemies move 25% slower while inside and recover on leaving. Bosses are immune. The replaced card stays in reserve and can be equipped again for free in the shop.', availability: 'Own Prism Corridor and Ricochet Mark. Reserve cards count toward purchase requirements',
  },
  {
    id: 456, name: 'Dual Ricochet', category: 'Mechanism Card', route: 'Low-variance Rifle', maxLevel: 1, slots: 1,
    description: 'Replaces Reflection Focus. Fire a main bolt and a half-damage secondary bolt angled 8° clockwise. Both use the current bounce limit. Each bolt can hit each enemy once, and the combined volley writes up to one sample. The replaced card stays in reserve and can be equipped again for free in the shop.', availability: 'Own Prism Corridor and Reflection Focus. Reserve cards count toward purchase requirements',
  },
  {
    id: 402, name: 'Variance Damage', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 3, slots: 0,
    description: 'Increases direct shotgun damage as live variance rises. Each level adds 10% of base damage per 60 variance.', availability: 'Shotgun route shop stock',
  },
  {
    id: 440, name: 'Wide Scatter', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Widens the fan from 36° to 72° through tier II. At tier III, the 360° ring increases from 25 to 37 pellets.', availability: 'Shotgun route shop stock',
  },
  {
    id: 441, name: 'Centroid Burst', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'When the player’s volley damages at least three distinct enemies, an explosion of radius 3 occurs at the average position of the hits. It deals 100% of the ordinary shot’s base damage and triggers at most once per volley.', availability: 'Shotgun route shop stock',
  },
  {
    id: 443, name: 'Focus Strike', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'If at least 3 pellets and at least 60% of the player’s volley damage the same enemy, deal an extra 150% of the ordinary shot’s base damage. Triggers at most once per volley.', availability: 'Shotgun route shop stock',
  },
  {
    id: 405, name: 'Extreme Clone', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 3, slots: 0,
    description: 'The first purchase grants one clone. The three levels allow up to 1, 10, or 100 clones. Clones copy the current shotgun form at 50% of its direct pellet damage. When the mean returns to 18–22 with variance at least 350, each existing body spawns one clone, up to capacity.', availability: 'Guaranteed in each new shop’s first stock after reaching shotgun tier III, until fully upgraded',
  },
  {
    id: 444, name: 'Sparks', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Shotgun hits ignite enemies for 3 damage per second over 3 seconds, even when the mean is out of range. Burn effects from the player and each clone stack independently.', availability: 'Shotgun route shop stock',
  },
  {
    id: 445, name: 'Ember Sowing', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'With Sparks equipped, pellets leave embers when they strike a wall or reach their maximum range. Moving enemies ignited by pellets also drop them. Each patch has a radius of 0.8 and deals 6 damage every 0.5 seconds for 2.2 seconds. Up to 28 patches can exist at once.', availability: 'Own Sparks',
  },
  {
    id: 446, name: 'Long Burn Fuel', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Equip with Sparks to raise each source’s burn to 8 damage per second for 5 seconds.', availability: 'Own Sparks',
  },
  {
    id: 447, name: 'Ember Revival', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'Equip with Sparks and Ember Sowing to increase ember radius from 0.8 to 1.2 and ember duration from 2.2 to 4 seconds.', availability: 'Own Ember Sowing',
  },
  {
    id: 448, name: 'Ember Sacrifice', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'With Extreme Clone owned and Sparks and Ember Sowing equipped, any body destroyed by a hit leaves embers. These patches inherit Ember Revival if equipped and count toward the limit of 28.', availability: 'Own Ember Sowing and Extreme Clone',
  },
  {
    id: 449, name: 'Intense Embers', category: 'Mechanism Card', route: 'High-variance Shotgun', maxLevel: 1, slots: 1,
    description: 'With Extreme Clone owned, equip with Sparks to raise burn damage to 18 per second for 5 seconds. Long Burn Fuel can then go into reserve.', availability: 'Own Long Burn Fuel and Extreme Clone',
  },
];
