/*
 * Home.tsx — 首页（以皮肤检测为核心）
 * Design: Warm Ivory Minimalism + Organic Shapes
 *
 * 层级：检测入口(大) → 今日状态(紧凑) → 工具入口 → 发现
 * 形状：大圆角、胶囊形、有机曲线，避免方块感
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

function getTimeEmoji(): string {
  const h = new Date().getHours();
  if (h < 6) return "🌙";
  if (h < 12) return "🌤";
  if (h < 18) return "☀️";
  return "🌙";
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
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full anim-float-slow opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #C17B5C 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[40%] -left-10 w-32 h-32 rounded-full anim-breathe"
        style={{ background: "radial-gradient(circle, #D4967A 0%, transparent 70%)", animationDelay: "1s" }}
      />
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
      gradient: "linear-gradient(145deg, #F5EBE0 0%, #ECDDD0 100%)",
      iconColor: "#C17B5C",
      emoji: "📔",
    },
    {
      label: "护肤方案",
      path: "/routine",
      gradient: "linear-gradient(145deg, #E8F0E8 0%, #D8E8D8 100%)",
      iconColor: "#5A8A5A",
      emoji: "✨",
    },
    {
      label: "成分分析",
      path: "/ingredients",
      gradient: "linear-gradient(145deg, #E8ECF5 0%, #D8DEF0 100%)",
      iconColor: "#6A7AB0",
      emoji: "🧪",
    },
    {
      label: "冲突检测",
      path: "/conflict",
      gradient: "linear-gradient(145deg, #F5EDE0 0%, #ECE0D0 100%)",
      iconColor: "#B08050",
      emoji: "🔍",
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
        <header className="flex items-center justify-between px-5 md:px-8 pt-[env(safe-area-inset-top,12px)] pb-1 max-w-2xl mx-auto w-full anim-fade-in">
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

          {/* Greeting */}
          <section className="mt-3 anim-slide-up">
            <p className="font-body text-[13px] text-[#B5ADA7] tracking-wide">{formatDate()}</p>
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mt-0.5 leading-tight">
              {getGreeting()}
              <span className="inline-block ml-2 anim-float" style={{ animationDuration: "2s" }}>
                {getTimeEmoji()}
              </span>
            </h1>
          </section>

          {/* ===== HERO: Detection CTA — BIG, organic shape ===== */}
          <section className="mt-5 anim-slide-up d-100">
            <button
              onClick={() => setLocation("/chat")}
              className="w-full overflow-hidden text-left group glow-clay anim-gradient-shift"
              style={{
                borderRadius: "28px",
                background: "linear-gradient(145deg, #C17B5C 0%, #D4956F 30%, #E0A882 60%, #D4956F 100%)",
                backgroundSize: "200% 200%",
              }}
            >
              <div className="relative px-7 py-10 md:py-14">
                {/* Decorative organic blobs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-[0.1] bg-white anim-breathe" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-[0.06] bg-white anim-float-slow" />
                <div className="absolute top-6 right-[25%] w-4 h-4 rounded-full bg-white/10 anim-float" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-8 right-[15%] w-3 h-3 rounded-full bg-white/15 anim-float" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-[50%] right-[8%] w-2 h-2 rounded-full bg-white/10 anim-float" style={{ animationDelay: "2.5s" }} />

                <div className="relative flex items-center gap-5">
                  {/* Camera icon — large, pill-shaped container */}
                  <div className="relative shrink-0">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-[22px] flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                      style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="md:w-9 md:h-9">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                    {/* Pulse ring */}
                    <div className="absolute inset-0 rounded-[22px] border-2 border-white/20" style={{ animation: "ripple 2.5s ease-out infinite" }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-white text-[1.4rem] md:text-[1.6rem] tracking-wide leading-tight">AI 皮肤检测</h2>
                    <p className="font-body text-white/70 text-[13px] md:text-[14px] mt-2 leading-relaxed">上传面部照片，30秒生成专业分析报告</p>
                    {/* Pill-shaped tags */}
                    <div className="flex gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-body text-white/90 font-medium" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                        📸 拍照检测
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-body text-white/90 font-medium" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                        ⚡ 30秒出报告
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 group-hover:translate-x-1 transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </section>

          {/* ===== Today Status — compact pill row ===== */}
          <section className="mt-5 anim-slide-up d-200">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Routine pill */}
              <button
                onClick={() => setLocation("/routine")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, rgba(237,232,224,0.8) 0%, rgba(232,226,217,0.9) 100%)",
                  border: "1px solid rgba(45,36,32,0.06)",
                }}
              >
                <span className="text-[13px]">☀️</span>
                <span className="font-body text-[12px] text-[#7A6E68] font-medium">{routineProgress.am}/{routineProgress.amTotal}</span>
                <div className="w-px h-3 bg-[rgba(45,36,32,0.08)]" />
                <span className="text-[13px]">🌙</span>
                <span className="font-body text-[12px] text-[#7A6E68] font-medium">{routineProgress.pm}/{routineProgress.pmTotal}</span>
                {/* Mini progress arc */}
                <div className="relative w-6 h-6 ml-0.5">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(45,36,32,0.06)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={routinePct >= 100 ? "#4A9A6B" : "#C17B5C"}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${routinePct * 0.88} 88`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-body text-[8px] text-[#7A6E68] font-bold">{routinePct}</span>
                </div>
              </button>

              {/* Streak pill */}
              <div
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(193,123,92,0.06) 0%, rgba(193,123,92,0.1) 100%)",
                  border: "1px solid rgba(193,123,92,0.08)",
                }}
              >
                <span className="text-[13px]">🔥</span>
                <span className="font-body text-[12px] text-[#C17B5C] font-semibold">{stats.streak}天</span>
              </div>

              {/* Mood pill (if diary exists) */}
              {todayDiary && (
                <div
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full"
                  style={{
                    background: "rgba(237,232,224,0.6)",
                    border: "1px solid rgba(45,36,32,0.05)",
                  }}
                >
                  <span className="text-[15px]">{MOOD_EMOJIS[todayDiary.mood]}</span>
                  <span className="font-body text-[12px] text-[#7A6E68]">{MOOD_LABELS[todayDiary.mood]}</span>
                </div>
              )}

              {/* Insight pill */}
              {topInsight && (
                <button
                  onClick={() => setLocation("/diary")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.97]"
                  style={{
                    background: "rgba(193,123,92,0.04)",
                    border: "1px solid rgba(193,123,92,0.08)",
                  }}
                >
                  <span className="font-body text-[11px] text-[#5A4F49] truncate max-w-[160px]">{topInsight}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          </section>

          {/* ===== Tools — organic rounded cards ===== */}
          <section className="mt-6 anim-slide-up d-300">
            <p className="font-body text-[12px] text-[#B5ADA7] tracking-widest uppercase mb-3">护肤工具</p>
            <div className="grid grid-cols-4 gap-2.5 stagger-children">
              {tools.map((tool) => (
                <button
                  key={tool.path}
                  onClick={() => setLocation(tool.path)}
                  className="flex flex-col items-center gap-2 py-4 px-2 border border-[rgba(45,36,32,0.04)] hover-lift group/tool active:scale-[0.95] transition-all duration-300"
                  style={{ background: tool.gradient, borderRadius: "20px" }}
                >
                  <span className="text-[24px] group-hover/tool:scale-125 transition-transform duration-300 inline-block">{tool.emoji}</span>
                  <span className="font-body text-[11px] text-[#5A4F49] font-medium whitespace-nowrap">{tool.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ===== Discover entry — organic pill shape ===== */}
          <section className="mt-5 anim-slide-up d-400">
            <button
              onClick={() => setLocation("/discover")}
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover-lift group/discover relative overflow-hidden active:scale-[0.98] transition-all duration-300"
              style={{
                borderRadius: "22px",
                background: "linear-gradient(135deg, #EDE8E0 0%, #E8E2D9 100%)",
                border: "1px solid rgba(45,36,32,0.06)",
              }}
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 anim-shimmer pointer-events-none" />

              <div
                className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 group-hover/discover:scale-110 group-hover/discover:rotate-12 transition-all duration-500"
                style={{ background: "rgba(193,123,92,0.08)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
