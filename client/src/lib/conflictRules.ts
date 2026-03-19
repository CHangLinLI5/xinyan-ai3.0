// ===== 冲突规则库 =====
// 15+ 冲突规则 + 8+ 安全搭配规则

export type Severity = "high" | "medium" | "low";

export interface ConflictRule {
  ingredientA: string[];  // 成分A的名称/别名
  ingredientB: string[];  // 成分B的名称/别名
  severity: Severity;
  description: string;
  advice: string;
}

export interface SynergyRule {
  ingredientA: string[];
  ingredientB: string[];
  benefit: string;
  description: string;
}

export const CONFLICT_RULES: ConflictRule[] = [
  // === 高风险 ===
  {
    ingredientA: ["视黄醇", "A醇", "维A醇", "retinol"],
    ingredientB: ["果酸", "AHA", "甘醇酸", "glycolic acid"],
    severity: "high",
    description: "双重刺激，严重破坏皮肤屏障",
    advice: "分开早晚使用：果酸早间，A醇晚间；或隔天交替",
  },
  {
    ingredientA: ["视黄醇", "A醇", "维A醇", "retinol"],
    ingredientB: ["水杨酸", "BHA", "salicylic acid"],
    severity: "high",
    description: "叠加去角质风险，导致过度剥脱",
    advice: "不建议同时使用，可隔天交替",
  },
  {
    ingredientA: ["果酸", "AHA", "甘醇酸", "glycolic acid"],
    ingredientB: ["水杨酸", "BHA", "salicylic acid"],
    severity: "high",
    description: "双酸叠加，去角质过度导致屏障受损",
    advice: "选择其一使用，不要同时叠加",
  },
  {
    ingredientA: ["视黄醇", "A醇", "维A醇", "retinol"],
    ingredientB: ["过氧化苯甲酰", "BPO", "benzoyl peroxide"],
    severity: "high",
    description: "BPO会氧化A醇使其失效，同时双重刺激",
    advice: "分开早晚使用：BPO早间，A醇晚间",
  },
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸", "ascorbic acid", "左旋维C"],
    ingredientB: ["过氧化苯甲酰", "BPO", "benzoyl peroxide"],
    severity: "high",
    description: "BPO会氧化VC使其完全失效",
    advice: "分开早晚使用：VC早间，BPO晚间",
  },
  {
    ingredientA: ["视黄醇", "A醇", "维A醇", "retinol", "视黄醛"],
    ingredientB: ["维生素C", "VC", "抗坏血酸", "ascorbic acid", "左旋维C"],
    severity: "high",
    description: "pH环境不兼容，互相降低效果并增加刺激",
    advice: "VC用于早间抗氧化，A醇用于晚间抗衰",
  },

  // === 中风险 ===
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸", "ascorbic acid", "左旋维C"],
    ingredientB: ["烟酰胺", "VB3", "niacinamide"],
    severity: "medium",
    description: "酸性环境下烟酰胺可能转化为烟酸引起潮红",
    advice: "间隔15-20分钟使用，或选择pH接近的产品",
  },
  {
    ingredientA: ["烟酰胺", "VB3", "niacinamide"],
    ingredientB: ["果酸", "AHA", "甘醇酸", "glycolic acid"],
    severity: "medium",
    description: "酸性条件下烟酰胺转化为烟酸，引起面部潮红",
    advice: "间隔使用或选择pH>5的烟酰胺产品",
  },
  {
    ingredientA: ["果酸", "AHA", "甘醇酸", "glycolic acid"],
    ingredientB: ["酒精", "乙醇", "alcohol denat"],
    severity: "medium",
    description: "叠加刺激和干燥，加速水分流失",
    advice: "避免同时使用含高浓度酒精和果酸的产品",
  },
  {
    ingredientA: ["视黄醇", "A醇", "retinol"],
    ingredientB: ["酒精", "乙醇", "alcohol denat"],
    severity: "medium",
    description: "酒精加剧A醇的刺激性和干燥感",
    advice: "使用A醇时避免含高浓度酒精的产品",
  },
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸", "ascorbic acid"],
    ingredientB: ["铜胜肽", "蓝铜胜肽", "copper peptide"],
    severity: "medium",
    description: "铜离子会加速VC氧化失效",
    advice: "分开早晚使用",
  },
  {
    ingredientA: ["水杨酸", "BHA"],
    ingredientB: ["壬二酸", "杜鹃花酸", "azelaic acid"],
    severity: "medium",
    description: "双酸叠加可能增加刺激",
    advice: "建议隔天交替使用",
  },
  {
    ingredientA: ["果酸", "AHA", "甘醇酸"],
    ingredientB: ["壬二酸", "杜鹃花酸"],
    severity: "medium",
    description: "酸类叠加增加刺激风险",
    advice: "建议隔天交替使用",
  },

  // === 低风险 ===
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸"],
    ingredientB: ["果酸", "AHA", "甘醇酸"],
    severity: "low",
    description: "都在酸性环境下工作，可搭配但注意刺激",
    advice: "敏感肌建议分开使用，耐受肌可同时使用",
  },
  {
    ingredientA: ["烟酰胺", "VB3"],
    ingredientB: ["水杨酸", "BHA"],
    severity: "low",
    description: "轻微pH冲突，但通常可以搭配",
    advice: "间隔几分钟使用即可",
  },
  {
    ingredientA: ["视黄醇", "A醇", "retinol"],
    ingredientB: ["烟酰胺", "VB3", "niacinamide"],
    severity: "low",
    description: "烟酰胺可能缓解A醇刺激，但部分人不适",
    advice: "大多数人可以搭配，注意观察皮肤反应",
  },
];

