import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { fetchUrlContent } from "@/app/lib/fetch-url";

// Force dynamic execution to skip caching
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Validate input
const RequestSchema = z.object({
  url: z.string().url(),
});

// Define output structure
const AnalysisSchema = z.object({
  score: z.number().min(0).max(100).describe("Fire score from 0 to 100"),
  reasoning: z
    .string()
    .max(200)
    .describe("Brief, sharp explanation in Degen style"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Risk assessment"),
  tags: z
    .array(z.string())
    .describe("Key characteristics of the project/tweet"),
});

// Mock Data for fallback
const MOCK_DATA = {
  score: 88,
  reasoning:
    "马斯克刚点赞了这条。流动性已锁。要起飞了。(Mock数据，AI_API_KEY 未配置或额度用尽)",
  riskLevel: "MEDIUM" as const,
  tags: ["名人互动", "高交易量", "Meme"],
};

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { url } = RequestSchema.parse(json);

    // Check for API Key with detailed logging
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ Missing GOOGLE_GENERATIVE_AI_API_KEY. Using Mock Data.");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return Response.json(MOCK_DATA);
    }

    try {
      // Fetch URL content
      console.log("📥 Fetching content from:", url);
      const context = await fetchUrlContent(url);

      // Call AI with content
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: AnalysisSchema,
        system: `你是一个 Degen (激进) 加密投资者。说话简短、犀利、幽默。
        分析给定内容的爆火潜力。
        - 如果看起来像骗局 => 低分数, 高风险, 直接说垃圾。
        - 如果有潜力 => 高分数, 警告风险但表现兴奋。
        - 推理必须用简体中文。
        - 推理保持在 200 字符以内。
        - 基于内容的实际信息进行分析,不要编造。`,
        prompt: `分析这个 URL 的内容:\n\nURL: ${url}\n\n${context}`,
      });

      return Response.json(object);
    } catch (apiError) {
      console.error("AI API Call Failed:", apiError);
      // Fallback to Mock Data on API failure
      return Response.json(MOCK_DATA);
    }
  } catch (error) {
    console.error("Request Error:", error);
    return Response.json(
      { error: "Invalid request or internal error" },
      { status: 400 }
    );
  }
}
