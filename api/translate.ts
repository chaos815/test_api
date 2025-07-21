import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { text } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',  // ✅ GPT-4o 사용
      messages: [
        {
          role: 'user',
          content: `아래 NOTAM 내용을 한국어로 항목별로 요약 번역해줘.
- NOTAM 번호
- 공항 이름과 코드
- 유효 시작일과 종료일 (UTC)
- 일일 적용 시간 (가능하면 한국시간도)
- 주요 내용 요약 (예: 유도로 폐쇄, 활주로 공사 등)
- SOURCE 항목도 빠짐없이 포함

원문:
${text}
`,
        },
      ],
    });

    const translated = chat.choices[0].message.content;
    res.status(200).send(translated);
  } catch (error) {
    res.status(500).send('번역 실패');
  }
}
