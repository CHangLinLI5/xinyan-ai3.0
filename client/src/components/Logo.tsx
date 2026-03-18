/*
 * Logo — 芯颜 AI
 * 使用品牌 favicon 图片替代 SVG 同心圆
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449767573/9NFV4vPhGYnrkNfpEcCSrd/favicon-192_9ec4093e.png";

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSize = size === "sm" ? 24 : size === "md" ? 30 : 36;

  return (
    <div className="flex items-center gap-2">
      <img
        src={LOGO_URL}
        alt="芯颜 AI"
        width={iconSize}
        height={iconSize}
        className="rounded-full object-cover"
        style={{ width: iconSize, height: iconSize }}
      />
      {showText && (
        <span className="font-display font-normal tracking-tight" style={{ fontSize: size === "sm" ? 16 : size === "md" ? 18 : 22 }}>
          <span className="text-[#2D2420]">芯颜</span>
          <span className="text-[#C17B5C] ml-0.5">AI</span>
        </span>
      )}
    </div>
  );
}
