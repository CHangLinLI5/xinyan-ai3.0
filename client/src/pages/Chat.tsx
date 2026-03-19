/*
 * Chat.tsx — 检测对话页
 * Design: Warm Ivory Minimalism + Claude-style fluid dialog
 * 
 * Claude 风格特点：
 * - AI 消息无气泡边框，直接文字排列，更开阔
 * - 用户消息用柔和圆角气泡
 * - 打字指示器（三个跳动圆点）
 * - 消息渐入动画（从下方滑入 + 淡入）
 * - 输入框更大更圆润，类似搜索框
 * - 底部免责声明
 */
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
// MobileTabBar removed per Ch3.1 - Chat is immersive experience

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  image?: string;
  isNew?: boolean;
  timestamp: number;
}

function formatTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
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

const agentShortcuts = [
  { label: "记录日记", path: "/diary", icon: "📝" },
  { label: "成分分析", path: "/ingredients", icon: "🧪" },
  { label: "冲突检测", path: "/conflict", icon: "🔍" },
  { label: "护肤方案", path: "/routine", icon: "📋" },
];

const resultFollowUps = [
  "如何改善毛孔评分？",
  "推荐适合我的精华液",
  "日常护肤步骤建议",
];

/* Typing indicator - three bouncing dots */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-[#C17B5C] opacity-60"
          style={{
            animation: `typing-bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const fromResult = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("from") === "result";
  }, []);

  const [messages, setMessages] = useState<Message[]>(() => {
    if (fromResult) {
      return [
        {
          id: "welcome-from-result",
          role: "ai" as const,
          content: "您好！我已经看过您的皮肤分析报告了 📋\n\n您的综合评分为 82 分，整体状态良好。其中弹性紧致度表现优秀（91分），水分含量也很充足（88分）。毛孔细腻度（58分）和色素均匀度（65分）还有提升空间。\n\n您可以针对任何维度向我提问，我会给出个性化的建议。",
          timestamp: Date.now(),
        },
      ];
    }
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
    }
  }, [inputText]);

  // Remove isNew flag after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages((prev) => prev.map((m) => ({ ...m, isNew: false })));
    }, 600);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const addMessage = useCallback((role: "user" | "ai", content: string, image?: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random()}`, role, content, image, isNew: true, timestamp: Date.now() },
    ]);
  }, []);

  const addAIMessageWithTyping = useCallback(
    (content: string, delay = 800) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addMessage("ai", content);
      }, delay);
    },
    [addMessage]
  );

  const runAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
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
        setTimeout(() => {
          addAIMessageWithTyping("收到您的照片，正在进行 AI 皮肤分析...", 600);
          setTimeout(() => runAnalysis(), 1400);
        }, 400);
      };
      reader.readAsDataURL(file);
    },
    [addMessage, addAIMessageWithTyping, runAnalysis]
  );

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    addMessage("user", inputText.trim());
    setInputText("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    addAIMessageWithTyping(
      "感谢您的提问！建议您先上传一张面部照片，我可以为您进行专业的皮肤分析，然后根据分析结果给出更精准的建议。您也可以直接描述您的皮肤问题，我会尽力帮助您。",
      1000
    );
  }, [inputText, addMessage, addAIMessageWithTyping]);

  const handleQuickQuestion = useCallback(
    (q: string) => {
      addMessage("user", q);
      if (fromResult) {
        addAIMessageWithTyping(
          "根据您的皮肤分析报告，我建议：\n\n1. 针对毛孔问题，每周使用 1-2 次含水杨酸的清洁面膜\n2. 日常使用含烟酰胺的精华液，帮助收缩毛孔并均匀肤色\n3. 保持现有的补水习惯，您的水分含量评分很好\n\n需要我推荐具体的产品吗？",
          1200
        );
      } else {
        addAIMessageWithTyping(
          "这是一个很好的问题！为了给您更精准的建议，建议您先上传一张面部照片进行皮肤分析。分析完成后，我可以根据您的具体皮肤状况提供个性化的护理方案。",
          1000
        );
      }
    },
    [addMessage, addAIMessageWithTyping, fromResult]
  );

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isWelcome = messages.length === 0 && !isAnalyzing;
  const showFollowUps = fromResult && messages.length === 1;

  return (
    <div
      className="page-locked flex flex-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Typing animation keyframes */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 0.9; }
        }
        @keyframes msg-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-new { animation: msg-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

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
      <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(45,36,32,0.06)] bg-[rgba(242,237,230,0.8)] backdrop-blur-sm z-10 shrink-0">
        <button
          onClick={() => setLocation(fromResult ? "/result" : "/")}
          className="flex items-center gap-1 font-body text-sm text-[#7A6E68] hover:text-[#C17B5C] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          {fromResult ? "报告" : "返回"}
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
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom, 0px))" }}>
        {isWelcome ? (
          /* Welcome Screen - Claude style centered */
          <div className="flex flex-col items-center justify-center h-full px-5 py-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 anim-scale-in"
              style={{
                background: "linear-gradient(135deg, rgba(193,123,92,0.12) 0%, rgba(193,123,92,0.06) 100%)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-normal text-[#2D2420] mb-2 anim-fade-up d-100">
              皮肤智能分析
            </h2>
            <p className="font-body text-sm text-[#7A6E68] text-center max-w-sm mb-8 anim-fade-up d-200" style={{ fontWeight: 300 }}>
              上传一张面部照片，AI 将为您进行专业的皮肤状态分析
            </p>

            {/* Upload area - cleaner */}
            <div
              className="w-full max-w-sm rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform anim-fade-up d-300"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "linear-gradient(145deg, #F8F0E8 0%, #F0E4D8 50%, #EBD9CC 100%)",
                boxShadow: "0 2px 16px rgba(193,123,92,0.1), 0 0 0 1px rgba(193,123,92,0.08)",
              }}
            >
              <div className="flex flex-col items-center py-8 px-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #C17B5C, #D4956F)", boxShadow: "0 4px 14px rgba(193,123,92,0.3)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <p className="font-body text-[14px] font-medium text-[#2D2420] mb-1">上传面部照片</p>
                <p className="font-body text-[12px] text-[#9A8C82]">正面清晰照 · JPG / PNG</p>
                <div className="mt-4 px-4 py-2 rounded-full"
                  style={{ background: "rgba(193,123,92,0.12)", border: "1px solid rgba(193,123,92,0.18)" }}>
                  <span className="font-body text-[13px] text-[#C17B5C] font-medium">点击选择照片</span>
                </div>
              </div>
            </div>

            {/* Agent shortcuts */}
            <div className="flex gap-2 mt-6 max-w-sm justify-center anim-fade-up d-350">
              {agentShortcuts.map((s) => (
                <button
                  key={s.path}
                  onClick={() => setLocation(s.path)}
                  className="flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all active:scale-[0.96] hover:shadow-sm"
                  style={{ background: "rgba(237,232,224,0.6)", border: "1px solid rgba(45,36,32,0.05)" }}
                >
                  <span className="text-[18px]">{s.icon}</span>
                  <span className="font-body text-[12px] text-[#7A6E68]">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Quick questions */}
            <div className="flex flex-wrap gap-2 mt-4 max-w-sm justify-center anim-fade-up d-400">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickQuestion(q)}
                  className="px-3.5 py-2 rounded-full text-[12px] font-body text-[#7A6E68] transition-all active:scale-[0.96] hover:text-[#C17B5C]"
                  style={{
                    background: "rgba(45,36,32,0.03)",
                    border: "1px solid rgba(45,36,32,0.08)",
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages - Claude style: AI messages without bubble, user messages with soft bubble */
          <div className="max-w-2xl mx-auto px-4 md:px-6 py-5 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${msg.isNew ? "msg-new" : ""}`}
              >
                {msg.role === "ai" ? (
                  /* AI Message - Claude style: no bubble, clean text with avatar */
                  <div className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(193,123,92,0.1)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className="font-body text-[13.5px] leading-[1.7] text-[#2D2420] whitespace-pre-line" style={{ fontWeight: 350 }}>
                        {msg.content}
                      </p>
                      <p className="font-body text-[12px] text-[#C5BBB3] mt-1.5">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ) : (
                  /* User Message - soft rounded bubble, right-aligned */
                  <div className="flex justify-end">
                    <div className="max-w-[80%] md:max-w-[65%]">
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="上传的照片"
                          className="max-w-[200px] rounded-2xl mb-2 ml-auto"
                          style={{ boxShadow: "0 2px 12px rgba(45,36,32,0.08)" }}
                        />
                      )}
                      <div
                        className="px-4 py-3 rounded-[20px] rounded-br-[6px]"
                        style={{
                          background: "linear-gradient(135deg, #C17B5C 0%, #D08B6A 100%)",
                          boxShadow: "0 2px 8px rgba(193,123,92,0.2)",
                        }}
                      >
                        <p className="font-body text-[13.5px] leading-[1.6] text-white whitespace-pre-line" style={{ fontWeight: 350 }}>
                          {msg.content}
                        </p>
                      </div>
                      <p className="font-body text-[12px] text-[#C5BBB3] mt-1.5 text-right">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Follow-up suggestions when coming from result */}
            {showFollowUps && (
              <div className="flex flex-wrap gap-2 pl-10 msg-new">
                {resultFollowUps.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="px-3.5 py-2 rounded-full text-[12px] font-body text-[#C17B5C] transition-all active:scale-[0.96] hover:bg-[rgba(193,123,92,0.12)]"
                    style={{
                      background: "rgba(193,123,92,0.06)",
                      border: "1px solid rgba(193,123,92,0.12)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 msg-new">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(193,123,92,0.1)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2" />
                  </svg>
                </div>
                <TypingIndicator />
              </div>
            )}

            {/* Analysis Steps */}
            {isAnalyzing && analysisStep >= 0 && analysisStep <= 5 && (
              <div className="flex gap-3 msg-new">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(193,123,92,0.1)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C17B5C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2" />
                  </svg>
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="font-body text-[12px] text-[#B5ADA7] mb-3 uppercase tracking-wider">
                    AI 分析进度
                  </p>
                  {/* Progress Ring (Ch3.3) */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(45,36,32,0.06)" strokeWidth="4" />
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#C17B5C" strokeWidth="4" strokeLinecap="round"
                          strokeDasharray={`${((Math.min(analysisStep + 1, 5)) / 5) * 175.9} 175.9`}
                          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-[16px] font-light text-[#C17B5C]">{Math.min(analysisStep + 1, 5)}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {analysisSteps.map((step, i) => {
                      const isDone = i < analysisStep;
                      const isCurrent = i === analysisStep;
                      return (
                        <div key={i} className="flex items-center gap-2.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-body transition-all duration-300"
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
                            className="font-body text-[13px] transition-colors duration-300"
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

      {/* Input Area - Claude style: larger, centered, with disclaimer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "linear-gradient(to top, rgba(242,237,230,1) 70%, rgba(242,237,230,0))",
          paddingTop: "20px",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 md:px-6"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}>
          {/* Input box */}
          <div
            className="flex items-end gap-2 px-3 py-2 rounded-2xl transition-all"
            style={{
              background: "rgba(255,255,255,0.8)",
              border: "1px solid rgba(45,36,32,0.1)",
              boxShadow: "0 2px 12px rgba(45,36,32,0.06), 0 0 0 0px rgba(193,123,92,0)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(193,123,92,0.3)";
              e.currentTarget.style.boxShadow = "0 2px 16px rgba(45,36,32,0.08), 0 0 0 3px rgba(193,123,92,0.06)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(45,36,32,0.1)";
              e.currentTarget.style.boxShadow = "0 2px 12px rgba(45,36,32,0.06), 0 0 0 0px rgba(193,123,92,0)";
            }}
          >
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
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[rgba(193,123,92,0.08)] transition-colors shrink-0 mb-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A8C82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={fromResult ? "针对报告提问..." : "上传照片或输入皮肤问题..."}
              rows={1}
              className="flex-1 resize-none py-2 font-body text-[14px] bg-transparent focus:outline-none placeholder:text-[#C5BBB3] text-[#2D2420] leading-relaxed"
              style={{ fontWeight: 350, maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5 disabled:opacity-30"
              style={{
                background: inputText.trim() ? "linear-gradient(135deg, #C17B5C, #D4956F)" : "rgba(45,36,32,0.06)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inputText.trim() ? "#FDFAF7" : "#B5ADA7"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>

          {/* Disclaimer - like ChatGPT/Claude */}
          <p className="text-center font-body text-[12px] text-[#C5BBB3] mt-2 mb-1 leading-relaxed" style={{ fontWeight: 300 }}>
            芯颜 AI 的分析结果仅供参考，不构成医疗建议。如有皮肤问题请咨询专业皮肤科医生。
          </p>
        </div>
      </div>

    </div>
  );
}
