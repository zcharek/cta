import React, { useState } from "react";

// Questions et options du quiz
const questions = [
  {
    question: "Quel est l'objectif principal de votre test ?",
    options: [
      "Vérifier le bon fonctionnement métier (fonctionnel)",
      "Mesurer la performance, la sécurité, l'accessibilité… (non-fonctionnel)"
    ],
  },
  {
    question: "Quel mode d'exécution privilégiez-vous ?",
    options: [
      "Analyse sans exécution du code (statique)",
      "Exécution réelle de scénarios (dynamique)"
    ],
  },
  {
    question: "Souhaitez-vous automatiser vos tests ?",
    options: [
      "Oui, je veux automatiser",
      "Non, je préfère du manuel"
    ],
  },
  {
    question: "Sur quel type de plateforme/test souhaitez-vous agir ?",
    options: [
      "Application web",
      "Application mobile",
      "API / Microservices",
      "Accessibilité",
      "Performance"
    ],
  },
];

// Nouvelle logique de recommandation
function getRecommendation(answers: string[]) {
  const recs: string[] = [];
  // Objectif
  if (answers[0].includes("fonctionnel")) {
    recs.push("Test fonctionnel");
  } else if (answers[0].includes("non-fonctionnel")) {
    recs.push("Test non-fonctionnel");
  }
  // Mode d'exécution
  if (answers[1].includes("statique")) {
    recs.push("Test statique (revue de code, checklist, analyse statique)");
  } else if (answers[1].includes("dynamique")) {
    recs.push("Test dynamique");
  }
  // Automatisation
  if (answers[2] === "Oui, je veux automatiser") {
    recs.push("Automatisation recommandée");
  } else {
    recs.push("Tests manuels recommandés");
  }
  // Plateforme/outils
  if (answers[3] === "Application web" && answers[2] === "Oui, je veux automatiser") {
    recs.push("Outils suggérés : Playwright, Cypress");
  }
  if (answers[3] === "Application mobile" && answers[2] === "Oui, je veux automatiser") {
    recs.push("Outils suggérés : Appium, Detox");
  }
  if (answers[3] === "API / Microservices" && answers[2] === "Oui, je veux automatiser") {
    recs.push("Outils suggérés : Postman, k6");
  }
  if (answers[3] === "Accessibilité") {
    recs.push("Outils suggérés : axe, Lighthouse");
  }
  if (answers[3] === "Performance") {
    recs.push("Outils suggérés : k6, Lighthouse");
  }
  return Array.from(new Set(recs));
}

const gradientBg = "bg-gradient-to-b from-white via-gray-50 to-gray-200";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/manjygqn"; // Remplace par ton endpoint Formspree

type QuizTestSelectorProps = {
  modalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
};

