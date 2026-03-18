/*
 * Chat.tsx — 检测对话页
 * Design: Warm Ivory Minimalism
 * - 全视窗锁定，上 header + 中内容 + 下输入框
 * - 初始状态：欢迎屏幕 + 上传区域
 * - 对话状态：消息列表
 * - AI 分析流程：5 步进度动画
 * - 底部显示 MobileTabBar
 */
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string;
}

const analysisSteps = [
  "识别面部轮廓",
  "分析皮肤纹理与毛孔",
  "检测色斑与色素",
  "评估水油平衡",
  "生成个性化报告",
];

const quickQuestions = [
  "我的皮肤适合什么护肤品？",
  "如何改善毛孔粗大？",
  "敏感肌日常护理建议",
];

export default function Chat() {
  const [, setLocation] = useLocation();
  const fromResult = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("from") === "result";
  const [messages, setMessages] = useState<Message[]>(() => {
    if (fromResult) {
      return [
        {
          id: "welcome-from-result",
          role: "ai" as const,
          content: "您好！我已经看过您的皮肤分析报告了。您可以针对报告中的任何问题向我提问，比如如何改善某个维度的评分、日常护肤步骤建议，或者产品选择方面的疑问。请随时告诉我您想了解什么！",
        },
      ];
    }
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((role: "user" | "ai", content: string, image?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random()}`, role, content, image },
    ]);
  }, []);

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Simulate 5 analysis steps
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < 5) {
        setAnalysisStep(step);
      } else {
        clearInterval(interval);
        setAnalysisStep(5);
        setTimeout(() => {
          addMessage("ai", "✅ 分析完成！正在为您生成详细报告...");
          setTimeout(() => {
            setLocation("/result");
          }, 1400);
        }, 600);
      }
    }, 800);
  }, [addMessage, setLocation]);

  const handleImageUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        addMessage("user", "请帮我分析一下皮肤状态", dataUrl);

        // Try API first, fallback to mock
        setTimeout(() => {
          addMessage("ai", "收到您的照片，正在进行 AI 皮肤分析...");
          setTimeout(() => runAnalysis(), 600);
        }, 500);
      };
      reader.readAsDataURL(file);
    },
    [addMessage, runAnalysis]
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    addMessage("user", inputText.trim());
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      addMessage(
        "ai",
        "感谢您的提问！建议您先上传一张面部照片，我可以为您进行专业的皮肤分析，然后根据分析结果给出更精准的建议。您也可以直接描述您的皮肤问题，我会尽力帮助您。"
      );
    }, 800);
  }, [inputText, addMessage]);

  const handleQuickQuestion = useCallback(
    (q: string) => {
      addMessage("user", q);
      setTimeout(() => {
        addMessage(
          "ai",
          "这是一个很好的问题！为了给您更精准的建议，建议您先上传一张面部照片进行皮肤分析。分析完成后，我可以根据您的具体皮肤状况提供个性化的护理方案。"
        );
      }, 800);
    },
    [addMessage]
  );

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const isWelcome = messages.length === 0 && !isAnalyzing && !fromResult;

  return (
    <div
      className="page-locked flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-[rgba(242,237,230,0.95)] flex items-center justify-center anim-fade-in">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="font-display text-lg text-[#2D2420]">释放以上传照片</p>
            <p className="font-body text-sm text-[#7A6E68] mt-1">支持 JPG、PNG 格式</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-1 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          返回
        </button>
        <Logo size="sm" />
        <button
          onClick={() => setLocation("/result")}
          className="font-body text-sm text-[#C17B5C] hover:text-[#D4967A] transition-colors"
        >
          查看报告
        </button>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-[72px] md:pb-0">
        {isWelcome ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full px-6 py-8">
            <div className="w-16 h-16 rounded-full bg-[rgba(193,123,92,0.1)] flex items-center justify-center mb-5 anim-scale-in">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-normal text-[#2D2420] mb-2 anim-fade-up d-100">
              皮肤智能分析
            </h2>
            <p className="font-body text-sm text-[#7A6E68] text-center max-w-sm mb-8 anim-fade-up d-200">
              上传一张面部照片，AI 将为您进行专业的皮肤状态分析，提供个性化护肤建议
            </p>

            {/* Upload area */}
            <div
              className="w-full max-w-sm border-2 border-dashed border-[rgba(193,123,92,0.25)] rounded-xl p-8 text-center cursor-pointer hover:border-[rgba(193,123,92,0.5)] hover:bg-[rgba(193,123,92,0.03)] transition-all anim-fade-up d-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-60">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p className="font-body text-sm text-[#7A6E68] mb-1">点击或拖拽上传照片</p>
              <p className="font-body text-[11px] text-[#B5ADA7]">支持 JPG、PNG，建议正面清晰照片</p>
            </div>

            {/* Quick questions */}
            <div className="flex flex-wrap gap-2 mt-6 max-w-sm justify-center anim-fade-up d-400">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="pill-clay text-[12px] hover:bg-[rgba(193,123,92,0.18)] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages */
          <div className="px-4 py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} anim-fade-up`}
              >
                <div
                  className="max-w-[80%] md:max-w-[60%] px-4 py-3 relative"
                  style={{
                    background: msg.role === "user" ? "#C17B5C" : "rgba(253, 250, 247, 0.95)",
                    color: msg.role === "user" ? "#FDFAF7" : "#2D2420",
                    borderRadius: msg.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                    border: msg.role === "ai" ? "1px solid rgba(45,36,32,0.08)" : "none",
                  }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="上传的照片"
                      className="w-full max-w-[200px] rounded-lg mb-2"
                    />
                  )}
                  <p className="font-body text-sm leading-relaxed" style={{ fontWeight: 300 }}>
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Analysis Steps */}
            {isAnalyzing && analysisStep >= 0 && analysisStep <= 5 && (
              <div className="flex justify-start anim-fade-up">
                <div
                  className="max-w-[80%] md:max-w-[60%] px-5 py-4 rounded-[4px_14px_14px_14px]"
                  style={{
                    background: "rgba(253, 250, 247, 0.95)",
                    border: "1px solid rgba(45,36,32,0.08)",
                  }}
                >
                  <p className="font-body text-xs text-[#B5ADA7] mb-3 uppercase tracking-wider">
                    AI 分析进度
                  </p>
                  <div className="space-y-2.5">
                    {analysisSteps.map((step, i) => {
                      const isDone = i < analysisStep;
                      const isCurrent = i === analysisStep;
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 transition-all duration-300"
                            style={{
                              background: isDone
                                ? "#C17B5C"
                                : isCurrent
                                ? "rgba(193,123,92,0.2)"
                                : "rgba(45,36,32,0.06)",
                              color: isDone ? "#FDFAF7" : isCurrent ? "#C17B5C" : "#B5ADA7",
                            }}
                          >
                            {isDone ? "✓" : isCurrent ? "●" : "○"}
                          </span>
                          <span
                            className="font-body text-sm transition-colors duration-300"
                            style={{
                              color: isDone ? "#2D2420" : isCurrent ? "#C17B5C" : "#B5ADA7",
                              fontWeight: isCurrent ? 500 : 300,
                            }}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {analysisStep === 5 && (
                    <div className="mt-3 pt-3 border-t border-[rgba(45,36,32,0.08)]">
                      <p className="font-body text-sm text-[#C17B5C] font-medium">✨ 分析完成</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm px-4 py-3 pb-[calc(0.75rem+72px)] md:pb-3 z-10">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(193,123,92,0.1)] hover:bg-[rgba(193,123,92,0.18)] transition-colors shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="上传照片或输入皮肤问题..."
            className="flex-1 h-10 px-4 rounded-full font-body text-sm bg-[rgba(45,36,32,0.04)] border border-[rgba(45,36,32,0.08)] focus:border-[rgba(193,123,92,0.4)] focus:outline-none transition-colors placeholder:text-[#B5ADA7]"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#C17B5C] hover:bg-[#D4967A] transition-colors shrink-0 disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDFAF7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <MobileTabBar />
    </div>
  );
}
