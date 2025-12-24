import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { aiTools } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Using Gemini 3 Flash via Vercel AI Gateway
    // AI SDK 6 auto-routes string model IDs through the gateway
    // OIDC authentication is automatic when deployed on Vercel
    model: "google/gemini-3-flash",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: aiTools,
  });

  return result.toUIMessageStreamResponse();
}
