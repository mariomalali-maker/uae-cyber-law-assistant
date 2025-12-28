export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, username } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const blockTopics = [
    "celebrity","actor","football","team","singer","youtuber",
    "politics","religion","medical","anime","movie","series"
  ];

  if (blockTopics.some(w => message.toLowerCase().includes(w))) {
    return res.json({
      answer: "⚠️ Sorry, I only answer **UAE cyber security & online law** questions."
    });
  }

  if (message.toLowerCase().includes("who created you")) {
    return res.json({
      answer: `👋 I was created by **Mariam** to help people in the UAE understand cyber security laws and what to do if they face online issues.`
    });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a UAE cyber security law assistant.
Rules:
- Always answer clearly and professionally.
- Include UAE law references when available (ex: Federal Decree-Law No. 34 of 2021).
- Do NOT invent article numbers; only mention if certain.
- Suggest reporting crimes to ecrime.ae or the police if needed.
- If asked "who made you": Mariam made you to increase awareness.
- End every answer with: "This is general information only, not official legal advice."
          `
          },
          { role: "user", content: `${username || "Guest"} says: ${message}` }
        ]
      })
    });

    const data = await completion.json();

    if (!data.choices) {
      console.log("OpenAI API ERROR:", data);
      return res.status(500).json({ answer: "❌ Error, try again later." });
    }

    res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ answer: "❌ Server crashed, check Vercel logs." });
  }
}
