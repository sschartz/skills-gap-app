import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { major, experience } = req.body || {};

  if (!major || !experience) {
    return res.status(400).json({ error: "Missing major or experience" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });
  }

  try {
    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `Write a concise, student-friendly overview of the current job market for ${major} at the ${experience} level. Focus on in-demand skills, hiring trends, and employer expectations. Keep it to 3-5 sentences and make it accurate, practical, and readable for students.`
    });

    return res.status(200).json({ marketUpdate: response.output_text?.trim() || "" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate market update" });
  }
}
