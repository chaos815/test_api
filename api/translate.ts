import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

  const { source, target, text } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Missing OpenAI API Key" });
    return;
  }

  if (!text) {
    res.status(400).json({ error: "No text provided" });
    return;
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "You are an aviation NOTAM interpreter. Translate each NOTAM below into natural Korean. Summarize the information in a structured format including:\n\n" +
          "- NOTAM 번호 (있는 경우)\n" +
          "- 타입 및 영향 (예: 활주로 폐쇄, 공사 등)\n" +
          "- 공항 또는 FIR 명칭 (가능한 경우)\n" +
          "- 유효기간 (시작/종료 시간)\n" +
          "- 상세 내용 요약\n" +
          "- 주의사항 또는 비고 (있다면)\n\n" +
          "Ensure technical aviation terms are preserved and translated naturally. Do not omit the 'SOURCE: XXXX' part—translate it as well."
      },
      {
        role: "user",
        content: text
      }
    ];

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.5,
        max_tokens: 1000
      })
    });

    const gptJson = await gptRes.json();
    const result = gptJson.choices?.[0]?.message?.content?.trim();

    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(500).json({
        error: gptJson.error?.message || "OpenAI returned no result"
      });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
