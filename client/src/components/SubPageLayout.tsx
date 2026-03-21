/*
 * SubPageLayout — 统一子页面布局
 * Design: Warm Ivory Minimalism + Lively Motion
 *
 * 提供一致的：
 * - 头部（返回按钮 + Logo + 占位）
 * - 标题区（带装饰性渐变线）
 * - 内容区（max-w-2xl 居中 + stagger动画）
 * - 底部 TabBar 间距
 */
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";

interface SubPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBack?: boolean;
  backTo?: string;
  showTabBar?: boolean;
  headerRight?: React.ReactNode;
  /** 标题旁的装饰色 */
  accentColor?: string;
}

export default function SubPageLayout({
  title,
  subtitle,
  children,
  showBack = true,
  backTo = "/",
  showTabBar = true,
  headerRight,
  accentColor = "#C17B5C",
}: SubPageLayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background relative overflow-hidden">
      {/* Decorative background orb */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full anim-breathe"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: 0.04,
        }}
      />

      {/* Header (mobile only when sidebar is present) */}
      <header className="flex md:hidden items-center gap-3 px-5 pt-[env(safe-area-inset-top,12px)] pb-2 max-w-2xl mx-auto w-full anim-fade-in">
        {showBack ? (
          <button
            onClick={() => setLocation(backTo)}
            className="flex items-center gap-1 text-[#9A8C82] hover:text-[#C17B5C] transition-all duration-300 shrink-0 hover:-translate-x-0.5 active:scale-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <div className="w-5" />
        )}
        <div className="flex-1 flex justify-center">
          <Logo size="sm" />
        </div>
        {headerRight ? (
          <div className="shrink-0">{headerRight}</div>
        ) : (
          <div className="w-5" />
        )}
      </header>

      {/* Title with accent bar */}
      <div className="max-w-2xl md:max-w-5xl mx-auto px-5 md:px-8 lg:px-12 mt-3 md:mt-6 anim-slide-up">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-6 rounded-full"
            style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}40)` }}
          />
          <div>
            <h1 className="font-display text-[1.25rem] md:text-[1.5rem] text-[#2D2420] leading-tight">{title}</h1>
            {subtitle && (
              <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl md:max-w-5xl mx-auto px-5 md:px-8 lg:px-12 mt-5 anim-slide-up d-100 relative z-10">
        {children}
      </main>

      {/* Bottom spacing */}
      {showTabBar ? (
        <>
          <div className="pb-tabbar md:pb-12" />
          <MobileTabBar />
        </>
      ) : (
        <div className="pb-8 md:pb-12" />
      )}
    </div>
  );
}
