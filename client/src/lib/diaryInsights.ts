// ===== 日记洞察规则引擎 — 6 条规则 =====

import type { DiaryEntry } from "./mockAgentData";

export interface Insight {
  type: "warning" | "pattern" | "positive" | "suggestion";
  icon: string;
  title: string;
  body: string;
}

// 至少需要 3 天数据才生成洞察
const MIN_DAYS = 3;

export function generateInsights(entries: DiaryEntry[]): Insight[] {
  if (entries.length < MIN_DAYS) return [];

  const insights: Insight[] = [];
  const recent7 = entries.slice(-7);
  const recent3 = entries.slice(-3);

  // 规则1: 连续 N 天同一皮肤问题 → 警告
  const issueCounts: Record<string, number> = {};
  for (const e of recent7) {
    for (const issue of e.issues) {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    }
  }
  for (const [issue, count] of Object.entries(issueCounts)) {
    if (count >= 3) {
      insights.push({
        type: "warning",
        icon: "⚠️",
        title: `连续${count}天出现${issue}`,
        body: `最近7天中有${count}天记录了"${issue}"问题，建议关注并调整护肤方案，必要时咨询皮肤科医生。`,
      });
    }
  }

  // 规则2: 高压力 + 发痘关联 → 模式发现
  const highStressDays = recent7.filter((e) => e.habits.stress === "high");
  const acneDays = recent7.filter((e) => e.issues.includes("发痘"));
  if (highStressDays.length >= 2 && acneDays.length >= 2) {
    const overlap = recent7.filter(
      (e) => e.habits.stress === "high" && e.issues.includes("发痘")
    ).length;
    if (overlap >= 1) {
      insights.push({
        type: "pattern",
        icon: "🔍",
        title: "压力与痘痘存在关联",
        body: "数据显示高压力日与发痘日高度重合。压力会刺激皮脂腺分泌，建议通过运动、冥想等方式缓解压力。",
      });
    }
  }

  // 规则3: 睡眠不足 → 皮肤状态下降关联
  const poorSleepDays = recent7.filter((e) => e.habits.sleep === "less6");
  const lowMoodDays = recent7.filter((e) => e.mood <= 2);
  if (poorSleepDays.length >= 2 && lowMoodDays.length >= 1) {
    insights.push({
      type: "pattern",
      icon: "😴",
      title: "睡眠不足影响皮肤状态",
      body: `最近7天有${poorSleepDays.length}天睡眠不足6小时，与皮肤状态评分下降相关。充足睡眠是皮肤修复的关键时间。`,
    });
  }

  // 规则4: 整体趋势向好 → 正面鼓励
  if (recent7.length >= 5) {
    const firstHalf = recent7.slice(0, Math.floor(recent7.length / 2));
    const secondHalf = recent7.slice(Math.floor(recent7.length / 2));
    const avgFirst = firstHalf.reduce((s, e) => s + e.mood, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((s, e) => s + e.mood, 0) / secondHalf.length;
    if (avgSecond > avgFirst && avgSecond >= 3.5) {
      insights.push({
        type: "positive",
        icon: "🎉",
        title: "皮肤状态持续改善",
        body: "近期皮肤状态评分呈上升趋势，说明你的护肤习惯正在发挥作用，继续保持！",
      });
    }
  }

  // 规则5: 饮水不足 + 干燥关联 → 建议
  const lowWaterDays = recent7.filter((e) => e.habits.water === "less4");
  const dryDays = recent7.filter((e) => e.issues.includes("干燥"));
  if (lowWaterDays.length >= 2 && dryDays.length >= 1) {
    insights.push({
      type: "suggestion",
      icon: "💧",
      title: "饮水不足可能导致干燥",
      body: `最近有${lowWaterDays.length}天饮水不足4杯，与皮肤干燥问题相关。建议每天饮水8杯以上，保持皮肤水润。`,
    });
  }

  // 规则6: 运动与皮肤状态正相关 → 正面鼓励
  const exerciseDays = recent7.filter(
    (e) => e.habits.exercise === "moderate" || e.habits.exercise === "light"
  );
  if (exerciseDays.length >= 3) {
    const exerciseAvgMood =
      exerciseDays.reduce((s, e) => s + e.mood, 0) / exerciseDays.length;
    if (exerciseAvgMood >= 3.5) {
      insights.push({
        type: "positive",
        icon: "🏃",
        title: "运动让皮肤更好",
        body: "运动日的皮肤状态评分明显高于非运动日。适度运动促进血液循环，有助于皮肤新陈代谢。",
      });
    }
  }

  return insights;
}

export function insightTypeColor(type: Insight["type"]): string {
  switch (type) {
    case "warning":
      return "#C0392B";
    case "pattern":
      return "#C17B5C";
    case "positive":
      return "#4A9A6B";
    case "suggestion":
      return "#5B8DB8";
    default:
      return "#7A6E68";
  }
}

export function insightTypeBg(type: Insight["type"]): string {
  switch (type) {
    case "warning":
      return "rgba(192, 57, 43, 0.06)";
    case "pattern":
      return "rgba(193, 123, 92, 0.06)";
    case "positive":
      return "rgba(74, 154, 107, 0.06)";
    case "suggestion":
      return "rgba(91, 141, 184, 0.06)";
    default:
      return "rgba(122, 110, 104, 0.06)";
  }
}
