// translate.ts (Vercel edge function)
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { text, source, target } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Missing OpenAI API Key" });
    return;
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Summarize and translate the following NOTAM in Korean. Include NOTAM number, airport, validity, daily hours, content, and source. Format in structured style." },
          { role: "user", content: text }
        ],
        max_tokens: 1000
      })
    });

    const data = await completion.json();
    const result = data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
