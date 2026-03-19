/*
 * Routine.tsx — 护肤方案 + 打卡
 * Design: Warm Ivory Minimalism
 * 顶部：打卡统计 → AM/PM tab → 步骤列表 → 完成按钮
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import {
  getRoutinePlan,
  getCheckins,
  getTodayCheckin,
  saveCheckin,
  getRoutineStats,
} from "@/lib/agentStorage";
import type { RoutinePlan, RoutineCheckin } from "@/lib/mockAgentData";

export default function Routine() {
  const [, setLocation] = useLocation();
  const [plan, setPlan] = useState<RoutinePlan | null>(null);
  const [tab, setTab] = useState<"am" | "pm">("am");
  const [todayCheckin, setTodayCheckin] = useState<RoutineCheckin>({ date: "", amCompleted: [], pmCompleted: [] });
  const [stats, setStats] = useState({ streak: 0, longest: 0, total: 0, weekRate: 0 });

  useEffect(() => {
    const p = getRoutinePlan();
    setPlan(p);
    const today = new Date().toISOString().split("T")[0];
    const existing = getTodayCheckin();
    setTodayCheckin(existing || { date: today, amCompleted: [], pmCompleted: [] });
    setStats(getRoutineStats());

    // Auto-select PM tab if it's after 6pm
    const hour = new Date().getHours();
    if (hour >= 18) setTab("pm");
  }, []);

  const steps = useMemo(() => {
    if (!plan) return [];
    return tab === "am" ? plan.amSteps : plan.pmSteps;
  }, [plan, tab]);

  const completed = tab === "am" ? todayCheckin.amCompleted : todayCheckin.pmCompleted;
  const totalDaily = steps.filter((s) => s.frequency === "daily").length;
  const completedCount = completed.length;
  const progress = totalDaily > 0 ? Math.round((completedCount / totalDaily) * 100) : 0;

  const toggleStep = (stepId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const newCheckin = { ...todayCheckin, date: today };
    if (tab === "am") {
      newCheckin.amCompleted = completed.includes(stepId)
        ? completed.filter((id) => id !== stepId)
        : [...completed, stepId];
    } else {
      newCheckin.pmCompleted = completed.includes(stepId)
        ? completed.filter((id) => id !== stepId)
        : [...completed, stepId];
    }
    setTodayCheckin(newCheckin);
    saveCheckin(newCheckin);
    setStats(getRoutineStats());
  };

  const allDone = completedCount >= totalDaily;

  // ===== Week dots =====
  const weekDots = useMemo(() => {
    const checkins = getCheckins();
    const dots: { day: string; done: boolean }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
      const found = checkins.find((c) => c.date === dateStr);
      dots.push({
        day: dayNames[d.getDay()],
        done: !!found && (found.amCompleted.length > 0 || found.pmCompleted.length > 0),
      });
    }
    return dots;
  }, [stats]);

  if (!plan) return null;

  const StatsCard = () => (
    <div className="card-warm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">🔥</span>
          <div>
            <span className="font-display text-[1.5rem] text-clay-gradient">{stats.streak}</span>
            <span className="font-body text-[13px] text-[#7A6E68] ml-1">天连续打卡</span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-body text-[12px] text-[#B5ADA7]">方案完成率</p>
          <p className="font-body text-[14px] text-[#C17B5C] font-medium">{stats.weekRate}%</p>
        </div>
      </div>
      {/* Week dots */}
      <div className="flex items-center justify-between">
        {weekDots.map((dot, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${
                dot.done
                  ? "bg-[#C17B5C] text-white"
                  : "bg-[rgba(237,232,224,0.6)] text-[#B5ADA7]"
              }`}
            >
              {dot.done ? "✓" : ""}
            </div>
            <span className="font-body text-[12px] text-[#B5ADA7]">{dot.day}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const StepsList = () => (
    <div className="space-y-2.5">
      {steps.map((step) => {
        const isDone = completed.includes(step.id);
        const isOptional = step.frequency !== "daily";
        return (
          <div
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={`card-warm px-4 py-3.5 cursor-pointer transition-all active:scale-[0.98] ${
              isDone ? "opacity-60" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isDone
                    ? "bg-[#C17B5C] border-[#C17B5C]"
                    : "border-[rgba(193,123,92,0.3)]"
                }`}
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-body text-[14px] font-medium ${isDone ? "line-through text-[#B5ADA7]" : "text-[#2D2420]"}`}>
                    {step.name}
                  </span>
                  {isOptional && (
                    <span className="font-body text-[12px] text-[#B5ADA7] bg-[rgba(237,232,224,0.6)] px-1.5 py-0.5 rounded">
                      {step.frequency === "weekly2-3" ? "周2-3次" : "周1次"}
                    </span>
                  )}
                  <span className="font-body text-[12px] text-[#B5ADA7] ml-auto">{step.duration}</span>
                </div>
                <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">{step.description}</p>
                <p className="font-body text-[12px] text-[#B5ADA7] mt-1 italic">💡 {step.tips}</p>
                <p className="font-body text-[12px] text-[#C17B5C] mt-0.5">推荐：{step.productRec}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ProgressBar = () => (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-2 bg-[rgba(237,232,224,0.6)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: allDone
              ? "linear-gradient(90deg, #4A9A6B, #6BB88A)"
              : "linear-gradient(90deg, #C17B5C, #D4967A)",
          }}
        />
      </div>
      <span className="font-body text-[13px] text-[#7A6E68] font-medium w-12 text-right">
        {completedCount}/{totalDaily}
      </span>
    </div>
  );

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="md:hidden min-h-[100dvh] flex flex-col bg-background">
        <header className="flex items-center gap-3 px-5 pt-[env(safe-area-inset-top,12px)] pb-2 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-1 text-[#7A6E68]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span className="font-body text-[13px]">返回</span>
          </button>
          <div className="flex-1 flex justify-center"><Logo size="sm" /></div>
          <div className="w-14" />
        </header>

        <div className="px-5 pt-2 anim-fade-up">
          <h1 className="font-display text-[1.3rem] text-[#2D2420]">护肤方案</h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">
            {plan.skinType} · {plan.concerns.join(" · ")}
          </p>
        </div>

        <div className="px-5 mt-4 anim-fade-up d-100">
          <StatsCard />
        </div>

        {/* AM/PM Tabs */}
        <div className="px-5 mt-4 anim-fade-up d-200">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTab("am")}
              className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all ${
                tab === "am"
                  ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)]"
                  : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82] border border-transparent"
              }`}
            >
              ☀️ 早间 {plan.amSteps.length}步
            </button>
            <button
              onClick={() => setTab("pm")}
              className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all ${
                tab === "pm"
                  ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)]"
                  : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82] border border-transparent"
              }`}
            >
              🌙 晚间 {plan.pmSteps.length}步
            </button>
          </div>

          <ProgressBar />
          <StepsList />

          {allDone && (
            <div className="mt-4 text-center py-4 rounded-xl" style={{ background: "rgba(74,154,107,0.06)" }}>
              <span className="text-[24px]">🎉</span>
              <p className="font-body text-[14px] text-[#4A9A6B] font-medium mt-1">
                {tab === "am" ? "早间" : "晚间"}护肤已完成！
              </p>
            </div>
          )}

          <button
            onClick={() => toast("方案重新生成功能即将推出")}
            className="w-full mt-4 py-2.5 rounded-xl font-body text-[13px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors"
            style={{ border: "1px solid rgba(45,36,32,0.08)" }}
          >
            重新生成方案
          </button>
        </div>

        <div className="pb-tabbar" />
        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex page-locked flex-col">
        <header className="flex items-center justify-between px-8 lg:px-12 py-4 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2"><Logo /></button>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors">返回首页</button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className="w-[40%] overflow-y-auto px-8 lg:px-12 py-6">
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mb-1 anim-fade-up">护肤方案</h1>
            <p className="font-body text-[13px] text-[#9A8C82] mb-6 anim-fade-up d-100">
              {plan.skinType} · {plan.concerns.join(" · ")}
            </p>
            <div className="anim-fade-up d-200"><StatsCard /></div>
          </div>

          <div className="w-px bg-[rgba(45,36,32,0.06)]" />

          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6">
            <div className="flex gap-2 mb-4 anim-fade-up d-300">
              <button
                onClick={() => setTab("am")}
                className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all ${
                  tab === "am"
                    ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)]"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82] border border-transparent"
                }`}
              >
                ☀️ 早间 {plan.amSteps.length}步
              </button>
              <button
                onClick={() => setTab("pm")}
                className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all ${
                  tab === "pm"
                    ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)]"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82] border border-transparent"
                }`}
              >
                🌙 晚间 {plan.pmSteps.length}步
              </button>
            </div>
            <div className="anim-fade-up d-400">
              <ProgressBar />
              <StepsList />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
