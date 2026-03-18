/*
 * ReportModal — 报告详情弹窗
 * Design: Warm Ivory Minimalism
 * - 从右侧滑入面板 width: min(520px, 100vw)
 * - 半透明遮罩
 * - 3 tabs: 问题分析 / 护肤建议 / 产品推荐
 */
import { useState, useEffect } from "react";
import type { SkinRecord } from "@/lib/mockData";
import { statusStyle, scoreColor } from "@/lib/mockData";

interface ReportModalProps {
  record: SkinRecord | null;
  onClose: () => void;
}

export default function ReportModal({ record, onClose }: ReportModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (record) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [record]);

  if (!record) return null;

  const tabs = ["问题分析", "护肤建议", "产品推荐"];

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "rgba(45, 36, 32, 0.25)",
          opacity: isVisible ? 1 : 0,
        }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="absolute top-0 right-0 h-full bg-[#F2EDE6] shadow-2xl flex flex-col"
        style={{
          width: "min(520px, 100vw)",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(45,36,32,0.08)]">
          <div>
            <h2 className="font-display text-lg font-normal text-[#2D2420]">皮肤分析报告</h2>
            <p className="font-body text-xs text-[#B5ADA7] mt-0.5">{record.date}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(45,36,32,0.06)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6E68" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Score Bar */}
        <div className="px-6 py-4 flex items-center gap-4">
          <span className="font-display text-4xl font-light text-clay-gradient">{record.score}</span>
          <span className="text-[#B5ADA7] font-body text-sm">/100</span>
          <span className={`pill-clay ml-2`}>{record.tag}</span>
          <div className="flex-1" />
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-8">
            {record.metrics.slice(0, 6).map((m, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full"
                style={{
                  height: `${(m.score / 100) * 100}%`,
                  background: scoreColor(m.score),
                }}
              />
            ))}
          </div>
        </div>
        <p className="px-6 pb-3 font-body text-sm text-[#7A6E68]">{record.summary}</p>

        <div className="warm-divider mx-6" />

        {/* Tabs */}
        <div className="flex gap-0 px-6 pt-4">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 font-body text-sm transition-colors relative"
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

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === 0 && (
            <div className="space-y-4">
              {record.metrics.map((m, i) => (
                <div key={i} className="card-warm p-4">
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
                  <div className="w-full h-1.5 bg-[rgba(45,36,32,0.06)] rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${m.score}%`,
                        background: scoreColor(m.score),
                      }}
                    />
                  </div>
                  <p className="font-body text-xs text-[#9A8C82] leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-5">
              {record.advice.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <span className="font-display text-3xl font-light text-[rgba(193,123,92,0.3)] leading-none shrink-0">
                    {a.step}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-normal text-[#2D2420] mb-1">{a.title}</h4>
                    <p className="font-body text-sm text-[#7A6E68] leading-relaxed">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-3">
              {record.products.map((p, i) => (
                <div key={i} className="card-warm p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h4 className="font-body text-sm font-medium text-[#2D2420]">{p.name}</h4>
                      <p className="font-body text-xs text-[#B5ADA7]">{p.brand} · {p.type}</p>
                    </div>
                    <span className="font-display text-lg font-light text-[#C17B5C]">{p.price}</span>
                  </div>
                  <p className="font-body text-xs text-[#9A8C82] mt-2">{p.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(45,36,32,0.08)]">
          <button onClick={handleClose} className="btn-ghost w-full">关闭</button>
        </div>
      </div>
    </div>
  );
}
