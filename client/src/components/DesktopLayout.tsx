/*
 * DesktopLayout — 桌面端布局包装器
 * 在 md 以上显示左侧导航栏 + 右侧内容区
 * 移动端直接渲染子组件
 */
import DesktopSidebar from "./DesktopSidebar";

interface DesktopLayoutProps {
  children: React.ReactNode;
  /** 是否隐藏侧边栏（如Chat、Result等全屏页面） */
  hideSidebar?: boolean;
}

export default function DesktopLayout({ children, hideSidebar = false }: DesktopLayoutProps) {
  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
