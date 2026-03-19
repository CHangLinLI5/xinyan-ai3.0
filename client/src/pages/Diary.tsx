/*
 * Diary.tsx — 皮肤日记
 * Design: Warm Ivory Minimalism
 * 移动端：上半表单 + 下半趋势/洞察/历史
 * 桌面端：左栏表单，右栏趋势+洞察+历史（page-locked 双栏）
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import {
  getDiaryEntries,
  saveDiaryEntry,
  getTodayDiary,
} from "@/lib/agentStorage";
import {
  SKIN_ISSUES,
  MOOD_EMOJIS,
  MOOD_LABELS,
  type DiaryEntry,
} from "@/lib/mockAgentData";
import { generateInsights, insightTypeColor, insightTypeBg } from "@/lib/diaryInsights";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Diary() {
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<DiaryEntry | null>(null);

  // Form state
  const [mood, setMood] = useState<number>(3);
  const [issues, setIssues] = useState<string[]>([]);
  const [sleep, setSleep] = useState<"less6" | "6to8" | "more8">("6to8");
  const [water, setWater] = useState<"less4" | "4to8" | "more8">("4to8");
  const [stress, setStress] = useState<"low" | "medium" | "high">("low");
  const [exercise, setExercise] = useState<"none" | "light" | "moderate">("none");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const all = getDiaryEntries();
    setEntries(all);
    const today = getTodayDiary();
    if (today) {
      setTodayEntry(today);
      setMood(today.mood);
      setIssues(today.issues);
      setSleep(today.habits.sleep);
      setWater(today.habits.water);
      setStress(today.habits.stress);
      setExercise(today.habits.exercise);
      setNote(today.note);
      setSaved(true);
    }
  }, []);

  const insights = useMemo(() => generateInsights(entries), [entries]);
  const recent7 = useMemo(() => entries.slice(-7), [entries]);

  const toggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
    setSaved(false);
  };

  const handleSave = () => {
    const entry: DiaryEntry = {
      id: `diary-${todayStr()}`,
      date: todayStr(),
      mood: mood as 1 | 2 | 3 | 4 | 5,
      issues,
      habits: { sleep, water, stress, exercise, period: null },
      note,
      createdAt: Date.now(),
    };
    saveDiaryEntry(entry);
    setTodayEntry(entry);
    setEntries(getDiaryEntries());
    setSaved(true);
    toast.success("今日日记已保存");
  };

  // ===== Form Section =====
  const FormSection = () => (
    <div className="space-y-5">
      {/* Mood Selector */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] mb-2.5 font-medium">今日皮肤状态</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((m) => (
            <button
              key={m}
              onClick={() => { setMood(m); setSaved(false); }}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all ${
                mood === m
                  ? "bg-[rgba(193,123,92,0.12)] border border-[rgba(193,123,92,0.3)]"
                  : "bg-[rgba(237,232,224,0.5)] border border-transparent hover:border-[rgba(193,123,92,0.15)]"
              }`}
            >
              <span className="text-[22px]">{MOOD_EMOJIS[m]}</span>
              <span className="font-body text-[12px]" style={{ color: mood === m ? "#C17B5C" : "#B5ADA7" }}>
                {MOOD_LABELS[m]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Issues Multi-select */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] mb-2.5 font-medium">皮肤问题（可多选）</p>
        <div className="flex flex-wrap gap-2">
          {SKIN_ISSUES.map((issue) => (
            <button
              key={issue}
              onClick={() => toggleIssue(issue)}
              className={`px-3 py-1.5 rounded-full text-[13px] font-body transition-all ${
                issues.includes(issue)
                  ? "bg-[#C17B5C] text-white"
                  : "bg-[rgba(237,232,224,0.6)] text-[#7A6E68] hover:bg-[rgba(193,123,92,0.1)]"
              }`}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* Habits */}
      <div className="space-y-3">
        <p className="font-body text-[13px] text-[#7A6E68] font-medium">生活习惯</p>

        {/* Sleep */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-[#9A8C82] w-12 shrink-0">睡眠</span>
          <div className="flex gap-1.5 flex-1">
            {([["less6", "<6h"], ["6to8", "6-8h"], ["more8", "8h+"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setSleep(val); setSaved(false); }}
                className={`flex-1 py-1.5 rounded-lg text-[12px] font-body transition-all ${
                  sleep === val
                    ? "bg-[rgba(193,123,92,0.15)] text-[#C17B5C] font-medium"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Water */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-[#9A8C82] w-12 shrink-0">饮水</span>
          <div className="flex gap-1.5 flex-1">
            {([["less4", "<4杯"], ["4to8", "4-8杯"], ["more8", "8杯+"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setWater(val); setSaved(false); }}
                className={`flex-1 py-1.5 rounded-lg text-[12px] font-body transition-all ${
                  water === val
                    ? "bg-[rgba(193,123,92,0.15)] text-[#C17B5C] font-medium"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Stress */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-[#9A8C82] w-12 shrink-0">压力</span>
          <div className="flex gap-1.5 flex-1">
            {([["low", "低"], ["medium", "中"], ["high", "高"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setStress(val); setSaved(false); }}
                className={`flex-1 py-1.5 rounded-lg text-[12px] font-body transition-all ${
                  stress === val
                    ? "bg-[rgba(193,123,92,0.15)] text-[#C17B5C] font-medium"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise */}
        <div className="flex items-center gap-2">
          <span className="font-body text-[13px] text-[#9A8C82] w-12 shrink-0">运动</span>
          <div className="flex gap-1.5 flex-1">
            {([["none", "无"], ["light", "轻度"], ["moderate", "中度"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => { setExercise(val); setSaved(false); }}
                className={`flex-1 py-1.5 rounded-lg text-[12px] font-body transition-all ${
                  exercise === val
                    ? "bg-[rgba(193,123,92,0.15)] text-[#C17B5C] font-medium"
                    : "bg-[rgba(237,232,224,0.5)] text-[#9A8C82]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] mb-2 font-medium">备注</p>
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setSaved(false); }}
          placeholder="记录今天皮肤的感受..."
          className="w-full h-20 px-3 py-2.5 rounded-xl text-[13px] font-body text-[#2D2420] placeholder:text-[#B5ADA7] resize-none focus:outline-none focus:ring-1 focus:ring-[rgba(193,123,92,0.3)]"
          style={{ background: "rgba(237,232,224,0.5)", border: "1px solid rgba(45,36,32,0.06)" }}
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-body text-[14px] font-medium transition-all ${
          saved
            ? "bg-[rgba(74,154,107,0.1)] text-[#4A9A6B]"
            : "btn-primary w-full"
        }`}
      >
        {saved ? "✓ 已保存" : todayEntry ? "更新今日日记" : "保存今日日记"}
      </button>
    </div>
  );

  // ===== Right Panel: Trend + Insights + History =====
  const RightPanel = () => (
    <div className="space-y-5">
      {/* 7-Day Mood Trend */}
      <div className="card-warm p-4">
        <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-3">7日情绪趋势</p>
        {recent7.length > 0 ? (
          <div className="flex items-end gap-1 h-24">
            {recent7.map((e) => {
              const h = (e.mood / 5) * 100;
              const dayLabel = e.date.slice(5).replace("-", "/");
              return (
                <div key={e.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[14px]">{MOOD_EMOJIS[e.mood]}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                    <div
                      className="w-3/4 rounded-t-md transition-all"
                      style={{
                        height: `${h}%`,
                        background: `rgba(193,123,92,${0.2 + (e.mood / 5) * 0.5})`,
                      }}
                    />
                  </div>
                  <span className="font-body text-[12px] text-[#B5ADA7]">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-body text-[13px] text-[#B5ADA7] text-center py-6">暂无数据</p>
        )}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="space-y-2.5">
          <p className="font-body text-[13px] text-[#7A6E68] font-medium">芯颜洞察</p>
          {insights.map((insight, i) => (
            <div
              key={i}
              className="rounded-xl px-4 py-3"
              style={{ background: insightTypeBg(insight.type), border: `1px solid ${insightTypeColor(insight.type)}15` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[14px]">{insight.icon}</span>
                <span className="font-body text-[13px] font-medium" style={{ color: insightTypeColor(insight.type) }}>
                  {insight.title}
                </span>
              </div>
              <p className="font-body text-[12px] text-[#7A6E68] leading-relaxed">{insight.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* History List */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-2.5">历史日记</p>
        <div className="space-y-2">
          {[...entries].reverse().slice(0, 10).map((e) => (
            <div key={e.id} className="card-warm px-4 py-3 flex items-center gap-3">
              <span className="text-[20px]">{MOOD_EMOJIS[e.mood]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[13px] text-[#2D2420] font-medium">
                    {e.date.slice(5).replace("-", "月")}日
                  </span>
                  <span className="font-body text-[12px] text-[#B5ADA7]">{MOOD_LABELS[e.mood]}</span>
                </div>
                {e.issues.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {e.issues.map((issue) => (
                      <span key={issue} className="pill-clay text-[12px] py-0.5 px-2">{issue}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
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

        <div className="px-5 pt-2 pb-1 anim-fade-up">
          <h1 className="font-display text-[1.3rem] text-[#2D2420]">皮肤日记</h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">记录每日皮肤状态，追踪变化趋势</p>
        </div>

        <div className="px-5 mt-3 anim-fade-up d-100">
          <FormSection />
        </div>

        <div className="warm-divider mx-5 my-5" />

        <div className="px-5 anim-fade-up d-200 pb-tabbar">
          <RightPanel />
        </div>

        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex page-locked flex-col">
        <header className="flex items-center justify-between px-8 lg:px-12 py-4 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2">
            <Logo />
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/")} className="font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors">返回首页</button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Left: Form */}
          <div className="w-[45%] overflow-y-auto px-8 lg:px-12 py-6">
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mb-1 anim-fade-up">皮肤日记</h1>
            <p className="font-body text-[13px] text-[#9A8C82] mb-6 anim-fade-up d-100">记录每日皮肤状态，追踪变化趋势</p>
            <div className="anim-fade-up d-200">
              <FormSection />
            </div>
          </div>

          <div className="w-px bg-[rgba(45,36,32,0.06)]" />

          {/* Right: Trend + Insights + History */}
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6">
            <div className="anim-fade-up d-300">
              <RightPanel />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
