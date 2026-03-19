/*
 * Discover.tsx — 发现页
 * Design: Warm Ivory Minimalism
 * 护肤知识卡片 + 成分聚焦 + 护肤小贴士
 */
import { useState } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import MobileTabBar from "@/components/MobileTabBar";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  icon: string;
}

interface IngredientSpotlight {
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  goodFor: string[];
  tips: string;
}

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "混合偏油肌的早晚护肤指南",
    summary: "T区出油、两颊干燥？学会分区护理，让混合肌也能拥有水油平衡的好状态。",
    category: "护肤方案",
    readTime: "5分钟",
    icon: "📋",
  },
  {
    id: "a2",
    title: "A醇入门：从0.1%开始的抗衰之路",
    summary: "A醇是公认的抗衰金标准，但使用不当会导致脱皮泛红。这篇文章教你安全建立耐受。",
    category: "成分科普",
    readTime: "8分钟",
    icon: "🧬",
  },
  {
    id: "a3",
    title: "防晒的正确用量：你可能一直涂少了",
    summary: "一元硬币大小到底是多少？SPF50和SPF30的真实差距有多大？",
    category: "防晒知识",
    readTime: "4分钟",
    icon: "☀️",
  },
  {
    id: "a4",
    title: "烟酰胺 vs 维生素C：美白成分怎么选",
    summary: "两大美白明星成分的优缺点对比，以及它们能不能一起用。",
    category: "成分对比",
    readTime: "6分钟",
    icon: "⚡",
  },
  {
    id: "a5",
    title: "皮肤屏障受损的5个信号",
    summary: "泛红、刺痛、干燥、出油、敏感——这些可能都是屏障受损的表现。",
    category: "皮肤健康",
    readTime: "5分钟",
    icon: "🛡️",
  },
  {
    id: "a6",
    title: "刷酸新手必读：AHA、BHA、PHA的区别",
    summary: "果酸、水杨酸、葡萄糖酸内酯各有什么特点？哪种适合你的肤质？",
    category: "成分科普",
    readTime: "7分钟",
    icon: "🧪",
  },
];

const SPOTLIGHTS: IngredientSpotlight[] = [
  {
    name: "神经酰胺",
    nameEn: "Ceramide",
    tagline: "皮肤屏障的基石",
    description: "神经酰胺是皮肤角质层中天然存在的脂质，占角质层脂质的50%。外用神经酰胺可以修复受损的皮肤屏障，减少水分流失。",
    goodFor: ["干性肌", "敏感肌", "屏障受损"],
    tips: "选择含有神经酰胺NP、AP、EOP三种类型的产品效果更好",
  },
  {
    name: "透明质酸",
    nameEn: "Hyaluronic Acid",
    tagline: "天然保湿因子",
    description: "透明质酸能吸收自身重量1000倍的水分。不同分子量的透明质酸作用于皮肤不同层次，大分子在表面保湿，小分子渗透补水。",
    goodFor: ["所有肤质", "干性肌", "缺水肌"],
    tips: "在湿润的皮肤上使用效果最佳，之后要用面霜锁住水分",
  },
  {
    name: "烟酰胺",
    nameEn: "Niacinamide",
    tagline: "多效全能选手",
    description: "烟酰胺（维生素B3）是护肤界的多面手，可以美白、控油、收毛孔、抗衰老。2-5%浓度适合日常使用。",
    goodFor: ["油性肌", "混合肌", "暗沉肌"],
    tips: "初次使用从低浓度开始，避免与高浓度维生素C同时使用",
  },
];

const TIPS = [
  { icon: "💧", text: "洗脸后30秒内涂抹护肤品，锁住水分效果最好" },
  { icon: "🌙", text: "晚上10点到凌晨2点是皮肤修复黄金期" },
  { icon: "☀️", text: "阴天也需要防晒，紫外线可以穿透云层" },
  { icon: "🥤", text: "每天8杯水，从内而外保持皮肤水润" },
  { icon: "🧴", text: "护肤品开封后注意保质期，一般6-12个月" },
  { icon: "😴", text: "枕套每周更换一次，减少细菌对皮肤的影响" },
];

