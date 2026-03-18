/*
 * History.tsx — 历史记录
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定，左右两栏（桌面），堆叠（移动）
 * - 左侧：筛选面板（年月树状导航）
 * - 右侧：记录列表（按年月分组时间线）
 * - 底部显示 MobileTabBar
 */
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import ReportModal from "@/components/ReportModal";
import {
  ALL_RECORDS,
  getAvailableMonths,
  getRecordsForMonth,
  scoreColor,
  tagStyle,
  type SkinRecord,
} from "@/lib/mockData";

export default function History() {
  const [, setLocation] = useLocation();
  const [selectedRecord, setSelectedRecord] = useState<SkinRecord | null>(null);
  const [filterYear, setFilterYear] = useState<number | null>(null);
  const [filterMonth, setFilterMonth] = useState<number | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([2025, 2024]));

  const availableMonths = useMemo(() => getAvailableMonths(), []);

  // Group months by year
  const yearGroups = useMemo(() => {
    const groups: Record<number, number[]> = {};
    availableMonths.forEach(({ year, month }) => {
      if (!groups[year]) groups[year] = [];
      groups[year].push(month);
    });
    return groups;
  }, [availableMonths]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (filterYear && filterMonth) {
      return getRecordsForMonth(filterYear, filterMonth);
    }
    if (filterYear) {
      return ALL_RECORDS.filter((r) => r.date.startsWith(`${filterYear}`));
    }
    return [...ALL_RECORDS];
  }, [filterYear, filterMonth]);

  const sortedRecords = useMemo(
    () => [...filteredRecords].sort((a, b) => b.date.localeCompare(a.date)),
    [filteredRecords]
  );

  // Group by year-month for timeline
  const groupedRecords = useMemo(() => {
    const groups: { key: string; label: string; records: SkinRecord[] }[] = [];
    const map = new Map<string, SkinRecord[]>();
    sortedRecords.forEach((r) => {
      const key = r.date.substring(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    });
    map.forEach((records, key) => {
      const [y, m] = key.split("-");
      groups.push({ key, label: `${y} 年 ${parseInt(m)} 月`, records });
    });
    return groups;
  }, [sortedRecords]);

  const avgScore = useMemo(() => {
    if (sortedRecords.length === 0) return 0;
    return Math.round(sortedRecords.reduce((s, r) => s + r.score, 0) / sortedRecords.length);
  }, [sortedRecords]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

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
          onClick={() => setLocation("/calendar")}
          className="font-body text-sm text-[#C17B5C] hover:text-[#D4967A] transition-colors"
        >
          日历视图
        </button>
      </header>

      {/* Main */}
      <div className="flex-1 flex overflow-hidden md:pb-0" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
        {/* Left: Filter Panel (desktop) */}
        <div className="hidden md:flex flex-col w-[220px] border-r border-[rgba(45,36,32,0.06)] overflow-y-auto px-4 py-4">
          <button
            onClick={() => { setFilterYear(null); setFilterMonth(null); }}
            className={`w-full text-left px-3 py-2 rounded-lg font-body text-sm mb-3 transition-colors ${
              !filterYear ? "bg-[rgba(193,123,92,0.1)] text-[#C17B5C] font-medium" : "text-[#7A6E68] hover:bg-[rgba(45,36,32,0.04)]"
            }`}
          >
            全部记录
          </button>

          {/* Year/month tree */}
          {Object.entries(yearGroups)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([year, months]) => (
              <div key={year} className="mb-2">
                <button
                  onClick={() => {
                    toggleYear(Number(year));
                    setFilterYear(Number(year));
                    setFilterMonth(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                    filterYear === Number(year) && !filterMonth
                      ? "bg-[rgba(193,123,92,0.1)] text-[#C17B5C] font-medium"
                      : "text-[#7A6E68] hover:bg-[rgba(45,36,32,0.04)]"
                  }`}
                >
                  <span>{year} 年</span>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    className={`transition-transform ${expandedYears.has(Number(year)) ? "rotate-90" : ""}`}
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                {expandedYears.has(Number(year)) && (
                  <div className="ml-3 mt-1 space-y-0.5">
                    {months.sort((a, b) => b - a).map((month) => (
                      <button
                        key={month}
                        onClick={() => { setFilterYear(Number(year)); setFilterMonth(month); }}
                        className={`w-full text-left px-3 py-1.5 rounded-md font-body text-xs transition-colors ${
                          filterYear === Number(year) && filterMonth === month
                            ? "bg-[rgba(193,123,92,0.1)] text-[#C17B5C] font-medium"
                            : "text-[#9A8C82] hover:text-[#7A6E68] hover:bg-[rgba(45,36,32,0.03)]"
                        }`}
                      >
                        {month} 月
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>

        {/* Right: Records List */}
        <div className="flex-1 overflow-y-auto">
          {/* Stats bar */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-[rgba(45,36,32,0.06)] anim-fade-up">
            <div>
              <span className="label-sm">记录数</span>
              <p className="font-display text-xl font-light text-[#2D2420]">{sortedRecords.length}</p>
            </div>
            <div className="w-px h-8 bg-[rgba(45,36,32,0.08)]" />
            <div>
              <span className="label-sm">平均评分</span>
              <p className="font-display text-xl font-light text-[#C17B5C]">{avgScore}</p>
            </div>
            <div className="flex-1" />
            {/* Trend mini bars */}
            <div className="flex items-end gap-0.5 h-6">
              {sortedRecords.slice(0, 12).reverse().map((r, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full"
                  style={{
                    height: `${((r.score - 50) / 50) * 100}%`,
                    background: scoreColor(r.score),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Timeline groups */}
          <div className="px-5 py-4">
            {groupedRecords.map((group) => (
              <div key={group.key} className="mb-6">
                <h3 className="font-display text-sm font-normal text-[#2D2420] mb-3">{group.label}</h3>
                <div className="space-y-2">
                  {group.records.map((r) => {
                    const day = parseInt(r.date.split("-")[2]);
                    return (
                      <div
                        key={r.id}
                        className="card-warm p-4 flex items-center gap-4 cursor-pointer anim-fade-up"
                        onClick={() => setSelectedRecord(r)}
                      >
                        {/* Date number */}
                        <div className="w-10 text-center shrink-0">
                          <span className="font-display text-2xl font-light text-[#2D2420]">{day}</span>
                        </div>

                        {/* Vertical line */}
                        <div className="w-px h-10 bg-[rgba(45,36,32,0.1)] shrink-0" />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-body font-medium ${tagStyle(r.tag)}`}>
                              {r.tag}
                            </span>
                            <span className="font-body text-xs text-[#B5ADA7] truncate">{r.summary}</span>
                          </div>
                          {/* Mini metric bars */}
                          <div className="flex gap-1">
                            {r.metrics.slice(0, 6).map((m, i) => (
                              <div key={i} className="flex-1 h-1 bg-[rgba(45,36,32,0.04)] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${m.score}%`,
                                    background: scoreColor(m.score),
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Score + Arrow */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-display text-2xl font-light" style={{ color: scoreColor(r.score) }}>
                            {r.score}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {sortedRecords.length === 0 && (
              <div className="text-center py-16">
                <p className="font-body text-sm text-[#B5ADA7]">暂无记录</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileTabBar />
      <ReportModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />
    </div>
  );
}
