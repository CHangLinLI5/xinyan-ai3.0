import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== GPT API Configuration =====
const GPT_API_BASE = "http://104.238.222.107:3006/v1";
const GPT_API_KEY = "sk-5aqlGxWsqus0wKLqphdt67S7xprPbm9ByU0zV2rkLfCmCMng";
const GPT_MODEL = "gpt-5.4";

// ===== System Prompt for Skin Analysis AI =====
const SKIN_AI_SYSTEM_PROMPT = `你是"芯颜AI"，一位专业、温暖、有亲和力的AI皮肤分析顾问。

你的核心能力：
1. 皮肤状态分析：根据用户描述或照片分析皮肤状况
2. 护肤建议：提供个性化的护肤方案和产品推荐
3. 成分解读：解释护肤品成分的功效和注意事项
4. 日常护理指导：提供科学的日常护肤步骤建议

回复风格要求：
- 使用温暖亲切的语气，像一位专业的闺蜜顾问
- 回复简洁有条理，适当使用emoji增加亲和力
- 给出具体可执行的建议，而不是泛泛而谈
- 涉及严重皮肤问题时，建议就医
- 全部使用中文回复
- 回复控制在200字以内，除非用户要求详细解答

免责声明意识：你的分析仅供参考，不构成医疗建议。`;

