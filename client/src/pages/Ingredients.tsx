/*
 * Ingredients.tsx — 成分分析器
 * Design: Warm Ivory Minimalism
 * 上半：textarea + 分析按钮 + 热门产品快捷选择
 * 下半：产品概览 + 成分详解列表
 */
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import {
  parseIngredientText,
  matchIngredient,
  safetyEmoji,
  safetyLabel,
  safetyColor,
  type IngredientInfo,
} from "@/lib/ingredientDatabase";
import { PRESET_PRODUCTS, type UserProduct } from "@/lib/mockAgentData";
import { saveProduct } from "@/lib/agentStorage";

interface AnalysisResult {
  productName: string;
  ingredients: { raw: string; info: IngredientInfo | null }[];
  overallSafety: number;
  mainFunctions: string[];
  goodForSkin: string[];
  concerns: string[];
}

function analyzeIngredients(text: string, productName?: string): AnalysisResult {
  const names = parseIngredientText(text);
  const ingredients = names.map((raw) => ({ raw, info: matchIngredient(raw) }));
  const matched = ingredients.filter((i) => i.info).map((i) => i.info!);

  // Overall safety: average of matched
  const overallSafety = matched.length > 0
    ? Math.round(matched.reduce((s, i) => s + i.safety, 0) / matched.length * 10) / 10
    : 0;

  // Main functions
  const funcCounts: Record<string, number> = {};
  matched.forEach((i) => i.functions.forEach((f) => { funcCounts[f] = (funcCounts[f] || 0) + 1; }));
  const mainFunctions = Object.entries(funcCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([f]) => f);

  // Good for skin types
  const skinSet = new Set<string>();
  matched.forEach((i) => i.goodFor.forEach((s) => skinSet.add(s)));
  const goodForSkin = Array.from(skinSet).slice(0, 4);

  // Concerns
  const concernSet = new Set<string>();
  matched.forEach((i) => i.concerns.forEach((c) => concernSet.add(c)));
  const concerns = Array.from(concernSet).slice(0, 5);

  return {
    productName: productName || "自定义产品",
    ingredients,
    overallSafety,
    mainFunctions,
    goodForSkin,
    concerns,
  };
}

