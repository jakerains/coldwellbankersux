import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from "ai";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { aiTools } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    // Vercel AI Gateway - requires `vercel dev` for local development
    // OIDC authentication is automatic when using vercel dev or deployed
    model: "xai/grok-4.1-fast-reasoning",
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: aiTools,
    // Allow multi-step tool calls (e.g., search local → then search external if no results)
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
