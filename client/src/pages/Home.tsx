/*
 * Home.tsx — 今日仪表盘 (Agent 3.0)
 * Design: Warm Ivory Minimalism
 * 
 * 移动端：今日概览 → 护肤打卡进度 → 快捷功能 → 日记摘要 → AI检测入口
 * 桌面端：左栏(今日概览+打卡) + 右栏(快捷功能+日记+检测)
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
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

const quickActions = [
  { label: "皮肤日记", path: "/diary", icon: "📝", desc: "记录今日状态" },
  { label: "护肤方案", path: "/routine", icon: "📋", desc: "查看今日步骤" },
  { label: "成分分析", path: "/ingredients", icon: "🧪", desc: "解读成分表" },
  { label: "冲突检测", path: "/conflict", icon: "🔍", desc: "产品搭配安全" },
];

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
    { label: "检测", path: "/chat" },
    { label: "个人中心", path: "/profile" },
  ];

  // ===== Shared Components =====
  const TodayOverview = () => (
    <div className="card-warm p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-body text-[12px] text-[#B5ADA7]">{formatDate()}</p>
          <h2 className="font-display text-[1.2rem] text-[#2D2420] mt-0.5">
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

  const QuickActions = () => (
    <div className="grid grid-cols-2 gap-2.5">
      {quickActions.map((action) => (
        <button
          key={action.path}
          onClick={() => setLocation(action.path)}
          className="card-warm px-4 py-3.5 text-left transition-all active:scale-[0.96] hover:shadow-md"
        >
          <span className="text-[22px]">{action.icon}</span>
          <p className="font-body text-[13px] text-[#2D2420] font-medium mt-2">{action.label}</p>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">{action.desc}</p>
        </button>
      ))}
    </div>
  );

  const DiaryCard = () => (
    <button
      onClick={() => setLocation("/diary")}
      className="card-warm w-full text-left px-4 py-3.5 transition-all active:scale-[0.98] hover:shadow-md"
    >
      {todayDiary ? (
        <div className="flex items-start gap-3">
          <span className="text-[24px]">{MOOD_EMOJIS[todayDiary.mood]}</span>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">今日日记已记录</p>
            {todayDiary.issues.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {todayDiary.issues.map((issue) => (
                  <span key={issue} className="pill-clay text-[12px] py-0.5 px-2">{issue}</span>
                ))}
              </div>
            )}
            {todayDiary.note && (
              <p className="font-body text-[12px] text-[#9A8C82] mt-1 truncate">{todayDiary.note}</p>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-1">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(193,123,92,0.08)] flex items-center justify-center">
            <span className="text-[18px]">📝</span>
          </div>
          <div className="flex-1">
            <p className="font-body text-[13px] text-[#2D2420] font-medium">记录今日皮肤状态</p>
            <p className="font-body text-[12px] text-[#9A8C82]">坚持记录，发现皮肤变化规律</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      )}
    </button>
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

  const DetectionEntry = () => (
    <div className="space-y-3">
      <button
        onClick={() => setLocation("/chat")}
        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
          boxShadow: "0 4px 16px rgba(193,123,92,0.25)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <div className="flex-1 text-left">
          <span className="font-body text-[14px] text-white font-medium">AI 皮肤检测</span>
          <p className="font-body text-[12px] text-white/70">上传照片，30秒出报告</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <button
        onClick={() => setLocation("/chat")}
        className="w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all active:scale-[0.98]"
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
    </div>
  );

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

        <div className="px-5 mt-2 anim-fade-up">
          <TodayOverview />
        </div>

        {topInsight && (
          <div className="px-5 mt-3 anim-fade-up d-100">
            <InsightBanner />
          </div>
        )}

        <div className="px-5 mt-4 anim-fade-up d-150">
          <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2.5 uppercase">快捷功能</p>
          <QuickActions />
        </div>

        <div className="px-5 mt-4 anim-fade-up d-200">
          <DiaryCard />
        </div>

        <div className="px-5 mt-4 anim-fade-up d-250">
          <DetectionEntry />
        </div>

        <div className="px-5 mt-4 anim-fade-up d-300">
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
          {/* Left Column */}
          <div className="w-[45%] overflow-y-auto px-8 lg:px-12 py-6 space-y-5">
            <div className="anim-fade-up">
              <TodayOverview />
            </div>

            {topInsight && (
              <div className="anim-fade-up d-100">
                <InsightBanner />
              </div>
            )}

            <div className="anim-fade-up d-200">
              <DiaryCard />
            </div>

            <div className="anim-fade-up d-300">
              <TipCard />
            </div>
          </div>

          <div className="w-px bg-[rgba(45,36,32,0.06)]" />

          {/* Right Column */}
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6 space-y-5">
            <div className="anim-fade-up d-100">
              <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2.5 uppercase">快捷功能</p>
              <QuickActions />
            </div>

            <div className="anim-fade-up d-200">
              <DetectionEntry />
            </div>

            {/* Hero image card */}
            <div className="anim-fade-up d-300 rounded-2xl overflow-hidden relative" style={{ height: 200 }}>
              <img
                src={HERO_IMAGE}
                alt="芯颜AI"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(1.02)" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,36,32,0.5), transparent)" }} />
              <div className="absolute bottom-4 left-5 right-5">
                <p className="font-display text-[1.1rem] text-white">芯颜 AI · 你的护肤伴侣</p>
                <p className="font-body text-[12px] text-white/70 mt-0.5">每天记录，每天进步</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3" style={{ borderTop: "1px solid rgba(193,123,92,0.06)" }}>
          <p className="font-body text-[12px] text-[#B5ADA7]">© 2025 芯颜 AI · 你的每日护肤伴侣</p>
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