export const SYNERGY_RULES: SynergyRule[] = [
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸"],
    ingredientB: ["维生素E", "VE", "生育酚"],
    benefit: "抗氧化协同增效",
    description: "VC+VE协同抗氧化，效果远超单独使用",
  },
  {
    ingredientA: ["维生素C", "VC", "抗坏血酸"],
    ingredientB: ["阿魏酸", "ferulic acid"],
    benefit: "抗氧化铁三角",
    description: "经典CEF组合，阿魏酸稳定VC并增强抗氧化效果",
  },
  {
    ingredientA: ["烟酰胺", "VB3"],
    ingredientB: ["透明质酸", "玻尿酸", "HA"],
    benefit: "美白+保湿双效",
    description: "烟酰胺美白控油+透明质酸深层保湿，互不干扰",
  },
  {
    ingredientA: ["神经酰胺", "ceramide"],
    ingredientB: ["角鲨烷", "squalane"],
    benefit: "双重屏障修护",
    description: "神经酰胺修复+角鲨烷封闭，全面修护皮肤屏障",
  },
  {
    ingredientA: ["视黄醇", "A醇", "retinol"],
    ingredientB: ["角鲨烷", "squalane"],
    benefit: "缓解A醇干燥",
    description: "角鲨烷的润肤效果可缓解A醇带来的干燥脱皮",
  },
  {
    ingredientA: ["透明质酸", "玻尿酸", "HA"],
    ingredientB: ["神经酰胺", "ceramide"],
    benefit: "补水+锁水",
    description: "透明质酸吸水+神经酰胺锁水，完美保湿组合",
  },
  {
    ingredientA: ["积雪草提取物", "CICA"],
    ingredientB: ["泛醇", "VB5", "panthenol"],
    benefit: "双重修护舒缓",
    description: "积雪草+泛醇协同修护受损屏障，舒缓敏感",
  },
  {
    ingredientA: ["烟酰胺", "VB3"],
    ingredientB: ["视黄醇", "A醇"],
    benefit: "抗衰+修护",
    description: "烟酰胺可帮助缓解A醇的刺激，同时增强抗衰效果",
  },
  {
    ingredientA: ["水杨酸", "BHA"],
    ingredientB: ["烟酰胺", "VB3"],
    benefit: "控油+收毛孔",
    description: "水杨酸清洁毛孔+烟酰胺收缩毛孔，油皮最佳搭档",
  },
  {
    ingredientA: ["胜肽", "peptides"],
    ingredientB: ["透明质酸", "玻尿酸", "HA"],
    benefit: "抗衰+保湿",
    description: "胜肽促胶原合成+透明质酸保湿，温和抗衰组合",
  },
];

// ===== 冲突检测函数 =====
function nameMatches(names: string[], target: string): boolean {
  const lower = target.toLowerCase();
  return names.some(
    (n) => n.toLowerCase() === lower || lower.includes(n.toLowerCase()) || n.toLowerCase().includes(lower)
  );
}

