export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { babyName, ageGroup, theme } = req.body;

  const prompt = `You are a warm children's book author writing a bedtime story for Cugo — India's first skin-first baby hygiene brand. Cugo is a friendly, soft, round baby character who loves gentle adventures.

Write a short soothing bedtime story (200–250 words) where Cugo and a baby named ${babyName} (age: ${ageGroup}) go on a gentle adventure about: ${theme}.

Guidelines:
- Simple, musical language with gentle rhythm
- End with both Cugo and ${babyName} drifting off to sleep
- Cugo is soft, clean, smells like mild soap, feels like a cloud
- Include sensory details appropriate for a baby
- 1-2 lines that make parents feel emotional and seen
- Tone: tender, dreamy, unhurried
- Use ${babyName}'s name naturally throughout

Start with the story title in this format:
**[Story Title]**

Then begin the story on a new line.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const story = data.content?.[0]?.text || "";
  res.status(200).json({ story });
}
