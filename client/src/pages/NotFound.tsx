/*
 * NotFound.tsx — 404 页面
 * Design: Warm Ivory Minimalism
 */
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="page-locked flex flex-col items-center justify-center">
      <span className="font-display text-[6rem] font-light text-clay-gradient leading-none mb-4 anim-scale-in">
        404
      </span>
      <h1 className="font-display text-xl font-normal text-[#2D2420] mb-2 anim-fade-up d-100">
        页面未找到
      </h1>
      <p className="font-body text-sm text-[#7A6E68] mb-6 anim-fade-up d-200">
        抱歉，您访问的页面不存在
      </p>
      <button onClick={() => setLocation("/")} className="btn-primary anim-fade-up d-300">
        返回首页
      </button>
    </div>
  );
}
