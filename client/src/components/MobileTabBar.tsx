/*
 * MobileTabBar — 移动端底部导航
 * Design: Warm Ivory Minimalism
 * Ch8.1: 选中 tab 下方加小圆点指示器
 * Ch8.2: 增强毛玻璃效果 blur(16px) + 更透明
 */
import { useLocation } from "wouter";

const tabs = [
  {
    label: "首页",
    path: "/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "检测",
    path: "/chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    label: "日历",
    path: "/calendar",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "记录",
    path: "/history",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "我的",
    path: "/profile",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function MobileTabBar() {
  const [location, setLocation] = useLocation();

  const getIsActive = (path: string) => {
    if (path === "/") return location === "/";
    if (path === "/chat") return location === "/chat" || location === "/result";
    return location === path;
  };

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
      <div className="flex items-center justify-around h-[56px]">
        {tabs.map((tab) => {
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
                  fontSize: "12px",
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
              {/* Ch8.1: Selected dot indicator */}
              {isActive && (
                <div
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[#C17B5C]"
                  style={{
                    animation: "fadeIn 0.2s ease-out",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
