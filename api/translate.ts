import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
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
    const prompt = `Translate the following NOTAM into Korean in a natural, short, aviation-appropriate summary format. Include source info if present.\n\n${text}`;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an aviation NOTAM translator." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800
      })
    });

    const gptJson = await gptRes.json();
    const result = gptJson.choices?.[0]?.message?.content?.trim();

    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(500).json({ error: gptJson.error?.message || "OpenAI returned no result" });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
