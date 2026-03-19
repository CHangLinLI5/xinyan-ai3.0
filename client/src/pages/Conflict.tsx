/*
 * Conflict.tsx — 产品冲突检测
 * Design: Warm Ivory Minimalism
 * 选择已保存产品 → 检测冲突/协同 → 使用顺序建议
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { getSavedProducts } from "@/lib/agentStorage";
import { PRESET_PRODUCTS, type UserProduct } from "@/lib/mockAgentData";
import {
  checkConflicts,
  checkSynergies,
  suggestOrder,
  severityColor,
  severityLabel,
  type ConflictResult,
  type SynergyResult,
} from "@/lib/conflictRules";

interface SelectableProduct {
  id: string;
  name: string;
  brand: string;
  keyIngredients: string[];
  selected: boolean;
}

export default function Conflict() {
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<SelectableProduct[]>([]);
  const [conflicts, setConflicts] = useState<ConflictResult[]>([]);
  const [synergies, setSynergies] = useState<SynergyResult[]>([]);
  const [order, setOrder] = useState<{ am: string[]; pm: string[] }>({ am: [], pm: [] });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = getSavedProducts();
    const presets = PRESET_PRODUCTS.filter(
      (p) => !saved.some((s) => s.name === p.name)
    );

    const all: SelectableProduct[] = [
      ...saved.map((s) => ({
        id: s.id,
        name: `${s.brand} ${s.name}`.trim(),
        brand: s.brand,
        keyIngredients: s.keyIngredients,
        selected: true,
      })),
      ...presets.map((p, i) => ({
        id: `preset-${i}`,
        name: `${p.brand} ${p.name}`.trim(),
        brand: p.brand,
        keyIngredients: p.keyIngredients,
        selected: false,
      })),
    ];
    setProducts(all);
  }, []);

  const selectedProducts = useMemo(
    () => products.filter((p) => p.selected),
    [products]
  );

  const toggleProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
    setChecked(false);
  };

  const handleCheck = () => {
    if (selectedProducts.length < 2) {
      toast.error("请至少选择2个产品");
      return;
    }
    const items = selectedProducts.map((p) => ({
      name: p.name,
      keyIngredients: p.keyIngredients,
    }));
    setConflicts(checkConflicts(items));
    setSynergies(checkSynergies(items));
    setOrder(suggestOrder(items));
    setChecked(true);
  };

  const SelectionSection = () => (
    <div className="space-y-4">
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] mb-2.5 font-medium">选择要检测的产品</p>
        <div className="space-y-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all active:scale-[0.98] ${
                p.selected
                  ? "bg-[rgba(193,123,92,0.08)] border border-[rgba(193,123,92,0.25)]"
                  : "bg-[rgba(237,232,224,0.4)] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    p.selected
                      ? "bg-[#C17B5C] border-[#C17B5C]"
                      : "border-[rgba(193,123,92,0.25)]"
                  }`}
                >
                  {p.selected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[13px] text-[#2D2420] font-medium truncate">{p.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.keyIngredients.slice(0, 4).map((ing) => (
                      <span key={ing} className="font-body text-[12px] text-[#9A8C82] bg-[rgba(237,232,224,0.6)] px-1.5 py-0.5 rounded">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCheck}
        disabled={selectedProducts.length < 2}
        className="btn-primary w-full disabled:opacity-40"
      >
        🔍 检测冲突（已选 {selectedProducts.length} 个）
      </button>

      <button
        onClick={() => setLocation("/ingredients")}
        className="w-full py-2.5 rounded-xl font-body text-[13px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors"
        style={{ border: "1px solid rgba(45,36,32,0.08)" }}
      >
        + 去成分分析器添加更多产品
      </button>
    </div>
  );

  const ResultSection = () => {
    if (!checked) return null;

    return (
      <div className="space-y-5 anim-fade-up">
        {/* Summary */}
        <div className="card-warm p-4">
          <div className="flex items-center gap-3">
            <span className="text-[28px]">{conflicts.length === 0 ? "✅" : "⚠️"}</span>
            <div>
              <p className="font-body text-[14px] text-[#2D2420] font-medium">
                {conflicts.length === 0
                  ? "未发现冲突"
                  : `发现 ${conflicts.length} 个潜在冲突`}
              </p>
              <p className="font-body text-[12px] text-[#9A8C82]">
                {synergies.length > 0 && `${synergies.length} 个协同增效`}
              </p>
            </div>
          </div>
        </div>

        {/* Conflicts */}
        {conflicts.length > 0 && (
          <div>
            <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-2.5">冲突详情</p>
            <div className="space-y-2.5">
              {conflicts.map((c, i) => (
                <div
                  key={i}
                  className="card-warm px-4 py-3"
                  style={{ borderLeft: `3px solid ${severityColor(c.rule.severity)}` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="font-body text-[12px] px-2 py-0.5 rounded-full font-medium"
                      style={{ color: severityColor(c.rule.severity), background: `${severityColor(c.rule.severity)}12` }}
                    >
                      {severityLabel(c.rule.severity)}
                    </span>
                  </div>
                  <p className="font-body text-[13px] text-[#2D2420] font-medium">
                    {c.ingredientA} × {c.ingredientB}
                  </p>
                  <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">
                    {c.productA} ↔ {c.productB}
                  </p>
                  <p className="font-body text-[12px] text-[#7A6E68] mt-1.5">{c.rule.description}</p>
                  <p className="font-body text-[12px] text-[#4A9A6B] mt-1">💡 {c.rule.advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synergies */}
        {synergies.length > 0 && (
          <div>
            <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-2.5">协同增效</p>
            <div className="space-y-2">
              {synergies.map((s, i) => (
                <div key={i} className="card-warm px-4 py-3" style={{ borderLeft: "3px solid #4A9A6B" }}>
                  <p className="font-body text-[13px] text-[#4A9A6B] font-medium">{s.rule.benefit}</p>
                  <p className="font-body text-[12px] text-[#2D2420] mt-0.5">
                    {s.ingredientA} + {s.ingredientB}
                  </p>
                  <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">
                    {s.productA} + {s.productB}
                  </p>
                  <p className="font-body text-[12px] text-[#7A6E68] mt-1">{s.rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage Order */}
        {(order.am.length > 0 || order.pm.length > 0) && (
          <div className="card-warm p-4">
            <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-3">建议使用顺序</p>
            {order.am.length > 0 && (
              <div className="mb-3">
                <p className="font-body text-[12px] text-[#C17B5C] font-medium mb-1.5">☀️ 早间</p>
                <div className="flex flex-wrap gap-1.5">
                  {order.am.map((name, i) => (
                    <span key={name} className="font-body text-[12px] text-[#7A6E68] bg-[rgba(237,232,224,0.6)] px-2 py-1 rounded-lg">
                      {i + 1}. {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {order.pm.length > 0 && (
              <div>
                <p className="font-body text-[12px] text-[#C17B5C] font-medium mb-1.5">🌙 晚间</p>
                <div className="flex flex-wrap gap-1.5">
                  {order.pm.map((name, i) => (
                    <span key={name} className="font-body text-[12px] text-[#7A6E68] bg-[rgba(237,232,224,0.6)] px-2 py-1 rounded-lg">
                      {i + 1}. {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
          <h1 className="font-display text-[1.3rem] text-[#2D2420]">冲突检测</h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">检测产品之间的成分冲突与协同</p>
        </div>

        <div className="px-5 mt-3 anim-fade-up d-100">
          <SelectionSection />
        </div>

        {checked && (
          <>
            <div className="warm-divider mx-5 my-5" />
            <div className="px-5 pb-tabbar">
              <ResultSection />
            </div>
          </>
        )}

        {!checked && <div className="pb-tabbar" />}
        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex page-locked flex-col">
        <header className="flex items-center justify-between px-8 lg:px-12 py-4 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2"><Logo /></button>
          <button onClick={() => window.history.back()} className="font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors">返回</button>
        </header>

        <main className="flex-1 flex overflow-hidden">
          <div className="w-[40%] overflow-y-auto px-8 lg:px-12 py-6">
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mb-1 anim-fade-up">冲突检测</h1>
            <p className="font-body text-[13px] text-[#9A8C82] mb-6 anim-fade-up d-100">检测产品之间的成分冲突与协同</p>
            <div className="anim-fade-up d-200"><SelectionSection /></div>
          </div>
          <div className="w-px bg-[rgba(45,36,32,0.06)]" />
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-6">
            {checked ? (
              <ResultSection />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="text-[40px]">🔍</span>
                  <p className="font-body text-[14px] text-[#B5ADA7] mt-3">选择产品后查看冲突检测结果</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
