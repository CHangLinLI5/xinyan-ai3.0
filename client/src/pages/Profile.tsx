/*
 * Profile.tsx — 个人中心
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定
 * - 用户信息 + 统计卡片 + 设置列表
 * - localStorage 读写
 * - 底部显示 MobileTabBar
 */
import { useState, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { getProfile, saveProfile, getDaysSinceFirstVisit, clearAllData } from "@/lib/userStorage";
import { ALL_RECORDS } from "@/lib/mockData";
import { toast } from "sonner";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState(getProfile);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(profile.nickname);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const daysSinceFirst = useMemo(() => getDaysSinceFirstVisit(), []);

  const stats = useMemo(() => {
    const records = ALL_RECORDS;
    const total = records.length;
    const maxScore = records.length > 0 ? Math.max(...records.map((r) => r.score)) : 0;
    const avgScore = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0;
    return { total, maxScore, avgScore };
  }, []);

  const handleSaveNickname = useCallback(() => {
    const newProfile = { ...profile, nickname: nicknameInput.trim() || "芯颜用户" };
    setProfile(newProfile);
    saveProfile(newProfile);
    setIsEditingNickname(false);
    toast.success("昵称已更新");
  }, [profile, nicknameInput]);

  const handleToggleReminder = useCallback(() => {
    const newProfile = { ...profile, reminderEnabled: !profile.reminderEnabled };
    setProfile(newProfile);
    saveProfile(newProfile);
    toast.success(newProfile.reminderEnabled ? "已开启检测提醒" : "已关闭检测提醒");
  }, [profile]);

  const handleClearData = useCallback(() => {
    clearAllData();
    setProfile(getProfile());
    setShowClearConfirm(false);
    toast.success("所有数据已清除");
  }, []);

  return (
    <div className="page-locked flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10">
        <Logo size="sm" />
        <button
          onClick={() => setLocation("/")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(45,36,32,0.06)] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7A6E68" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto md:pb-0" style={{ paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px) + 8px)' }}>
        <div className="max-w-md mx-auto px-5 py-8">
          {/* User Info */}
          <div className="flex flex-col items-center mb-8 anim-fade-up">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ background: "rgba(193, 123, 92, 0.15)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Nickname */}
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNickname()}
                  className="font-display text-lg text-center bg-transparent border-b border-[rgba(193,123,92,0.4)] focus:outline-none px-2 py-1"
                  autoFocus
                />
                <button onClick={handleSaveNickname} className="text-[#C17B5C] font-body text-sm">
                  保存
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setIsEditingNickname(true); setNicknameInput(profile.nickname); }}
                className="font-display text-lg font-normal text-[#2D2420] hover:text-[#C17B5C] transition-colors"
              >
                {profile.nickname}
              </button>
            )}

            <p className="font-body text-xs text-[#B5ADA7] mt-1">
              使用芯颜 AI 已 {daysSinceFirst} 天
            </p>
          </div>

          {/* Stats Cards */}
          <div className="card-warm p-5 mb-6 anim-fade-up d-100">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "总检测", value: stats.total, suffix: "次" },
                { label: "最高评分", value: stats.maxScore, suffix: "" },
                { label: "平均评分", value: stats.avgScore, suffix: "" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl font-light text-[#2D2420]">
                    {stat.value}
                    {stat.suffix && <span className="text-sm text-[#B5ADA7] ml-0.5">{stat.suffix}</span>}
                  </p>
                  <p className="label-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Settings List */}
          <div className="card-warm overflow-hidden mb-6 anim-fade-up d-200">
            {/* 个人资料 */}
            <button
              onClick={() => { setIsEditingNickname(true); setNicknameInput(profile.nickname); }}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[rgba(45,36,32,0.03)] transition-colors"
            >
              <span className="font-body text-sm text-[#2D2420]">个人资料</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="warm-divider mx-5" />

            {/* 检测提醒 */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="font-body text-sm text-[#2D2420]">检测提醒</span>
              <button
                onClick={handleToggleReminder}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: profile.reminderEnabled ? "#C17B5C" : "rgba(45, 36, 32, 0.12)",
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                  style={{
                    left: profile.reminderEnabled ? "calc(100% - 18px)" : "2px",
                  }}
                />
              </button>
            </div>

            <div className="warm-divider mx-5" />

            {/* 深色模式 */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="font-body text-sm text-[#B5ADA7]">深色模式</span>
                <span className="pill-clay text-[9px]">即将推出</span>
              </div>
              <button
                disabled
                className="relative w-10 h-5 rounded-full opacity-40"
                style={{ background: "rgba(45, 36, 32, 0.12)" }}
              >
                <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="warm-divider mx-5" />

            {/* 清除数据 */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[rgba(45,36,32,0.03)] transition-colors"
            >
              <span className="font-body text-sm text-[#C0392B]">清除所有数据</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="warm-divider mx-5" />

            {/* 关于 */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <span className="font-body text-sm text-[#2D2420]">关于芯颜 AI</span>
              <span className="font-body text-xs text-[#B5ADA7]">v1.0</span>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center font-body text-[11px] text-[#B5ADA7] anim-fade-up d-300">
            © 2025 芯颜 AI · 专业皮肤智能分析
          </p>
        </div>
      </div>

      {/* Clear Data Confirmation Dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[rgba(45,36,32,0.25)]"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="relative glass-card p-6 mx-4 max-w-sm w-full anim-scale-in">
            <h3 className="font-display text-lg font-normal text-[#2D2420] mb-2">确认清除数据</h3>
            <p className="font-body text-sm text-[#7A6E68] mb-5">
              此操作将清除所有本地存储的用户数据和检测记录，且无法恢复。确定要继续吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn-ghost flex-1"
              >
                取消
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 inline-flex items-center justify-center bg-[#C0392B] text-white rounded-md px-4 py-2.5 font-body text-sm font-medium hover:bg-[#a93226] transition-colors"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileTabBar />
    </div>
  );
}
