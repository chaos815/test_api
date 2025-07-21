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
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an aviation NOTAM summary assistant.
Translate and summarize the following NOTAM from ${source} to ${target}.
Your output must follow this summary format:

\ud83d\udd37 \uC6D0\uBB38 \uc694\uc57d:

\u25cf NOTAM \ubc88\ud638: ...
\u25cf \uACF5\ud56d: ... (\uACF5\ud56d\uba85)
\u25cf \uc720\ud6a8\uae30\uac04:
  \u25aa\ufe0f \uc2dc\uc791: ...
  \u25aa\ufe0f \uc885\ub8cc: ...
  \u25aa\ufe0f \uc77c\uc77c \uc801\uc6a9\uc2dc\uac04: ... \u2192 \ud55c\uad6d\uc2dc\uac04 ...
\u25cf \ub0b4\uc6a9:
  \u25aa\ufe0f ...

Use aviation terminology and translate dates/times clearly.`
          },
          { role: "user", content: text }
        ],
        max_tokens: 1000,
        temperature: 0.2
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
