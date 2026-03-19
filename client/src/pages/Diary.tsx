/*
 * Diary.tsx — 皮肤日记
 * Design: Warm Ivory Minimalism — 单栏居中布局
 * 上方：表单 → 下方：趋势+洞察+历史
 */
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import SubPageLayout from "@/components/SubPageLayout";
import {
  getDiaryEntries,
  saveDiaryEntry,
  getTodayDiary,
} from "@/lib/agentStorage";
import {
  SKIN_ISSUES,
  MOOD_EMOJIS,
  MOOD_LABELS,
  type DiaryEntry,
} from "@/lib/mockAgentData";
import { generateInsights, insightTypeColor, insightTypeBg } from "@/lib/diaryInsights";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Diary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<DiaryEntry | null>(null);

  const [mood, setMood] = useState<number>(3);
  const [issues, setIssues] = useState<string[]>([]);
  const [sleep, setSleep] = useState<"less6" | "6to8" | "more8">("6to8");
  const [water, setWater] = useState<"less4" | "4to8" | "more8">("4to8");
  const [stress, setStress] = useState<"low" | "medium" | "high">("low");
  const [exercise, setExercise] = useState<"none" | "light" | "moderate">("none");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const all = getDiaryEntries();
    setEntries(all);
    const today = getTodayDiary();
    if (today) {
      setTodayEntry(today);
      setMood(today.mood);
      setIssues(today.issues);
      setSleep(today.habits.sleep);
      setWater(today.habits.water);
      setStress(today.habits.stress);
      setExercise(today.habits.exercise);
      setNote(today.note);
      setSaved(true);
    }
  }, []);

  const insights = useMemo(() => generateInsights(entries), [entries]);
  const recent7 = useMemo(() => entries.slice(-7), [entries]);

  const toggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]
    );
    setSaved(false);
  };

  const handleSave = () => {
    const entry: DiaryEntry = {
      id: `diary-${todayStr()}`,
      date: todayStr(),
      mood: mood as 1 | 2 | 3 | 4 | 5,
      issues,
      habits: { sleep, water, stress, exercise, period: null },
      note,
      createdAt: Date.now(),
    };
    saveDiaryEntry(entry);
    setTodayEntry(entry);
    setEntries(getDiaryEntries());
    setSaved(true);
    toast.success("今日日记已保存");
  };

  const HabitRow = ({
    label,
    options,
    value,
    onChange,
  }: {
    label: string;
    options: readonly (readonly [string, string])[];
    value: string;
    onChange: (v: any) => void;
  }) => (
    <div className="flex items-center gap-2">
      <span className="font-body text-[12px] text-[#9A8C82] w-10 shrink-0">{label}</span>
      <div className="flex gap-1.5 flex-1">
        {options.map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => { onChange(val); setSaved(false); }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-body transition-all ${
              value === val
                ? "bg-[rgba(193,123,92,0.12)] text-[#C17B5C] font-medium"
                : "bg-[rgba(237,232,224,0.4)] text-[#9A8C82]"
            }`}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <SubPageLayout title="皮肤日记" subtitle="记录每日皮肤状态，追踪变化趋势" accentColor="#C17B5C">
      {/* ===== Form ===== */}
      <div className="space-y-4">
        {/* Mood */}
        <div>
          <p className="font-body text-[12px] text-[#7A6E68] mb-2 font-medium">今日皮肤状态</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                onClick={() => { setMood(m); setSaved(false); }}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl transition-all duration-300 ${
                  mood === m
                    ? "bg-[rgba(193,123,92,0.1)] border border-[rgba(193,123,92,0.25)] scale-105 shadow-sm"
                    : "bg-[rgba(237,232,224,0.4)] border border-transparent hover:bg-[rgba(237,232,224,0.7)] hover:scale-[1.02]"
                }`}
              >
                <span className="text-[20px]">{MOOD_EMOJIS[m]}</span>
                <span className="font-body text-[10px]" style={{ color: mood === m ? "#C17B5C" : "#B5ADA7" }}>
                  {MOOD_LABELS[m]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Issues */}
        <div>
          <p className="font-body text-[12px] text-[#7A6E68] mb-2 font-medium">皮肤问题</p>
          <div className="flex flex-wrap gap-1.5">
            {SKIN_ISSUES.map((issue) => (
              <button
                key={issue}
                onClick={() => toggleIssue(issue)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-body transition-all duration-300 ${
                  issues.includes(issue)
                    ? "bg-[#C17B5C] text-white shadow-sm scale-105"
                    : "bg-[rgba(237,232,224,0.5)] text-[#7A6E68] hover:bg-[rgba(237,232,224,0.8)] hover:scale-[1.02]"
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-2">
          <p className="font-body text-[12px] text-[#7A6E68] font-medium">生活习惯</p>
          <HabitRow label="睡眠" options={[["less6", "<6h"], ["6to8", "6-8h"], ["more8", "8h+"]] as const} value={sleep} onChange={setSleep} />
          <HabitRow label="饮水" options={[["less4", "<4杯"], ["4to8", "4-8杯"], ["more8", "8杯+"]] as const} value={water} onChange={setWater} />
          <HabitRow label="压力" options={[["low", "低"], ["medium", "中"], ["high", "高"]] as const} value={stress} onChange={setStress} />
          <HabitRow label="运动" options={[["none", "无"], ["light", "轻度"], ["moderate", "中度"]] as const} value={exercise} onChange={setExercise} />
        </div>

        {/* Note */}
        <div>
          <p className="font-body text-[12px] text-[#7A6E68] mb-1.5 font-medium">备注</p>
          <textarea
            value={note}
            onChange={(e) => { setNote(e.target.value); setSaved(false); }}
            placeholder="记录今天皮肤的感受..."
            className="w-full h-16 px-3 py-2 rounded-xl text-[12px] font-body text-[#2D2420] placeholder:text-[#B5ADA7] resize-none focus:outline-none focus:ring-1 focus:ring-[rgba(193,123,92,0.3)] bg-[rgba(237,232,224,0.4)] border border-[rgba(45,36,32,0.06)]"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className={`w-full py-2.5 rounded-xl font-body text-[13px] font-medium transition-all ${
            saved
              ? "bg-[rgba(74,154,107,0.08)] text-[#4A9A6B]"
              : "btn-primary w-full"
          }`}
        >
          {saved ? "✓ 已保存" : todayEntry ? "更新今日日记" : "保存今日日记"}
        </button>
      </div>

      {/* ===== Divider ===== */}
      <div className="warm-divider my-6" />

      {/* ===== 7-Day Trend ===== */}
      <div className="card-warm p-4 mb-4">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2.5">7日情绪趋势</p>
        {recent7.length > 0 ? (
          <div className="flex items-end gap-1.5 h-24 stagger-children">
            {recent7.map((e, idx) => {
              const h = (e.mood / 5) * 100;
              const dayLabel = e.date.slice(5).replace("-", "/");
              return (
                <div key={e.id} className="flex-1 flex flex-col items-center gap-1 group/bar">
                  <span className="text-[14px] group-hover/bar:scale-125 transition-transform duration-300">{MOOD_EMOJIS[e.mood]}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: 48 }}>
                    <div
                      className="w-3/4 rounded-t-md transition-all duration-500 group-hover/bar:w-full"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, rgba(193,123,92,${0.3 + (e.mood / 5) * 0.5}), rgba(193,123,92,${0.1 + (e.mood / 5) * 0.3}))`,
                        animationDelay: `${idx * 0.08}s`,
                      }}
                    />
                  </div>
                  <span className="font-body text-[10px] text-[#B5ADA7]">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-body text-[12px] text-[#B5ADA7] text-center py-4">暂无数据</p>
        )}
      </div>

      {/* ===== AI Insights ===== */}
      {insights.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="font-body text-[12px] text-[#7A6E68] font-medium">芯颜洞察</p>
          {insights.map((insight, i) => (
            <div
              key={i}
              className="rounded-xl px-3.5 py-3 hover-lift"
              style={{ background: insightTypeBg(insight.type), border: `1px solid ${insightTypeColor(insight.type)}15` }}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[13px]">{insight.icon}</span>
                <span className="font-body text-[12px] font-medium" style={{ color: insightTypeColor(insight.type) }}>
                  {insight.title}
                </span>
              </div>
              <p className="font-body text-[11px] text-[#7A6E68] leading-relaxed">{insight.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* ===== History ===== */}
      <div>
        <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">历史日记</p>
        <div className="space-y-1.5">
          {[...entries].reverse().slice(0, 10).map((e) => (
            <div key={e.id} className="card-warm px-3.5 py-2.5 flex items-center gap-2.5 hover-lift">
              <span className="text-[18px]">{MOOD_EMOJIS[e.mood]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[12px] text-[#2D2420] font-medium">
                    {e.date.slice(5).replace("-", "月")}日
                  </span>
                  <span className="font-body text-[11px] text-[#B5ADA7]">{MOOD_LABELS[e.mood]}</span>
                </div>
                {e.issues.length > 0 && (
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {e.issues.slice(0, 3).map((issue) => (
                      <span key={issue} className="font-body text-[10px] text-[#C17B5C] bg-[rgba(193,123,92,0.06)] px-1.5 py-0.5 rounded-full">{issue}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SubPageLayout>
  );
}
