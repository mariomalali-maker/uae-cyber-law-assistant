export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });

  const {
    message = "",
    language = "en",
    username = "User",
    gender = "none",
    tone = "supportive",
    mode = "chat"
  } = req.body || {};

  const trimmed = message.toString().trim();
  if (!trimmed) return res.status(400).json({ error: "Empty message" });

  const toneStyle = {
    supportive: "warm, comforting, safe",
    friendly: "cute, casual, sweet",
    formal: "professional, respectful",
    strict: "direct and serious, no sugarcoating",
    soft: "gentle, emotional, kind"
  }[tone] || "neutral";

  let systemPrompt = `
You are a cyber safety & UAE online law mentor.
Your style is ${toneStyle}.
Call the user by their name if given: ${username}.
User gender set as: ${gender}. Only mention if needed, never overuse.
Always answer in ${language === "ar" ? "Arabic" : "English"}.
Never give official legal advice; remind them this is general guidance only.
Focus on UAE cyber rules, safety steps, evidence collection, reporting (ecrime.ae, UAE Police, PP).
`;

  if (mode === "scam") systemPrompt += `
You are now in Scam Detector mode.
Highlight red flags, risk level, and safety steps.
Do NOT hallucinate article numbers if unsure.
`;

  try {
    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: trimmed }
        ],
        temperature: 0.4
      })
    });

    const data = await completionRes.json();
    const answer = data.choices?.[0]?.message?.content || "Error: no response";

    return res.status(200).json({ reply: answer });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
