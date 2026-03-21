/*
 * DesktopSidebar — 桌面端左侧导航栏
 * Design: Warm Ivory Minimalism
 * 仅在 md 以上显示，替代移动端底部 TabBar
 */
import { useLocation } from "wouter";
import Logo from "@/components/Logo";

const navItems = [
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
    label: "AI 检测",
    path: "/chat",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    label: "皮肤日记",
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
    label: "护肤方案",
    path: "/routine",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: "成分分析",
    path: "/ingredients",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v11l-3 3-3-3V3z" />
        <path d="M6 21h12" />
        <path d="M6 18h12" />
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
];

const bottomItems = [
  {
    label: "历史记录",
    path: "/history",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "个人中心",
    path: "/profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function getIsActive(location: string, path: string) {
  if (path === "/") return location === "/";
  if (path === "/chat") return location === "/chat" || location === "/result";
  if (path === "/diary") return location === "/diary";
  if (path === "/discover")
    return location === "/discover" || location === "/ingredients" || location === "/conflict";
  return location.startsWith(path);
}

export default function DesktopSidebar() {
  const [location, setLocation] = useLocation();

  return (
    <aside
      className="hidden md:flex flex-col w-[220px] lg:w-[240px] shrink-0 h-screen sticky top-0 border-r border-[rgba(45,36,32,0.06)]"
      style={{
        background: "rgba(253,250,247,0.95)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <Logo />
        <p className="font-body text-[11px] text-[#B5ADA7] mt-1">皮肤智能分析平台</p>
      </div>

      {/* Divider */}
      <div className="mx-4 warm-divider" />

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = getIsActive(location, item.path);
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group text-left"
              style={{
                background: active ? "rgba(193,123,92,0.08)" : "transparent",
                color: active ? "#C17B5C" : "#7A6E68",
              }}
            >
              <div
                className="transition-transform duration-200 group-hover:scale-110"
                style={{ color: active ? "#C17B5C" : "#9A8C82" }}
              >
                {item.icon}
              </div>
              <span
                className="font-body text-[13px] transition-colors duration-200"
                style={{ fontWeight: active ? 500 : 400 }}
              >
                {item.label}
              </span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C17B5C]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 warm-divider" />

      {/* Bottom Nav */}
      <div className="px-3 py-3 space-y-1">
        {bottomItems.map((item) => {
          const active = getIsActive(location, item.path);
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group text-left"
              style={{
                background: active ? "rgba(193,123,92,0.06)" : "transparent",
                color: active ? "#C17B5C" : "#9A8C82",
              }}
            >
              {item.icon}
              <span
                className="font-body text-[12px]"
                style={{ fontWeight: active ? 500 : 400 }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Version */}
      <div className="px-5 pb-4 pt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="font-body text-[10px] text-[#B5ADA7]">GPT-5.4 · Online</span>
        </div>
      </div>
    </aside>
  );
}
