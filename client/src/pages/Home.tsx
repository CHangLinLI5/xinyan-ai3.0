/*
 * Home.tsx — Landing 首页
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定，左文右图不对称布局
 * - 不显示 MobileTabBar
 * - 浮动毛玻璃评分卡片 + 维度条
 * - countUp 动画 + fadeUp 错开进入
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/hero-face-KvC8ByCEeL23Hap2YwZiKi.webp";

const metrics = [
  { label: "水分", value: 88 },
  { label: "油脂", value: 72 },
  { label: "色素", value: 65 },
  { label: "毛孔", value: 58 },
  { label: "亮度", value: 78 },
  { label: "弹性", value: 91 },
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
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const score = useCountUp(82);

  const navLinks = [
    { label: "检测", path: "/chat" },
    { label: "日历", path: "/calendar" },
    { label: "记录", path: "/history" },
    { label: "个人中心", path: "/profile" },
  ];

  const handleNav = useCallback((path: string) => {
    setMobileMenuOpen(false);
    setLocation(path);
  }, [setLocation]);

  return (
    <div className="page-locked flex flex-col">
      {/* ===== Top Nav ===== */}
      <header className="relative z-20 flex items-center justify-between px-5 md:px-8 py-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocation("/chat")}
            className="btn-primary text-sm hidden md:inline-flex"
          >
            免费检测
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`block w-5 h-[1.5px] bg-[#2D2420] transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[#2D2420] transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-[#2D2420] transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[rgba(242,237,230,0.98)] md:hidden anim-fade-in">
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {navLinks.map((link, i) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="font-display text-2xl font-light text-[#2D2420] hover:text-[#C17B5C] transition-colors anim-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("/chat")}
              className="btn-primary mt-4 anim-fade-up d-400"
            >
              免费检测
            </button>
          </div>
          <button
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D2420" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main className="flex-1 flex flex-col md:flex-row items-stretch overflow-hidden relative z-10">
        {/* Left: Text Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 py-8 md:py-0 md:max-w-[55%]">
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

          {/* Buttons */}
          <div className="flex gap-3 mb-6 anim-fade-up d-300">
            <button onClick={() => setLocation("/chat")} className="btn-primary">
              开始检测
            </button>
            <button className="btn-ghost" onClick={() => toast("专家咨询功能即将推出")}>咨询专家</button>
          </div>

          {/* Secondary links */}
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

          {/* Stats */}
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

        {/* Right: Hero Image (desktop only) */}
        <div className="hidden md:block relative flex-1 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={HERO_IMAGE}
              alt="皮肤分析"
              className="w-full h-full object-cover object-center anim-fade-in"
              style={{ filter: "brightness(1.02)" }}
            />
            {/* Gradient overlay on left edge */}
            <div
              className="absolute inset-y-0 left-0 w-24"
              style={{
                background: "linear-gradient(90deg, #F2EDE6 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Floating Score Card (top-left) */}
          <div className="absolute top-12 left-8 glass-card p-5 anim-scale-in d-400" style={{ width: 180 }}>
            <p className="label-sm mb-2">综合评分</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[3.2rem] font-light leading-none text-clay-gradient">
                {score}
              </span>
              <span className="font-body text-sm text-[#B5ADA7]">/100</span>
            </div>
            {/* Mini bar chart */}
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

          {/* Floating Metrics Card (bottom-right) */}
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

      {/* ===== Bottom Bar ===== */}
      <footer className="relative z-10 flex items-center justify-between px-5 md:px-8 py-3 border-t border-[rgba(45,36,32,0.06)]">
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
  );
}
