/*
 * Login.tsx — 登录/注册页
 * Design: Warm Ivory Minimalism
 * 简洁的登录注册切换，暖色调设计
 */
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const sendCode = useCallback(() => {
    if (!phone || phone.length < 11) {
      toast("请输入正确的手机号");
      return;
    }
    setCodeSent(true);
    setCountdown(60);
    toast("验证码已发送");
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [phone]);

  const handleSubmit = useCallback(() => {
    if (!phone || phone.length < 11) {
      toast("请输入正确的手机号");
      return;
    }
    if (!code || code.length < 4) {
      toast("请输入验证码");
      return;
    }
    if (!isLogin && !nickname.trim()) {
      toast("请输入昵称");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast(isLogin ? "登录成功，欢迎回来！" : "注册成功，欢迎加入芯颜！");
      setLocation("/");
    }, 1200);
  }, [phone, code, nickname, isLogin, setLocation]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 shrink-0">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <Logo size="sm" />
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-5 pb-8">
        <div className="w-full max-w-sm">
          {/* Welcome */}
          <div className="text-center mb-8 anim-fade-up">
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
                boxShadow: "0 8px 24px rgba(193,123,92,0.25)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-light text-[#2D2420] mb-1.5">
              {isLogin ? "欢迎回来" : "加入芯颜"}
            </h1>
            <p className="font-body text-[13px] text-[#9A8C82]" style={{ fontWeight: 300 }}>
              {isLogin ? "登录后查看您的皮肤分析记录" : "注册后开启智能皮肤分析之旅"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 anim-fade-up d-100">
            {/* Nickname (register only) */}
            {!isLogin && (
              <div className="anim-fade-up">
                <label className="font-body text-[12px] text-[#9A8C82] tracking-wider uppercase block mb-1.5 ml-1">
                  昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="给自己取个名字"
                  className="w-full h-12 px-4 rounded-xl font-body text-[14px] bg-[rgba(45,36,32,0.03)] border border-[rgba(45,36,32,0.08)] focus:border-[rgba(193,123,92,0.4)] focus:outline-none focus:bg-white transition-all placeholder:text-[#C5BBB3]"
                />
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="font-body text-[12px] text-[#9A8C82] tracking-wider uppercase block mb-1.5 ml-1">
                手机号
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="请输入手机号"
                className="w-full h-12 px-4 rounded-xl font-body text-[14px] bg-[rgba(45,36,32,0.03)] border border-[rgba(45,36,32,0.08)] focus:border-[rgba(193,123,92,0.4)] focus:outline-none focus:bg-white transition-all placeholder:text-[#C5BBB3]"
              />
            </div>

            {/* Verification Code */}
            <div>
              <label className="font-body text-[12px] text-[#9A8C82] tracking-wider uppercase block mb-1.5 ml-1">
                验证码
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入验证码"
                  className="flex-1 h-12 px-4 rounded-xl font-body text-[14px] bg-[rgba(45,36,32,0.03)] border border-[rgba(45,36,32,0.08)] focus:border-[rgba(193,123,92,0.4)] focus:outline-none focus:bg-white transition-all placeholder:text-[#C5BBB3]"
                />
                <button
                  onClick={sendCode}
                  disabled={countdown > 0}
                  className="shrink-0 h-12 px-5 rounded-xl font-body text-[13px] font-medium transition-all disabled:opacity-50"
                  style={{
                    background: countdown > 0 ? "rgba(45,36,32,0.06)" : "rgba(193,123,92,0.1)",
                    color: countdown > 0 ? "#B5ADA7" : "#C17B5C",
                    border: `1px solid ${countdown > 0 ? "rgba(45,36,32,0.06)" : "rgba(193,123,92,0.2)"}`,
                  }}
                >
                  {countdown > 0 ? `${countdown}s` : codeSent ? "重新发送" : "获取验证码"}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-body text-[14px] font-medium text-white transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
              style={{
                background: "linear-gradient(135deg, #C17B5C 0%, #D4956F 100%)",
                boxShadow: "0 4px 16px rgba(193,123,92,0.3)",
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  {isLogin ? "登录中..." : "注册中..."}
                </span>
              ) : (
                isLogin ? "登录" : "注册"
              )}
            </button>
          </div>

          {/* Switch mode */}
          <div className="text-center mt-6 anim-fade-up d-200">
            <p className="font-body text-[13px] text-[#9A8C82]" style={{ fontWeight: 300 }}>
              {isLogin ? "还没有账号？" : "已有账号？"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#C17B5C] font-medium ml-1 hover:underline transition-colors"
              >
                {isLogin ? "立即注册" : "去登录"}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 anim-fade-up d-300">
            <div className="flex-1 h-px bg-[rgba(45,36,32,0.06)]" />
            <span className="font-body text-[12px] text-[#C5BBB3]">其他方式</span>
            <div className="flex-1 h-px bg-[rgba(45,36,32,0.06)]" />
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 anim-fade-up d-400">
            <button
              onClick={() => toast("微信登录功能即将推出")}
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(45,36,32,0.03)] border border-[rgba(45,36,32,0.06)] hover:bg-[rgba(45,36,32,0.06)] transition-all hover:scale-105"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#07C160">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.769c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
              </svg>
            </button>
            <button
              onClick={() => toast("Apple 登录功能即将推出")}
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-[rgba(45,36,32,0.03)] border border-[rgba(45,36,32,0.06)] hover:bg-[rgba(45,36,32,0.06)] transition-all hover:scale-105"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#2D2420">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>
          </div>

          {/* Terms */}
          <p className="text-center font-body text-[12px] text-[#C5BBB3] mt-6 leading-relaxed anim-fade-up d-500" style={{ fontWeight: 300 }}>
            登录即表示同意芯颜 AI 的
            <button className="text-[#9A8C82] underline" onClick={() => toast("用户协议页面即将推出")}>用户协议</button>
            {" "}和{" "}
            <button className="text-[#9A8C82] underline" onClick={() => toast("隐私政策页面即将推出")}>隐私政策</button>
          </p>
        </div>
      </div>
    </div>
  );
}
