// ===== Mock Agent Data =====
// 14天日记 + 默认护肤方案 + 12天打卡记录 + 3个已保存产品 + 6个预置热门产品

// ===== 类型定义 =====
export interface DiaryEntry {
  id: string;
  date: string; // "2025-03-19"
  mood: 1 | 2 | 3 | 4 | 5;
  issues: string[];
  habits: {
    sleep: "less6" | "6to8" | "more8";
    water: "less4" | "4to8" | "more8";
    stress: "low" | "medium" | "high";
    exercise: "none" | "light" | "moderate";
    period: boolean | null;
  };
  note: string;
  createdAt: number;
}

export interface RoutineStep {
  id: string;
  order: number;
  name: string;
  description: string;
  duration: string;
  tips: string;
  productRec: string;
  frequency: "daily" | "weekly2-3" | "weekly1";
  isRequired: boolean;
}

export interface RoutinePlan {
  id: string;
  skinType: string;
  concerns: string[];
  amSteps: RoutineStep[];
  pmSteps: RoutineStep[];
  createdAt: string;
}

export interface RoutineCheckin {
  date: string;
  amCompleted: string[];
  pmCompleted: string[];
}

export interface UserProduct {
  id: string;
  name: string;
  brand: string;
  ingredientText: string;
  keyIngredients: string[];
  savedAt: number;
}

export interface PresetProduct {
  name: string;
  brand: string;
  ingredientText: string;
  keyIngredients: string[];
}

export const SKIN_ISSUES = [
  "出油", "干燥", "泛红", "发痘", "暗沉",
  "毛孔粗大", "脱皮", "黑眼圈", "浮肿",
];

export const MOOD_EMOJIS: Record<number, string> = {
  1: "😣",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

export const MOOD_LABELS: Record<number, string> = {
  1: "很差",
  2: "较差",
  3: "一般",
  4: "不错",
  5: "很好",
};

// ===== 14天日记 Mock 数据 (3月6日-3月18日) =====
// 设计模式: 连续高压力+出油, 睡眠不足+暗沉, 运动日状态好
export const MOCK_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: "diary-0306",
    date: "2026-03-06",
    mood: 3,
    issues: ["出油", "毛孔粗大"],
    habits: { sleep: "6to8", water: "4to8", stress: "medium", exercise: "none", period: null },
    note: "今天T区出油比较明显",
    createdAt: Date.now() - 13 * 86400000,
  },
  {
    id: "diary-0307",
    date: "2026-03-07",
    mood: 4,
    issues: ["出油"],
    habits: { sleep: "more8", water: "more8", stress: "low", exercise: "light", period: null },
    note: "周末睡了个好觉，皮肤状态不错",
    createdAt: Date.now() - 12 * 86400000,
  },
  {
    id: "diary-0308",
    date: "2026-03-08",
    mood: 4,
    issues: [],
    habits: { sleep: "more8", water: "more8", stress: "low", exercise: "moderate", period: null },
    note: "去跑了步，出了一身汗，感觉皮肤透亮了",
    createdAt: Date.now() - 11 * 86400000,
  },
  {
    id: "diary-0309",
    date: "2026-03-09",
    mood: 3,
    issues: ["出油", "暗沉"],
    habits: { sleep: "6to8", water: "4to8", stress: "medium", exercise: "none", period: null },
    note: "周一开始上班，压力有点大",
    createdAt: Date.now() - 10 * 86400000,
  },
  {
    id: "diary-0310",
    date: "2026-03-10",
    mood: 2,
    issues: ["出油", "发痘", "暗沉"],
    habits: { sleep: "less6", water: "less4", stress: "high", exercise: "none", period: null },
    note: "加班到很晚，额头冒了一颗痘",
    createdAt: Date.now() - 9 * 86400000,
  },
  {
    id: "diary-0311",
    date: "2026-03-11",
    mood: 2,
    issues: ["出油", "发痘", "黑眼圈"],
    habits: { sleep: "less6", water: "less4", stress: "high", exercise: "none", period: null },
    note: "连续加班，黑眼圈好重",
    createdAt: Date.now() - 8 * 86400000,
  },
  {
    id: "diary-0312",
    date: "2026-03-12",
    mood: 3,
    issues: ["出油", "发痘"],
    habits: { sleep: "6to8", water: "4to8", stress: "high", exercise: "none", period: null },
    note: "痘痘还没消，压力还是大",
    createdAt: Date.now() - 7 * 86400000,
  },
  {
    id: "diary-0313",
    date: "2026-03-13",
    mood: 3,
    issues: ["出油"],
    habits: { sleep: "6to8", water: "4to8", stress: "medium", exercise: "light", period: null },
    note: "下班后散了个步，心情好一点",
    createdAt: Date.now() - 6 * 86400000,
  },
  {
    id: "diary-0314",
    date: "2026-03-14",
    mood: 4,
    issues: [],
    habits: { sleep: "more8", water: "more8", stress: "low", exercise: "moderate", period: null },
    note: "周末去健身房了，皮肤感觉很通透",
    createdAt: Date.now() - 5 * 86400000,
  },
  {
    id: "diary-0315",
    date: "2026-03-15",
    mood: 5,
    issues: [],
    habits: { sleep: "more8", water: "more8", stress: "low", exercise: "light", period: null },
    note: "今天状态超好！连续两天早睡效果明显",
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: "diary-0316",
    date: "2026-03-16",
    mood: 4,
    issues: ["干燥"],
    habits: { sleep: "6to8", water: "less4", stress: "medium", exercise: "none", period: null },
    note: "今天忘记喝水了，脸有点干",
    createdAt: Date.now() - 3 * 86400000,
  },
  {
    id: "diary-0317",
    date: "2026-03-17",
    mood: 3,
    issues: ["干燥", "泛红"],
    habits: { sleep: "6to8", water: "less4", stress: "medium", exercise: "none", period: null },
    note: "连续两天喝水少，皮肤有点泛红",
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: "diary-0318",
    date: "2026-03-18",
    mood: 4,
    issues: ["出油"],
    habits: { sleep: "6to8", water: "4to8", stress: "low", exercise: "light", period: null },
    note: "开始注意补水了，状态恢复中",
    createdAt: Date.now() - 1 * 86400000,
  },
];

