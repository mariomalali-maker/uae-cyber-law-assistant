// api/chat.js  (Vercel Serverless Function)

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse body safely
  const body = req.body || {};
  const message = body.message;
  const username = body.username || "User";

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // If this happens, the env var on Vercel is wrong or missing
    return res.status(500).json({ error: "Server is missing OPENAI_API_KEY" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
You are an online safety & cyber law helper focused on UAE context.

Goals:
- Help users understand what to do if they face hacking, threats, blackmail, privacy issues, cyberbullying, scams, etc.
- Explain in simple English (and you can mix Arabic terms if needed).
- When possible, mention UAE laws and official channels like:
  - ecrime.ae
  - 999 (emergency)
  - Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime.
Rules:
- Do NOT invent article numbers or fake law names.
- If unsure about an exact article, say it clearly (example: "There is a UAE cybercrime law that covers this, but I cannot guarantee the article number.").
- Always encourage reporting serious cases to official authorities.
- End every answer with: "This is general information only, not official legal advice."
- If user asks "who created you" or similar, answer that you were created by Mariam to help people in the UAE stay safe online.
`
          },
          {
            role: "user",
            content: `${username} says: ${message}`
          }
        ]
      })
    });

    const data = await response.json();

    // If OpenAI returned an error status
    if (!response.ok) {
      console.error("OpenAI error:", response.status, data);

      const msg =
        (data && data.error && data.error.message) ||
        "OpenAI API error";

      return res.status(500).json({
        error: msg
      });
    }

    const answer =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;

    if (!answer) {
      return res.status(500).json({ error: "No answer from AI" });
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error talking to OpenAI:", err);
    return res.status(500).json({
      error: "Server error while calling OpenAI"
    });
  }
};
