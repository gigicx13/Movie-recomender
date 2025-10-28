// api/recommendations.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // chave segura do servidor
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ message: "Respostas não enviadas" });
  }

  const prompt = `
  O usuário respondeu o seguinte questionário sobre preferências de filmes:
  ${JSON.stringify(answers, null, 2)}
  Baseado nessas informações, recomende 5 filmes diferentes,
  incluindo nome, gênero e uma breve descrição de por que podem agradar.
  Responda em formato de lista numerada.
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendations = response.choices[0].message.content;

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar recomendações" });
  }
}
