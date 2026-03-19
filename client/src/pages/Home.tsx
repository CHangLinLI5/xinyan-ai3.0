/*
 * Home.tsx — 以皮肤检测为核心的首页
 * Design: Warm Ivory Minimalism
 * 
 * 移动端：大面积检测入口 → 今日概览 → 辅助功能
 * 桌面端：左栏(大面积检测入口+英雄区) + 右栏(今日概览+辅助功能)
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

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/hero-face-KvC8ByCEeL23Hap2YwZiKi.webp";

const skinTips = [
  "每天涂抹防晒霜是抗衰老最有效的方式之一",
  "洁面后 60 秒内使用精华液，吸收效果最佳",
  "充足的睡眠比昂贵的护肤品更能改善肤质",
  "维生素 C 精华搭配防晒，美白效果翻倍",
];

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
  const [tipIndex] = useState(() => Math.floor(Math.random() * skinTips.length));
  const [activeNav, setActiveNav] = useState<string | null>(null);

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

  const navLinks = [
    { label: "日记", path: "/diary" },
    { label: "方案", path: "/routine" },
    { label: "发现", path: "/discover" },
    { label: "个人中心", path: "/profile" },
  ];

  // ===== Hero Detection CTA =====
  const HeroDetection = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={`relative overflow-hidden ${isMobile ? "rounded-2xl mx-5" : "rounded-2xl"}`}
      style={{
        background: "linear-gradient(145deg, #C17B5C 0%, #D4956F 40%, #E0A882 100%)",
        boxShadow: "0 8px 32px rgba(193,123,92,0.3), 0 2px 8px rgba(193,123,92,0.15)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
      </div>

      <button
        onClick={() => setLocation("/chat")}
        className={`relative w-full text-left transition-all active:scale-[0.98] ${isMobile ? "px-6 py-7" : "px-8 py-10"}`}
      >
        {/* Camera icon */}
        <div
          className={`${isMobile ? "w-14 h-14" : "w-16 h-16"} rounded-2xl flex items-center justify-center mb-4`}
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
        >
          <svg width={isMobile ? "26" : "30"} height={isMobile ? "26" : "30"} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>

        <h2 className={`font-display text-white ${isMobile ? "text-[1.4rem]" : "text-[1.7rem]"} leading-tight`}>
          AI 皮肤检测
        </h2>
        <p className={`font-body text-white/75 mt-1.5 ${isMobile ? "text-[13px]" : "text-[14px]"} leading-relaxed max-w-[280px]`}>
          上传一张面部照片，AI 为你生成专业皮肤分析报告
        </p>

        <div className={`flex items-center gap-4 ${isMobile ? "mt-5" : "mt-6"}`}>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="font-body text-[12px] text-white font-medium">拍照检测</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-body text-[12px] text-white/60">30秒出报告</span>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </button>
    </div>
  );

  // ===== Today Overview (compact) =====
  const TodayOverview = () => (
    <div className="card-warm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-body text-[12px] text-[#B5ADA7]">{formatDate()}</p>
          <h2 className="font-display text-[1.1rem] text-[#2D2420] mt-0.5">
            {getGreeting()}，<span className="text-clay-gradient">芯颜</span>用户
          </h2>
        </div>
        {todayDiary && (
          <div className="flex items-center gap-1.5 bg-[rgba(193,123,92,0.08)] px-3 py-1.5 rounded-full">
            <span className="text-[16px]">{MOOD_EMOJIS[todayDiary.mood]}</span>
            <span className="font-body text-[12px] text-[#C17B5C] font-medium">{MOOD_LABELS[todayDiary.mood]}</span>
          </div>
        )}
      </div>

      {/* Routine Progress */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 bg-[rgba(237,232,224,0.6)] rounded-full overflow-hidden">
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
        <span className="font-body text-[12px] text-[#7A6E68] font-medium w-10 text-right">{routinePct}%</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px]">☀️</span>
          <span className="font-body text-[12px] text-[#9A8C82]">早间 {routineProgress.am}/{routineProgress.amTotal}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px]">🌙</span>
          <span className="font-body text-[12px] text-[#9A8C82]">晚间 {routineProgress.pm}/{routineProgress.pmTotal}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-[12px]">🔥</span>
          <span className="font-body text-[12px] text-[#C17B5C] font-medium">{stats.streak}天连续</span>
        </div>
      </div>
    </div>
  );

  // ===== Quick Tools (secondary) =====
  const QuickTools = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setLocation("/diary")}
          className="card-warm px-3.5 py-3 text-left transition-all active:scale-[0.97] hover:shadow-md flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">皮肤日记</p>
            <p className="font-body text-[11px] text-[#B5ADA7]">记录今日状态</p>
          </div>
        </button>

        <button
          onClick={() => setLocation("/routine")}
          className="card-warm px-3.5 py-3 text-left transition-all active:scale-[0.97] hover:shadow-md flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">护肤方案</p>
            <p className="font-body text-[11px] text-[#B5ADA7]">今日步骤</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setLocation("/ingredients")}
          className="card-warm px-3.5 py-3 text-left transition-all active:scale-[0.97] hover:shadow-md flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6v11l-3 3-3-3z" />
              <path d="M6 14l-3 3v4h18v-4l-3-3" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">成分分析</p>
            <p className="font-body text-[11px] text-[#B5ADA7]">解读成分表</p>
          </div>
        </button>

        <button
          onClick={() => setLocation("/conflict")}
          className="card-warm px-3.5 py-3 text-left transition-all active:scale-[0.97] hover:shadow-md flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[rgba(193,123,92,0.06)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">冲突检测</p>
            <p className="font-body text-[11px] text-[#B5ADA7]">产品搭配安全</p>
          </div>
        </button>
      </div>
    </div>
  );

  const InsightBanner = () => {
    if (!topInsight) return null;
    return (
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
        onClick={() => setLocation("/diary")}
        style={{
          background: "linear-gradient(135deg, rgba(193,123,92,0.04) 0%, rgba(242,237,230,0.8) 100%)",
          border: "1px solid rgba(193,123,92,0.06)",
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="font-body text-[12px] text-[#C17B5C] font-medium tracking-wider mb-0.5">芯颜洞察</p>
          <p className="font-body text-[13px] text-[#5A4F49]">{topInsight}</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    );
  };

  const TipCard = () => (
    <div
      className="rounded-xl px-4 py-3.5 flex items-start gap-3"
      style={{
        background: "linear-gradient(135deg, rgba(193,123,92,0.04) 0%, rgba(242,237,230,0.8) 100%)",
        border: "1px solid rgba(193,123,92,0.06)",
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(193,123,92,0.08)" }}>
        <span className="text-[14px]">💡</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-[12px] text-[#C17B5C] font-medium tracking-wider mb-1">芯颜小贴士</p>
        <p className="font-body text-[12px] text-[#5A4F49] leading-relaxed">{skinTips[tipIndex]}</p>
      </div>
    </div>
  );

  const ChatEntry = () => (
    <button
      onClick={() => setLocation("/chat")}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
      style={{
        background: "rgba(237,232,224,0.6)",
        border: "1px solid rgba(45,36,32,0.05)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span className="font-body text-[13px] text-[#7A6E68]">和芯颜 AI 聊聊护肤问题</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="ml-auto">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );

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

      {/* ===== MOBILE ===== */}
      <div
        className="md:hidden min-h-[100dvh] flex flex-col bg-background"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <header className="flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] pb-2 shrink-0">
          <Logo />
          <button
            onClick={() => setLocation("/profile")}
            className="w-9 h-9 rounded-full bg-[rgba(193,123,92,0.08)] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </header>

        {/* Hero Detection - TOP PRIORITY */}
        <div className="mt-2 anim-fade-up">
          <HeroDetection isMobile />
        </div>

        {/* Today Overview */}
        <div className="px-5 mt-4 anim-fade-up d-100">
          <TodayOverview />
        </div>

        {/* Insight */}
        {topInsight && (
          <div className="px-5 mt-3 anim-fade-up d-150">
            <InsightBanner />
          </div>
        )}

        {/* Quick Tools */}
        <div className="px-5 mt-4 anim-fade-up d-200">
          <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2.5 uppercase">护肤工具</p>
          <QuickTools />
        </div>

        {/* Chat Entry */}
        <div className="px-5 mt-3 anim-fade-up d-250">
          <ChatEntry />
        </div>

        {/* Tip */}
        <div className="px-5 mt-3 anim-fade-up d-300">
          <TipCard />
        </div>

        <div className="pb-tabbar" />
        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div
        className="hidden md:flex page-locked flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <header className="relative z-20 flex items-center justify-between px-8 lg:px-12 py-4">
          <Logo />
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => setLocation(link.path)}
                onMouseEnter={() => setActiveNav(link.path)}
                onMouseLeave={() => setActiveNav(null)}
                className="relative font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors py-1"
                style={{ fontWeight: 400 }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    width: activeNav === link.path ? "60%" : "0%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(90deg, transparent, #C17B5C, transparent)",
                  }}
                />
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => setLocation("/chat")} className="btn-primary text-[13px] px-5 py-2">
              AI 检测
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(193,123,92,0.08)] hover:bg-[rgba(193,123,92,0.15)] transition-all hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Left Column - Hero Detection */}
          <div className="w-[50%] overflow-y-auto px-8 lg:px-12 py-6 space-y-5">
            <div className="anim-fade-up">
              <HeroDetection />
            </div>

            {/* Hero image card */}
            <div className="anim-fade-up d-100 rounded-2xl overflow-hidden relative" style={{ height: 200 }}>
              <img
                src={HERO_IMAGE}
                alt="芯颜AI"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(1.02)" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,36,32,0.5), transparent)" }} />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="font-display text-[1.1rem] text-white">芯颜 AI · 你的护肤伴侣</p>
                <p className="font-body text-[12px] text-white/70 mt-0.5">专业皮肤分析，科学护肤指导</p>
              </div>
            </div>

            {/* Chat entry */}
            <div className="anim-fade-up d-200">
              <ChatEntry />
            </div>
          </div>

          <div className="w-px bg-[rgba(45,36,32,0.06)]" />

          {/* Right Column - Overview + Tools */}
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6 space-y-5">
            <div className="anim-fade-up">
              <TodayOverview />
            </div>

            {topInsight && (
              <div className="anim-fade-up d-100">
                <InsightBanner />
              </div>
            )}

            <div className="anim-fade-up d-200">
              <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2.5 uppercase">护肤工具</p>
              <QuickTools />
            </div>

            <div className="anim-fade-up d-300">
              <TipCard />
            </div>
          </div>
        </main>

        <footer className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3" style={{ borderTop: "1px solid rgba(193,123,92,0.06)" }}>
          <p className="font-body text-[12px] text-[#B5ADA7]">© 2025 芯颜 AI · 专业皮肤智能分析</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setLocation("/discover")} className="font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors">
              护肤知识
            </button>
            <span className="text-[#E0D8D0]">·</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-[5px] h-[5px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, #C17B5C, #D4956F)",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }}
              />
              <span className="font-body text-[12px] text-[#B5ADA7]">服务运行中</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
