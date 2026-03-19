/*
 * Discover.tsx — 发现页
 * Design: Warm Ivory Minimalism + Lively Motion
 * 成分聚焦(动态卡片) → 文章列表(交错进场) → 小贴士(渐变) → 工具入口
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import SubPageLayout from "@/components/SubPageLayout";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  emoji: string;
}

const ARTICLES: Article[] = [
  { id: "a1", title: "混合偏油肌的早晚护肤指南", summary: "T区出油、两颊干燥？学会分区护理，让混合肌也能拥有水油平衡的好状态。", category: "护肤方案", readTime: "5分钟", emoji: "💧" },
  { id: "a2", title: "A醇入门：从0.1%开始的抗衰之路", summary: "A醇是公认的抗衰金标准，但使用不当会导致脱皮泛红。", category: "成分科普", readTime: "8分钟", emoji: "✨" },
  { id: "a3", title: "防晒的正确用量：你可能一直涂少了", summary: "一元硬币大小到底是多少？SPF50和SPF30的真实差距有多大？", category: "防晒知识", readTime: "4分钟", emoji: "☀️" },
  { id: "a4", title: "烟酰胺 vs 维生素C：美白成分怎么选", summary: "两大美白明星成分的优缺点对比，以及它们能不能一起用。", category: "成分对比", readTime: "6分钟", emoji: "⚡" },
  { id: "a5", title: "皮肤屏障受损的5个信号", summary: "泛红、刺痛、干燥、出油、敏感——这些可能都是屏障受损的表现。", category: "皮肤健康", readTime: "5分钟", emoji: "🛡️" },
  { id: "a6", title: "刷酸新手必读：AHA、BHA、PHA的区别", summary: "果酸、水杨酸、葡萄糖酸内酯各有什么特点？哪种适合你的肤质？", category: "成分科普", readTime: "7分钟", emoji: "🧬" },
];

interface Spotlight {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  goodFor: string[];
  tips: string;
  gradient: string;
  iconBg: string;
}

const SPOTLIGHTS: Spotlight[] = [
  {
    name: "神经酰胺", nameEn: "Ceramide", tagline: "皮肤屏障的基石",
    description: "神经酰胺是皮肤角质层中天然存在的脂质，占角质层脂质的50%。外用神经酰胺可以修复受损的皮肤屏障，减少水分流失。",
    goodFor: ["干性肌", "敏感肌", "屏障受损"],
    tips: "选择含有神经酰胺NP、AP、EOP三种类型的产品效果更好",
    gradient: "linear-gradient(135deg, #F0E4D8 0%, #E8D8CA 50%, #F5EDE4 100%)",
    iconBg: "rgba(193,123,92,0.1)",
  },
  {
    name: "透明质酸", nameEn: "Hyaluronic Acid", tagline: "天然保湿因子",
    description: "透明质酸能吸收自身重量1000倍的水分。不同分子量的透明质酸作用于皮肤不同层次。",
    goodFor: ["所有肤质", "干性肌", "缺水肌"],
    tips: "在湿润的皮肤上使用效果最佳，之后要用面霜锁住水分",
    gradient: "linear-gradient(135deg, #E0E8F0 0%, #D4DEE8 50%, #EAF0F6 100%)",
    iconBg: "rgba(106,122,176,0.1)",
  },
  {
    name: "烟酰胺", nameEn: "Niacinamide", tagline: "多效全能选手",
    description: "烟酰胺（维生素B3）是护肤界的多面手，可以美白、控油、收毛孔、抗衰老。2-5%浓度适合日常使用。",
    goodFor: ["油性肌", "混合肌", "暗沉肌"],
    tips: "初次使用从低浓度开始，避免与高浓度维生素C同时使用",
    gradient: "linear-gradient(135deg, #E4EDE4 0%, #D4E2D4 50%, #ECF4EC 100%)",
    iconBg: "rgba(74,154,107,0.1)",
  },
];

const TIPS = [
  { text: "洗脸后30秒内涂抹护肤品，锁住水分效果最好", icon: "💦" },
  { text: "晚上10点到凌晨2点是皮肤修复黄金期", icon: "🌙" },
  { text: "阴天也需要防晒，紫外线可以穿透云层", icon: "☁️" },
  { text: "护肤品开封后注意保质期，一般6-12个月", icon: "📅" },
];

export default function Discover() {
  const [, setLocation] = useLocation();
  const [spotIdx, setSpotIdx] = useState(0);
  const spot = SPOTLIGHTS[spotIdx];

  return (
    <SubPageLayout title="发现" subtitle="护肤知识与灵感" showBack={false} accentColor="#C17B5C">
      {/* Ingredient Spotlight — animated gradient card */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-[12px] text-[#7A6E68] font-medium tracking-wider uppercase">成分聚焦</p>
          <div className="flex gap-1.5">
            {SPOTLIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotIdx(i)}
                className={`rounded-full transition-all duration-500 ${
                  i === spotIdx ? "bg-[#C17B5C] w-5 h-2" : "bg-[rgba(193,123,92,0.15)] w-2 h-2 hover:bg-[rgba(193,123,92,0.3)]"
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-5 relative overflow-hidden transition-all duration-500 hover-lift"
          style={{ background: spot.gradient, border: "1px solid rgba(45,36,32,0.04)" }}
        >
          {/* Decorative floating circle */}
          <div
            className="absolute -top-6 -right-6 w-28 h-28 rounded-full anim-breathe pointer-events-none"
            style={{ background: spot.iconBg }}
          />
          <div
            className="absolute bottom-2 left-[60%] w-8 h-8 rounded-full anim-float pointer-events-none"
            style={{ background: spot.iconBg, animationDelay: "1s" }}
          />

          <div className="relative">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-display text-[1.1rem] text-clay-gradient">{spot.name}</span>
              <span className="font-body text-[11px] text-[#B5ADA7]">{spot.nameEn}</span>
            </div>
            <p className="font-body text-[13px] text-[#C17B5C] font-medium mb-2">{spot.tagline}</p>
            <p className="font-body text-[12px] text-[#5A4F49] leading-relaxed mb-3">{spot.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {spot.goodFor.map((s) => (
                <span key={s} className="font-body text-[10px] text-[#4A9A6B] bg-[rgba(74,154,107,0.08)] px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
            <div className="flex items-start gap-1.5 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.5)]">
              <span className="text-[12px] mt-0.5">💡</span>
              <p className="font-body text-[11px] text-[#7A6E68] leading-relaxed">{spot.tips}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Articles — stagger animation */}
      <div className="mb-6">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium tracking-wider uppercase mb-3">护肤知识</p>
        <div className="space-y-2 stagger-children">
          {ARTICLES.map((a) => (
            <button
              key={a.id}
              onClick={() => toast("文章详情功能即将推出")}
              className="card-warm w-full text-left px-4 py-3.5 hover-lift group/article"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[rgba(237,232,224,0.6)] group-hover/article:scale-110 transition-transform duration-300">
                  <span className="text-[16px]">{a.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[13px] text-[#2D2420] font-medium group-hover/article:text-[#C17B5C] transition-colors duration-300">{a.title}</p>
                  <p className="font-body text-[11px] text-[#9A8C82] mt-0.5 line-clamp-1">{a.summary}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-body text-[10px] text-[#C17B5C] bg-[rgba(193,123,92,0.06)] px-1.5 py-0.5 rounded-full">{a.category}</span>
                    <span className="font-body text-[10px] text-[#B5ADA7]">{a.readTime}</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B5ADA7" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-1 group-hover/article:translate-x-0.5 group-hover/article:stroke-[#C17B5C] transition-all duration-300">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips — with icons and subtle gradient */}
      <div className="mb-6">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium tracking-wider uppercase mb-3">每日小贴士</p>
        <div className="grid grid-cols-2 gap-2">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="rounded-xl px-3.5 py-3 hover-lift"
              style={{
                background: `linear-gradient(135deg, rgba(237,232,224,0.4) 0%, rgba(237,232,224,0.7) 100%)`,
                border: "1px solid rgba(45,36,32,0.04)",
              }}
            >
              <span className="text-[18px] inline-block mb-1.5">{tip.icon}</span>
              <p className="font-body text-[11px] text-[#5A4F49] leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tools — with gradient backgrounds */}
      <div className="flex gap-2.5">
        <button
          onClick={() => setLocation("/ingredients")}
          className="flex-1 rounded-xl px-3 py-4 text-center hover-lift group/tool"
          style={{ background: "linear-gradient(135deg, #E0E4F0 0%, #D0D6E8 100%)", border: "1px solid rgba(45,36,32,0.04)" }}
        >
          <span className="text-[20px] inline-block group-hover/tool:scale-125 transition-transform duration-300">🧪</span>
          <p className="font-body text-[12px] text-[#2D2420] font-medium mt-1.5">成分分析器</p>
          <p className="font-body text-[10px] text-[#7A6E68] mt-0.5">解读成分表</p>
        </button>
        <button
          onClick={() => setLocation("/conflict")}
          className="flex-1 rounded-xl px-3 py-4 text-center hover-lift group/tool"
          style={{ background: "linear-gradient(135deg, #F0E8E0 0%, #E8DCD0 100%)", border: "1px solid rgba(45,36,32,0.04)" }}
        >
          <span className="text-[20px] inline-block group-hover/tool:scale-125 transition-transform duration-300">🔍</span>
          <p className="font-body text-[12px] text-[#2D2420] font-medium mt-1.5">冲突检测</p>
          <p className="font-body text-[10px] text-[#7A6E68] mt-0.5">检查搭配安全</p>
        </button>
      </div>
    </SubPageLayout>
  );
}
