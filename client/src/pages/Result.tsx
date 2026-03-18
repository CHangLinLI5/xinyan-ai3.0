/*
 * Result.tsx — 分析结果页
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定，两栏（桌面）/堆叠（移动）
 * - 左侧：大号评分 + countUp + 微型柱状图
 * - 右侧：3 tabs（问题分析/护肤建议/产品推荐）
 * - 底部操作栏
 * - 底部显示 MobileTabBar
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { DEFAULT_RESULT, statusStyle, scoreColor } from "@/lib/mockData";

const PRODUCT_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/skincare-product-hero-7UGb9NEjxQiSGnBjm4dLGf.webp";
const PRODUCT_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/skincare-product-1-iSiVNL9nNGuKPB3o2X45DK.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/skincare-product-2-aYoFFSq54mT9TcuvNGhFjj.webp",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/skincare-product-3-nJgAsCzivkNAkTa5GUihgW.webp",
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

function ProgressBar({ score, delay }: { score: number; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(timer);
  }, [score, delay]);
  return (
    <div ref={ref} className="w-full h-1.5 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: scoreColor(score),
          transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

export default function Result() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const record = DEFAULT_RESULT;
  const score = useCountUp(record.score);

  const tabs = ["问题分析", "护肤建议", "产品推荐"];

  return (
    <div className="page-locked flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10">
        <button
          onClick={() => setLocation("/chat")}
          className="flex items-center gap-1 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <Logo size="sm" />
        <div className="w-12" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden pb-[72px] md:pb-0">
        {/* Left: Score Panel */}
        <div className="md:w-[340px] lg:w-[380px] shrink-0 flex flex-col items-center justify-center px-6 py-8 md:py-0 md:border-r md:border-[rgba(45,36,32,0.06)]">
          <div className="text-center anim-scale-in">
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="font-display text-[clamp(3rem,8vw,5.5rem)] font-light leading-none text-clay-gradient">
                {score}
              </span>
              <span className="font-body text-lg text-[#B5ADA7]">/100</span>
            </div>

            <span className="pill-clay text-sm">{record.tag === "良好" ? "皮肤状态良好" : record.tag}</span>

            {/* Mini bar chart */}
            <div className="flex items-end justify-center gap-2 mt-6 h-12">
              {record.metrics.map((m, i) => (
                <div
                  key={i}
                  className="w-3 rounded-sm anim-fade-up"
                  style={{
                    height: `${(m.score / 100) * 100}%`,
                    background: scoreColor(m.score),
                    animationDelay: `${0.3 + i * 0.08}s`,
                  }}
                />
              ))}
            </div>

            <p className="font-body text-xs text-[#B5ADA7] mt-4">{record.date}</p>
            <p className="font-body text-[11px] text-[#B5ADA7] mt-1">6 维度分析</p>
          </div>
        </div>

        {/* Right: Detail Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[rgba(45,36,32,0.06)] px-5">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className="px-5 py-3.5 font-body text-sm transition-colors relative"
                style={{
                  color: activeTab === i ? "#C17B5C" : "#B5ADA7",
                  fontWeight: activeTab === i ? 500 : 400,
                }}
              >
                {tab}
                {activeTab === i && (
                  <div className="absolute bottom-0 left-5 right-5 h-[2px] bg-[#C17B5C] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {/* Tab 0: 问题分析 */}
            {activeTab === 0 && (
              <div className="space-y-4 max-w-2xl">
                {record.metrics.map((m, i) => (
                  <div key={i} className="card-warm p-4 anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="label-sm">{m.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${statusStyle(m.status)}`}>
                        {m.status}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-display text-2xl font-light" style={{ color: scoreColor(m.score) }}>
                        {m.score}
                      </span>
                      <span className="text-[#B5ADA7] text-xs font-body">/100</span>
                    </div>
                    <ProgressBar score={m.score} delay={300 + i * 100} />
                    <p className="font-body text-xs text-[#9A8C82] leading-relaxed mt-2">{m.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 1: 护肤建议 */}
            {activeTab === 1 && (
              <div className="space-y-6 max-w-2xl">
                {record.advice.map((a, i) => (
                  <div key={i} className="flex gap-5 anim-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <span className="font-display text-[2.75rem] font-light text-[rgba(193,123,92,0.25)] leading-none shrink-0 w-16 text-right">
                      {a.step}
                    </span>
                    <div className="flex-1 pt-2">
                      <h4 className="font-display text-[1.35rem] font-normal text-[#2D2420] mb-2">{a.title}</h4>
                      <p className="font-body text-sm text-[#7A6E68] leading-relaxed" style={{ fontWeight: 300 }}>
                        {a.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: 产品推荐 */}
            {activeTab === 2 && (
              <div className="max-w-2xl">
                {/* Hero product image */}
                <div className="relative rounded-xl overflow-hidden mb-5 anim-fade-up" style={{ height: 200 }}>
                  <img src={PRODUCT_HERO} alt="推荐产品" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(45,36,32,0.6) 0%, transparent 60%)" }}
                  />
                  <div className="absolute bottom-4 left-5">
                    <p className="font-display text-lg text-white font-normal">精选护肤推荐</p>
                    <p className="font-body text-xs text-white/70 mt-0.5">根据您的皮肤分析结果定制</p>
                  </div>
                </div>

                {/* Product cards */}
                <div className="space-y-3">
                  {record.products.map((p, i) => (
                    <div key={i} className="card-warm p-4 flex gap-4 anim-fade-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img src={PRODUCT_IMAGES[i]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-body text-sm font-medium text-[#2D2420]">{p.name}</h4>
                            <p className="font-body text-xs text-[#B5ADA7]">{p.brand} · {p.type}</p>
                          </div>
                          <span className="font-display text-lg font-light text-[#C17B5C]">{p.price}</span>
                        </div>
                        <p className="font-body text-xs text-[#9A8C82] mt-1.5">{p.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-[rgba(45,36,32,0.06)] px-5 py-3 flex gap-3 justify-center bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10 pb-[calc(0.75rem+72px)] md:pb-3">
        <button onClick={() => setLocation("/chat")} className="btn-primary">重新分析</button>
        <button
          onClick={() => { window.location.href = "/chat?from=result"; }}
          className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-body text-sm font-medium transition-all duration-200 bg-[#2D2420] text-[#F2EDE6] hover:bg-[#3D342F] active:scale-[0.97]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          和芯颜AI聊天
        </button>
        <button className="btn-ghost" onClick={() => toast("报告已保存到本地")}>保存报告</button>
      </div>

      <MobileTabBar />
    </div>
  );
}