export default function Discover() {
  const [, setLocation] = useLocation();
  const [spotlightIdx, setSpotlightIdx] = useState(0);
  const spotlight = SPOTLIGHTS[spotlightIdx];

  const handleArticleClick = () => {
    toast("文章详情功能即将推出");
  };

  const Content = () => (
    <div className="space-y-6">
      {/* Ingredient Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-[13px] text-[#7A6E68] font-medium">成分聚焦</p>
          <div className="flex gap-1">
            {SPOTLIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setSpotlightIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === spotlightIdx ? "bg-[#C17B5C] w-4" : "bg-[rgba(193,123,92,0.2)]"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="card-warm p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display text-[1.1rem] text-clay-gradient">{spotlight.name}</span>
            <span className="font-body text-[12px] text-[#B5ADA7]">{spotlight.nameEn}</span>
          </div>
          <p className="font-body text-[14px] text-[#C17B5C] font-medium mb-2">{spotlight.tagline}</p>
          <p className="font-body text-[13px] text-[#7A6E68] leading-relaxed mb-3">{spotlight.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {spotlight.goodFor.map((s) => (
              <span key={s} className="font-body text-[12px] text-[#4A9A6B] bg-[rgba(74,154,107,0.08)] px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
          <p className="font-body text-[12px] text-[#9A8C82] italic">💡 {spotlight.tips}</p>
        </div>
      </div>

      {/* Articles */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-3">护肤知识</p>
        <div className="space-y-2.5">
          {ARTICLES.map((article) => (
            <button
              key={article.id}
              onClick={handleArticleClick}
              className="card-warm w-full text-left px-4 py-3.5 transition-all active:scale-[0.98] hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-[22px] shrink-0">{article.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[14px] text-[#2D2420] font-medium">{article.title}</p>
                  <p className="font-body text-[12px] text-[#9A8C82] mt-1 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="pill-clay text-[12px]">{article.category}</span>
                    <span className="font-body text-[12px] text-[#B5ADA7]">{article.readTime}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-3">每日小贴士</p>
        <div className="grid grid-cols-2 gap-2.5">
          {TIPS.map((tip, i) => (
            <div key={i} className="card-warm px-3 py-3">
              <span className="text-[18px]">{tip.icon}</span>
              <p className="font-body text-[12px] text-[#7A6E68] mt-1.5 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="font-body text-[13px] text-[#7A6E68] font-medium mb-3">快捷工具</p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setLocation("/ingredients")}
            className="card-warm px-4 py-4 text-center transition-all active:scale-[0.96] hover:shadow-md"
          >
            <span className="text-[24px]">🧪</span>
            <p className="font-body text-[13px] text-[#2D2420] font-medium mt-2">成分分析器</p>
            <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">解读产品成分表</p>
          </button>
          <button
            onClick={() => setLocation("/conflict")}
            className="card-warm px-4 py-4 text-center transition-all active:scale-[0.96] hover:shadow-md"
          >
            <span className="text-[24px]">🔍</span>
            <p className="font-body text-[13px] text-[#2D2420] font-medium mt-2">冲突检测</p>
            <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">检查产品搭配安全</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ===== MOBILE ===== */}
      <div className="md:hidden min-h-[100dvh] flex flex-col bg-background">
        <header className="flex items-center gap-3 px-5 pt-[env(safe-area-inset-top,12px)] pb-2 shrink-0">
          <Logo size="sm" />
          <div className="flex-1" />
        </header>

        <div className="px-5 pt-2 pb-1 anim-fade-up">
          <h1 className="font-display text-[1.3rem] text-[#2D2420]">发现</h1>
          <p className="font-body text-[12px] text-[#9A8C82] mt-0.5">护肤知识与灵感</p>
        </div>

        <div className="px-5 mt-3 anim-fade-up d-100 pb-tabbar">
          <Content />
        </div>

        <MobileTabBar />
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex page-locked flex-col">
        <header className="flex items-center justify-between px-8 lg:px-12 py-4 shrink-0">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2"><Logo /></button>
          <button onClick={() => setLocation("/")} className="font-body text-[13px] text-[#7A6E68] hover:text-[#C17B5C] transition-colors">返回首页</button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-6">
            <h1 className="font-display text-[1.5rem] text-[#2D2420] mb-1 anim-fade-up">发现</h1>
            <p className="font-body text-[13px] text-[#9A8C82] mb-6 anim-fade-up d-100">护肤知识与灵感</p>
            <div className="anim-fade-up d-200">
              <Content />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