// ===== 默认护肤方案 =====
export const DEFAULT_ROUTINE_PLAN: RoutinePlan = {
  id: "plan-default",
  skinType: "混合偏油",
  concerns: ["出油", "毛孔粗大", "暗沉"],
  amSteps: [
    {
      id: "am-1",
      order: 1,
      name: "温和洁面",
      description: "使用氨基酸洁面乳清洁面部",
      duration: "1-2分钟",
      tips: "用温水打湿面部，轻柔打圈按摩，避免用力拉扯",
      productRec: "芙丽芳丝净润洗面霜",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "am-2",
      order: 2,
      name: "爽肤水",
      description: "拍打爽肤水帮助后续吸收",
      duration: "30秒",
      tips: "倒在手心轻拍至吸收，不要用化妆棉擦拭以减少摩擦",
      productRec: "黛珂紫苏水",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "am-3",
      order: 3,
      name: "精华液",
      description: "使用美白或抗氧化精华",
      duration: "1分钟",
      tips: "取2-3滴在掌心，按压涂抹全脸，重点涂抹暗沉区域",
      productRec: "修丽可CE精华",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "am-4",
      order: 4,
      name: "面霜",
      description: "使用清爽型面霜锁住水分",
      duration: "30秒",
      tips: "取黄豆大小，从内向外涂抹，T区可以少量",
      productRec: "珂润润浸保湿面霜",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "am-5",
      order: 5,
      name: "防晒",
      description: "涂抹足量防晒霜",
      duration: "30秒",
      tips: "用量一元硬币大小，出门前15分钟涂抹，每2小时补涂",
      productRec: "安耐晒小金瓶",
      frequency: "daily",
      isRequired: true,
    },
  ],
  pmSteps: [
    {
      id: "pm-1",
      order: 1,
      name: "卸妆",
      description: "使用卸妆油/膏彻底卸除防晒和彩妆",
      duration: "2-3分钟",
      tips: "干手干脸按摩乳化，确保防晒彻底卸除",
      productRec: "植村秀琥珀卸妆油",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-2",
      order: 2,
      name: "洁面",
      description: "二次清洁，确保毛孔干净",
      duration: "1-2分钟",
      tips: "温和打圈，重点清洁T区和鼻翼两侧",
      productRec: "芙丽芳丝净润洗面霜",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-3",
      order: 3,
      name: "化妆水",
      description: "调理肌肤pH值，为后续护肤打底",
      duration: "30秒",
      tips: "可以用化妆棉湿敷3分钟加强补水",
      productRec: "SK-II神仙水",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-4",
      order: 4,
      name: "功效精华",
      description: "使用抗衰或修护精华",
      duration: "1分钟",
      tips: "晚间是皮肤修复黄金期，可使用功效性更强的精华",
      productRec: "兰蔻小黑瓶",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-5",
      order: 5,
      name: "眼霜",
      description: "涂抹眼霜预防眼周细纹",
      duration: "30秒",
      tips: "用无名指轻点按压，从内眼角到外眼角",
      productRec: "雅诗兰黛小棕瓶眼霜",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-6",
      order: 6,
      name: "面霜",
      description: "使用滋润型面霜封层锁水",
      duration: "30秒",
      tips: "晚间可以用比早间更滋润的面霜",
      productRec: "珂润润浸保湿面霜",
      frequency: "daily",
      isRequired: true,
    },
    {
      id: "pm-7",
      order: 7,
      name: "面膜",
      description: "每周2-3次补水面膜",
      duration: "15-20分钟",
      tips: "敷完后轻拍至吸收，不需要洗掉精华",
      productRec: "春雨蜂蜜面膜",
      frequency: "weekly2-3",
      isRequired: false,
    },
  ],
  createdAt: "2026-03-07",
};

