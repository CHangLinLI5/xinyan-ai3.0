/*
 * Ingredients.tsx — 成分分析器
 * Design: Warm Ivory Minimalism — 单栏居中布局
 */
import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import SubPageLayout from "@/components/SubPageLayout";
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
  const overallSafety = matched.length > 0
    ? Math.round(matched.reduce((s, i) => s + i.safety, 0) / matched.length * 10) / 10
    : 0;
  const funcCounts: Record<string, number> = {};
  matched.forEach((i) => i.functions.forEach((f) => { funcCounts[f] = (funcCounts[f] || 0) + 1; }));
  const mainFunctions = Object.entries(funcCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f]) => f);
  const skinSet = new Set<string>();
  matched.forEach((i) => i.goodFor.forEach((s) => skinSet.add(s)));
  const goodForSkin = Array.from(skinSet).slice(0, 4);
  const concernSet = new Set<string>();
  matched.forEach((i) => i.concerns.forEach((c) => concernSet.add(c)));
  const concerns = Array.from(concernSet).slice(0, 5);
  return { productName: productName || "自定义产品", ingredients, overallSafety, mainFunctions, goodForSkin, concerns };
}

export default function Ingredients() {
  const [, setLocation] = useLocation();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = (text?: string, name?: string) => {
    const t = text || inputText;
    if (!t.trim()) { toast.error("请输入成分表"); return; }
    setAnalyzing(true);
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
      keyIngredients: result.ingredients.filter((i) => i.info).map((i) => i.info!.name).slice(0, 6),
      savedAt: Date.now(),
    };
    saveProduct(product);
    toast.success("分析结果已保存");
  };

  const matched = result?.ingredients.filter((i) => i.info) || [];
  const unmatched = result?.ingredients.filter((i) => !i.info) || [];

  return (
    <SubPageLayout title="成分分析器" subtitle="粘贴成分表，AI 为你解读每一个成分" accentColor="#6A7AB0">
      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="粘贴产品成分表，支持中英文、逗号/顿号/换行分隔..."
          className="w-full h-28 px-3 py-2.5 rounded-xl text-[12px] font-body text-[#2D2420] placeholder:text-[#B5ADA7] resize-none focus:outline-none focus:ring-1 focus:ring-[rgba(193,123,92,0.3)] bg-[rgba(237,232,224,0.4)] border border-[rgba(45,36,32,0.06)]"
        />
        <button
          onClick={() => handleAnalyze()}
          disabled={analyzing}
          className="btn-primary w-full"
        >
          {analyzing ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              分析中...
            </span>
          ) : "开始分析"}
        </button>

        {/* Presets */}
        <div>
          <p className="font-body text-[11px] text-[#B5ADA7] tracking-wider mb-1.5">热门产品</p>
          <div className="flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {PRESET_PRODUCTS.map((p) => (
              <button
                key={p.name}
                onClick={() => handlePreset(p)}
                className="shrink-0 px-3 py-1.5 rounded-lg font-body text-[11px] text-[#7A6E68] bg-[rgba(237,232,224,0.5)] border border-[rgba(45,36,32,0.04)] hover:text-[#C17B5C] hover:border-[rgba(193,123,92,0.2)] hover:shadow-sm active:scale-[0.96] transition-all duration-300"
              >
                {p.brand} {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="warm-divider my-5" />
          <div ref={resultRef} className="space-y-3 anim-slide-up">
            {/* Overview */}
            <div className="card-warm p-4 hover-lift">
              <h3 className="font-display text-[1rem] text-[#2D2420] mb-2.5">{result.productName}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg p-2.5 bg-[rgba(237,232,224,0.4)]">
                  <p className="font-body text-[11px] text-[#B5ADA7] mb-0.5">安全评级</p>
                  <div className="flex items-center gap-1">
                    <span className="font-display text-[1.1rem]" style={{ color: safetyColor(Math.round(result.overallSafety)) }}>
                      {result.overallSafety.toFixed(1)}
                    </span>
                    <span className="font-body text-[11px] text-[#9A8C82]">/5</span>
                  </div>
                </div>
                <div className="rounded-lg p-2.5 bg-[rgba(237,232,224,0.4)]">
                  <p className="font-body text-[11px] text-[#B5ADA7] mb-0.5">识别成分</p>
                  <p className="font-display text-[1.1rem] text-[#2D2420]">
                    {matched.length}<span className="font-body text-[11px] text-[#9A8C82]">/{result.ingredients.length}</span>
                  </p>
                </div>
              </div>
              {result.mainFunctions.length > 0 && (
                <div className="mt-2.5">
                  <p className="font-body text-[11px] text-[#B5ADA7] mb-1">主要功效</p>
                  <div className="flex flex-wrap gap-1">
                    {result.mainFunctions.map((f) => (
                      <span key={f} className="pill-clay text-[11px]">{f}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.concerns.length > 0 && (
                <div className="mt-2.5">
                  <p className="font-body text-[11px] text-[#B5ADA7] mb-1">注意事项</p>
                  {result.concerns.map((c, i) => (
                    <p key={i} className="font-body text-[11px] text-[#9A5E42]">⚠️ {c}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Detail list */}
            <div>
              <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">成分详解</p>
              <div className="space-y-1.5">
                {matched.map(({ raw, info }) => (
                  <div key={raw} className="card-warm px-3 py-2.5 hover-lift">
                    <div className="flex items-start gap-2">
                      <span className="text-[12px] mt-0.5">{safetyEmoji(info!.safety)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-body text-[12px] text-[#2D2420] font-medium">{info!.name}</span>
                          <span className="font-body text-[10px] text-[#B5ADA7]">{info!.nameEn}</span>
                          <span
                            className="font-body text-[10px] px-1 py-0.5 rounded ml-auto"
                            style={{ color: safetyColor(info!.safety), background: `${safetyColor(info!.safety)}12` }}
                          >
                            {safetyLabel(info!.safety)}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-0.5 mt-1">
                          {info!.functions.map((f) => (
                            <span key={f} className="font-body text-[10px] text-[#7A6E68] bg-[rgba(237,232,224,0.5)] px-1 py-0.5 rounded">{f}</span>
                          ))}
                        </div>
                        <p className="font-body text-[11px] text-[#9A8C82] mt-1 leading-relaxed">{info!.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {unmatched.length > 0 && (
                  <div className="card-warm px-3 py-2.5">
                    <p className="font-body text-[11px] text-[#B5ADA7] mb-1">未识别 ({unmatched.length})</p>
                    <p className="font-body text-[11px] text-[#9A8C82]">{unmatched.map((i) => i.raw).join("、")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button onClick={handleSave} className="btn-primary flex-1 text-[13px]">保存结果</button>
              <button onClick={() => setLocation("/conflict")} className="btn-ghost flex-1 text-[13px]">检查冲突 →</button>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!result && (
        <div className="text-center py-16">
          <span className="text-[40px] inline-block anim-float" style={{ animationDuration: '3s' }}>🧪</span>
          <p className="font-body text-[13px] text-[#B5ADA7] mt-3">输入成分表后查看分析结果</p>
        </div>
      )}
    </SubPageLayout>
  );
}
