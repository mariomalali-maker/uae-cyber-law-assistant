// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY in environment");
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
  }

  const {
    message = "",
    username = "User",
    gender = "other",
    mode = "chat",
  } = req.body || {};

  const trimmed = String(message || "").trim();
  if (!trimmed) {
    return res.status(400).json({ error: "Empty message" });
  }

  // Base system prompt
  let systemPrompt = `
You are an AI cyber safety and online law assistant focused on the United Arab Emirates.

Goals:
- Help people deal with real online situations: hacked accounts, blackmail, cyberbullying,
  privacy leaks, online threats, fraud, phishing, social media problems, etc.
- Explain what steps they can take (safety + evidence + reporting).
- When relevant, mention UAE cybercrime rules and any known laws.

Critical rules:
- Speak in a warm, supportive tone.
- You can reply in English or Arabic depending on the question.
- If the user’s spelling or slang is messy, still understand them and answer clearly.
- Always try to:
  1) Give practical, step-by-step actions.
  2) Mention UAE legal context when it fits.
  3) Add references to official UAE sources if you know them
     (examples: UAE Public Prosecution, u.ae portal, MOI/UAE Police websites, Dubai Police platforms like ecrime.ae).
- Law references:
  - When confident, mention law names like "Federal Decree-Law No. 34 of 2021 on Combatting Rumours & Cybercrime"
    and article numbers you are sure about.
  - If you are NOT sure about a specific article number, say you are not sure instead of guessing.
- Always end your answer with this line (in the same language as the reply):
  "This is general information only, not official legal advice. For exact legal details, check official UAE government sources or consult a lawyer."
- If the question is clearly NOT related to online safety, cyber issues, or digital laws,
  politely explain that you are specialised only in cyber safety / UAE online law and try to redirect
  the user back to relevant topics.

If the information you give depends on the situation, ask 1–3 short follow-up questions first to clarify details,
then give a tailored answer.
`.trim();

  if (mode === "scam") {
    systemPrompt += `
You are currently acting as a "Scam Detector".
Analyse the pasted text and:
- Say how risky it looks.
- Point out red flags (links, asking for passwords, money, OTPs, etc).
- Recommend safe steps (ignore, block, don't click, verify with official channels, report).
Mention that scams can be reported to official UAE channels when relevant.
`.trim();
  }

  const userContext = `User name: ${username}. Gender: ${gender}. Message: ${trimmed}`;

  try {
    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContext },
        ],
        temperature: 0.4,
      }),
    });

    if (!completionRes.ok) {
      const errorText = await completionRes.text();
      console.error("OpenAI error:", completionRes.status, errorText);
      return res.status(500).json({ error: "AI failed to respond" });
    }

    const data = await completionRes.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("Empty AI response from OpenAI:", data);
      return res.status(500).json({ error: "Empty AI response" });
    }

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("API error talking to OpenAI:", err);
    return res.status(500).json({ error: "Server error talking to AI" });
  }
}

