/*
 * Home.tsx — 首页（以皮肤检测为核心）
 * Design: Warm Ivory Minimalism — 极简单栏布局
 *
 * 层级：检测入口 → 今日状态 → 工具入口
 * 移动端：单栏纵向
 * 桌面端：居中单栏 max-w-xl，两侧留白
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
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      label: "成分分析",
      path: "/ingredients",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3h6v11l-3 3-3-3z" />
          <path d="M6 14l-3 3v4h18v-4l-3-3" />
        </svg>
      ),
    },
    {
      label: "冲突检测",
      path: "/conflict",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-[rgba(242,237,230,0.95)] flex items-center justify-center anim-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
        className="min-h-[100dvh] bg-background"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* ===== Header ===== */}
        <header className="flex items-center justify-between px-5 md:px-8 pt-[env(safe-area-inset-top,12px)] pb-2 max-w-2xl mx-auto w-full">
          <Logo />
          <button
            onClick={() => setLocation("/profile")}
            className="w-9 h-9 rounded-full bg-[rgba(193,123,92,0.06)] flex items-center justify-center hover:bg-[rgba(193,123,92,0.12)] transition-colors"
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
          <section className="mt-4 anim-fade-up">
            <p className="font-body text-[13px] text-[#B5ADA7]">{formatDate()}</p>
            <h1 className="font-display text-[1.35rem] text-[#2D2420] mt-1 leading-tight">
              {getGreeting()}
            </h1>

            {/* Detection CTA */}
            <button
              onClick={() => setLocation("/chat")}
              className="w-full mt-5 rounded-2xl overflow-hidden text-left transition-all active:scale-[0.98] hover:shadow-lg group"
              style={{
                background: "linear-gradient(145deg, #C17B5C 0%, #D4956F 50%, #E0A882 100%)",
                boxShadow: "0 6px 24px rgba(193,123,92,0.25)",
              }}
            >
              <div className="relative px-6 py-6 md:py-8">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-[0.08] bg-white" />
                <div className="absolute -bottom-3 -left-3 w-20 h-20 rounded-full opacity-[0.05] bg-white" />

                <div className="relative flex items-center gap-5">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: "rgba(255,255,255,0.18)" }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-white text-[1.15rem] md:text-[1.3rem]">AI 皮肤检测</h2>
                    <p className="font-body text-white/70 text-[13px] mt-1">上传面部照片，30秒生成专业分析报告</p>
                  </div>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-50 shrink-0 group-hover:translate-x-1 transition-transform">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </button>
          </section>

          {/* Section 2: Today Status */}
          <section className="mt-6 anim-fade-up d-100">
            <div className="rounded-xl bg-[#EDE8E0] border border-[rgba(45,36,32,0.06)] p-4">
              {/* Row 1: Routine progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-body text-[12px] text-[#9A8C82]">今日护肤</span>
                    <span className="font-body text-[12px] text-[#7A6E68] font-medium">{routinePct}%</span>
                  </div>
                  <div className="h-1.5 bg-[rgba(237,232,224,0.8)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
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

              {/* Row 2: Stats */}
              <div className="flex items-center gap-5 mt-3 pt-3 border-t border-[rgba(45,36,32,0.05)]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">☀️</span>
                  <span className="font-body text-[12px] text-[#9A8C82]">{routineProgress.am}/{routineProgress.amTotal}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]">🌙</span>
                  <span className="font-body text-[12px] text-[#9A8C82]">{routineProgress.pm}/{routineProgress.pmTotal}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px]">🔥</span>
                  <span className="font-body text-[12px] text-[#C17B5C] font-medium">{stats.streak}天</span>
                </div>
                {todayDiary && (
                  <div className="flex items-center gap-1">
                    <span className="text-[14px]">{MOOD_EMOJIS[todayDiary.mood]}</span>
                    <span className="font-body text-[12px] text-[#9A8C82]">{MOOD_LABELS[todayDiary.mood]}</span>
                  </div>
                )}
              </div>

              {/* Row 3: Insight (if any) */}
              {topInsight && (
                <button
                  onClick={() => setLocation("/diary")}
                  className="flex items-center gap-2 mt-3 pt-3 border-t border-[rgba(45,36,32,0.05)] w-full text-left"
                >
                  <p className="font-body text-[12px] text-[#5A4F49] flex-1 truncate">{topInsight}</p>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>
          </section>

          {/* Section 3: Tools */}
          <section className="mt-6 anim-fade-up d-200">
            <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-3">护肤工具</p>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {tools.map((tool) => (
                <button
                  key={tool.path}
                  onClick={() => setLocation(tool.path)}
                  className="flex flex-col items-center gap-2 px-4 py-3.5 rounded-xl bg-[#EDE8E0] border border-[rgba(45,36,32,0.06)] shrink-0 min-w-[80px] transition-all active:scale-[0.96] hover:border-[rgba(193,123,92,0.2)]"
                  style={{ color: "#9A8C82" }}
                >
                  {tool.icon}
                  <span className="font-body text-[11px] text-[#7A6E68] whitespace-nowrap">{tool.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 4: Discover entry */}
          <section className="mt-6 anim-fade-up d-300">
            <button
              onClick={() => setLocation("/discover")}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#EDE8E0] border border-[rgba(45,36,32,0.06)] text-left transition-all active:scale-[0.98] hover:border-[rgba(193,123,92,0.2)]"
            >
              <div className="w-9 h-9 rounded-lg bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-[13px] text-[#2D2420] font-medium">护肤知识</p>
                <p className="font-body text-[11px] text-[#B5ADA7]">成分科普、护肤技巧、每日贴士</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
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