const QuizTestSelector: React.FC<QuizTestSelectorProps> = ({ modalOpen: modalOpenProp, setModalOpen: setModalOpenProp }) => {
  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const modalOpen = modalOpenProp !== undefined ? modalOpenProp : internalModalOpen;
  const setModalOpen = setModalOpenProp !== undefined ? setModalOpenProp : setInternalModalOpen;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [introData, setIntroData] = useState({ firstName: "", email: "", company: "" });
  const [introError, setIntroError] = useState("");
  const [introStep, setIntroStep] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = option;
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
      handleSendToFormspree(introData, newAnswers);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
    setIntroStep(true);
    setIntroError("");
    setSent(false);
  };

  const handleOpen = () => {
    setModalOpen(true);
    setStep(0);
    setAnswers([]);
    setShowResult(false);
    setIntroStep(true);
    setIntroError("");
    setSent(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleIntroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntroData({ ...introData, [e.target.name]: e.target.value });
  };

  const handleIntroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introData.firstName.trim() || !introData.email.trim()) {
      setIntroError("Merci de renseigner votre prénom et votre email.");
      return;
    }
    setIntroStep(false);
  };

  const handleSendToFormspree = async (user: typeof introData, quizAnswers: string[]) => {
    setSending(true);
    const recommendation = getRecommendation(quizAnswers).join(", ");
    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("email", user.email);
    formData.append("company", user.company);
    formData.append("quizAnswers", quizAnswers.join(" | "));
    formData.append("recommendation", recommendation);
    formData.append("_replyto", user.email);
    formData.append("message", `Bonjour ${user.firstName}, voici votre recommandation personnalisée : ${recommendation}`);
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setSent(true);
    } catch {
      setSent(false);
    } finally {
      setSending(false);
    }
  };

  const progress = ((step + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <section className={`py-16 px-2 sm:px-0 webflow-section ${gradientBg}`} id="quiz-test-selector">
      <div className="flex flex-col items-center justify-center my-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 mb-2 text-center">
          Quel test pour votre projet&nbsp;?
        </h2>
        <p className="text-gray-500 text-center mb-6 text-base sm:text-lg max-w-xl">
          Répondez à quelques questions pour découvrir la stratégie de test la plus adaptée à votre plateforme.
        </p>
        <button
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-2xl font-bold text-base sm:text-lg shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all mb-4 w-full max-w-xs"
          onClick={handleOpen}
        >
          🚀 Démarrer l'évaluation des besoins 
        </button>
        {/* Sticky button amélioré */}
        <div
          className="fixed z-50 bottom-6 right-4 sm:bottom-8 sm:right-8 group"
          style={{boxShadow:'0 8px 32px 0 rgba(31, 38, 135, 0.25)'}}
        >
          <button
            onClick={handleOpen}
            aria-label="Lancer le quiz de recommandation"
            className="flex items-center bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-full shadow-xl px-2 py-2 sm:px-3 sm:py-3 font-bold text-sm sm:text-base hover:scale-105 focus:scale-105 transition-all duration-200 outline-none animate-pulse-soft"
          >
            <span className="w-5 h-5 flex items-center justify-center text-lg font-bold">?</span>
            <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 group-hover:ml-2 max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 text-sm font-semibold whitespace-nowrap">
              Quel test pour votre projet ?
            </span>
          </button>
        </div>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className={`relative w-full max-w-xl mx-2 sm:mx-4 rounded-3xl shadow-2xl p-0 overflow-hidden ${gradientBg} animate-fade-in-up`} style={{maxHeight:'95vh'}}>
              {/* Bouton fermer */}
              <button
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-2xl sm:text-3xl text-gray-500 hover:text-red-500 font-bold z-10 bg-white/70 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow"
                onClick={handleClose}
                aria-label="Fermer le quiz"
              >
                ×
              </button>
              {/* Barre de progression */}
              <div className="h-2 w-full bg-gray-200">
                <div
                  className="h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="p-4 sm:p-8 flex flex-col items-center overflow-y-auto" style={{maxHeight:'calc(95vh - 2rem)'}}>
                {/* Étape d'intro */}
                {introStep ? (
                  <form className="w-full max-w-md mx-auto flex flex-col gap-4" onSubmit={handleIntroSubmit}>
                    <h3 className="text-xl font-bold text-center mb-2 text-blue-700">Commencer votre recommandation personnalisée</h3>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Prénom *"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      value={introData.firstName}
                      onChange={handleIntroChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email *"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      value={introData.email}
                      onChange={handleIntroChange}
                      required
                    />
                    <input
                      type="text"
                      name="company"
                      placeholder="Société (optionnel)"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      value={introData.company}
                      onChange={handleIntroChange}
                    />
                    {introError && <p className="text-red-500 text-sm text-center">{introError}</p>}
                    <button
                      type="submit"
                      className="w-full mt-2 px-6 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-xl font-bold text-base shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all"
                    >
                      Poursuivre
                    </button>
                  </form>
                ) : !showResult ? (
                  <div className="w-full">
                    <div className="mb-4 sm:mb-6">
                      <div className="text-xs sm:text-sm text-gray-400 mb-2 text-center tracking-wide">
                        Question {step + 1} / {questions.length}
                      </div>
                      <div className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center text-blue-900">
                        {questions[step].question}
                      </div>
                      <div className="grid gap-3 sm:gap-4">
                        {questions[step].options.map((option) => (
                          <button
                            key={option}
                            className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                              ${answers[step] === option
                                ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white border-blue-500 scale-105 shadow-lg"
                                : "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-800"}
                            `}
                            onClick={() => handleSelect(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    {step > 0 && (
                      <button
                        className="text-blue-600 underline text-xs sm:text-sm mt-2 hover:text-blue-800 transition-all"
                        onClick={() => setStep(step - 1)}
                      >
                        &larr; Revenir à la question précédente
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center w-full flex flex-col items-center justify-center min-h-[350px]">
                    {sending ? (
                      <div className="text-blue-700 font-semibold text-lg">Envoi de votre recommandation...</div>
                    ) : sent ? (
                      <>
                        <div className="flex flex-col items-center justify-center mb-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-xl animate-bounce">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-green-700 tracking-tight">Votre recommandation personnalisée</h3>
                          <p className="text-blue-900 mb-4">Voici la stratégie de test la plus adaptée à votre projet :</p>
                          <div className="bg-white/90 rounded-2xl px-10 py-8 shadow-2xl mb-8 flex flex-col items-center max-w-lg w-full">
                            <ul className="space-y-4 w-full">
                              {getRecommendation(answers).map((rec) => (
                                <li key={rec} className="flex items-center text-lg text-blue-900 font-semibold">
                                  <span className="inline-block w-4 h-4 mr-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full shadow"></span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <button
                            className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all"
                            onClick={() => {
                              setModalOpen(false);
                              setTimeout(() => {
                                const el = document.getElementById('services');
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  window.location.hash = '#services';
                                }
                              }, 200);
                            }}
                          >
                            Découvrir nos services
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center mb-8">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center mb-4 shadow-xl animate-bounce">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-4 text-green-700 tracking-tight">Recommandation personnalisée</h3>
                        </div>
                        <div className="bg-white/90 rounded-2xl px-10 py-8 shadow-2xl mb-8 flex flex-col items-center max-w-lg w-full">
                          <ul className="space-y-4 w-full">
                            {getRecommendation(answers).map((rec) => (
                              <li key={rec} className="flex items-center text-lg text-blue-900 font-semibold">
                                <span className="inline-block w-4 h-4 mr-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full shadow"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button
                          className="mt-2 px-8 py-3 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-400 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-blue-800 hover:to-blue-500 transition-all"
                          onClick={() => {
                            setModalOpen(false);
                            setTimeout(() => {
                              const el = document.getElementById('services');
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                window.location.hash = '#services';
                              }
                            }, 200);
                          }}
                        >
                          Découvrir nos services
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizTestSelector; 