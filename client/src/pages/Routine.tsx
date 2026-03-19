/*
 * Routine.tsx — 护肤方案 + 打卡
 * Design: Warm Ivory Minimalism — 单栏居中布局
 */
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import SubPageLayout from "@/components/SubPageLayout";
import {
  getRoutinePlan,
  getCheckins,
  getTodayCheckin,
  saveCheckin,
  getRoutineStats,
} from "@/lib/agentStorage";
import type { RoutinePlan, RoutineCheckin } from "@/lib/mockAgentData";

export default function Routine() {
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
    if (new Date().getHours() >= 18) setTab("pm");
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

  return (
    <SubPageLayout
      title="护肤方案"
      subtitle={`${plan.skinType} · ${plan.concerns.join(" · ")}`}
      accentColor="#5A8A5A"
    >
      {/* Stats + Week dots */}
      <div className="card-warm p-4 mb-4 hover-lift">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[16px]">🔥</span>
            <span className="font-display text-[1.2rem] text-clay-gradient">{stats.streak}</span>
            <span className="font-body text-[12px] text-[#7A6E68]">天连续打卡</span>
          </div>
          <span className="font-body text-[12px] text-[#C17B5C] font-medium">{stats.weekRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          {weekDots.map((dot, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-300 ${
                  dot.done ? "bg-[#C17B5C] text-white scale-110 shadow-sm" : "bg-[rgba(237,232,224,0.6)] text-[#B5ADA7]"
                }`}
              >
                {dot.done ? "✓" : ""}
              </div>
              <span className="font-body text-[10px] text-[#B5ADA7]">{dot.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AM/PM Tabs */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setTab("am")}
          className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all duration-300 ${
            tab === "am"
              ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)] shadow-sm"
              : "bg-[rgba(237,232,224,0.4)] text-[#9A8C82] border border-transparent hover:bg-[rgba(237,232,224,0.7)]"
          }`}
        >
          ☀️ 早间 {plan.amSteps.length}步
        </button>
        <button
          onClick={() => setTab("pm")}
          className={`flex-1 py-2.5 rounded-xl font-body text-[13px] font-medium transition-all duration-300 ${
            tab === "pm"
              ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] border border-[rgba(193,123,92,0.25)] shadow-sm"
              : "bg-[rgba(237,232,224,0.4)] text-[#9A8C82] border border-transparent hover:bg-[rgba(237,232,224,0.7)]"
          }`}
        >
          🌙 晚间 {plan.pmSteps.length}步
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex-1 h-2 bg-[rgba(237,232,224,0.6)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out progress-animated"
            style={{
              width: `${progress}%`,
              background: allDone
                ? "linear-gradient(90deg, #4A9A6B, #6BB88A)"
                : "linear-gradient(90deg, #C17B5C, #D4967A)",
            }}
          />
        </div>
        <span className="font-body text-[12px] text-[#7A6E68] font-medium">{completedCount}/{totalDaily}</span>
      </div>

      {/* Steps */}
      <div className="space-y-2 stagger-children">
        {steps.map((step) => {
          const isDone = completed.includes(step.id);
          const isOptional = step.frequency !== "daily";
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`card-warm px-3.5 py-3 cursor-pointer transition-all duration-300 active:scale-[0.98] hover-lift ${isDone ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                    isDone ? "bg-[#C17B5C] border-[#C17B5C] scale-110" : "border-[rgba(193,123,92,0.25)]"
                  }`}
                  style={{ width: 18, height: 18 }}
                >
                  {isDone && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-body text-[13px] font-medium ${isDone ? "line-through text-[#B5ADA7]" : "text-[#2D2420]"}`}>
                      {step.name}
                    </span>
                    {isOptional && (
                      <span className="font-body text-[10px] text-[#B5ADA7] bg-[rgba(237,232,224,0.6)] px-1 py-0.5 rounded">
                        {step.frequency === "weekly2-3" ? "周2-3" : "周1"}
                      </span>
                    )}
                    <span className="font-body text-[11px] text-[#B5ADA7] ml-auto">{step.duration}</span>
                  </div>
                  <p className="font-body text-[11px] text-[#9A8C82] mt-0.5">{step.description}</p>
                  <p className="font-body text-[11px] text-[#C17B5C] mt-0.5">推荐：{step.productRec}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {allDone && (
        <div className="mt-3 text-center py-4 rounded-xl bg-[rgba(74,154,107,0.05)] anim-bounce-in">
          <span className="text-[24px] inline-block anim-float" style={{ animationDuration: '2s' }}>🎉</span>
          <p className="font-body text-[13px] text-[#4A9A6B] font-medium mt-0.5">
            {tab === "am" ? "早间" : "晚间"}护肤已完成！
          </p>
        </div>
      )}

      <button
        onClick={() => toast("方案重新生成功能即将推出")}
        className="w-full mt-3 py-2 rounded-xl font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors border border-[rgba(45,36,32,0.06)]"
      >
        重新生成方案
      </button>
    </SubPageLayout>
  );
}
