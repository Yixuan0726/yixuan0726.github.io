// 对应 Unity 默认四槽玩法。ID、等级、卡名与供货条件来自 EducationShopCards、
// EducationDataCards、EducationHighVarianceCards、EducationActionCards 和 CardText。
// 路线入口也列入卡表。恢复生命和吸金币属于独立的商店补给。
window.statsShooterCards = [
  {
    id: 413, name: '基础火力', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每级增加 4 点基础伤害，三级共增加 12 点。', availability: '常规商店',
  },
  {
    id: 414, name: '发射频率', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每级增加 15% 基础射速，各级加成相加。', availability: '常规商店',
  },
  {
    id: 415, name: '精准射击', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每级增加 10 个百分点的暴击率。暴击造成双倍伤害。', availability: '常规商店',
  },
  {
    id: 416, name: '轻装步伐', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每级增加 8% 基础移速，各级加成相加。', availability: '常规商店',
  },
  {
    id: 417, name: '生命上限', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每次购买增加 1 点生命上限，并立即恢复 1 点生命。', availability: '常规商店',
  },
  {
    id: 418, name: '守护屏障', category: '基础卡', route: '通用', maxLevel: 1, slots: 0,
    description: '立即获得一层护盾，抵挡一次伤害后消耗。消耗后经过 30 秒战斗时间恢复，最多一层。', availability: '常规商店',
  },
  {
    id: 419, name: '自我修复', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '未满血时每经过 30／25／20 秒战斗时间恢复 1 点生命，间隔随等级缩短。满血时重置计时。', availability: '常规商店',
  },
  {
    id: 420, name: '校准提频', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每级将两次右键校准的间隔缩短 0.05 秒，从 0.50 秒降至最低 0.35 秒。', availability: '常规商店',
  },
  {
    id: 424, name: '急停射击', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '持续移动 1 秒后停下蓄能。下一轮造成伤害的射击获得 20%／40%／60% 增伤。再次移动会取消蓄能。', availability: '常规商店',
  },
  {
    id: 425, name: '强敌克星', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '对风、雷云和风暴 Boss 的射击伤害提高 20%／40%／60%。', availability: '常规商店',
  },
  {
    id: 426, name: '幸运掉落', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '每次击杀分别以 10%／20%／30% 的概率额外掉落 1 枚金币，拾取后入账。', availability: '常规商店',
  },
  {
    id: 427, name: '击杀恢复', category: '基础卡', route: '通用', maxLevel: 3, slots: 0,
    description: '未满血时累计击杀 50／40／30 个敌人可恢复 1 点生命。每次恢复后有 8 秒战斗冷却，满血清空进度。', availability: '常规商店',
  },
  {
    id: 429, name: '战斗履历', category: '基础卡', route: '通用', maxLevel: 1, slots: 0,
    description: '购买后每击杀一个敌人，本局伤害加成增加 0.1 个百分点，累计 400 次击杀后封顶于 40%。', availability: '前 7 次商店',
  },
  {
    id: 430, name: '急停熟练', category: '基础卡', route: '通用', maxLevel: 1, slots: 0,
    description: '购买后每 3 次蓄能急停射击造成伤害，急停增伤增加 2 个百分点，本局最多额外增加 30 个百分点。', availability: '拥有急停射击',
  },
  {
    id: 431, name: '无伤推进', category: '基础卡', route: '通用', maxLevel: 1, slots: 0,
    description: '购买后，每完成一段造成过伤害且未损失生命的战斗，移速增加 2%，本局最多增加 10%。', availability: '前 7 次商店',
  },

  {
    id: 406, name: '收窄采样', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 0,
    description: '选择自动步枪。均值在 18–22 时，六格实际方差降至 60／12／0.30 即可进入Ⅰ／Ⅱ／Ⅲ档，依次贯穿 2 敌、3 敌、3 敌且穿透不减伤。', availability: '开局免费选择',
  },
  {
    id: 400, name: '扩大采样', category: '数据卡', route: '高方差霰弹', maxLevel: 1, slots: 0,
    description: '选择近战霰弹枪，初始 5 弹，射程 6，基础射击间隔 0.8 秒。均值在 18–22 时，六格实际方差达到 140／240／360 即可升为 7 弹、9 弹、25 弹环射。', availability: '开局免费选择',
  },
  {
    id: 435, name: '精密采样', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '将新原始取数由 12–16 或 24–28 收窄到 16–20 或 20–24。两侧机会相同，随后再应用平均或中心收缩。', availability: '稳定路线商店',
  },
  {
    id: 436, name: '八次平均', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '每组独立取 8 个数后求平均，理论方差为原始分布的 1/8。基础射击间隔 0.474 秒，与六十四次平均互斥。', availability: '稳定路线商店',
  },
  {
    id: 437, name: '六十四次平均', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '每组独立取 64 个数后求平均，理论方差为原始分布的 1/64。基础射击间隔 0.642 秒，与八次平均互斥。', availability: '完成 6 段有实际命中的战斗，并拥有八次平均',
  },
  {
    id: 438, name: '中心收缩', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '把新观测到 20 的距离减半，处理后的理论方差变为原来的 1/4。有平均卡时先平均，再收缩。', availability: '完成 6 段有实际命中的战斗，并拥有精密采样或八次平均',
  },
  {
    id: 410, name: '集中校准', category: '数据卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '右键替换一格，优先修复失效均值。均值有效时，在保持 18–22 的方案中尽量降低六格方差。', availability: '稳定路线规则 SP',
  },
  {
    id: 439, name: '两端采样', category: '数据卡', route: '高方差霰弹', maxLevel: 2, slots: 1,
    description: 'Ⅰ级从 1–5 或 35–39 取数，Ⅱ级改为 0–2 或 38–40，两侧机会相同。升级沿用原槽位。', availability: 'Ⅱ级需完成 6 段有实际命中的战斗',
  },
  {
    id: 401, name: '尾部概率', category: '数据卡', route: '高方差霰弹', maxLevel: 3, slots: 1,
    description: 'Ⅰ／Ⅱ／Ⅲ级分别有 20%／40%／60% 概率改取端点 0 或 40。触发时两个端点机会相同。', availability: 'Ⅲ级需完成 6 段有实际命中的战斗',
  },
  {
    id: 421, name: '极值筛选', category: '数据卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '每个新观测独立抽取 3 个候选，只保留离 20 最远的一个。距离相同时随机选取。', availability: '霰弹路线商店',
  },
  {
    id: 404, name: '保差校准', category: '数据卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '右键替换一格，优先修复失效均值。均值有效时，在保持 18–22 的方案中尽量提高六格方差。', availability: '霰弹路线商店',
  },

  {
    id: 408, name: '稳定增伤', category: '机制卡', route: '稳定步枪', maxLevel: 3, slots: 0,
    description: '六格方差不超过 40 时，每级提高 25% 伤害。超过门槛时加成暂停。', availability: '稳定路线商店',
  },
  {
    id: 423, name: '连贯射击', category: '机制卡', route: '稳定步枪', maxLevel: 3, slots: 0,
    description: '开火前和命中后均值都在 18–22 时叠一层增伤，最多 10 层，每层按等级提供 1%／2%／3% 伤害。均值出界清空，打空保留。', availability: '稳定路线商店',
  },
  {
    id: 411, name: '稳态火控', category: '机制卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '连续 6 次命中后均值在 18–22、方差不超过 1 时启动。射速提高 15%，暴击期望转为固定增伤。均值出界或方差大于 2 时退出。', availability: '当前构筑的新观测理论方差不超过 0.8',
  },
  {
    id: 432, name: '贯穿赏金', category: '机制卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: 'Ⅱ档及以上步枪的一发子弹伤害三名敌人时，在第三个敌人处额外掉落 2 枚金币，冷却 3 秒。', availability: '本局步枪曾达到Ⅱ档',
  },
  {
    id: 433, name: '贯穿回响', category: '机制卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: 'Ⅱ档及以上步枪的一发子弹伤害至少两名敌人时，延迟 0.15 秒沿原方向追加一发 50% 伤害的穿透弹。追加弹不写入观测。', availability: '本局步枪曾达到Ⅱ档',
  },
  {
    id: 434, name: '急停震爆', category: '机制卡', route: '稳定步枪', maxLevel: 1, slots: 1,
    description: '蓄能急停后 0.4 秒内射击命中并造成伤害时，在角色周围产生半径 3 的冲击波，造成普通单发基底的 50% 伤害并击退敌人。Boss 免疫击退。', availability: '稳定路线且拥有急停射击',
  },
  {
    id: 402, name: '方差增伤', category: '机制卡', route: '高方差霰弹', maxLevel: 3, slots: 0,
    description: '霰弹直伤随六格实际方差增加。每 60 方差，每级增加 10% 基础伤害。', availability: '霰弹路线商店',
  },
  {
    id: 440, name: '广域散射', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '初始至Ⅱ档的扇面由 36° 扩大到 72°。Ⅲ档保持 360° 环射，弹丸由 25 增至 37。', availability: '霰弹路线商店',
  },
  {
    id: 441, name: '重心震爆', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '本体一轮射击伤害至少三名不同敌人时，在这些命中位置的平均坐标处引爆。半径 3，伤害为普通单发基底的 100%，每轮最多触发一次。', availability: '霰弹路线商店',
  },
  {
    id: 443, name: '集中重击', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '本体一轮射击中，至少 3 颗弹丸且不少于全部弹丸的 60% 对同一敌人造成伤害时，追加普通单发基底 150% 的伤害。每轮最多触发一次。', availability: '霰弹路线商店',
  },
  {
    id: 405, name: '极值分身', category: '机制卡', route: '高方差霰弹', maxLevel: 3, slots: 0,
    description: '首购获得 1 只同步分身，三个等级的分身上限为 1／10／100 只。分身复制当前霰弹形态，弹丸为本体对应直伤的 50%。均值回到 18–22 且方差至少 350 时，现有每个身体各生成一只分身，直至上限。', availability: '本局霰弹曾达Ⅲ档后，每间新商店首次货架必供未满级强化',
  },
  {
    id: 444, name: '火花', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '霰弹命中点燃目标，每秒造成 3 点伤害，持续 3 秒。均值出界时依然可点燃。本体和分身的燃烧各自叠加。', availability: '霰弹路线商店',
  },
  {
    id: 445, name: '余烬播撒', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '装备火花后，弹丸撞墙或到达射程尽头时留下余烬，移动的燃烧敌人也会掉落余烬。半径 0.8，每 0.5 秒造成 6 点伤害，持续 2.2 秒，最多 28 处。', availability: '拥有火花',
  },
  {
    id: 446, name: '延烧燃料', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '与火花同时装备时，每个来源的燃烧提高到每秒 8 点伤害，持续 5 秒。', availability: '拥有火花',
  },
  {
    id: 447, name: '余烬复燃', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '装备火花和余烬播撒时，余烬半径从 0.8 扩大到 1.2，持续时间从 2.2 秒延长到 4 秒。', availability: '拥有余烬播撒',
  },
  {
    id: 448, name: '弃体留火', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '拥有极值分身并装备火花和余烬播撒时，任何身体受击消失都会在原地留下余烬。余烬继承复燃效果，计入 28 处上限。', availability: '拥有余烬播撒和极值分身',
  },
  {
    id: 449, name: '烈性火种', category: '机制卡', route: '高方差霰弹', maxLevel: 1, slots: 1,
    description: '拥有极值分身并与火花同时装备时，燃烧提高至每秒 18 点伤害，持续 5 秒。购买后可把延烧燃料放回备用。', availability: '拥有延烧燃料和极值分身',
  },
];
