export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, username } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing API key in Vercel env");
    return res.status(500).json({ error: "Server API key missing" });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a helpful cyber safety AI made by Mariam in the UAE.
Always answer clearly using UAE cyber laws when possible.
Always include helpful actions like reporting to ecrime.ae.
Never mention API keys, code, or internal errors to user.
        `
          },
          { role: "user", content: `${username || 'Guest'} says: ${message}` }
        ]
      })
    });

    const data = await completion.json();

    if (!data.choices) {
      console.error("API Error Response:", data);
      return res.json({ error: "AI failed to respond" });
    }

    res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.json({ error: "Server crashed while calling AI" });
  }
}
