import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (모든 도메인 허용)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // 입력값
  const { source, target, text } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;
  const MODEL = "gpt-4o";

  // 디버그: 주요 요청값/키 상태 로깅
  console.log("[translate.ts] 요청:", { source, target, text, model: MODEL });
  if (!apiKey) {
    console.error("[translate.ts] ERROR: No OpenAI API KEY");
    res.status(500).json({ error: "Missing OpenAI API Key" });
    return;
  }
  if (!text) {
    console.error("[translate.ts] ERROR: No text provided");
    res.status(400).json({ error: "No text provided" });
    return;
  }

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: `Translate the following NOTAM from ${source} to ${target} (aviation context, short, natural):` },
          { role: "user", content: text }
        ],
        max_tokens: 800
      })
    });

    const gptJson = await gptRes.json();
    console.log("[translate.ts] OpenAI 응답:", gptJson);

    const result = gptJson.choices?.[0]?.message?.content?.trim();
    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(500).json({ error: gptJson.error?.message || "OpenAI returned no result" });
    }
  } catch (err) {
    console.error("[translate.ts] GPT 호출 ERROR:", err);
    res.status(500).json({ error: String(err) });
  }
}
