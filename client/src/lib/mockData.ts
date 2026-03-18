// ===== Mock Data Layer for 芯颜 AI =====
// ~24 simulated skin analysis records from 2024-11 to 2025-03

export interface SkinMetric {
  label: string;
  score: number;
  status: "优秀" | "良好" | "需改善" | "注意";
  desc: string;
}

export interface AdviceStep {
  step: string;
  title: string;
  body: string;
}

export interface Product {
  name: string;
  brand: string;
  type: string;
  reason: string;
  price: string;
}

export interface SkinRecord {
  id: string;
  date: string;
  score: number;
  tag: "优秀" | "良好" | "需关注";
  summary: string;
  metrics: SkinMetric[];
  advice: AdviceStep[];
  products: Product[];
}

function getStatus(score: number): "优秀" | "良好" | "需改善" | "注意" {
  if (score >= 85) return "优秀";
  if (score >= 70) return "良好";
  if (score >= 60) return "需改善";
  return "注意";
}

function getTag(score: number): "优秀" | "良好" | "需关注" {
  if (score >= 85) return "优秀";
  if (score >= 70) return "良好";
  return "需关注";
}

function makeMetrics(base: number): SkinMetric[] {
  const offsets = [6, -10, -17, -24, -4, 9];
  const labels = ["水分含量", "油脂平衡", "色素均匀度", "毛孔细腻度", "肤色亮度", "弹性紧致度"];
  const descs = [
    "皮肤含水量充足，角质层水润饱满",
    "T区与两颊油脂分泌较为均衡",
    "面部色素分布较为均匀，少量色斑",
    "毛孔状态需要关注，建议定期清洁",
    "整体肤色明亮，光泽感良好",
    "皮肤弹性紧致，胶原蛋白状态良好",
  ];
  return labels.map((label, i) => {
    const s = Math.max(40, Math.min(98, base + offsets[i] + Math.round((Math.random() - 0.5) * 8)));
    return { label, score: s, status: getStatus(s), desc: descs[i] };
  });
}

function makeAdvice(): AdviceStep[] {
  return [
    { step: "01", title: "温和清洁", body: "使用氨基酸洁面乳，早晚各一次。避免过度清洁导致皮肤屏障受损，水温控制在32-36°C之间。" },
    { step: "02", title: "深层补水", body: "洁面后立即使用含透明质酸的精华液，配合化妆水湿敷3-5分钟，帮助肌肤锁住水分。" },
    { step: "03", title: "防晒修护", body: "每日使用SPF50+防晒霜，每2小时补涂一次。晚间使用含烟酰胺的修护面霜，促进肌肤屏障修复。" },
  ];
}

function makeProducts(): Product[] {
  return [
    { name: "氨基酸温和洁面乳", brand: "芙丽芳丝", type: "洁面", reason: "温和不刺激，适合敏感肌日常清洁", price: "¥128" },
    { name: "双萃精华肌底液", brand: "兰蔻", type: "精华", reason: "修护肌肤屏障，提升肌肤弹性与光泽", price: "¥780" },
    { name: "清透防晒乳 SPF50+", brand: "安耐晒", type: "防晒", reason: "轻薄不油腻，高倍防晒持久防护", price: "¥228" },
  ];
}

const summaries = [
  "皮肤整体状态良好，水分充足，建议加强防晒",
  "肤质状态稳定，毛孔略有粗大，注意清洁",
  "皮肤弹性优秀，色素均匀度有待提升",
  "水油平衡良好，建议增加抗氧化护理",
  "整体评分提升，持续保持当前护肤习惯",
  "皮肤状态波动，建议调整作息和饮食",
  "肤色亮度提升明显，补水效果显著",
  "毛孔状态改善，继续使用收敛水",
  "皮肤屏障修复中，避免使用刺激性产品",
  "综合评分优秀，皮肤状态达到近期最佳",
];

// Generate records
const recordDates = [
  "2024-11-05", "2024-11-12", "2024-11-20", "2024-11-28",
  "2024-12-03", "2024-12-10", "2024-12-18", "2024-12-25",
  "2025-01-02", "2025-01-08", "2025-01-15", "2025-01-22", "2025-01-30",
  "2025-02-05", "2025-02-12", "2025-02-19", "2025-02-26",
  "2025-03-03", "2025-03-08", "2025-03-12", "2025-03-15", "2025-03-17", "2025-03-20", "2025-03-25",
];

