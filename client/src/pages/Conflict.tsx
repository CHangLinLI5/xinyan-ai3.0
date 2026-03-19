/*
 * Conflict.tsx — 产品冲突检测
 * Design: Warm Ivory Minimalism — 单栏居中布局
 */
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import SubPageLayout from "@/components/SubPageLayout";
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
    const presets = PRESET_PRODUCTS.filter((p) => !saved.some((s) => s.name === p.name));
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

  const selectedProducts = useMemo(() => products.filter((p) => p.selected), [products]);

  const toggleProduct = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)));
    setChecked(false);
  };

  const handleCheck = () => {
    if (selectedProducts.length < 2) { toast.error("请至少选择2个产品"); return; }
    const items = selectedProducts.map((p) => ({ name: p.name, keyIngredients: p.keyIngredients }));
    setConflicts(checkConflicts(items));
    setSynergies(checkSynergies(items));
    setOrder(suggestOrder(items));
    setChecked(true);
  };

  return (
    <SubPageLayout title="冲突检测" subtitle="检测产品之间的成分冲突与协同">
      {/* Product Selection */}
      <div className="space-y-3">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium">选择要检测的产品</p>
        <div className="space-y-1.5">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => toggleProduct(p.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all active:scale-[0.98] ${
                p.selected
                  ? "bg-[rgba(193,123,92,0.06)] border border-[rgba(193,123,92,0.2)]"
                  : "bg-[rgba(237,232,224,0.3)] border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    p.selected ? "bg-[#C17B5C] border-[#C17B5C]" : "border-[rgba(193,123,92,0.2)]"
                  }`}
                >
                  {p.selected && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[12px] text-[#2D2420] font-medium truncate">{p.name}</p>
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {p.keyIngredients.slice(0, 3).map((ing) => (
                      <span key={ing} className="font-body text-[10px] text-[#9A8C82] bg-[rgba(237,232,224,0.5)] px-1 py-0.5 rounded">{ing}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={selectedProducts.length < 2}
          className="btn-primary w-full disabled:opacity-40"
        >
          检测冲突（已选 {selectedProducts.length} 个）
        </button>

        <button
          onClick={() => setLocation("/ingredients")}
          className="w-full py-2 rounded-xl font-body text-[12px] text-[#B5ADA7] hover:text-[#C17B5C] transition-colors border border-[rgba(45,36,32,0.06)]"
        >
          + 去成分分析器添加更多产品
        </button>
      </div>

      {/* Results */}
      {checked && (
        <>
          <div className="warm-divider my-5" />
          <div className="space-y-4 anim-fade-up">
            {/* Summary */}
            <div className="card-warm p-3.5 flex items-center gap-2.5">
              <span className="text-[24px]">{conflicts.length === 0 ? "✅" : "⚠️"}</span>
              <div>
                <p className="font-body text-[13px] text-[#2D2420] font-medium">
                  {conflicts.length === 0 ? "未发现冲突" : `发现 ${conflicts.length} 个潜在冲突`}
                </p>
                {synergies.length > 0 && (
                  <p className="font-body text-[11px] text-[#9A8C82]">{synergies.length} 个协同增效</p>
                )}
              </div>
            </div>

            {/* Conflicts */}
            {conflicts.length > 0 && (
              <div>
                <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">冲突详情</p>
                <div className="space-y-2">
                  {conflicts.map((c, i) => (
                    <div
                      key={i}
                      className="card-warm px-3.5 py-2.5"
                      style={{ borderLeft: `3px solid ${severityColor(c.rule.severity)}` }}
                    >
                      <span
                        className="inline-block font-body text-[10px] px-1.5 py-0.5 rounded-full font-medium mb-1"
                        style={{ color: severityColor(c.rule.severity), background: `${severityColor(c.rule.severity)}12` }}
                      >
                        {severityLabel(c.rule.severity)}
                      </span>
                      <p className="font-body text-[12px] text-[#2D2420] font-medium">{c.ingredientA} × {c.ingredientB}</p>
                      <p className="font-body text-[11px] text-[#9A8C82]">{c.productA} ↔ {c.productB}</p>
                      <p className="font-body text-[11px] text-[#7A6E68] mt-1">{c.rule.description}</p>
                      <p className="font-body text-[11px] text-[#4A9A6B] mt-0.5">💡 {c.rule.advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Synergies */}
            {synergies.length > 0 && (
              <div>
                <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">协同增效</p>
                <div className="space-y-1.5">
                  {synergies.map((s, i) => (
                    <div key={i} className="card-warm px-3.5 py-2.5" style={{ borderLeft: "3px solid #4A9A6B" }}>
                      <p className="font-body text-[12px] text-[#4A9A6B] font-medium">{s.rule.benefit}</p>
                      <p className="font-body text-[11px] text-[#2D2420]">{s.ingredientA} + {s.ingredientB}</p>
                      <p className="font-body text-[11px] text-[#7A6E68] mt-0.5">{s.rule.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order */}
            {(order.am.length > 0 || order.pm.length > 0) && (
              <div className="card-warm p-3.5">
                <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">建议使用顺序</p>
                {order.am.length > 0 && (
                  <div className="mb-2">
                    <p className="font-body text-[11px] text-[#C17B5C] font-medium mb-1">☀️ 早间</p>
                    <div className="flex flex-wrap gap-1">
                      {order.am.map((name, i) => (
                        <span key={name} className="font-body text-[11px] text-[#7A6E68] bg-[rgba(237,232,224,0.5)] px-1.5 py-0.5 rounded">{i + 1}. {name}</span>
                      ))}
                    </div>
                  </div>
                )}
                {order.pm.length > 0 && (
                  <div>
                    <p className="font-body text-[11px] text-[#C17B5C] font-medium mb-1">🌙 晚间</p>
                    <div className="flex flex-wrap gap-1">
                      {order.pm.map((name, i) => (
                        <span key={name} className="font-body text-[11px] text-[#7A6E68] bg-[rgba(237,232,224,0.5)] px-1.5 py-0.5 rounded">{i + 1}. {name}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!checked && (
        <div className="text-center py-12">
          <span className="text-[32px]">🔍</span>
          <p className="font-body text-[13px] text-[#B5ADA7] mt-2">选择产品后查看冲突检测结果</p>
        </div>
      )}
    </SubPageLayout>
  );
}