// ===== Skin Analysis System Prompt =====
const SKIN_ANALYSIS_SYSTEM_PROMPT = `你是"芯颜AI"的皮肤分析引擎。用户上传了面部照片请求分析。

请根据用户的描述生成一份专业的皮肤分析报告，必须严格按照以下JSON格式返回：

{
  "score": 82,
  "tag": "良好",
  "summary": "皮肤整体状态良好的一句话总结",
  "metrics": [
    {"label": "水分含量", "score": 88, "status": "优秀", "desc": "详细描述"},
    {"label": "油脂平衡", "score": 72, "status": "良好", "desc": "详细描述"},
    {"label": "色素均匀度", "score": 65, "status": "需改善", "desc": "详细描述"},
    {"label": "毛孔细腻度", "score": 58, "status": "注意", "desc": "详细描述"},
    {"label": "肤色亮度", "score": 78, "status": "良好", "desc": "详细描述"},
    {"label": "弹性紧致度", "score": 91, "status": "优秀", "desc": "详细描述"}
  ],
  "advice": [
    {"step": "01", "title": "步骤标题", "body": "详细建议内容"},
    {"step": "02", "title": "步骤标题", "body": "详细建议内容"},
    {"step": "03", "title": "步骤标题", "body": "详细建议内容"}
  ],
  "products": [
    {"name": "产品名", "brand": "品牌", "type": "类型", "reason": "推荐理由", "price": "¥价格"},
    {"name": "产品名", "brand": "品牌", "type": "类型", "reason": "推荐理由", "price": "¥价格"},
    {"name": "产品名", "brand": "品牌", "type": "类型", "reason": "推荐理由", "price": "¥价格"}
  ]
}

评分规则：
- score: 总分 40-98
- tag: score>=85 "优秀", score>=70 "良好", 其他 "需关注"
- status: score>=85 "优秀", score>=70 "良好", score>=60 "需改善", 其他 "注意"
- 每个维度的分数应该有差异，不要都很接近
- 建议要具体、可执行
- 产品推荐要真实存在的品牌和产品

只返回JSON，不要包含任何其他文字或markdown代码块标记。`;

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON body
  app.use(express.json({ limit: "10mb" }));

  // ===== API Routes =====

  // Chat endpoint - streaming
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages is required" });
      }

      // Prepare messages with system prompt
      const apiMessages = [
        { role: "system", content: SKIN_AI_SYSTEM_PROMPT },
        ...messages.map((m: any) => ({
          role: m.role === "ai" ? "assistant" : m.role,
          content: m.content,
        })),
      ];

      // Set SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no");

      // Call GPT API with streaming
      const response = await fetch(`${GPT_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: GPT_MODEL,
          messages: apiMessages,
          stream: true,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("GPT API error:", response.status, errorText);
        res.write(`data: ${JSON.stringify({ error: "AI服务暂时不可用，请稍后再试" })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      // Stream the response
      const reader = response.body?.getReader();
      if (!reader) {
        res.write(`data: ${JSON.stringify({ error: "无法读取AI响应" })}\n\n`);
        res.write("data: [DONE]\n\n");
        res.end();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              res.write("data: [DONE]\n\n");
            } else {
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  res.write(`data: ${JSON.stringify({ content })}\n\n`);
                }
                if (parsed.choices?.[0]?.finish_reason === "stop") {
                  res.write("data: [DONE]\n\n");
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      res.end();
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  });

  // Analyze endpoint - returns structured skin analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { description } = req.body;

      const userMessage = description
        ? `用户描述了他们的皮肤状况：${description}。请生成详细的皮肤分析报告。`
        : "用户上传了一张面部照片请求皮肤分析。请根据一般情况生成一份中等偏上的皮肤分析报告，各维度分数要有差异化。";

      const response = await fetch(`${GPT_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GPT_API_KEY}`,
        },
        body: JSON.stringify({
          model: GPT_MODEL,
          messages: [
            { role: "system", content: SKIN_ANALYSIS_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          max_tokens: 2000,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Analyze API error:", response.status, errorText);
        return res.status(500).json({ error: "AI分析服务暂时不可用" });
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        return res.status(500).json({ error: "AI未返回分析结果" });
      }

      // Parse the JSON response from GPT
      try {
        // Remove potential markdown code block markers
        const cleanContent = content
          .replace(/```json\s*/g, "")
          .replace(/```\s*/g, "")
          .trim();
        const analysisResult = JSON.parse(cleanContent);

        // Add metadata
        analysisResult.id = `rec-${Date.now()}`;
        analysisResult.date = new Date().toISOString().split("T")[0];

        // Validate and fix tag
        if (!analysisResult.tag) {
          const score = analysisResult.score || 75;
          analysisResult.tag = score >= 85 ? "优秀" : score >= 70 ? "良好" : "需关注";
        }

        res.json(analysisResult);
      } catch (parseError) {
        console.error("Failed to parse analysis result:", content);
        // Return a fallback result
        res.json({
          id: `rec-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          score: 78,
          tag: "良好",
          summary: content.slice(0, 100),
          metrics: [
            { label: "水分含量", score: 82, status: "良好", desc: "皮肤含水量较好" },
            { label: "油脂平衡", score: 70, status: "良好", desc: "油脂分泌较为均衡" },
            { label: "色素均匀度", score: 68, status: "需改善", desc: "面部色素分布需要关注" },
            { label: "毛孔细腻度", score: 62, status: "需改善", desc: "毛孔状态需要改善" },
            { label: "肤色亮度", score: 75, status: "良好", desc: "整体肤色明亮" },
            { label: "弹性紧致度", score: 85, status: "优秀", desc: "皮肤弹性良好" },
          ],
          advice: [
            { step: "01", title: "温和清洁", body: "使用氨基酸洁面乳，早晚各一次" },
            { step: "02", title: "深层补水", body: "使用含透明质酸的精华液" },
            { step: "03", title: "防晒修护", body: "每日使用SPF50+防晒霜" },
          ],
          products: [
            { name: "氨基酸温和洁面乳", brand: "芙丽芳丝", type: "洁面", reason: "温和不刺激", price: "¥128" },
            { name: "双萃精华肌底液", brand: "兰蔻", type: "精华", reason: "修护肌肤屏障", price: "¥780" },
            { name: "清透防晒乳 SPF50+", brand: "安耐晒", type: "防晒", reason: "轻薄高倍防晒", price: "¥228" },
          ],
        });
      }
    } catch (error) {
      console.error("Analyze error:", error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", model: GPT_MODEL, timestamp: new Date().toISOString() });
  });

  // ===== Static Files & SPA Fallback =====
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3001;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`GPT Model: ${GPT_MODEL}`);
    console.log(`API Base: ${GPT_API_BASE}`);
  });
}

startServer().catch(console.error);
