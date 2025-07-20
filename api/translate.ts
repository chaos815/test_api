// /api/translate.ts (Vercel 서버리스)
// TypeScript 기반. JS로도 변환 가능.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { source, target, text } = req.body;
  const apiKey = process.env.OPENAI_API_KEY; // Vercel 환경변수로 넣음

  if (!apiKey) {
    res.status(500).json({ error: "Missing OpenAI API Key" });
    return;
  }
  try {
    // GPT 번역 (gpt-3.5-turbo 예시)
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `Translate the following NOTAM from ${source} to ${target} (aviation context, short, natural):` },
          { role: "user", content: text }
        ],
        max_tokens: 800
      })
    });
    const gptJson = await gptRes.json();
    const result = gptJson.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
