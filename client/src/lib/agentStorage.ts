// ===== Agent Storage — 统一存储模块 =====
// 所有读写都经过这个文件。首次读取localStorage为空时自动填充mock数据。

import type {
  DiaryEntry,
  RoutinePlan,
  RoutineCheckin,
  UserProduct,
} from "./mockAgentData";
import {
  MOCK_DIARY_ENTRIES,
  DEFAULT_ROUTINE_PLAN,
  MOCK_CHECKINS,
  MOCK_SAVED_PRODUCTS,
} from "./mockAgentData";

const KEYS = {
  diary: "xinyan_diary",
  routine: "xinyan_routine",
  checkins: "xinyan_checkins",
  products: "xinyan_products",
  initialized: "xinyan_agent_init",
};

// ===== 初始化 =====
function ensureInit() {
  if (localStorage.getItem(KEYS.initialized)) return;
  localStorage.setItem(KEYS.diary, JSON.stringify(MOCK_DIARY_ENTRIES));
  localStorage.setItem(KEYS.routine, JSON.stringify(DEFAULT_ROUTINE_PLAN));
  localStorage.setItem(KEYS.checkins, JSON.stringify(MOCK_CHECKINS));
  localStorage.setItem(KEYS.products, JSON.stringify(MOCK_SAVED_PRODUCTS));
  localStorage.setItem(KEYS.initialized, "1");
}

function readJSON<T>(key: string, fallback: T): T {
  ensureInit();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ===== 日记 =====
export function getDiaryEntries(): DiaryEntry[] {
  return readJSON<DiaryEntry[]>(KEYS.diary, []);
}

export function saveDiaryEntry(entry: DiaryEntry): void {
  const entries = getDiaryEntries();
  const idx = entries.findIndex((e) => e.date === entry.date);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  entries.sort((a, b) => a.date.localeCompare(b.date));
  writeJSON(KEYS.diary, entries);
}

export function getTodayDiary(): DiaryEntry | null {
  const today = new Date().toISOString().split("T")[0];
  const entries = getDiaryEntries();
  return entries.find((e) => e.date === today) || null;
}

export function getDiaryByDate(date: string): DiaryEntry | null {
  const entries = getDiaryEntries();
  return entries.find((e) => e.date === date) || null;
}

// ===== 护肤方案 =====
export function getRoutinePlan(): RoutinePlan {
  return readJSON<RoutinePlan>(KEYS.routine, DEFAULT_ROUTINE_PLAN);
}

export function saveRoutinePlan(plan: RoutinePlan): void {
  writeJSON(KEYS.routine, plan);
}

// ===== 打卡 =====
export function getCheckins(): RoutineCheckin[] {
  return readJSON<RoutineCheckin[]>(KEYS.checkins, []);
}

export function getTodayCheckin(): RoutineCheckin | null {
  const today = new Date().toISOString().split("T")[0];
  const checkins = getCheckins();
  return checkins.find((c) => c.date === today) || null;
}

export function saveCheckin(checkin: RoutineCheckin): void {
  const checkins = getCheckins();
  const idx = checkins.findIndex((c) => c.date === checkin.date);
  if (idx >= 0) {
    checkins[idx] = checkin;
  } else {
    checkins.push(checkin);
  }
  checkins.sort((a, b) => a.date.localeCompare(b.date));
  writeJSON(KEYS.checkins, checkins);
}

export function getRoutineStats(): {
  streak: number;
  longest: number;
  total: number;
  weekRate: number;
} {
  const checkins = getCheckins();
  const plan = getRoutinePlan();
  const total = checkins.length;

  // Calculate streak (consecutive days ending today or yesterday)
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = checkins.find((c) => c.date === dateStr);
    if (found && (found.amCompleted.length > 0 || found.pmCompleted.length > 0)) {
      streak++;
    } else if (i === 0) {
      // Today might not have checkin yet, skip
      continue;
    } else {
      break;
    }
  }

  // Longest streak
  let longest = 0;
  let current = 0;
  const sortedDates = checkins.map((c) => c.date).sort();
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      current = 1;
    } else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) {
        current++;
      } else {
        current = 1;
      }
    }
    longest = Math.max(longest, current);
  }

  // Week completion rate
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const weekCheckins = checkins.filter((c) => c.date >= thisWeekStart.toISOString().split("T")[0]);
  const totalAmSteps = plan.amSteps.length;
  const totalPmSteps = plan.pmSteps.filter((s) => s.frequency === "daily").length;
  const totalStepsPerDay = totalAmSteps + totalPmSteps;
  let weekCompleted = 0;
  for (const c of weekCheckins) {
    weekCompleted += c.amCompleted.length + c.pmCompleted.length;
  }
  const weekDays = Math.max(1, weekCheckins.length);
  const weekRate = Math.round((weekCompleted / (weekDays * totalStepsPerDay)) * 100);

  return { streak, longest, total, weekRate: Math.min(100, weekRate) };
}

// ===== 已保存产品 =====
export function getSavedProducts(): UserProduct[] {
  return readJSON<UserProduct[]>(KEYS.products, []);
}

export function saveProduct(product: UserProduct): void {
  const products = getSavedProducts();
  products.push(product);
  writeJSON(KEYS.products, products);
}

export function removeProduct(id: string): void {
  const products = getSavedProducts().filter((p) => p.id !== id);
  writeJSON(KEYS.products, products);
}

// ===== 清除所有 Agent 数据 =====
export function clearAgentData(): void {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
