/*
 * Result.tsx — 分析结果页
 * Design: Warm Ivory Minimalism
 * Data: Reads AI-generated analysis from localStorage, falls back to DEFAULT_RESULT
 * 
 * 移动端：紧凑评分头部 + 横向维度滚动 + 全宽 Tab + 醒目聊天按钮
 * 桌面端：左侧评分面板 + 右侧 Tab 详情
 */
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { DEFAULT_RESULT, statusStyle, scoreColor } from "@/lib/mockData";
import type { SkinRecord } from "@/lib/mockData";

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

function ProgressBar({ score: s, delay }: { score: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setWidth(s), delay);
    return () => clearTimeout(timer);
  }, [s, delay]);
  return (
    <div className="w-full h-1.5 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          background: scoreColor(s),
          transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
    </div>
  );
}

export default function Result() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Try to load AI-generated result from localStorage
  const record: SkinRecord = useMemo(() => {
    try {
      const stored = localStorage.getItem("xinyan-analysis-result");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate essential fields
        if (parsed.score && parsed.metrics && Array.isArray(parsed.metrics)) {
          return parsed as SkinRecord;
        }
      }
    } catch {
      // Fall through to default
    }
    return DEFAULT_RESULT;
  }, []);

  const isAIGenerated = useMemo(() => {
    try {
      return !!localStorage.getItem("xinyan-analysis-result");
    } catch { return false; }
  }, []);

  const score = useCountUp(record.score);
  const tabs = ["问题分析", "护肤建议", "产品推荐"];

  // Swipe gesture for tabs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0 && activeTab < 2) setActiveTab((p) => p + 1);
      if (dx > 0 && activeTab > 0) setActiveTab((p) => p - 1);
    }
  }, [activeTab]);

  const handleSave = useCallback(() => {
    try {
      localStorage.setItem("xinyan-saved-report", JSON.stringify(record));
      toast.success("报告已保存到本地");
    } catch {
      toast.error("保存失败");
    }
  }, [record]);

  return (
    <div className="page-locked flex flex-col">
      {/* Header - glassmorphism */}
      <header className="flex items-center justify-between px-5 md:px-8 py-3 md:py-4 border-b border-[rgba(45,36,32,0.06)] z-10 shrink-0"
        style={{
          background: "rgba(242,237,230,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}>
        <button
          onClick={() => setLocation("/chat")}
          className="flex items-center gap-1.5 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          {isAIGenerated && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-body font-medium text-[#C17B5C] bg-[rgba(193,123,92,0.08)]">
              AI 分析
            </span>
          )}
        </div>
        <button
          className="font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors active:scale-95"
          onClick={handleSave}
        >
          保存
        </button>
      </header>

      {/* ===== MOBILE LAYOUT ===== */}
      <div className="md:hidden flex-1 flex flex-col overflow-hidden" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
        {/* Mobile Score Header */}
        <div className="px-5 pt-5 pb-4 anim-scale-in shrink-0">
          <div className="flex items-center gap-4">
            {/* Score Circle */}
            <div className="relative w-[88px] h-[88px] shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="38" fill="none" stroke="rgba(45,36,32,0.06)" strokeWidth="5" />
                <circle
                  cx="44" cy="44" r="38" fill="none"
                  stroke="#C17B5C"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${(record.score / 100) * 238.8} 238.8`}
                  style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.22, 1, 0.36, 1)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[1.75rem] font-light leading-none text-clay-gradient">{score}</span>
                <span className="font-body text-[12px] text-[#B5ADA7] mt-0.5">/ 100</span>
              </div>
            </div>

            {/* Score Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="pill-clay text-[12px] py-0.5 px-2.5">
                  {record.tag === "良好" ? "皮肤状态良好" : record.tag === "优秀" ? "皮肤状态优秀" : "需要关注"}
                </span>
              </div>
              <p className="font-body text-[12px] text-[#7A6E68] leading-relaxed" style={{ fontWeight: 300 }}>
                {record.summary}
              </p>
              <p className="font-body text-[12px] text-[#B5ADA7] mt-1">{record.date} · {record.metrics?.length || 6} 维度分析</p>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Metrics Scroll */}
        <div className="px-5 pb-4 shrink-0 anim-fade-up d-100 relative">
          <div className="absolute top-0 right-5 bottom-1 w-8 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, rgba(242,237,230,1) 0%, rgba(242,237,230,0) 100%)" }} />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            {record.metrics.map((m, i) => (
              <div
                key={i}
                className="shrink-0 w-[100px] rounded-xl p-3 border border-[rgba(45,36,32,0.06)] bg-[rgba(253,250,247,0.8)]"
              >
                <p className="font-body text-[12px] text-[#9A8C82] mb-1 truncate">{m.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-lg font-light" style={{ color: scoreColor(m.score) }}>
                    {m.score}
                  </span>
                </div>
                <div className="w-full h-1 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.score}%`,
                      background: scoreColor(m.score),
                      transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                      transitionDelay: `${0.3 + i * 0.1}s`,
                    }}
                  />
                </div>
                <span className={`inline-block mt-1.5 text-[12px] px-1.5 py-0.5 rounded-full font-body ${statusStyle(m.status)}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Chat CTA */}
        <div className="px-5 pb-3 shrink-0 anim-fade-up d-200">
          <button
            onClick={() => setLocation("/chat?from=result")}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-body text-sm font-medium transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #C17B5C 0%, #D4967A 100%)",
              color: "#FDFAF7",
              boxShadow: "0 4px 16px rgba(193, 123, 92, 0.3)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            和芯颜 AI 聊聊我的报告
          </button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex border-b border-[rgba(45,36,32,0.06)] px-4 shrink-0">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="flex-1 px-2 py-3 font-body text-[13px] transition-colors relative text-center"
              style={{
                color: activeTab === i ? "#C17B5C" : "#B5ADA7",
                fontWeight: activeTab === i ? 500 : 400,
              }}
            >
              {tab}
              {activeTab === i && (
                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#C17B5C] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Tab Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {activeTab === 0 && (
            <div className="space-y-3">
              {record.metrics.map((m, i) => (
                <div key={i} className="card-warm p-4 anim-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-body text-[13px] font-medium text-[#2D2420]">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-light" style={{ color: scoreColor(m.score) }}>
                        {m.score}
                      </span>
                      <span className={`text-[12px] px-2 py-0.5 rounded-full font-body font-medium ${statusStyle(m.status)}`}>
                        {m.status}
                      </span>
                    </div>
                  </div>
                  <ProgressBar score={m.score} delay={300 + i * 80} />
                  <p className="font-body text-[12px] text-[#9A8C82] leading-relaxed mt-2" style={{ fontWeight: 300 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              {record.advice.map((a, i) => (
                <div key={i} className="flex gap-3 anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="w-8 h-8 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-display text-sm font-light text-[#C17B5C]">{a.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body text-[14px] font-medium text-[#2D2420] mb-1">{a.title}</h4>
                    <p className="font-body text-[12px] text-[#7A6E68] leading-relaxed" style={{ fontWeight: 300 }}>
                      {a.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4 anim-fade-up" style={{ height: 140 }}>
                <img src={PRODUCT_HERO} alt="推荐产品" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(45,36,32,0.6) 0%, transparent 60%)" }}
                />
                <div className="absolute bottom-3 left-4">
                  <p className="font-display text-base text-white font-normal">精选护肤推荐</p>
                  <p className="font-body text-[12px] text-white/70 mt-0.5">
                    {isAIGenerated ? "由 AI 根据您的皮肤分析结果定制" : "根据您的皮肤分析结果定制"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {record.products.map((p, i) => (
                  <div key={i} className="card-warm p-3.5 flex gap-3 anim-fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[rgba(193,123,92,0.06)] flex items-center justify-center">
                      {PRODUCT_IMAGES[i] ? (
                        <img src={PRODUCT_IMAGES[i]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-body text-[13px] font-medium text-[#2D2420]">{p.name}</h4>
                          <p className="font-body text-[12px] text-[#B5ADA7]">{p.brand} · {p.type}</p>
                        </div>
                        <span className="font-display text-base font-light text-[#C17B5C] shrink-0">{p.price}</span>
                      </div>
                      <p className="font-body text-[12px] text-[#9A8C82] mt-1">{p.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT ===== */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left: Score Panel */}
        <div className="w-[340px] lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col items-center justify-center px-6 lg:px-8 border-r border-[rgba(45,36,32,0.06)]">
          <div className="text-center anim-scale-in">
            <div className="flex items-baseline justify-center gap-1 mb-3">
              <span className="font-display text-[clamp(3rem,8vw,5.5rem)] font-light leading-none text-clay-gradient">
                {score}
              </span>
              <span className="font-body text-lg text-[#B5ADA7]">/100</span>
            </div>

            <span className="pill-clay text-sm">
              {record.tag === "良好" ? "皮肤状态良好" : record.tag === "优秀" ? "皮肤状态优秀" : "需要关注"}
            </span>

            {isAIGenerated && (
              <p className="font-body text-[11px] text-[#B5ADA7] mt-2">
                由 GPT-5.4 AI 分析生成
              </p>
            )}

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
            <p className="font-body text-[12px] text-[#B5ADA7] mt-1">{record.metrics?.length || 6} 维度分析</p>

            {/* Desktop Chat CTA */}
            <div className="mt-6 space-y-2">
              <button
                onClick={() => setLocation("/chat?from=result")}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-200 hover:shadow-lg active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, #C17B5C 0%, #D4967A 100%)",
                  color: "#FDFAF7",
                  boxShadow: "0 2px 12px rgba(193, 123, 92, 0.25)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                和芯颜 AI 聊聊
              </button>
              <div className="flex gap-2">
                <button onClick={() => setLocation("/chat")} className="flex-1 btn-ghost text-[12px] py-2 rounded-lg">重新分析</button>
                <button className="flex-1 btn-ghost text-[12px] py-2 rounded-lg" onClick={handleSave}>保存报告</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-[rgba(45,36,32,0.06)] px-5 lg:px-8">
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

          <div className="flex-1 overflow-y-auto px-5 lg:px-8 py-5 lg:py-6">
            {activeTab === 0 && (
              <div className="space-y-4 max-w-3xl">
                {record.metrics.map((m, i) => (
                  <div key={i} className="card-warm p-4 lg:p-5 anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
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

            {activeTab === 1 && (
              <div className="space-y-6 max-w-3xl">
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

            {activeTab === 2 && (
              <div className="max-w-3xl">
                <div className="relative rounded-xl overflow-hidden mb-5 anim-fade-up" style={{ height: 200 }}>
                  <img src={PRODUCT_HERO} alt="推荐产品" className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(45,36,32,0.6) 0%, transparent 60%)" }}
                  />
                  <div className="absolute bottom-4 left-5">
                    <p className="font-display text-lg text-white font-normal">精选护肤推荐</p>
                    <p className="font-body text-xs text-white/70 mt-0.5">
                      {isAIGenerated ? "由 AI 根据您的皮肤分析结果定制" : "根据您的皮肤分析结果定制"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {record.products.map((p, i) => (
                    <div key={i} className="card-warm p-4 flex gap-4 anim-fade-up" style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[rgba(193,123,92,0.06)] flex items-center justify-center">
                        {PRODUCT_IMAGES[i] ? (
                          <img src={PRODUCT_IMAGES[i]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        )}
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

      <MobileTabBar />
    </div>
  );
}