export interface ConflictResult {
  rule: ConflictRule;
  productA: string;
  productB: string;
  ingredientA: string;
  ingredientB: string;
}

export interface SynergyResult {
  rule: SynergyRule;
  productA: string;
  productB: string;
  ingredientA: string;
  ingredientB: string;
}

export function checkConflicts(
  products: { name: string; keyIngredients: string[] }[]
): ConflictResult[] {
  const results: ConflictResult[] = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const pA = products[i];
      const pB = products[j];
      for (const ingA of pA.keyIngredients) {
        for (const ingB of pB.keyIngredients) {
          for (const rule of CONFLICT_RULES) {
            if (
              (nameMatches(rule.ingredientA, ingA) && nameMatches(rule.ingredientB, ingB)) ||
              (nameMatches(rule.ingredientA, ingB) && nameMatches(rule.ingredientB, ingA))
            ) {
              // Avoid duplicates
              const exists = results.some(
                (r) =>
                  r.rule === rule &&
                  ((r.productA === pA.name && r.productB === pB.name) ||
                    (r.productA === pB.name && r.productB === pA.name))
              );
              if (!exists) {
                results.push({
                  rule,
                  productA: pA.name,
                  productB: pB.name,
                  ingredientA: ingA,
                  ingredientB: ingB,
                });
              }
            }
          }
        }
      }
    }
  }
  return results.sort((a, b) => {
    const order: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
    return order[a.rule.severity] - order[b.rule.severity];
  });
}

export function checkSynergies(
  products: { name: string; keyIngredients: string[] }[]
): SynergyResult[] {
  const results: SynergyResult[] = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const pA = products[i];
      const pB = products[j];
      for (const ingA of pA.keyIngredients) {
        for (const ingB of pB.keyIngredients) {
          for (const rule of SYNERGY_RULES) {
            if (
              (nameMatches(rule.ingredientA, ingA) && nameMatches(rule.ingredientB, ingB)) ||
              (nameMatches(rule.ingredientA, ingB) && nameMatches(rule.ingredientB, ingA))
            ) {
              const exists = results.some(
                (r) =>
                  r.rule === rule &&
                  ((r.productA === pA.name && r.productB === pB.name) ||
                    (r.productA === pB.name && r.productB === pA.name))
              );
              if (!exists) {
                results.push({
                  rule,
                  productA: pA.name,
                  productB: pB.name,
                  ingredientA: ingA,
                  ingredientB: ingB,
                });
              }
            }
          }
        }
      }
    }
  }
  return results;
}

// 使用顺序建议
export function suggestOrder(
  products: { name: string; keyIngredients: string[] }[]
): { am: string[]; pm: string[] } {
  const am: string[] = [];
  const pm: string[] = [];

  for (const p of products) {
    const hasRetinol = p.keyIngredients.some((i) =>
      ["视黄醇", "A醇", "retinol", "视黄醛"].some((r) => i.toLowerCase().includes(r.toLowerCase()))
    );
    const hasVC = p.keyIngredients.some((i) =>
      ["维生素C", "VC", "抗坏血酸", "左旋维C"].some((r) => i.toLowerCase().includes(r.toLowerCase()))
    );
    const hasBPO = p.keyIngredients.some((i) =>
      ["BPO", "过氧化苯甲酰"].some((r) => i.toLowerCase().includes(r.toLowerCase()))
    );
    const hasAcid = p.keyIngredients.some((i) =>
      ["果酸", "AHA", "水杨酸", "BHA"].some((r) => i.toLowerCase().includes(r.toLowerCase()))
    );

    if (hasRetinol) {
      pm.push(p.name);
    } else if (hasVC) {
      am.push(p.name);
    } else if (hasBPO) {
      am.push(p.name);
    } else if (hasAcid) {
      pm.push(p.name);
    } else {
      am.push(p.name);
      pm.push(p.name);
    }
  }

  return { am, pm };
}

export function severityEmoji(s: Severity): string {
  return s === "high" ? "🔴" : s === "medium" ? "🟡" : "🟢";
}

export function severityLabel(s: Severity): string {
  return s === "high" ? "高风险" : s === "medium" ? "中风险" : "低风险";
}

export function severityColor(s: Severity): string {
  return s === "high" ? "#C0392B" : s === "medium" ? "#C8A84E" : "#4A9A6B";
}
