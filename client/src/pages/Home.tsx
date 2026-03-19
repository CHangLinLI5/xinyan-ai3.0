/*
 * Home.tsx — 首页（以皮肤检测为核心）
 * Design: Warm Ivory Minimalism + Lively Motion
 *
 * 层级：检测入口 → 今日状态 → 工具入口
 * 增强：浮动装饰、呼吸光效、交错动画、悬浮反馈
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import {
  getTodayDiary,
  getRoutineStats,
  getTodayCheckin,
  getRoutinePlan,
  getDiaryEntries,
} from "@/lib/agentStorage";
import { MOOD_EMOJIS, MOOD_LABELS, type DiaryEntry } from "@/lib/mockAgentData";
import { generateInsights } from "@/lib/diaryInsights";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "夜深了";
  if (h < 12) return "早上好";
  if (h < 14) return "中午好";
  if (h < 18) return "下午好";
  return "晚上好";
}

function formatDate(): string {
  const d = new Date();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`;
}

/* Floating decorative orbs */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Large warm orb top-right */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full anim-float-slow opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #C17B5C 0%, transparent 70%)" }}
      />
      {/* Small orb left */}
      <div
        className="absolute top-[40%] -left-10 w-32 h-32 rounded-full anim-breathe"
        style={{ background: "radial-gradient(circle, #D4967A 0%, transparent 70%)", animationDelay: "1s" }}
      />
      {/* Tiny orb bottom */}
      <div
        className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-full anim-float"
        style={{ background: "radial-gradient(circle, #C17B5C 0%, transparent 70%)", opacity: 0.05, animationDelay: "2s" }}
      />
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [todayDiary, setTodayDiary] = useState<DiaryEntry | null>(null);
  const [stats, setStats] = useState({ streak: 0, longest: 0, total: 0, weekRate: 0 });
  const [routineProgress, setRoutineProgress] = useState({ am: 0, pm: 0, amTotal: 0, pmTotal: 0 });
  const [topInsight, setTopInsight] = useState<string | null>(null);

  useEffect(() => {
    const diary = getTodayDiary();
    setTodayDiary(diary);
    setStats(getRoutineStats());

    const plan = getRoutinePlan();
    const checkin = getTodayCheckin();
    const amTotal = plan.amSteps.length;
    const pmTotal = plan.pmSteps.filter((s) => s.frequency === "daily").length;
    setRoutineProgress({
      am: checkin?.amCompleted.length || 0,
      pm: checkin?.pmCompleted.length || 0,
      amTotal,
      pmTotal,
    });

    const entries = getDiaryEntries();
    const insights = generateInsights(entries);
    if (insights.length > 0) {
      setTopInsight(`${insights[0].icon} ${insights[0].title}`);
    }
  }, []);

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setLocation("/chat");
    },
    [setLocation]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const totalDone = routineProgress.am + routineProgress.pm;
  const totalAll = routineProgress.amTotal + routineProgress.pmTotal;
  const routinePct = totalAll > 0 ? Math.round((totalDone / totalAll) * 100) : 0;

  const tools = [
    {
      label: "皮肤日记",
      path: "/diary",
      gradient: "linear-gradient(135deg, #F0E4D8 0%, #E8D8CA 100%)",
      iconColor: "#C17B5C",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "护肤方案",
      path: "/routine",
      gradient: "linear-gradient(135deg, #E4EDE4 0%, #D4E2D4 100%)",
      iconColor: "#5A8A5A",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      label: "成分分析",
      path: "/ingredients",
      gradient: "linear-gradient(135deg, #E0E4F0 0%, #D0D6E8 100%)",
      iconColor: "#6A7AB0",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6v11l-3 3-3-3z" />
          <path d="M6 14l-3 3v4h18v-4l-3-3" />
        </svg>
      ),
    },
    {
      label: "冲突检测",
      path: "/conflict",
      gradient: "linear-gradient(135deg, #F0E8E0 0%, #E8DCD0 100%)",
      iconColor: "#B08050",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <FloatingOrbs />

      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[rgba(242,237,230,0.95)] flex items-center justify-center anim-fade-in">
          <div className="text-center anim-bounce-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center anim-breathe">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="font-display text-lg text-[#2D2420]">释放以上传照片</p>
            <p className="font-body text-sm text-[#7A6E68] mt-1">支持 JPG、PNG 格式</p>
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />

      <div
        className="min-h-[100dvh] bg-background relative z-10"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* ===== Header ===== */}
        <header className="flex items-center justify-between px-5 md:px-8 pt-[env(safe-area-inset-top,12px)] pb-2 max-w-2xl mx-auto w-full anim-fade-in">
          <Logo />
          <button
            onClick={() => setLocation("/profile")}
            className="w-9 h-9 rounded-full bg-[rgba(193,123,92,0.06)] flex items-center justify-center hover:bg-[rgba(193,123,92,0.12)] hover:scale-110 transition-all duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A8C82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </header>

        {/* ===== Content ===== */}
        <main className="max-w-2xl mx-auto px-5 md:px-8 pb-4">

          {/* Section 1: Greeting + Detection CTA */}
          <section className="mt-4 anim-slide-up">
            <p className="font-body text-[13px] text-[#B5ADA7] tracking-wide">{formatDate()}</p>
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mt-1 leading-tight">
              {getGreeting()}
              <span className="inline-block ml-2 anim-float" style={{ animationDuration: "2s" }}>
                {new Date().getHours() < 12 ? "🌤" : new Date().getHours() < 18 ? "☀️" : "🌙"}
              </span>
            </h1>

            {/* Detection CTA — with glow + animated gradient */}
            <button
              onClick={() => setLocation("/chat")}
              className="w-full mt-5 rounded-2xl overflow-hidden text-left group glow-clay anim-gradient-shift"
              style={{
                background: "linear-gradient(145deg, #C17B5C 0%, #D4956F 30%, #E0A882 60%, #D4956F 100%)",
                backgroundSize: "200% 200%",
              }}
            >
              <div className="relative px-6 py-7 md:py-9">
                {/* Animated decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-[0.1] bg-white anim-breathe" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-[0.06] bg-white anim-float-slow" />
                <div className="absolute top-3 right-[30%] w-3 h-3 rounded-full bg-white/10 anim-float" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-4 right-[20%] w-2 h-2 rounded-full bg-white/15 anim-float" style={{ animationDelay: "1.5s" }} />

                <div className="relative flex items-center gap-5">
                  {/* Camera icon with ripple */}
                  <div className="relative shrink-0">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-white/20" style={{ animation: "ripple 2.5s ease-out infinite" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-white text-[1.2rem] md:text-[1.35rem] tracking-wide">AI 皮肤检测</h2>
                    <p className="font-body text-white/75 text-[13px] mt-1.5 leading-relaxed">上传面部照片，30秒生成专业分析报告</p>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </section>

          {/* Section 2: Today Status */}
          <section className="mt-6 anim-slide-up d-200">
            <div className="rounded-2xl bg-[#EDE8E0] border border-[rgba(45,36,32,0.06)] p-5 hover-lift">
              {/* Row 1: Routine progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-[13px] text-[#7A6E68] font-medium">今日护肤</span>
                    <span
                      className="font-display text-[15px] font-medium"
                      style={{ color: routinePct >= 100 ? "#4A9A6B" : "#C17B5C" }}
                    >
                      {routinePct}%
                    </span>
                  </div>
                  <div className="h-2 bg-[rgba(45,36,32,0.04)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out progress-animated"
                      style={{
                        width: `${routinePct}%`,
                        background: routinePct >= 100
                          ? "linear-gradient(90deg, #4A9A6B, #6BB88A)"
                          : "linear-gradient(90deg, #C17B5C, #D4967A)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Stats chips */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[rgba(45,36,32,0.05)]">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.5)]">
                  <span className="text-[12px]">☀️</span>
                  <span className="font-body text-[12px] text-[#7A6E68] font-medium">{routineProgress.am}/{routineProgress.amTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.5)]">
                  <span className="text-[12px]">🌙</span>
                  <span className="font-body text-[12px] text-[#7A6E68] font-medium">{routineProgress.pm}/{routineProgress.pmTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[rgba(193,123,92,0.06)] ml-auto">
                  <span className="text-[12px]">🔥</span>
                  <span className="font-body text-[12px] text-[#C17B5C] font-semibold">{stats.streak}天</span>
                </div>
                {todayDiary && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[rgba(255,255,255,0.5)]">
                    <span className="text-[14px]">{MOOD_EMOJIS[todayDiary.mood]}</span>
                    <span className="font-body text-[12px] text-[#7A6E68]">{MOOD_LABELS[todayDiary.mood]}</span>
                  </div>
                )}
              </div>

              {/* Row 3: Insight */}
              {topInsight && (
                <button
                  onClick={() => setLocation("/diary")}
                  className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(45,36,32,0.05)] w-full text-left group/insight"
                >
                  <div className="w-1 h-4 rounded-full bg-[#C17B5C] opacity-60 shrink-0" />
                  <p className="font-body text-[12px] text-[#5A4F49] flex-1 truncate group-hover/insight:text-[#C17B5C] transition-colors">{topInsight}</p>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="group-hover/insight:translate-x-0.5 group-hover/insight:stroke-[#C17B5C] transition-all">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          </section>

          {/* Section 3: Tools — with individual gradients and stagger */}
          <section className="mt-6 anim-slide-up d-300">
            <p className="font-body text-[12px] text-[#B5ADA7] tracking-widest uppercase mb-3">护肤工具</p>
            <div className="grid grid-cols-4 gap-2.5 stagger-children">
              {tools.map((tool) => (
                <button
                  key={tool.path}
                  onClick={() => setLocation(tool.path)}
                  className="flex flex-col items-center gap-2.5 py-4 px-2 rounded-2xl border border-[rgba(45,36,32,0.04)] hover-lift group/tool"
                  style={{ background: tool.gradient }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center group-hover/tool:scale-110 transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.6)", color: tool.iconColor }}
                  >
                    {tool.icon}
                  </div>
                  <span className="font-body text-[11px] text-[#5A4F49] font-medium whitespace-nowrap">{tool.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 4: Discover entry — with shimmer accent */}
          <section className="mt-6 anim-slide-up d-400">
            <button
              onClick={() => setLocation("/discover")}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left hover-lift group/discover relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, #EDE8E0 0%, #E8E2D9 100%)", border: "1px solid rgba(45,36,32,0.06)" }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 anim-shimmer pointer-events-none" />

              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover/discover:scale-110 transition-transform duration-300" style={{ background: "rgba(193,123,92,0.08)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="group-hover/discover:rotate-45 transition-transform duration-500">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 relative">
                <p className="font-body text-[13px] text-[#2D2420] font-medium">护肤知识</p>
                <p className="font-body text-[11px] text-[#9A8C82] mt-0.5">成分科普、护肤技巧、每日贴士</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0 group-hover/discover:bg-[rgba(193,123,92,0.12)] group-hover/discover:translate-x-0.5 transition-all duration-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          </section>
        </main>

        {/* Mobile bottom padding */}
        <div className="pb-tabbar md:pb-8" />
        <MobileTabBar />
      </div>
    </>
  );
}
