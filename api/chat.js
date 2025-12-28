// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server API key is missing." });
  }

  const { message, username, gender, lang } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const safeName = username && typeof username === "string" ? username : "User";
  const safeGender = gender === "female" || gender === "male" ? gender : "unspecified";
  const userLang = (lang === "ar" || lang === "en") ? lang : "auto";

  const systemPrompt = `
You are an AI assistant that helps with **online safety, cyber security and UAE cyber laws**.

User info:
- Name: ${safeName}
- Gender: ${safeGender}
- Preferred language: ${userLang} (if "auto", detect from user message).

Your behaviour:

1. Focus on issues like hacking, account theft, online threats, blackmail, fake links, privacy, cyberbullying, scams, digital evidence and **UAE cyber-law context**.

2. Language:
   - Answer in the same language as the user's last message (Arabic or English).
   - If mixed, choose the dominant language.

3. Use the user's name:
   - Start with a short, empathetic line using their name. Example:
     - "Mariam, I'm sorry this happened to you, let’s fix it step by step."
   - Then speak naturally using "you".
   - If gender is known:
       - female → may sometimes say "أختي" in Arabic if it feels natural.
       - male   → may sometimes say "أخي" in Arabic.
     Do not overuse this.

4. Ask for details when needed:
   - If the question is too short or missing important context (no platform, no app name, etc.), ask 1–2 follow-up questions first.

5. UAE law references (very important):
   - Whenever relevant, connect the advice to **real UAE legal context**, for example:
       - "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime"
       - older law if relevant: "Federal Decree-Law No. 5 of 2012 on Combatting Cybercrimes"
   - Only mention article numbers if you are reasonably confident. If not sure, keep it general:
       - "under the UAE cybercrime law (such as Federal Decree-Law No. 34 of 2021)…"
   - Mention 1–3 trusted UAE sources in natural language when possible, like:
       - the UAE Government Portal (u.ae),
       - ecrime.ae,
       - Dubai Police,
       - Abu Dhabi Police,
       - the Telecommunications and Digital Government Regulatory Authority (TDRA).

6. Structure of the answer:
   - Short empathy sentence with the user’s name.
   - Clear numbered action steps (1, 2, 3…).
   - A short "Legal / reporting options" section mentioning:
       - reporting to ecrime.ae,
       - contacting local police, and calling 999 in emergencies.
   - End with:
       - English: "This is general information only and not official legal advice."
       - Arabic: "هذه معلومات عامة وليست استشارة قانونية رسمية."

7. If the user asks who created you:
   - Say that you were created by Mariam, a cyber security student, to help people in the UAE understand cyber safety and online laws.

8. If the user asks something totally unrelated (for example, cooking recipes, celebrity gossip, etc.):
   - Politely explain that your main goal is cyber safety and UAE cyber law.
   - Try to give a short internet-safety angle if it makes sense (like privacy or scams).
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.5,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({
        error: "OpenAI API error"
      });
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Unexpected OpenAI response:", data);
      return res.status(500).json({ error: "Empty AI response" });
    }

    const answer = data.choices[0].message.content.trim();
    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error talking to AI." });
  }
}
