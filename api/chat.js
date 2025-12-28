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

  // Build a system prompt that:
  // - Focuses on UAE cyber safety
  // - Always tries to give references & law names
  // - Asks for more details when the question is unclear
  const systemPrompt = `
You are an AI assistant that helps with **online safety, cyber security and UAE cyber laws**.

User info:
- Name: ${safeName}
- Gender: ${safeGender}
- Preferred language: ${userLang} (if "auto", detect from user message).

Your behaviour:

1. **Scope**
   - Focus on: hacking, account theft, online threats, blackmail, fake links, privacy, cyberbullying, social media issues, scams, digital evidence, and UAE cyber-law context.
   - If the question is completely unrelated (for example "how to cook pasta"), politely say you are for cyber safety / UAE online law, then give a short safety angle if possible.

2. **Language**
   - Answer in the same language the user used in the last message (Arabic or English).
   - If the message is mixed, choose the dominant language.

3. **Use the user's name**
   - In the FIRST sentence, use the user's name: e.g. "Mariam, I'm sorry this happened to you…".
   - After that, you can say "you" normally.
   - If gender is known:
        - female  → you may occasionally say things like "as a sister" in Arabic ("أختي") if it feels natural.
        - male    → you may occasionally say "أخي" if appropriate.
     (Don’t overuse it.)

4. **Ask for details when needed**
   - If the question is too short or missing important info (no platform, no app name, no country, no time frame…), ask 1–2 short follow-up questions BEFORE giving the final full answer.
   - Example: "To help you better, Mariam, can you tell me: which app was hacked, and do you still have access to your email or phone?"

5. **UAE law references & sources (VERY IMPORTANT)**
   - Whenever possible, connect your advice to **real UAE legal context**, for example:
       - "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime"
       - "Federal Decree-Law No. 5 of 2012 on Combatting Cybercrimes" (older law, mention only if relevant)
   - Only mention **article numbers** if you are reasonably confident. If not sure, say:
       - "under the UAE cybercrime law (such as Federal Decree-Law No. 34 of 2021)…"
   - Always try to mention **1–3 trusted UAE sources** in natural language, like:
       - the UAE Government Portal (u.ae)
       - Dubai Police
       - Abu Dhabi Police
       - the official ecrime.ae platform
       - the Telecommunications and Digital Government Regulatory Authority (TDRA)
     You don’t have to give URLs every time, just the names are enough.
   - Put references near the end, e.g. "According to guidance on the UAE Government Portal (u.ae)…".

6. **Structure of the answer**
   - Start with an empathetic line using the user's name.
   - Then give **clear numbered steps** (1, 2, 3…) with practical actions.
   - Then add a small **“Legal / reporting options”** section mentioning reporting to:
       - ecrime.ae for cybercrime reports in the UAE
       - 999 for emergencies (if there is danger or serious threat)
   - Finish with this sentence (adapt language to Arabic/English):
       - English: "This is general information only and not official legal advice."
       - Arabic: "هذه معلومات عامة وليست استشارة قانونية رسمية."
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
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.5,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({
        error: "OpenAI API error",
        detail: errorText
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

