/*
 * Home.tsx — 首页
 * Design: Warm Ivory Minimalism
 * 
 * 移动端：无 hero 图片，紧凑上传区 + 6维度标签 + 快捷提问胶囊 + 小统计
 * 桌面端：保留左文右图不对称布局 + 浮动卡片
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
  "适合什么护肤品？",
  "改善毛孔粗大",
  "敏感肌护理",
  "美白淡斑方法",
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

        {/* Greeting + Upload CTA */}
        <div className="px-5 pt-2 pb-4 anim-fade-up">
          <h1 className="font-display text-[1.5rem] font-light text-[#2D2420] leading-tight">
            你好，<span className="text-clay-gradient">开始检测</span>
          </h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-1" style={{ fontWeight: 300 }}>
            上传照片，AI 30 秒生成专业分析报告
          </p>
        </div>

        {/* Upload Card - prominent but compact */}
        <div className="px-4 mb-4 anim-fade-up d-100">
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: "linear-gradient(135deg, rgba(193,123,92,0.08) 0%, rgba(193,123,92,0.03) 100%)",
              border: "1.5px solid rgba(193,123,92,0.15)",
            }}
          >
            <div className="flex items-center gap-4 p-4">
              {/* Camera icon circle */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
                  boxShadow: "0 4px 12px rgba(193,123,92,0.3)",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-body text-[14px] font-medium text-[#2D2420]">拍照 / 上传面部照片</p>
                <p className="font-body text-[11px] text-[#B5ADA7] mt-0.5">正面清晰照片效果最佳</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-50">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* 6 Dimension Badges - horizontal scroll */}
        <div className="px-4 mb-4 anim-fade-up d-150">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="font-body text-[11px] text-[#B5ADA7] tracking-wider">6 维度智能分析</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg"
                style={{
                  background: "rgba(253,250,247,0.8)",
                  border: "1px solid rgba(45,36,32,0.05)",
                }}
              >
                <span className="text-[12px]">{m.icon}</span>
                <span className="font-body text-[11px] text-[#5A4F49]">{m.label}</span>
                <span className="font-body text-[11px] text-[#C17B5C] font-medium ml-auto">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Questions - horizontal pill scroll */}
        <div className="px-4 mb-4 anim-fade-up d-200">
          <p className="font-body text-[11px] text-[#B5ADA7] tracking-wider mb-2">快捷提问</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setLocation("/chat")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-body text-[#5A4F49] hover:text-[#C17B5C] transition-colors active:scale-[0.96]"
                style={{
                  background: "rgba(253,250,247,0.8)",
                  border: "1px solid rgba(45,36,32,0.06)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 shrink-0">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Stats + Quick Links Row */}
        <div className="px-4 mb-4 anim-fade-up d-250">
          <div className="flex gap-2">
            {/* Stats mini card */}
            <div
              className="flex-1 flex items-center justify-around py-2.5 rounded-xl"
              style={{
                background: "rgba(253,250,247,0.8)",
                border: "1px solid rgba(45,36,32,0.05)",
              }}
            >
              {[
                { num: "98%", label: "准确率" },
                { num: "30s", label: "出结果" },
                { num: "6", label: "维度" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col items-center px-2">
                  <span className="font-display text-[14px] font-light text-[#2D2420]">{stat.num}</span>
                  <span className="font-body text-[9px] text-[#B5ADA7]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Nav Buttons */}
        <div className="px-4 mb-6 anim-fade-up d-300">
          <div className="flex gap-2">
            <button
              onClick={() => setLocation("/calendar")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              style={{
                background: "rgba(253,250,247,0.8)",
                border: "1px solid rgba(45,36,32,0.05)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="font-body text-[12px] text-[#5A4F49]">护肤日历</span>
            </button>
            <button
              onClick={() => setLocation("/history")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              style={{
                background: "rgba(253,250,247,0.8)",
                border: "1px solid rgba(45,36,32,0.05)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span className="font-body text-[12px] text-[#5A4F49]">历史记录</span>
            </button>
            <button
              onClick={() => setLocation("/chat")}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl transition-all active:scale-[0.97]"
              style={{
                background: "rgba(253,250,247,0.8)",
                border: "1px solid rgba(45,36,32,0.05)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span className="font-body text-[12px] text-[#5A4F49]">AI 对话</span>
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

      {/* MobileTabBar */}
      <MobileTabBar />
    </div>
  );
}
