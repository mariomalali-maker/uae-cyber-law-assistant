// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OpenAI API Key in Vercel" });
  }

  const {
    message = "",
    mode = "chat",
    language = "en",
  } = req.body || {};

  if (!message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  // SELECT PROMPT BASED ON MODE
  const systemPrompt =
    mode === "scam"
      ? `Analyze the message for scam or phishing patterns. 
         Highlight red flags and provide guidance for UAE users.
         Do not claim to be a lawyer. No official legal advice.`
      : `You are a UAE cyber safety helper. 
         Help with hacked accounts, blackmail, privacy, cyberbullying.
         Mention UAE reporting channels (ecrime.ae) when relevant.
         Do not claim to be a lawyer. No official legal advice.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    // SAFETY: always check
    const reply = data?.choices?.[0]?.message?.content || "I couldn't respond.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Server error, check console." });
  }
}


