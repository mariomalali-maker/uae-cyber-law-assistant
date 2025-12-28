// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
  }

  const { message = "", username = "User", gender = "other", mode = "chat", language = "en" } = req.body || {};
  const trimmed = String(message || "").trim();

  if (!trimmed) {
    return res.status(400).json({ error: "Empty message" });
  }

  let systemPrompt = `
You are an AI cyber safety and online law assistant focused on the UAE.
Always respond in ${language === "ar" ? "Arabic" : "English"}.
Give practical steps. Mention UAE reporting options when relevant.
Warm & supportive tone.`;

  if (mode === "scam") {
    systemPrompt += `
You are currently acting as a Scam Detector.
Identify scam red flags and safe steps.
Mention UAE reporting platforms like ecrime.ae`;
  }

  const userContext = `User name: ${username}. Gender: ${gender}. Message: ${trimmed}`;

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
          { role: "user", content: userContext }
        ],
        temperature: 0.4
      })
    });

    if (!completionRes.ok) {
      const errorText = await completionRes.text();
      console.error("OpenAI error:", errorText);
      return res.status(500).json({ error: "AI failed to respond" });
    }

    const data = await completionRes.json();
    const answer = data.choices?.[0]?.message?.content || "Sorry, I could not reply.";

    return res.status(200).json({ reply: answer }); // <-- reply sent correctly
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Server error talking to AI" });
  }
}