// ===== 12天打卡记录 =====
export const MOCK_CHECKINS: RoutineCheckin[] = Array.from({ length: 12 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (12 - i));
  const dateStr = d.toISOString().split("T")[0];
  const amAll = DEFAULT_ROUTINE_PLAN.amSteps.map((s) => s.id);
  const pmAll = DEFAULT_ROUTINE_PLAN.pmSteps.filter((s) => s.frequency === "daily").map((s) => s.id);

  // 模拟不完美的打卡: 有些天漏掉1-2步
  let amCompleted = [...amAll];
  let pmCompleted = [...pmAll];
  if (i % 4 === 0) amCompleted = amAll.slice(0, -1); // 漏掉防晒
  if (i % 3 === 0) pmCompleted = pmAll.slice(0, -1); // 漏掉面霜

  return { date: dateStr, amCompleted, pmCompleted };
});

// ===== 3个已保存产品 =====
export const MOCK_SAVED_PRODUCTS: UserProduct[] = [
  {
    id: "saved-1",
    name: "小黑瓶精华肌底液",
    brand: "兰蔻",
    ingredientText: "二裂酵母发酵产物, 透明质酸, 腺苷, 维生素E, 甘油",
    keyIngredients: ["二裂酵母发酵产物", "透明质酸", "腺苷", "维生素E"],
    savedAt: Date.now() - 7 * 86400000,
  },
  {
    id: "saved-2",
    name: "神仙水",
    brand: "SK-II",
    ingredientText: "半乳糖酵母样菌发酵产物滤液, 丁二醇, 苯氧乙醇, 烟酰胺",
    keyIngredients: ["半乳糖酵母样菌发酵产物滤液", "烟酰胺"],
    savedAt: Date.now() - 5 * 86400000,
  },
  {
    id: "saved-3",
    name: "CE精华",
    brand: "修丽可",
    ingredientText: "维生素C, 维生素E, 阿魏酸, 透明质酸",
    keyIngredients: ["维生素C", "维生素E", "阿魏酸"],
    savedAt: Date.now() - 3 * 86400000,
  },
];

// ===== 6个预置热门产品 =====
export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    name: "小黑瓶精华肌底液",
    brand: "兰蔻",
    ingredientText: "二裂酵母发酵产物溶胞物, 水, 双丙甘醇, 甘油, 变性乙醇, 碳酸二辛酯, 透明质酸钠, 腺苷, 苯氧乙醇, 生育酚(维生素E), 黄原胶, 丁二醇, 辛甘醇, 棕榈酰三肽-1, 棕榈酰四肽-7, 水解大豆蛋白, 酵母提取物",
    keyIngredients: ["二裂酵母发酵产物", "透明质酸", "腺苷", "维生素E", "胜肽", "酒精"],
  },
  {
    name: "神仙水",
    brand: "SK-II",
    ingredientText: "半乳糖酵母样菌发酵产物滤液, 丁二醇, 戊二醇, 水, 苯甲酸钠, 甲基异噻唑啉酮, 柠檬酸, 烟酰胺",
    keyIngredients: ["半乳糖酵母样菌发酵产物滤液", "烟酰胺", "丁二醇"],
  },
  {
    name: "CE精华",
    brand: "修丽可",
    ingredientText: "水, 乙氧基二甘醇, 抗坏血酸(15%维生素C), 丙二醇, 甘油, 月桂醇硫酸酯钠, 阿魏酸, 生育酚(维生素E), 泛醇, 透明质酸钠, 苯氧乙醇",
    keyIngredients: ["维生素C", "阿魏酸", "维生素E", "透明质酸", "泛醇"],
  },
  {
    name: "B5修复霜",
    brand: "理肤泉",
    ingredientText: "水, 矿物油, 甘油, 泛醇(维生素B5), 角鲨烷, 硬脂醇, 鲸蜡醇, 蔗糖硬脂酸酯, 卡波姆, 积雪草苷, 羟基积雪草苷, 积雪草酸, 透明质酸钠, 尿囊素, 苯氧乙醇",
    keyIngredients: ["泛醇", "角鲨烷", "积雪草提取物", "透明质酸", "尿囊素"],
  },
  {
    name: "小白瓶精华液",
    brand: "OLAY",
    ingredientText: "水, 烟酰胺(5%), 甘油, 丁二醇, 聚二甲基硅氧烷, 泛醇, 生育酚乙酸酯(维生素E), 透明质酸钠, 尿囊素, 苯氧乙醇, EDTA二钠",
    keyIngredients: ["烟酰胺", "泛醇", "维生素E", "透明质酸", "尿囊素"],
  },
  {
    name: "润浸保湿面霜",
    brand: "珂润",
    ingredientText: "水, 甘油, 鲸蜡醇, 硬脂醇, 角鲨烷, 神经酰胺NP, 神经酰胺AP, 神经酰胺EOP, 胆固醇, 尿囊素, 桉叶提取物, 苯氧乙醇, 对羟基苯甲酸酯",
    keyIngredients: ["神经酰胺", "角鲨烷", "胆固醇", "尿囊素"],
  },
];
