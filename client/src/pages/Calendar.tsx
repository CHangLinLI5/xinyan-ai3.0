/*
 * Calendar.tsx — 护肤日历
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定，左右两栏（桌面），堆叠（移动）
 * - 日历网格 + 侧边栏记录列表
 * - 有检测记录的日期显示赭石色圆点 + 分数
 * - 底部显示 MobileTabBar
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import ReportModal from "@/components/ReportModal";
import {
  getRecordsForMonth,
  getAvailableMonths,
  RECORDS_BY_DATE,
  scoreColor,
  tagStyle,
  type SkinRecord,
} from "@/lib/mockData";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export default function Calendar() {
  const [, setLocation] = useLocation();
  const availableMonths = useMemo(() => getAvailableMonths(), []);
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(3);
  const [selectedRecord, setSelectedRecord] = useState<SkinRecord | null>(null);

  const monthRecords = useMemo(
    () => getRecordsForMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const avgScore = useMemo(() => {
    if (monthRecords.length === 0) return 0;
    return Math.round(monthRecords.reduce((s, r) => s + r.score, 0) / monthRecords.length);
  }, [monthRecords]);

  // Calendar grid
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === currentYear &&
    today.getMonth() + 1 === currentMonth &&
    today.getDate() === day;

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const getDateKey = (day: number) =>
    `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="page-locked flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <Logo size="sm" />
        <button
          onClick={() => setLocation("/history")}
          className="font-body text-sm text-[#C17B5C] hover:text-[#D4967A] transition-colors"
        >
          历史记录
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden md:pb-0" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
        {/* Left: Calendar Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5 anim-fade-up">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(45,36,32,0.06)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6E68" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="text-center">
              <h2 className="font-display text-lg font-normal text-[#2D2420]">
                {currentYear} 年 {currentMonth} 月
              </h2>
              {monthRecords.length > 0 && (
                <span className="pill-clay text-[12px] mt-1">月均 {avgScore} 分</span>
              )}
            </div>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(45,36,32,0.06)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6E68" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 anim-fade-up d-100">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center label-sm py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1 anim-fade-up d-200">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day cells - Ch5.1: min-h-[44px], remove score text, keep dot only */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = getDateKey(day);
              const record = RECORDS_BY_DATE[dateKey];
              const todayMark = isToday(day);

              return (
                <div
                  key={day}
                  className={`min-h-[44px] rounded-lg flex flex-col items-center justify-center relative transition-all ${
                    record ? "cursor-pointer hover:bg-[rgba(193,123,92,0.08)] active:scale-95" : ""
                  } ${todayMark ? "ring-1 ring-[#C17B5C]" : ""}`}
                  onClick={() => record && setSelectedRecord(record)}
                >
                  {todayMark && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C17B5C]" />
                  )}
                  <span className={`font-body text-sm ${record ? "text-[#2D2420] font-medium" : "text-[#B5ADA7]"}`}>
                    {day}
                  </span>
                  {record && (
                    <div
                      className="w-2 h-2 rounded-full mt-1"
                      style={{ background: scoreColor(record.score) }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Ch5.1: Summary bar */}
          <div className="flex items-center justify-between mt-4 px-1 anim-fade-up d-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(193,123,92,0.9)" }} />
                <span className="font-body text-[12px] text-[#B5ADA7]">优秀</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(193,123,92,0.6)" }} />
                <span className="font-body text-[12px] text-[#B5ADA7]">良好</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(193,123,92,0.35)" }} />
                <span className="font-body text-[12px] text-[#B5ADA7]">关注</span>
              </div>
            </div>
            <span className="font-body text-[12px] text-[#B5ADA7]">{monthRecords.length} 次检测</span>
          </div>

          {/* Ch5.2: Mobile month records list */}
          <div className="md:hidden mt-5 space-y-2.5 anim-fade-up d-400">
            <p className="label-sm mb-2">本月记录</p>
            {monthRecords.length > 0 ? monthRecords.map((r) => (
              <div
                key={r.id}
                className="card-warm p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
                onClick={() => setSelectedRecord(r)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${scoreColor(r.score)}15` }}
                >
                  <span className="font-display text-base font-light" style={{ color: scoreColor(r.score) }}>{r.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[13px] font-medium text-[#2D2420]">{r.date.split("-").slice(1).join("/")}</span>
                    <span className={`text-[12px] px-1.5 py-0.5 rounded-full font-body ${tagStyle(r.tag)}`}>{r.tag}</span>
                  </div>
                  <p className="font-body text-[12px] text-[#9A8C82] mt-0.5 truncate">{r.summary}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )) : (
              <p className="font-body text-sm text-[#B5ADA7] text-center py-6">本月暂无记录</p>
            )}
          </div>
        </div>

        {/* Right: Sidebar (desktop) */}
        <div className="hidden md:flex flex-col w-[280px] border-l border-[rgba(45,36,32,0.06)] overflow-hidden">
          <div className="px-4 py-4 border-b border-[rgba(45,36,32,0.06)]">
            <p className="label-sm">本月记录</p>
            <p className="font-display text-2xl font-light text-[#2D2420] mt-1">{monthRecords.length} <span className="text-sm text-[#B5ADA7]">条</span></p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {monthRecords.map((r) => (
              <div
                key={r.id}
                className="card-warm p-3 cursor-pointer"
                onClick={() => setSelectedRecord(r)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-body text-xs text-[#7A6E68]">{r.date.split("-").slice(1).join("/")}</span>
                  <span className={`text-[12px] px-1.5 py-0.5 rounded-full font-body font-medium ${tagStyle(r.tag)}`}>
                    {r.tag}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl font-light" style={{ color: scoreColor(r.score) }}>
                    {r.score}
                  </span>
                  {/* Mini bars */}
                  <div className="flex items-end gap-0.5 h-5">
                    {r.metrics.slice(0, 6).map((m, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full"
                        style={{
                          height: `${(m.score / 100) * 100}%`,
                          background: scoreColor(m.score),
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="font-body text-[12px] text-[#9A8C82] mt-1 line-clamp-1">{r.summary}</p>
              </div>
            ))}

            {monthRecords.length === 0 && (
              <p className="font-body text-sm text-[#B5ADA7] text-center py-8">本月暂无记录</p>
            )}
          </div>

          <div className="px-4 py-3 border-t border-[rgba(45,36,32,0.06)]">
            <button
              onClick={() => setLocation("/history")}
              className="btn-ghost w-full text-sm"
            >
              查看全部历史
            </button>
          </div>
        </div>
      </div>

      <MobileTabBar />
      <ReportModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}
