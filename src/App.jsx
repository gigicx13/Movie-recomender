import { useState } from "react";

function App() {
  // Perguntas do questionário
  const questions = [
    "Olá! 😄 Qual é o seu nome?",
    "Pra eu te conhecer melhor, quantos anos você tem?",
    "Qual é o seu gênero de filme favorito? (ex: ação, comédia, romance, terror...)",
    "Prefere filmes mais recentes ou clássicos?",
    "Você gosta mais de finais felizes ou de histórias mais intensas?",
    "Qual é o seu humor hoje? (feliz, cansado, reflexivo...)",
    "Prefere filmes curtos ou longos?",
    "Gosta de filmes com muitas reviravoltas ou histórias mais simples?",
  ];

  // Estados
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para avançar nas perguntas
  const handleNext = () => {
    if (input.trim() === "") return;

    const updatedAnswers = [...answers, input];
    setAnswers(updatedAnswers);
    setInput("");

    // Se ainda houver perguntas, passa para a próxima
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Quando termina o questionário, chama a IA
      generateRecommendations(updatedAnswers);
      setShowResult(true);
    }
  };

  // Função que chama a função serverless para gerar recomendações
  const generateRecommendations = async (responses) => {
    setLoading(true);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: responses }),
      });

      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error(error);
      setRecommendations("Ocorreu um erro ao gerar recomendações. 😢");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white px-4">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-2xl shadow-lg">
        {!showResult ? (
          <>
            <h2 className="text-xl font-semibold mb-4">{questions[step]}</h2>

            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none mb-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua resposta..."
            />

            <button
              onClick={handleNext}
              className="bg-pink-500 hover:bg-pink-600 transition-colors px-4 py-2 rounded font-semibold"
            >
              Próxima
            </button>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              🍿 {answers[0]}, aqui estão 5 filmes que combinam com você!
            </h2>

            {loading ? (
              <p>Carregando recomendações... ⏳</p>
            ) : (
              <div className="text-left bg-gray-700 p-4 rounded whitespace-pre-line">
                {recommendations}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-pink-500 hover:bg-pink-600 transition-colors px-4 py-2 rounded font-semibold"
            >
              Refazer teste
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
