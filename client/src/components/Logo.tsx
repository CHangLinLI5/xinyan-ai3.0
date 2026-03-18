/*
 * Logo — 芯颜 AI
 * SVG: 三层同心圆 + 文字
 */
interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const iconSize = size === "sm" ? 24 : size === "md" ? 28 : 34;

  return (
    <div className="flex items-center gap-2">
      <svg width={iconSize} height={iconSize} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#C17B5C" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="12" fill="rgba(193,123,92,0.15)" />
        <circle cx="20" cy="20" r="6" fill="#C17B5C" />
      </svg>
      {showText && (
        <span className="font-display font-normal tracking-tight" style={{ fontSize: size === "sm" ? 16 : size === "md" ? 18 : 22 }}>
          <span className="text-[#2D2420]">芯颜</span>
          <span className="text-[#C17B5C] ml-0.5">AI</span>
        </span>
      )}
    </div>
  );
}
