export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, username } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  
  const blockTopics = [
    "celebrity","actor","football","team","singer","youtuber",
    "politics","religion","medical","anime","movie","series"
  ];
  if (blockTopics.some(w => message.toLowerCase().includes(w))) {
    return res.json({
      answer: "⚠️ I only answer UAE cyber security and online law questions. Please ask something related."
    });
  }

  
  const msg = message.toLowerCase();
  if (msg.includes("who created you")) {
    return res.json({
      answer: `👋 I was created by mariam to help people in the UAE understand cyber security laws and what actions to take if they face online issues.`
    });
  }

  
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
You are a UAE cyber security law assistant.
Rules:
- Always answer professionally and clearly.
- Always include relevant UAE law references when available, like:
  "Federal Decree-Law No. 34 of 2021 on Combatting Rumours and Cybercrime".
- If giving article numbers, only mention if you're confident (do not invent numbers).
- Always suggest reporting serious issues to ecrime.ae or calling 999 in emergencies.
- End every answer with: "This is general information only, not official legal advice."
- If asked about you: say Mariam created you to increase UAE cyber security awareness.
          `
        },
        { role: "user", content: `${username} says: ${message}` }
      ]
    })
  });

  const data = await completion.json();

  if (!data.choices) {
    return res.json({ answer: "❌ Error: API response failed. Try again." });
  }

  res.status(200).json({
    answer: data.choices[0].message.content
  });
}
