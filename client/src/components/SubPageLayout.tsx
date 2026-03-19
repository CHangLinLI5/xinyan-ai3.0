/*
 * SubPageLayout — 统一子页面布局
 * Design: Warm Ivory Minimalism
 *
 * 提供一致的：
 * - 头部（返回按钮 + Logo + 占位）
 * - 标题区
 * - 内容区（max-w-2xl 居中）
 * - 底部 TabBar 间距
 */
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";

interface SubPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** 是否显示返回按钮，默认 true */
  showBack?: boolean;
  /** 返回路径，默认 "/" */
  backTo?: string;
  /** 是否显示底部 TabBar，默认 true */
  showTabBar?: boolean;
  /** 右上角自定义内容 */
  headerRight?: React.ReactNode;
}

export default function SubPageLayout({
  title,
  subtitle,
  children,
  showBack = true,
  backTo = "/",
  showTabBar = true,
  headerRight,
}: SubPageLayoutProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 md:px-8 pt-[env(safe-area-inset-top,12px)] pb-2 max-w-2xl mx-auto w-full">
        {showBack ? (
          <button
            onClick={() => setLocation(backTo)}
            className="flex items-center gap-1 text-[#9A8C82] hover:text-[#C17B5C] transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <div className="w-4" />
        )}
        <div className="flex-1 flex justify-center">
          <Logo size="sm" />
        </div>
        {headerRight ? (
          <div className="shrink-0">{headerRight}</div>
        ) : (
          <div className="w-4" />
        )}
      </header>

      {/* Title */}
      <div className="max-w-2xl mx-auto px-5 md:px-8 mt-2 anim-fade-up">
        <h1 className="font-display text-[1.2rem] text-[#2D2420]">{title}</h1>
        {subtitle && (
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-5 md:px-8 mt-4 anim-fade-up d-100">
        {children}
      </main>

      {/* Bottom spacing */}
      {showTabBar ? (
        <>
          <div className="pb-tabbar md:pb-8" />
          <MobileTabBar />
        </>
      ) : (
        <div className="pb-8" />
      )}
    </div>
  );
}
