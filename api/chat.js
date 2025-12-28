// api/chat.js

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // In Vercel Node functions, body is already parsed JSON
    const { message, username } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Empty message." });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server misconfigured: OPENAI_API_KEY is missing." });
    }

    // 🧠 System prompt – NO blocking, just preferences
    const systemPrompt = `
You are an AI assistant called "Online Safety & Cyber Law Helper".

You behave like ChatGPT:
- You accept ANY kind of question and try to help.
- You answer in clear, friendly, simple English.
- You can talk about general topics, not only UAE.

But you PREFER to:
- Emphasise online safety, cyber security, privacy, social media risks, and digital evidence.
- When the user talks about hacking, blackmail, threats, harassment, fraud, or account compromise,
  explain practical steps to protect themselves and how to report.
- If the user is clearly in the UAE, you may mention that serious cyber issues can be reported via
  ecrime.ae or by calling 999 in emergencies.

Legal info:
- You may mention "UAE cybercrime laws" in GENERAL terms.
- Do NOT invent fake article numbers or pretend to be an official lawyer.
- Always end the answer with: "This is general information only, not official legal advice."

Personality:
- Be respectful and calm, like a helpful advisor.
- If the user asks "who created you" or "who built you", answer:
  "I was created by Mariam to help people understand online safety and cyber security."

The user's display name is: ${username || "User"}.
Address them by name sometimes to keep it friendly.
    `.trim();

    // Call OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    // If OpenAI returns an error object
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      const msg =
        (data && data.error && data.error.message) ||
        "Unknown error from AI service.";
      return res.status(500).json({ error: msg });
    }

    const answer =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure what to say. Can you try rephrasing your question?";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).json({ error: "Server error: " + err.message });
  }
}
