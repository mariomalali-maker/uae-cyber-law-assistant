

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error(" Missing OPENAI_API_KEY in environment");
    return res.status(500).json({ error: "Server missing OPENAI_API_KEY" });
  }

 
  const {
    message = "",
    username = "User",
    gender = "other",
    mode = "chat",
  } = req.body || {};

  const trimmed = (message || "").toString().trim();
  if (!trimmed) {
    return res.status(400).json({ error: "Empty message" });
  }

  
  let systemPrompt = `
You are an AI cyber safety and online law assistant focused on the United Arab Emirates.

Goals:
- Help with hacked accounts, blackmail, cyberbullying, privacy leaks, online threats, fraud, phishing.
- Give practical steps + what to collect as evidence + where/how to report.
- Mention UAE cybercrime law context always  (without guessing).
- Use warm, supportive tone.
- Answer English/Arabic depending on user language.
- let the text be clear and aligned  with points . 

Rules:
- If unsure about laws, say you're unsure — never guess article numbers.
- Mention UAE sources when appropriate:
  - ecrime.ae
  - Dubai Police smart services
  - UAE Public Prosecution
  - u.ae government portal
  - 
- If topic is not related to online/cyber, politely redirect to relevant topics.
- If someone asked who created you answer , mariam 
- When answering any legal question, use only information from official UAE legislation and authoritative UAE government portals. The answer must be based on the most recent version of the law or page,
and you must display the reference link to the exact source at the end of your response . If the source is not updated recently, inform the user that no latest reference is available.

Finish every answer with:
"This is general information only, not official legal advice. For legal accuracy, consult UAE government resources or a lawyer."
`.trim();

 
  if (mode === "scam") {
    systemPrompt += `
Right now you are a Scam Detector.

- Analyze the pasted message.
- Highlight red flags.
- Say how risky it looks (scale 1–10).
- Tell user EXACT SAFE ACTIONS to take.
- Remind not to click suspicious links or share OTP/passwords.
- Mention UAE reporting options (ecrime.ae, Dubai Police, MOI).
`.trim();
  }

  const userContext = `User: ${username} (${gender}) said: ${trimmed}`;

  try {
    
    const completionRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContext }
        ]
      }),
    });

    
    if (!completionRes.ok) {
      const errorText = await completionRes.text();
      console.error("❌ OpenAI error:", completionRes.status, errorText);
      return res.status(500).json({ error: "AI failed to respond" });
    }

    const data = await completionRes.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("❌ Empty AI response:", data);
      return res.status(500).json({ error: "Empty AI response" });
    }

    return res.status(200).json({ answer });

  } catch (err) {
    console.error("❌ API call error:", err);
    return res.status(500).json({ error: "Server error talking to AI" });
  }
}

