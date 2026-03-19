/*
 * MobileTabBar — 移动端底部导航
 * Design: Warm Ivory + Organic Rounded
 * 特色：浮动胶囊容器、圆润选中态、中心检测按钮圆形凸起
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
    label: "日记",
    path: "/diary",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: "检测",
    path: "/chat",
    isCenter: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    label: "发现",
    path: "/discover",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
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

function getIsActive(location: string, path: string) {
  if (path === "/") return location === "/";
  if (path === "/chat") return location === "/chat" || location === "/result";
  if (path === "/diary") return location === "/diary" || location === "/routine";
  if (path === "/discover")
    return location === "/discover" || location === "/ingredients" || location === "/conflict";
  return location === path;
}

export default function MobileTabBar() {
  const [location, setLocation] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center"
      style={{
        paddingBottom: `env(safe-area-inset-bottom, 0px)`,
      }}
    >
      {/* Floating pill container */}
      <div
        className="flex items-center mx-3 mb-2 w-full max-w-md"
        style={{
          height: "64px",
          borderRadius: "32px",
          background: "rgba(253, 250, 247, 0.92)",
          backdropFilter: "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: "blur(24px) saturate(1.8)",
          border: "1px solid rgba(45, 36, 32, 0.06)",
          boxShadow: "0 8px 32px rgba(45, 36, 32, 0.08), 0 2px 8px rgba(45, 36, 32, 0.04)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = getIsActive(location, tab.path);
          const isCenter = tab.isCenter;

          if (isCenter) {
            return (
              <button
                key={tab.path}
                onClick={() => setLocation(tab.path)}
                className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300"
              >
                {/* Raised circle button */}
                <div
                  className="flex items-center justify-center transition-all duration-400"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    marginTop: -16,
                    background: isActive
                      ? "linear-gradient(145deg, #C17B5C, #D4956F)"
                      : "linear-gradient(145deg, rgba(193,123,92,0.12), rgba(193,123,92,0.06))",
                    color: isActive ? "white" : "#C17B5C",
                    boxShadow: isActive
                      ? "0 6px 20px rgba(193,123,92,0.35), 0 2px 6px rgba(193,123,92,0.2)"
                      : "0 2px 8px rgba(45,36,32,0.06)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {tab.icon}
                </div>
                <span
                  className="font-body transition-all duration-300"
                  style={{
                    fontSize: "10px",
                    marginTop: 2,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#C17B5C" : "#B5ADA7",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.path}
              onClick={() => setLocation(tab.path)}
              className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 group/tab"
            >
              {/* Icon with pill-shaped active background */}
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <div
                    className="absolute inset-0 -mx-1.5 -my-0.5 rounded-full transition-all duration-400"
                    style={{
                      background: "rgba(193,123,92,0.08)",
                      transform: "scale(1)",
                    }}
                  />
                )}
                <div
                  className={`relative transition-all duration-300 ${
                    isActive ? "scale-105" : "group-hover/tab:scale-105"
                  }`}
                  style={{ color: isActive ? "#C17B5C" : "#B5ADA7" }}
                >
                  {tab.icon}
                </div>
              </div>

              {/* Label */}
              <span
                className="font-body transition-all duration-300"
                style={{
                  fontSize: "10px",
                  marginTop: "4px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#C17B5C" : "#B5ADA7",
                  letterSpacing: "0.02em",
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
