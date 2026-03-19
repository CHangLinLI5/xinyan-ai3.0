/*
 * MobileTabBar — 移动端底部导航 (Agent 3.0)
 * Design: Warm Ivory Minimalism
 * 5 tabs: 首页 / 日记 / 检测(C位凸起) / 发现 / 我的
 * 检测按钮使用凸起圆形设计，突出核心功能
 */
import { useLocation } from "wouter";

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const DiaryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const CameraIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const DiscoverIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const sideTabs = [
  { label: "首页", path: "/", icon: <HomeIcon /> },
  { label: "日记", path: "/diary", icon: <DiaryIcon /> },
  // center tab is separate
  { label: "发现", path: "/discover", icon: <DiscoverIcon /> },
  { label: "我的", path: "/profile", icon: <ProfileIcon /> },
];

export default function MobileTabBar() {
  const [location, setLocation] = useLocation();

  const getIsActive = (path: string) => {
    if (path === "/") return location === "/";
    if (path === "/chat") return location === "/chat" || location === "/result";
    if (path === "/diary") return location === "/diary" || location === "/routine";
    if (path === "/discover") return location === "/discover" || location === "/ingredients" || location === "/conflict";
    return location === path;
  };

  const isCenterActive = getIsActive("/chat");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        height: `calc(56px + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: `env(safe-area-inset-bottom, 0px)`,
        background: "rgba(242, 237, 230, 0.88)",
        backdropFilter: "blur(16px) saturate(1.5)",
        WebkitBackdropFilter: "blur(16px) saturate(1.5)",
        borderTop: "1px solid rgba(45, 36, 32, 0.06)",
        boxShadow: "0 -1px 12px rgba(45, 36, 32, 0.04)",
      }}
    >
      <div className="flex items-center justify-around h-[56px] relative">
        {/* Left two tabs */}
        {sideTabs.slice(0, 2).map((tab) => {
          const isActive = getIsActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative"
              style={{ color: isActive ? "#C17B5C" : "#B5ADA7" }}
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {tab.icon}
              </div>
              <span
                className="font-body mt-0.5"
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#C17B5C]"
                  style={{ animation: "fadeIn 0.2s ease-out" }}
                />
              )}
            </button>
          );
        })}

        {/* Center Detection Tab - Elevated */}
        <div className="flex-1 flex items-center justify-center h-full relative">
          <button
            onClick={() => setLocation("/chat")}
            className="absolute -top-5 flex flex-col items-center transition-all duration-200 active:scale-95"
          >
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
              style={{
                background: isCenterActive
                  ? "linear-gradient(145deg, #C17B5C 0%, #D4956F 100%)"
                  : "linear-gradient(145deg, #C17B5C 0%, #D4956F 100%)",
                boxShadow: isCenterActive
                  ? "0 4px 16px rgba(193,123,92,0.4), 0 0 0 3px rgba(193,123,92,0.15)"
                  : "0 4px 16px rgba(193,123,92,0.3)",
                color: "white",
              }}
            >
              <CameraIcon />
            </div>
            <span
              className="font-body mt-1"
              style={{
                fontSize: "11px",
                fontWeight: isCenterActive ? 600 : 500,
                color: isCenterActive ? "#C17B5C" : "#9A8C82",
                letterSpacing: "0.02em",
              }}
            >
              检测
            </span>
          </button>
        </div>

        {/* Right two tabs */}
        {sideTabs.slice(2).map((tab) => {
          const isActive = getIsActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative"
              style={{ color: isActive ? "#C17B5C" : "#B5ADA7" }}
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {tab.icon}
              </div>
              <span
                className="font-body mt-0.5"
                style={{
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
              {isActive && (
                <div
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#C17B5C]"
                  style={{ animation: "fadeIn 0.2s ease-out" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
