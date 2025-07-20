import type { VercelRequest, VercelResponse } from '@vercel/node';

const MAX_NOTAM_BATCH = 8;

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

  const { source, target, notams } = req.body || {};
  const apiKey = process.env.OPENAI_API_KEY;

  if (!Array.isArray(notams) || !notams.length) {
    res.status(400).json({ error: "No NOTAM list provided" });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ error: "Missing OpenAI API Key" });
    return;
  }

  const batchList = notams.slice(0, MAX_NOTAM_BATCH);

  const numbered = batchList.map((n, i) => `${i + 1}. ${n}`).join('\n\n');
  const SYSTEM_PROMPT = `
아래 여러 건의 영문 NOTAM을 각 줄 번호별로 번역하세요.
실제 한국 항공 NOTAM 스타일로, 자연스럽고 명확하게, 불필요한 직역 없이 번역하세요.
한국 조종사들이 현장에서 읽는 한글 NOTAM 어투(공문체)로 작성하세요.
각 번역 결과 앞에 같은 번호를 붙여주세요.
`;

  try {
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT.trim() },
          { role: "user", content: numbered }
        ],
        max_tokens: 1800
      })
    });

    const gptJson = await gptRes.json();
    const aiText = gptJson.choices?.[0]?.message?.content?.trim();

    // 번호별로 결과 분리
    let translations: string[] = [];
    if (aiText) {
      const parts = aiText.split(/\n(?=\d+\.\s)/).map(x => x.trim());
      translations = batchList.map((_, i) => {
        const find = parts.find(p => p.startsWith(`${i+1}.`));
        return find ? find.replace(/^\d+\.\s*/, "") : "";
      });
    }

    res.status(200).json({
      translations, // 번역 결과 배열(원문 순서와 일치)
      raw: aiText || "",
      error: aiText ? null : (gptJson.error?.message || "No result from OpenAI")
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
}
