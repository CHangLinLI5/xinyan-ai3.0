/*
 * Home.tsx — 首页
 * Design: Warm Ivory Minimalism
 * 
 * 移动端：自然流式布局，内容紧凑排列，无视口锁定
 * 桌面端：左文右图不对称布局 + 浮动毛玻璃卡片 + 精致导航（page-locked）
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/hero-face-KvC8ByCEeL23Hap2YwZiKi.webp";

const metrics = [
  { label: "水分", value: 88, icon: "💧" },
  { label: "油脂", value: 72, icon: "🫧" },
  { label: "色素", value: 65, icon: "🎨" },
  { label: "毛孔", value: 58, icon: "🔬" },
  { label: "亮度", value: 78, icon: "✨" },
  { label: "弹性", value: 91, icon: "🌿" },
];

const quickQuestions = [
  { text: "适合什么护肤品？", emoji: "🧴" },
  { text: "改善毛孔粗大", emoji: "🔍" },
  { text: "敏感肌护理", emoji: "🌸" },
  { text: "美白淡斑方法", emoji: "✨" },
  { text: "祛痘方法", emoji: "🌿" },
  { text: "抗衰老建议", emoji: "💎" },
];

const skinTips = [
  "每天涂抹防晒霜是抗衰老最有效的方式之一",
  "洁面后 60 秒内使用精华液，吸收效果最佳",
  "充足的睡眠比昂贵的护肤品更能改善肤质",
  "维生素 C 精华搭配防晒，美白效果翻倍",
];

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const score = useCountUp(82);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tipIndex] = useState(() => Math.floor(Math.random() * skinTips.length));
  const [activeNav, setActiveNav] = useState<string | null>(null);

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

  const navLinks = [
    { label: "检测", path: "/chat" },
    { label: "日历", path: "/calendar" },
    { label: "记录", path: "/history" },
    { label: "个人中心", path: "/profile" },
  ];

  return (
    <>
      {/* Drag overlay (global) */}
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

      {/* Hidden file input */}
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

      {/* ===== MOBILE LAYOUT — Natural flow, NOT page-locked ===== */}
      <div
        className="md:hidden min-h-[100dvh] flex flex-col bg-background"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Mobile Header */}
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

        {/* Greeting */}
        <div className="px-5 pt-3 pb-1 anim-fade-up">
          <h1 className="font-display text-[1.5rem] font-light text-[#2D2420] leading-tight">
            你好，我是<span className="text-clay-gradient">芯颜 AI</span>～
          </h1>
          <p className="font-body text-[13px] text-[#9A8C82] mt-1.5 leading-relaxed" style={{ fontWeight: 300 }}>
            你的专属皮肤智能分析助手
          </p>
        </div>

        {/* Upload Card */}
        <div className="px-5 mt-4 anim-fade-up d-100">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: "linear-gradient(145deg, #F8F0E8 0%, #F0E4D8 50%, #EBD9CC 100%)",
              boxShadow: "0 2px 12px rgba(193,123,92,0.08), 0 0 0 1px rgba(193,123,92,0.06)",
            }}
          >
            <div className="flex flex-col items-center py-7 px-6 relative">
              {/* Decorative circles */}
              <div className="absolute top-3 right-4 w-20 h-20 rounded-full opacity-[0.04]" style={{ background: "#C17B5C" }} />
              <div className="absolute bottom-2 left-6 w-12 h-12 rounded-full opacity-[0.03]" style={{ background: "#C17B5C" }} />
              
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
                  boxShadow: "0 4px 14px rgba(193,123,92,0.3)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="font-body text-[14px] font-medium text-[#2D2420]">上传面部照片</p>
              <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">正面清晰照 · JPG / PNG</p>
              
              {/* CTA Button */}
              <div className="mt-3 px-5 py-2 rounded-full"
                style={{ background: "rgba(193,123,92,0.12)", border: "1px solid rgba(193,123,92,0.18)" }}>
                <span className="font-body text-[13px] text-[#C17B5C] font-medium">点击选择照片</span>
              </div>

              {/* Stats row */}
              <div className="flex items-center mt-3.5 gap-0">
                {[
                  { num: "98%", label: "准确率" },
                  { num: "30s", label: "出结果" },
                  { num: "6项", label: "维度" },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center">
                    {i > 0 && <div className="w-px h-3 bg-[rgba(193,123,92,0.15)] mx-3" />}
                    <div className="flex items-center gap-1">
                      <span className="font-body text-[12px] text-[#C17B5C] font-semibold">{s.num}</span>
                      <span className="font-body text-[12px] text-[#B5ADA7]">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="px-5 mt-5 anim-fade-up d-200">
          <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2.5 uppercase">或者直接问我</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => {
              const pillStyles = [
                { bg: "linear-gradient(135deg, rgba(193,123,92,0.12) 0%, rgba(193,123,92,0.06) 100%)", border: "rgba(193,123,92,0.18)", text: "#8B5E3C" },
                { bg: "linear-gradient(135deg, rgba(168,130,100,0.14) 0%, rgba(168,130,100,0.06) 100%)", border: "rgba(168,130,100,0.20)", text: "#6B5030" },
                { bg: "linear-gradient(135deg, rgba(139,162,130,0.14) 0%, rgba(139,162,130,0.06) 100%)", border: "rgba(139,162,130,0.20)", text: "#4A6B40" },
                { bg: "linear-gradient(135deg, rgba(200,150,110,0.14) 0%, rgba(200,150,110,0.06) 100%)", border: "rgba(200,150,110,0.20)", text: "#7A5530" },
                { bg: "linear-gradient(135deg, rgba(130,155,140,0.13) 0%, rgba(130,155,140,0.05) 100%)", border: "rgba(130,155,140,0.18)", text: "#3D6B50" },
                { bg: "linear-gradient(135deg, rgba(155,130,165,0.13) 0%, rgba(155,130,165,0.05) 100%)", border: "rgba(155,130,165,0.18)", text: "#5A4070" },
              ];
              const s = pillStyles[i % pillStyles.length];
              return (
                <button
                  key={q.text}
                  onClick={() => setLocation("/chat")}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-body transition-all active:scale-[0.96] hover:shadow-sm"
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    color: s.text,
                  }}
                >
                  <span className="text-[13px]">{q.emoji}</span>
                  {q.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skin Tip Card */}
        <div className="px-5 mt-5 anim-fade-up d-250">
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
        </div>

        {/* Recent Detection Card (if exists) */}
        <div className="px-5 mt-5 anim-fade-up d-280">
          <div className="rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => setLocation("/result")}
            style={{
              background: "rgba(237,232,224,0.6)",
              border: "1px solid rgba(45,36,32,0.05)",
            }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(193,123,92,0.15), rgba(193,123,92,0.05))" }}>
              <span className="font-display text-[16px] font-light text-[#C17B5C]">82</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[13px] text-[#2D2420] font-medium">最近检测</p>
              <p className="font-body text-[12px] text-[#9A8C82]">3月25日 · 综合评分良好</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* AI Chat Entry */}
        <div className="px-5 mt-4 anim-fade-up d-300" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 16px)' }}>
          <button
            onClick={() => setLocation("/chat")}
            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
              boxShadow: "0 4px 16px rgba(193,123,92,0.25)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="font-body text-[14px] text-white font-medium">和芯颜 AI 聊聊</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-70">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* MobileTabBar for mobile */}
        <MobileTabBar />
      </div>

      {/* ===== DESKTOP LAYOUT — page-locked ===== */}
      <div
        className="hidden md:flex page-locked flex-col"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Desktop Top Nav */}
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
            <button
              onClick={() => setLocation("/chat")}
              className="btn-primary text-[13px] px-5 py-2"
            >
              免费检测
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[rgba(193,123,92,0.08)] hover:bg-[rgba(193,123,92,0.15)] transition-all hover:scale-105"
              title="个人中心"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </header>

        {/* Desktop Main Content */}
        <main className="flex-1 flex items-stretch overflow-hidden relative z-10">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col justify-center px-12 lg:px-16 max-w-[55%]">
            <div className="pill-clay anim-fade-up mb-5 w-fit">
              <span>✦</span> AI 皮肤智能分析
            </div>

            <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.15] text-[#2D2420] mb-5 anim-fade-up d-100">
              了解你的<br />
              <span className="text-clay-gradient font-display" style={{ fontStyle: "italic" }}>皮肤状态</span>
            </h1>

            <p className="font-body text-[15px] text-[#7A6E68] leading-relaxed max-w-md mb-6 anim-fade-up d-200" style={{ fontWeight: 300 }}>
              上传一张照片，AI 将在 30 秒内为你生成专业的皮肤分析报告，包含 6 大维度评估、个性化护肤建议和产品推荐。
            </p>

            <div className="warm-divider max-w-md mb-6 anim-fade-up d-300" />

            <div className="flex gap-3 items-center mb-8 anim-fade-up d-300">
              <button onClick={() => setLocation("/chat")} className="btn-primary">
                开始检测
              </button>
              <button
                className="font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors px-4 py-2"
                onClick={() => toast("专家咨询功能即将推出")}
              >
                咨询专家 →
              </button>
            </div>

            {/* Stats with dividers */}
            <div className="flex items-center gap-0 anim-fade-up d-400">
              {[
                { num: "98%", label: "准确率" },
                { num: "30s", label: "出结果" },
                { num: "12+", label: "检测维度" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center">
                  {i > 0 && <div className="w-px h-8 bg-[rgba(45,36,32,0.08)] mx-6" />}
                  <div className="flex flex-col">
                    <span className="font-display text-xl font-light text-[#2D2420]">{stat.num}</span>
                    <span className="label-sm mt-0.5">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-0">
              <img
                src={HERO_IMAGE}
                alt="皮肤分析"
                className="w-full h-full object-cover object-center anim-fade-in"
                style={{ filter: "brightness(1.02)" }}
              />
              <div
                className="absolute inset-y-0 left-0 w-32"
                style={{ background: "linear-gradient(90deg, #F2EDE6 0%, rgba(242,237,230,0.6) 50%, transparent 100%)" }}
              />
            </div>

            {/* Floating Score Card */}
            <div
              className="absolute top-12 left-8 p-5 anim-scale-in d-400"
              style={{
                width: 180,
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 12px 40px rgba(45,36,32,0.06), 0 4px 12px rgba(45,36,32,0.03)",
              }}
            >
              <p className="label-sm mb-2">综合评分</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-[3.2rem] font-light leading-none text-clay-gradient">
                  {score}
                </span>
                <span className="font-body text-sm text-[#B5ADA7]">/100</span>
              </div>
              <div className="flex items-end gap-1.5 mt-3 h-8">
                {metrics.map((m, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all duration-700"
                    style={{
                      height: `${(m.value / 100) * 100}%`,
                      background: `rgba(193, 123, 92, ${0.3 + (m.value / 100) * 0.6})`,
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Metrics Card */}
            <div
              className="absolute bottom-16 right-8 p-4 anim-scale-in d-600"
              style={{
                width: 200,
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.45)",
                boxShadow: "0 12px 40px rgba(45,36,32,0.06), 0 4px 12px rgba(45,36,32,0.03)",
              }}
            >
              <p className="label-sm mb-3">维度分析</p>
              <div className="space-y-2.5">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-[12px] text-[#7A6E68]">{m.label}</span>
                      <span className="font-body text-[12px] text-[#C17B5C] font-medium">{m.value}</span>
                    </div>
                    <div className="w-full h-1 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-900"
                        style={{
                          width: `${m.value}%`,
                          background: `linear-gradient(90deg, rgba(193,123,92,${0.3 + (m.value / 100) * 0.4}), rgba(193,123,92,${0.5 + (m.value / 100) * 0.4}))`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Desktop Footer */}
        <footer className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3" style={{ borderTop: "1px solid rgba(193,123,92,0.06)" }}>
          <p className="font-body text-[12px] text-[#B5ADA7]">© 2025 芯颜 AI · 专业皮肤智能分析</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLocation("/calendar")}
              className="font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors"
            >
              护肤日历
            </button>
            <span className="text-[#E0D8D0]">·</span>
            <button
              onClick={() => setLocation("/history")}
              className="font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors"
            >
              历史记录
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
