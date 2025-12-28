export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "Server misconfigured (missing OPENAI_API_KEY)." });
  }

  try {
    const { message, username } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message text is required." });
    }

    const safeName =
      typeof username === "string" && username.trim()
        ? username.trim()
        : "Guest";

    const systemPrompt = `
You are a friendly but professional cyber security & cyber law assistant.

FOCUS:
- Focus on cyber security, online behaviour, scams, privacy, hacked accounts, blackmail, and cybercrime.
- Use UAE situations and mention UAE cybercrime laws when relevant
  (for example "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime").
- You MAY answer general global cyber-safety questions, but prefer UAE context when possible.

STYLE:
- Speak clearly and simply, like talking to a university student.
- Occasionally use the user's name (${safeName}).
- Use short paragraphs and bullet points.
- Always end with: "This is general information only, not official legal advice."

RULES:
- If the question is clearly NOT about security / digital / online stuff (like cooking, clothes, celebrities, sports gossip),
  say: "I can only help with cyber security, digital safety, and cybercrime topics (especially in the UAE)."
- If the user asks "who created you" or "who made you":
  - say Mariam created you to help people in the UAE understand cyber security and what to do in online problems.
- For serious issues (blackmail, threats, hacked accounts, financial fraud, doxxing):
  - Tell them to keep evidence (screenshots, usernames, links).
  - Suggest reporting via official UAE channels (e.g. ecrime.ae, 999 in emergencies, or local police).
- Do NOT invent specific law article numbers. Only mention article numbers if you are confident.
- Avoid political debates and religious arguments.
`;

    const payload = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `${safeName} asks: ${message}`,
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!completion.ok) {
      const errText = await completion.text();
      console.error("OpenAI error:", completion.status, errText);
      return res
        .status(500)
        .json({ error: "AI service error. Please try again later." });
    }

    const data = await completion.json();

    const answer =
      data?.choices?.[0]?.message?.content ??
      "I couldn't generate a response. Please try again.";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Handler error:", err);
    if (err.name === "AbortError") {
      return res
        .status(504)
        .json({ error: "The request took too long. Please try again." });
    }
    return res.status(500).json({ error: "Unexpected server error." });
  }
}
