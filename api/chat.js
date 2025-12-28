// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });

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

  const style = {
    supportive: "warm, comforting, safe",
    friendly: "cute, casual, sweet",
    formal: "professional and respectful",
    strict: "direct and serious",
    soft: "gentle and emotional"
  }[tone] || "neutral";

  let systemPrompt = `
You are a cyber safety and UAE online law assistant.
Tone: ${style}.
User name: ${username}.
User gender: ${gender}. Only mention if relevant, never overuse.
Language: ${language === "ar" ? "Arabic" : "English"} only.
Always remind: "This is general information only, not official legal advice."
Focus: reporting, evidence, ecrime.ae, UAE Police, Public Prosecution.
`;

  if (mode === "scam") {
    systemPrompt += `
You are in SCAM DETECTOR mode.
Identify red flags, threats, and risk level in clear language.
`;
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
        temperature: 0.3
      })
    });

    const data = await openaiRes.json();
    const answer = data.choices?.[0]?.message?.content || "Error.";

    return res.status(200).json({ reply: answer });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