const scoreProgression = [
  72, 74, 71, 76, 78, 75, 80, 77,
  79, 82, 80, 84, 83,
  81, 85, 82, 86,
  84, 87, 85, 88, 82, 90, 92,
];

export const ALL_RECORDS: SkinRecord[] = recordDates.map((date, i) => {
  const score = scoreProgression[i];
  return {
    id: `rec-${date}`,
    date,
    score,
    tag: getTag(score),
    summary: summaries[i % summaries.length],
    metrics: makeMetrics(score),
    advice: makeAdvice(),
    products: makeProducts(),
  };
});

// Index by date
export const RECORDS_BY_DATE: Record<string, SkinRecord> = {};
ALL_RECORDS.forEach((r) => {
  RECORDS_BY_DATE[r.date] = r;
});

// Get records for a specific month
export function getRecordsForMonth(year: number, month: number): SkinRecord[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  return ALL_RECORDS.filter((r) => r.date.startsWith(prefix));
}

// Get available months (sorted)
export function getAvailableMonths(): { year: number; month: number }[] {
  const set = new Set<string>();
  ALL_RECORDS.forEach((r) => {
    const [y, m] = r.date.split("-");
    set.add(`${y}-${m}`);
  });
  return Array.from(set)
    .sort()
    .map((s) => {
      const [y, m] = s.split("-");
      return { year: parseInt(y), month: parseInt(m) };
    });
}

// Score → terracotta opacity
export function scoreColor(score: number): string {
  const opacity = 0.3 + (score / 100) * 0.6;
  return `rgba(193, 123, 92, ${opacity.toFixed(2)})`;
}

// Tag → Tailwind classes
export function tagStyle(tag: string): string {
  switch (tag) {
    case "优秀":
      return "text-[#C17B5C] bg-[rgba(193,123,92,0.1)]";
    case "良好":
      return "text-[#9A7A50] bg-[rgba(154,122,80,0.1)]";
    case "需关注":
    case "需改善":
      return "text-[#8B6A45] bg-[rgba(139,106,69,0.1)]";
    case "注意":
      return "text-[#9A5E42] bg-[rgba(154,94,66,0.12)]";
    default:
      return "text-[#7A6E68] bg-[rgba(122,110,104,0.1)]";
  }
}

// Status → Tailwind classes
export function statusStyle(status: string): string {
  switch (status) {
    case "优秀":
      return "text-[#C17B5C] bg-[rgba(193,123,92,0.1)]";
    case "良好":
      return "text-[#9A7A50] bg-[rgba(154,122,80,0.1)]";
    case "需改善":
      return "text-[#8B6A45] bg-[rgba(139,106,69,0.1)]";
    case "注意":
      return "text-[#9A5E42] bg-[rgba(154,94,66,0.12)]";
    default:
      return "text-[#7A6E68] bg-[rgba(122,110,104,0.1)]";
  }
}

// Latest record (for Result page default)
export const LATEST_RECORD = ALL_RECORDS[ALL_RECORDS.length - 1];

// Default result record (the one shown after analysis)
export const DEFAULT_RESULT: SkinRecord = {
  id: "rec-default",
  date: new Date().toISOString().split("T")[0],
  score: 82,
  tag: "良好",
  summary: "皮肤整体状态良好，水分充足，建议加强防晒和抗氧化护理",
  metrics: [
    { label: "水分含量", score: 88, status: "优秀", desc: "皮肤含水量充足，角质层水润饱满，保湿工作做得很好" },
    { label: "油脂平衡", score: 72, status: "良好", desc: "T区与两颊油脂分泌较为均衡，轻微出油属正常范围" },
    { label: "色素均匀度", score: 65, status: "需改善", desc: "面部色素分布不够均匀，两颊有轻微色斑，建议加强美白护理" },
    { label: "毛孔细腻度", score: 58, status: "注意", desc: "鼻翼两侧毛孔略有粗大，建议定期深层清洁和使用收敛产品" },
    { label: "肤色亮度", score: 78, status: "良好", desc: "整体肤色明亮有光泽，气色良好，继续保持防晒习惯" },
    { label: "弹性紧致度", score: 91, status: "优秀", desc: "皮肤弹性紧致度极佳，胶原蛋白状态良好，年轻态保持优秀" },
  ],
  advice: makeAdvice(),
  products: makeProducts(),
};
