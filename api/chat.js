export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  
  const { message, username } = req.body || {};
  const text = message || req.body?.question;

  if (!text) {
    return res.status(400).json({ error: "No message provided" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  const lower = text.toLowerCase();

  // topics that are clearly NOT cyber/online related
  const blockedTopics = [
    "taylor swift","football","messi","ronaldo","movie","series",
    "anime","kpop","actor","actress","singer","youtuber",
    "president","election","politics","religion"
  ];

  if (blockedTopics.some(w => lower.includes(w))) {
    return res.json({
      answer: "⚠️ I only answer questions about cyber security, online behaviour and cybercrime. Please ask something related to online safety or digital law."
    });
  }

  // check if message is at least a bit cyber/online related
  const cyberWords = [
    "hack","hacked","account","snapchat","instagram","tiktok","whatsapp",
    "online","internet","social media","post","photo","video","password",
    "email","scam","fraud","blackmail","threat","privacy","data","cyber",
    "law","crime","report","ecrime","police","device","phone","laptop",
    "website","link","phishing"
  ];

  const looksCyber = cyberWords.some(w => lower.includes(w));
  if (!looksCyber) {
    return res.json({
      answer: "I can only help with online behaviour, cyber security and cybercrime situations. Try asking, for example, about hacked accounts, online blackmail, privacy, or social media misuse."
    });
  }

  // special question: who created you?
  if (lower.includes("who created you")) {
    const name = username || "Mariam";
    return res.json({
      answer: `I was created by ${name} (Mariam) to help people in the UAE understand cyber security, what the law says about online behaviour, and what to do if something happens to them online.`
    });
  }

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a UAE cyber security and online law assistant.

Goals:
- Explain what UAE cybercrime laws say about common online situations (hacked accounts, blackmail, threats, privacy, sharing photos, defamation, scams, fraud, etc.).
- Speak clearly, kindly and professionally, like you are helping a student or normal user.
- Whenever possible, mention relevant UAE laws in general form, for example:
  • "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime"
  • "UAE cybercrime law on privacy and misuse of electronic data"
- If you know an exact article number, you may mention it. If you are not sure, do NOT invent article numbers. Just refer to the law in general.
- If the situation sounds serious (blackmail, threats, harassment, financial fraud), encourage the user to:
  • report via ecrime.ae
  • or visit the nearest police station
  • or call 999 in emergencies.

Tone:
- Friendly but formal.
- Use the person's name if provided.
- Give step-by-step practical advice (what to do right now).

Important:
- You do NOT have live internet access. Base everything on your knowledge of UAE law up to 2024.
- Always finish your answer with this sentence:
  "This is general information only, not official legal advice."
          `.trim()
          },
          {
            role: "user",
            content: `${username ? "User name: " + username + "\n" : ""}Question: ${text}`
          }
        ]
      })
    });

    if (!completion.ok) {
      const errorText = await completion.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({ error: "AI request failed" });
    }

    const data = await completion.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({ error: "Invalid AI response" });
    }

    return res.status(200).json({
      answer: data.choices[0].message.content
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

      console.log("OpenAI API ERROR:", data);
      return res.status(500).json({ answer: "Error, try again later." });
    }

    res.status(200).json({
      answer: data.choices[0].message.content
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ answer: "Server crashed, check Vercel logs." });
  }
}
