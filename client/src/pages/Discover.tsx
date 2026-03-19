/*
 * Discover.tsx — 发现页
 * Design: Warm Ivory Minimalism — 单栏居中布局
 * 成分聚焦 → 文章列表 → 小贴士
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
}

const ARTICLES: Article[] = [
  { id: "a1", title: "混合偏油肌的早晚护肤指南", summary: "T区出油、两颊干燥？学会分区护理，让混合肌也能拥有水油平衡的好状态。", category: "护肤方案", readTime: "5分钟" },
  { id: "a2", title: "A醇入门：从0.1%开始的抗衰之路", summary: "A醇是公认的抗衰金标准，但使用不当会导致脱皮泛红。", category: "成分科普", readTime: "8分钟" },
  { id: "a3", title: "防晒的正确用量：你可能一直涂少了", summary: "一元硬币大小到底是多少？SPF50和SPF30的真实差距有多大？", category: "防晒知识", readTime: "4分钟" },
  { id: "a4", title: "烟酰胺 vs 维生素C：美白成分怎么选", summary: "两大美白明星成分的优缺点对比，以及它们能不能一起用。", category: "成分对比", readTime: "6分钟" },
  { id: "a5", title: "皮肤屏障受损的5个信号", summary: "泛红、刺痛、干燥、出油、敏感——这些可能都是屏障受损的表现。", category: "皮肤健康", readTime: "5分钟" },
  { id: "a6", title: "刷酸新手必读：AHA、BHA、PHA的区别", summary: "果酸、水杨酸、葡萄糖酸内酯各有什么特点？哪种适合你的肤质？", category: "成分科普", readTime: "7分钟" },
];

interface Spotlight {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  goodFor: string[];
  tips: string;
}

const SPOTLIGHTS: Spotlight[] = [
  { name: "神经酰胺", nameEn: "Ceramide", tagline: "皮肤屏障的基石", description: "神经酰胺是皮肤角质层中天然存在的脂质，占角质层脂质的50%。外用神经酰胺可以修复受损的皮肤屏障，减少水分流失。", goodFor: ["干性肌", "敏感肌", "屏障受损"], tips: "选择含有神经酰胺NP、AP、EOP三种类型的产品效果更好" },
  { name: "透明质酸", nameEn: "Hyaluronic Acid", tagline: "天然保湿因子", description: "透明质酸能吸收自身重量1000倍的水分。不同分子量的透明质酸作用于皮肤不同层次。", goodFor: ["所有肤质", "干性肌", "缺水肌"], tips: "在湿润的皮肤上使用效果最佳，之后要用面霜锁住水分" },
  { name: "烟酰胺", nameEn: "Niacinamide", tagline: "多效全能选手", description: "烟酰胺（维生素B3）是护肤界的多面手，可以美白、控油、收毛孔、抗衰老。2-5%浓度适合日常使用。", goodFor: ["油性肌", "混合肌", "暗沉肌"], tips: "初次使用从低浓度开始，避免与高浓度维生素C同时使用" },
];

const TIPS = [
  "洗脸后30秒内涂抹护肤品，锁住水分效果最好",
  "晚上10点到凌晨2点是皮肤修复黄金期",
  "阴天也需要防晒，紫外线可以穿透云层",
  "护肤品开封后注意保质期，一般6-12个月",
];

export default function Discover() {
  const [, setLocation] = useLocation();
  const [spotIdx, setSpotIdx] = useState(0);
  const spot = SPOTLIGHTS[spotIdx];

  return (
    <SubPageLayout title="发现" subtitle="护肤知识与灵感" showBack={false}>
      {/* Ingredient Spotlight */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-body text-[12px] text-[#7A6E68] font-medium">成分聚焦</p>
          <div className="flex gap-1">
            {SPOTLIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === spotIdx ? "bg-[#C17B5C] w-4" : "bg-[rgba(193,123,92,0.15)] w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="card-warm p-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-[1rem] text-clay-gradient">{spot.name}</span>
            <span className="font-body text-[11px] text-[#B5ADA7]">{spot.nameEn}</span>
          </div>
          <p className="font-body text-[12px] text-[#C17B5C] font-medium mb-1.5">{spot.tagline}</p>
          <p className="font-body text-[12px] text-[#7A6E68] leading-relaxed mb-2">{spot.description}</p>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {spot.goodFor.map((s) => (
              <span key={s} className="font-body text-[10px] text-[#4A9A6B] bg-[rgba(74,154,107,0.06)] px-1.5 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
          <p className="font-body text-[11px] text-[#9A8C82] italic">💡 {spot.tips}</p>
        </div>
      </div>

      {/* Articles */}
      <div className="mb-5">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">护肤知识</p>
        <div className="space-y-1.5">
          {ARTICLES.map((a) => (
            <button
              key={a.id}
              onClick={() => toast("文章详情功能即将推出")}
              className="card-warm w-full text-left px-3.5 py-3 transition-all active:scale-[0.98]"
            >
              <p className="font-body text-[13px] text-[#2D2420] font-medium">{a.title}</p>
              <p className="font-body text-[11px] text-[#9A8C82] mt-0.5 line-clamp-1">{a.summary}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="font-body text-[10px] text-[#C17B5C] bg-[rgba(193,123,92,0.06)] px-1.5 py-0.5 rounded-full">{a.category}</span>
                <span className="font-body text-[10px] text-[#B5ADA7]">{a.readTime}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mb-5">
        <p className="font-body text-[12px] text-[#7A6E68] font-medium mb-2">每日小贴士</p>
        <div className="space-y-1.5">
          {TIPS.map((tip, i) => (
            <div key={i} className="card-warm px-3.5 py-2.5">
              <p className="font-body text-[11px] text-[#7A6E68] leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tools */}
      <div className="flex gap-2">
        <button
          onClick={() => setLocation("/ingredients")}
          className="flex-1 card-warm px-3 py-3 text-center transition-all active:scale-[0.96]"
        >
          <p className="font-body text-[12px] text-[#2D2420] font-medium">成分分析器</p>
          <p className="font-body text-[10px] text-[#9A8C82] mt-0.5">解读成分表</p>
        </button>
        <button
          onClick={() => setLocation("/conflict")}
          className="flex-1 card-warm px-3 py-3 text-center transition-all active:scale-[0.96]"
        >
          <p className="font-body text-[12px] text-[#2D2420] font-medium">冲突检测</p>
          <p className="font-body text-[10px] text-[#9A8C82] mt-0.5">检查搭配安全</p>
        </button>
      </div>
    </SubPageLayout>
  );
}