export default function Ingredients() {
  const [, setLocation] = useLocation();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (text?: string, name?: string) => {
    const t = text || inputText;
    if (!t.trim()) {
      toast.error("请输入成分表");
      return;
    }
    setAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      const r = analyzeIngredients(t, name);
      setResult(r);
      setAnalyzing(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 600);
  };

  const handlePreset = (preset: typeof PRESET_PRODUCTS[0]) => {
    setInputText(preset.ingredientText);
    handleAnalyze(preset.ingredientText, `${preset.brand} ${preset.name}`);
  };

  const handleSave = () => {
    if (!result) return;
    const product: UserProduct = {
      id: `saved-${Date.now()}`,
      name: result.productName,
      brand: "",
      ingredientText: inputText,
      keyIngredients: result.ingredients
        .filter((i) => i.info)
        .map((i) => i.info!.name)
        .slice(0, 6),
      savedAt: Date.now(),
    };
    saveProduct(product);
    toast.success("分析结果已保存");
  };

  const InputSection = () => (
    <div className="space-y-4">
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] mb-2 font-medium">粘贴成分表</p>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="粘贴产品成分表，支持中英文、逗号/顿号/换行分隔..."
          className="w-full h-32 px-4 py-3 rounded-xl text-[13px] font-body text-[#2D2420] placeholder:text-[#B5ADA7] resize-none focus:outline-none focus:ring-1 focus:ring-[rgba(193,123,92,0.3)]"
          style={{ background: "rgba(237,232,224,0.5)", border: "1px solid rgba(45,36,32,0.06)" }}
        />
      </div>

      <button
        onClick={() => handleAnalyze()}
        disabled={analyzing}
        className="btn-primary w-full"
      >
        {analyzing ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            分析中...
          </span>
        ) : (
          "🧪 开始分析"
        )}
      </button>

      {/* Preset Products */}
      <div>
        <p className="font-body text-[12px] text-[#B5ADA7] tracking-wider mb-2 uppercase">热门产品快捷分析</p>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {PRESET_PRODUCTS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePreset(p)}
              className="shrink-0 px-3 py-2 rounded-xl font-body text-[12px] text-[#7A6E68] transition-all hover:text-[#C17B5C] active:scale-[0.96]"
              style={{ background: "rgba(237,232,224,0.6)", border: "1px solid rgba(45,36,32,0.06)" }}
            >
              {p.brand} {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const ResultSection = () => {
    if (!result) return null;
    const matched = result.ingredients.filter((i) => i.info);
    const unmatched = result.ingredients.filter((i) => !i.info);

    return (
      <div ref={resultRef} className="space-y-4 anim-fade-up">
        {/* Overview Card */}
        <div className="card-warm p-4">
          <h3 className="font-display text-[1.1rem] text-[#2D2420] mb-3">{result.productName}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3" style={{ background: "rgba(237,232,224,0.5)" }}>
              <p className="font-body text-[12px] text-[#B5ADA7] mb-1">安全评级</p>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[1.3rem]" style={{ color: safetyColor(Math.round(result.overallSafety)) }}>
                  {result.overallSafety.toFixed(1)}
                </span>
                <span className="font-body text-[12px] text-[#9A8C82]">/5</span>
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: "rgba(237,232,224,0.5)" }}>
              <p className="font-body text-[12px] text-[#B5ADA7] mb-1">识别成分</p>
              <p className="font-display text-[1.3rem] text-[#2D2420]">
                {matched.length}<span className="font-body text-[12px] text-[#9A8C82]">/{result.ingredients.length}</span>
              </p>
            </div>
          </div>

          {/* Functions */}
          {result.mainFunctions.length > 0 && (
            <div className="mt-3">
              <p className="font-body text-[12px] text-[#B5ADA7] mb-1.5">主要功效</p>
              <div className="flex flex-wrap gap-1.5">
                {result.mainFunctions.map((f) => (
                  <span key={f} className="pill-clay">{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Good for */}
          {result.goodForSkin.length > 0 && (
            <div className="mt-3">
              <p className="font-body text-[12px] text-[#B5ADA7] mb-1.5">适合肤质</p>
              <div className="flex flex-wrap gap-1.5">
                {result.goodForSkin.map((s) => (
                  <span key={s} className="font-body text-[12px] text-[#4A9A6B] bg-[rgba(74,154,107,0.08)] px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Concerns */}
          {result.concerns.length > 0 && (
            <div className="mt-3">
              <p className="font-body text-[12px] text-[#B5ADA7] mb-1.5">注意事项</p>
              <div className="space-y-1">
                {result.concerns.map((c, i) => (
                  <p key={i} className="font-body text-[12px] text-[#9A5E42]">⚠️ {c}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ingredient Detail List */}
        <div>
          <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-2.5">成分详解</p>
          <div className="space-y-2">
            {matched.map(({ raw, info }) => (
              <div key={raw} className="card-warm px-4 py-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-[14px] mt-0.5">{safetyEmoji(info!.safety)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-[13px] text-[#2D2420] font-medium">{info!.name}</span>
                      <span className="font-body text-[12px] text-[#B5ADA7]">{info!.nameEn}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="font-body text-[12px] px-1.5 py-0.5 rounded"
                        style={{ color: safetyColor(info!.safety), background: `${safetyColor(info!.safety)}12` }}
                      >
                        {safetyLabel(info!.safety)}
                      </span>
                      <span className="font-body text-[12px] text-[#B5ADA7]">{info!.category}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {info!.functions.map((f) => (
                        <span key={f} className="font-body text-[12px] text-[#7A6E68] bg-[rgba(237,232,224,0.6)] px-1.5 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                    <p className="font-body text-[12px] text-[#9A8C82] mt-1.5 leading-relaxed">{info!.description}</p>
                    {info!.concerns.length > 0 && (
                      <p className="font-body text-[12px] text-[#9A5E42] mt-1">
                        ⚠️ {info!.concerns.join("；")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Unmatched */}
            {unmatched.length > 0 && (
              <div className="card-warm px-4 py-3">
                <p className="font-body text-[12px] text-[#B5ADA7] mb-1.5">未识别成分 ({unmatched.length})</p>
                <p className="font-body text-[12px] text-[#9A8C82]">
                  {unmatched.map((i) => i.raw).join("、")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary flex-1">
            保存分析结果
          </button>
          <button
            onClick={() => setLocation("/conflict")}
            className="btn-ghost flex-1"
          >
            检查冲突 →
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="md:hidden min-h-[100dvh] flex flex-col bg-background">
        <header className="flex items-center gap-3 px-5 pt-[env(safe-area-inset-top,12px)] pb-2 shrink-0">
          <button onClick={() => window.history.back()} className="flex items-center gap-1 text-[#7A6E68]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            <span className="font-body text-[13px]">返回</span>
          </button>
          <div className="flex-1 flex justify-center"><Logo size="sm" /></div>
          <div className="w-14" />
        </header>

        <div className="px-5 pt-2 pb-1 anim-fade-up">
          <h1 className="font-display text-[1.3rem] text-[#2D2420]">成分分析器</h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">粘贴成分表，AI 为你解读每一个成分</p>
        </div>

        <div className="px-5 mt-3 anim-fade-up d-100">
          <InputSection />
        </div>

        {result && (
          <>
            <div className="warm-divider mx-5 my-5" />
            <div className="px-5 pb-tabbar">
              <ResultSection />
            </div>
          </>
        )}

        {!result && <div className="pb-tabbar" />}
        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex page-locked flex-col">
        <header className="flex items-center justify-between px-8 lg:px-12 py-4 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2"><Logo /></button>
          <button onClick={() => window.history.back()} className="font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors">返回</button>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className="w-[45%] overflow-y-auto px-8 lg:px-12 py-6">
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mb-1 anim-fade-up">成分分析器</h1>
            <p className="font-body text-[13px] text-[#9A8C82] mb-6 anim-fade-up d-100">粘贴成分表，AI 为你解读每一个成分</p>
            <div className="anim-fade-up d-200"><InputSection /></div>
          </div>
          <div className="w-px bg-[rgba(45,36,32,0.06)]" />
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6">
            {result ? (
              <ResultSection />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="text-[40px]">🧪</span>
                  <p className="font-body text-[14px] text-[#B5ADA7] mt-3">输入成分表后查看分析结果</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
