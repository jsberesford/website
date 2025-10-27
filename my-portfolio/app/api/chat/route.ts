import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const key = process.env.OPENAI_API_KEY;

    if (!key) {
      return NextResponse.json({ error: "OPENAI_API_KEY not set on server." }, { status: 500 });
    }

    // Proxy to OpenAI Chat Completions
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant answering questions about Jared Beresford. If you don't know something, say so." },
          { role: "user", content: message },
        ],
        max_tokens: 600,
      }),
    });

    const data = await resp.json();
    // extract assistant text safely
    const reply = data?.choices?.[0]?.message?.content ?? data?.error ?? "No response";

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
