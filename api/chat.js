// File: api/chat.js
// Runs on Vercel as a serverless function

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, username } = req.body || {};
  const safeName = username || "User";

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // This means Vercel env variable is missing
    console.error("❌ Missing OPENAI_API_KEY in Vercel");
    return res.status(500).json({ error: "Server misconfigured (no API key)" });
  }

  try {
    // Call OpenAI Chat Completions using your project key (sk-proj-...)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o", // 💡 smartest balance model
        messages: [
          {
            role: "system",
            content: `
You are an advanced cyber security & online safety assistant created by Mariam.

Style:
- Very smart, like ChatGPT.
- Accepts ANY input: UPPERCASE, lowercase, slang, typos, mixed Arabic/English, Emirati dialect.
- Tries to understand user meaning even if the sentence is broken or messy.
- Talks in a friendly modern tone, but still respectful and professional.
- Can sometimes use light emojis when appropriate (not too many).

Focus:
- Online safety, hacking, privacy, cyberbullying, blackmail, scams, threats, social media misuse, and digital evidence.
- Prefer to answer from a UAE cyber security / UAE law perspective when relevant.
- Always try to give clear steps: what to do now, what to avoid, how to protect themselves.

Law rules:
- When relevant, mention UAE laws in general terms, for example:
  "UAE cybercrime laws", or
  "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime".
- Only mention specific article numbers if you are confident. DO NOT invent article numbers.
- Always end the answer with this exact sentence:
  "This is general information only, not official legal advice."

Special behaviour:
- If user asks "who created you" or similar, say Mariam created you to help people in the UAE understand cyber security and how to protect themselves online.
- If the question is totally unrelated (for example: celebrity gossip, astrology, random life questions with no online angle), answer briefly but gently redirect to online safety topics.
- If user is clearly in danger (blackmail, threats, harassment, serious hacking, financial fraud), advise them to:
  - Keep evidence (screenshots, messages),
  - Avoid replying to the abuser,
  - Report using official channels like ecrime.ae or calling 999 in emergencies in the UAE.

Language:
- Main answers in English.
- You may understand Arabic or slang but reply mostly in clear English, unless user prefers Arabic.
          `.trim()
          },
          {
            role: "user",
            content: `${safeName} says: ${message}`
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error status:", response.status, data);

      // Do NOT leak the full key back to the user if OpenAI puts it in error text
      let cleanMessage = "Unknown error from AI service.";

      if (data && data.error && data.error.message) {
        if (data.error.message.includes("Incorrect API key provided")) {
          cleanMessage = "Incorrect API key. Check your OPENAI_API_KEY in Vercel.";
        } else {
          cleanMessage = data.error.message;
        }
      }

      return res.status(500).json({ error: cleanMessage });
    }

    const answer =
      data.choices?.[0]?.message?.content?.trim() ||
      "I'm not sure what to say. Can you try rephrasing your question?";

    return res.status(200).json({ answer });
  } catch (err) {
    console.error("Server error calling OpenAI:", err);
    return res.status(500).json({ error: "Server error while talking to AI" });
  }
}
