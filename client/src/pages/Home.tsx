/*
 * Home.tsx — 首页（移动端合并检测入口）
 * Design: Warm Ivory Minimalism
 * 
 * 移动端：紧凑 hero + 上传区 + 快捷问题 + TabBar（一站式体验）
 * 桌面端：保留左文右图不对称布局 + 浮动卡片
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/hero-face-KvC8ByCEeL23Hap2YwZiKi.webp";

const metrics = [
  { label: "水分", value: 88 },
  { label: "油脂", value: 72 },
  { label: "色素", value: 65 },
  { label: "毛孔", value: 58 },
  { label: "亮度", value: 78 },
  { label: "弹性", value: 91 },
];

const quickQuestions = [
  "我的皮肤适合什么护肤品？",
  "如何改善毛孔粗大？",
  "敏感肌日常护理建议",
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

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      // Navigate to chat with the file info
      // Store file temporarily and go to chat
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
    <div
      className="page-locked flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-[rgba(242,237,230,0.95)] flex items-center justify-center anim-fade-in">
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

      {/* ===== MOBILE LAYOUT (md:hidden) ===== */}
      <div className="md:hidden flex flex-col h-full overflow-y-auto pb-[72px]">
        {/* Mobile Header */}
        <header className="flex items-center justify-between px-5 py-3 shrink-0">
          <Logo />
          <button
            onClick={() => setLocation("/profile")}
            className="w-8 h-8 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </header>

        {/* Mobile Hero - Compact */}
        <div className="relative mx-4 rounded-2xl overflow-hidden mb-5 anim-fade-up" style={{ height: 200 }}>
          <img
            src={HERO_IMAGE}
            alt="皮肤分析"
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.85)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(45,36,32,0.7) 0%, rgba(45,36,32,0.1) 50%, transparent 100%)" }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body font-medium bg-[rgba(255,255,255,0.2)] text-white backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C17B5C]" />
                AI 皮肤智能分析
              </span>
            </div>
            <h1 className="font-display text-[1.6rem] font-light leading-tight text-white">
              了解你的<span className="text-[#E8B4A0]">皮肤状态</span>
            </h1>
            <p className="font-body text-[12px] text-white/70 mt-1.5 leading-relaxed" style={{ fontWeight: 300 }}>
              上传照片，30 秒获得 6 维度专业分析报告
            </p>
          </div>
        </div>

        {/* Mobile Upload Area */}
        <div className="px-4 mb-4 anim-fade-up d-100">
          <div
            className="relative border-2 border-dashed border-[rgba(193,123,92,0.25)] rounded-xl p-5 text-center cursor-pointer hover:border-[rgba(193,123,92,0.5)] hover:bg-[rgba(193,123,92,0.03)] transition-all active:scale-[0.98]"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-body text-sm font-medium text-[#2D2420]">上传面部照片开始检测</p>
                <p className="font-body text-[11px] text-[#B5ADA7] mt-0.5">支持 JPG、PNG，建议正面清晰照片</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Questions */}
        <div className="px-4 mb-5 anim-fade-up d-200">
          <p className="font-body text-[11px] text-[#B5ADA7] uppercase tracking-wider mb-2.5">快捷提问</p>
          <div className="flex flex-col gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setLocation("/chat")}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[rgba(253,250,247,0.8)] border border-[rgba(45,36,32,0.06)] text-left hover:bg-[rgba(193,123,92,0.06)] transition-all active:scale-[0.98]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <span className="font-body text-[13px] text-[#5A4F49]">{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="px-4 mb-5 anim-fade-up d-300">
          <div className="flex items-center justify-around py-4 rounded-xl bg-[rgba(253,250,247,0.8)] border border-[rgba(45,36,32,0.06)]">
            {[
              { num: "98%", label: "准确率" },
              { num: "30s", label: "出结果" },
              { num: "12+", label: "检测维度" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-display text-lg font-light text-[#2D2420]">{stat.num}</span>
                <span className="font-body text-[10px] text-[#B5ADA7] mt-0.5">{stat.label}</span>
                {i < 2 && <div className="absolute" />}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Quick Links */}
        <div className="px-4 mb-6 anim-fade-up d-400">
          <div className="flex gap-3">
            <button
              onClick={() => setLocation("/calendar")}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(253,250,247,0.8)] border border-[rgba(45,36,32,0.06)] hover:bg-[rgba(193,123,92,0.06)] transition-all active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-body text-[13px] text-[#5A4F49]">护肤日历</span>
            </button>
            <button
              onClick={() => setLocation("/history")}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-[rgba(253,250,247,0.8)] border border-[rgba(45,36,32,0.06)] hover:bg-[rgba(193,123,92,0.06)] transition-all active:scale-[0.98]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-body text-[13px] text-[#5A4F49]">历史记录</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT (hidden md:flex) ===== */}
      <div className="hidden md:flex flex-col h-full">
        {/* Desktop Top Nav */}
        <header className="relative z-20 flex items-center justify-between px-8 py-4">
          <Logo />
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => setLocation(link.path)}
                className="font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setLocation("/chat")}
            className="btn-primary text-sm"
          >
            免费检测
          </button>
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
              <span className="text-clay-gradient">皮肤状态</span>
            </h1>

            <p className="font-body text-[15px] text-[#7A6E68] leading-relaxed max-w-md mb-6 anim-fade-up d-200" style={{ fontWeight: 300 }}>
              上传一张照片，AI 将在 30 秒内为你生成专业的皮肤分析报告，包含 6 大维度评估、个性化护肤建议和产品推荐。
            </p>

            <div className="warm-divider max-w-md mb-6 anim-fade-up d-300" />

            <div className="flex gap-3 mb-6 anim-fade-up d-300">
              <button onClick={() => setLocation("/chat")} className="btn-primary">
                开始检测
              </button>
              <button className="btn-ghost" onClick={() => toast("专家咨询功能即将推出")}>咨询专家</button>
            </div>

            <div className="flex gap-5 mb-8 anim-fade-up d-400">
              <button
                onClick={() => setLocation("/calendar")}
                className="flex items-center gap-1.5 font-body text-xs text-[#9A8C82] hover:text-[#C17B5C] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                护肤日历
              </button>
              <button
                onClick={() => setLocation("/history")}
                className="flex items-center gap-1.5 font-body text-xs text-[#9A8C82] hover:text-[#C17B5C] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                历史记录
              </button>
            </div>

            <div className="flex gap-8 anim-fade-up d-500">
              {[
                { num: "98%", label: "准确率" },
                { num: "30s", label: "出结果" },
                { num: "12+", label: "检测维度" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-display text-xl font-light text-[#2D2420]">{stat.num}</span>
                  <span className="label-sm mt-0.5">{stat.label}</span>
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
                className="absolute inset-y-0 left-0 w-24"
                style={{ background: "linear-gradient(90deg, #F2EDE6 0%, transparent 100%)" }}
              />
            </div>

            {/* Floating Score Card */}
            <div className="absolute top-12 left-8 glass-card p-5 anim-scale-in d-400" style={{ width: 180 }}>
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
            <div className="absolute bottom-16 right-8 glass-card p-4 anim-scale-in d-600" style={{ width: 200 }}>
              <p className="label-sm mb-3">维度分析</p>
              <div className="space-y-2.5">
                {metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-[11px] text-[#7A6E68]">{m.label}</span>
                      <span className="font-body text-[11px] text-[#C17B5C] font-medium">{m.value}</span>
                    </div>
                    <div className="w-full h-1 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-900"
                        style={{
                          width: `${m.value}%`,
                          background: `rgba(193, 123, 92, ${0.4 + (m.value / 100) * 0.5})`,
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
        <footer className="relative z-10 flex items-center justify-between px-8 py-3 border-t border-[rgba(45,36,32,0.06)]">
          <p className="font-body text-[11px] text-[#B5ADA7]">© 2025 芯颜 AI · 专业皮肤智能分析</p>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#C17B5C]"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <span className="font-body text-[11px] text-[#B5ADA7]">服务运行中</span>
          </div>
        </footer>
      </div>

      {/* MobileTabBar - now shows on Home for mobile */}
      <MobileTabBar />
    </div>
  );
}
