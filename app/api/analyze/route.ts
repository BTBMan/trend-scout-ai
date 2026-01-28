import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

// Force dynamic execution to skip caching
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Validate input
const RequestSchema = z.object({
  url: z.string().url(),
});

// Define output structure
const AnalysisSchema = z.object({
  score: z.number().min(0).max(100).describe("Viral score from 0 to 100"),
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

    // Check for API Key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Missing GOOGLE_GENERATIVE_AI_API_KEY. Using Mock Data.");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return Response.json(MOCK_DATA);
    }

    return Response.json(MOCK_DATA);

    // try {
    //   const { object } = await generateObject({
    //     model: google("gemini-2.5-flash"),
    //     schema: AnalysisSchema,
    //     system: `You are a Degen (aggressive) crypto investor. You speak short, sharp, and humorous.
    //     Analyze the viral potential of the given URL/project.
    //     - If it looks like a scam => LOW score, HIGH risk, call it garbage.
    //     - If it has potential => HIGH score, warn about risks but show excitement.
    //     - Always use Simplified Chinese for reasoning.
    //     - Keep reasoning under 200 characters.`,
    //     prompt: `Analyze this URL: ${url}`,
    //   });

    //   return Response.json(object);
    // } catch (apiError) {
    //   console.error("AI API Call Failed:", apiError);
    //   // Fallback to Mock Data on API failure
    //   return Response.json(MOCK_DATA);
    // }
  } catch (error) {
    console.error("Request Error:", error);
    return Response.json(
      { error: "Invalid request or internal error" },
      { status: 400 }
    );
  }
}
