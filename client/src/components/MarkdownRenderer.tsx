/*
 * MarkdownRenderer — 渲染 AI 消息中的 Markdown 格式
 * 支持：加粗、斜体、列表、标题、代码块、链接等
 * Design: Warm Ivory Minimalism 风格
 */
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  // Headings
  h1: ({ children }) => (
    <h1 className="font-display text-lg font-medium text-[#2D2420] mt-4 mb-2 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-display text-base font-medium text-[#2D2420] mt-3 mb-1.5 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-body text-[14px] font-semibold text-[#2D2420] mt-2.5 mb-1 first:mt-0">
      {children}
    </h3>
  ),
  // Paragraphs
  p: ({ children }) => (
    <p className="font-body text-[13.5px] leading-[1.75] text-[#2D2420] mb-2 last:mb-0" style={{ fontWeight: 350 }}>
      {children}
    </p>
  ),
  // Bold
  strong: ({ children }) => (
    <strong className="font-semibold text-[#2D2420]">{children}</strong>
  ),
  // Italic
  em: ({ children }) => (
    <em className="italic text-[#5A4F49]">{children}</em>
  ),
  // Unordered list
  ul: ({ children }) => (
    <ul className="space-y-1 mb-2 last:mb-0 ml-1">{children}</ul>
  ),
  // Ordered list
  ol: ({ children }) => (
    <ol className="space-y-1 mb-2 last:mb-0 ml-1 list-decimal list-inside">{children}</ol>
  ),
  // List item
  li: ({ children }) => (
    <li className="font-body text-[13px] leading-[1.7] text-[#2D2420] flex gap-1.5" style={{ fontWeight: 350 }}>
      <span className="text-[#C17B5C] shrink-0 mt-[2px]">•</span>
      <span className="flex-1">{children}</span>
    </li>
  ),
  // Code inline
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-[rgba(45,36,32,0.04)] rounded-lg px-3 py-2 font-mono text-[12px] text-[#5A4F49] overflow-x-auto my-2">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-[rgba(193,123,92,0.08)] text-[#9A5E42] px-1.5 py-0.5 rounded text-[12px] font-mono">
        {children}
      </code>
    );
  },
  // Code block wrapper
  pre: ({ children }) => (
    <pre className="bg-[rgba(45,36,32,0.04)] rounded-lg overflow-hidden my-2 last:mb-0">
      {children}
    </pre>
  ),
  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#C17B5C] pl-3 my-2 last:mb-0 text-[#7A6E68]">
      {children}
    </blockquote>
  ),
  // Horizontal rule
  hr: () => (
    <hr className="warm-divider my-3" />
  ),
  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#C17B5C] underline underline-offset-2 decoration-[#C17B5C]/30 hover:decoration-[#C17B5C] transition-colors"
    >
      {children}
    </a>
  ),
  // Table
  table: ({ children }) => (
    <div className="overflow-x-auto my-2 last:mb-0">
      <table className="w-full text-[12px] font-body border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[rgba(193,123,92,0.06)]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2 font-medium text-[#2D2420] border-b border-[rgba(45,36,32,0.08)]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 text-[#5A4F49] border-b border-[rgba(45,36,32,0.04)]">
      {children}
    </td>
  ),
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
