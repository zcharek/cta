import React from "react";
import { FaPuzzlePiece, FaRocket, FaCheckCircle, FaExchangeAlt, FaRedo, FaUser, FaChartLine, FaBolt, FaArrowsAltH, FaKeyboard, FaTabletAlt, FaUserFriends, FaUsers, FaTasks } from "react-icons/fa";

// Service de gestion de projet agile
const agileProjectManagement = {
  icon: <FaUsers className="text-orange-600 text-lg" />, 
  title: "Gestion de projet agile", 
  color: "text-orange-700",
  tooltip: "Structuration d'équipes Scrum avec création de feature teams et accompagnement méthodologique.",
  link: "/services/gestion-projet-agile"
};

const functionalTests = [
  {
    icon: <FaCheckCircle className="text-green-600 text-lg" />, 
    title: "Validation", 
    color: "text-blue-700",
    tooltip: "Vérifie que l'application répond au cahier des charges et aux user stories.",
    link: "/services/validation"
  },
  {
    icon: <FaExchangeAlt className="text-blue-600 text-lg" />, 
    title: "Intégration", 
    color: "text-blue-700", 
    tooltip: "Vérifie les interactions entre modules (UI/API).",
    link: "/services/integration"
  },
  {
    icon: <FaRedo className="text-yellow-500 text-lg" />, 
    title: "Régression", 
    color: "text-blue-700", 
    tooltip: "S'assure que l'existant fonctionne après chaque modification.",
    link: "/services/regression"
  },
  {
    icon: <FaUser className="text-purple-600 text-lg" />, 
    title: "Acceptation utilisateur", 
    color: "text-purple-700", 
    tooltip: "Tests réalisés par ou avec les clients/utilisateurs.",
    link: "/services/acceptation"
  },
];

const nonFunctionalTests = [
  {
    icon: <FaChartLine className="text-blue-600 text-lg" />, 
    title: "Charge", 
    color: "text-blue-700",
    tooltip: "Combien d'utilisateurs simultanés peuvent être supportés ?",
    link: "/services/charge"
  },
  {
    icon: <FaBolt className="text-yellow-500 text-lg" />, 
    title: "Stress", 
    color: "text-blue-700",
    tooltip: "Que se passe-t-il si on dépasse les limites ?",
    link: "/services/stress"
  },
  {
    icon: <FaArrowsAltH className="text-blue-400 text-lg" />, 
    title: "Montée en charge", 
    color: "text-blue-700",
    tooltip: "La performance reste-t-elle stable avec plus d'utilisateurs ?",
    link: "/services/montee-charge"
  },
  {
    icon: <FaKeyboard className="text-green-700 text-lg" />, 
    title: "Accessibilité", 
    color: "text-blue-700",
    tooltip: "L'application est-elle utilisable par tous (navigation clavier, etc.) ?",
    link: "/services/accessibilite"
  },
  {
    icon: <FaTabletAlt className="text-blue-700 text-lg" />, 
    title: "Compatibilité", 
    color: "text-blue-700",
    tooltip: "Fonctionne-t-elle sur tous les navigateurs, résolutions, appareils ?",
    link: "/services/compatibilite"
  },
  {
    icon: <FaUserFriends className="text-blue-600 text-lg" />, 
    title: "Utilisabilité (UX)", 
    color: "text-blue-700",
    tooltip: "Le parcours utilisateur est-il simple et cohérent ?",
    link: "/services/ux"
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-b from-white via-gray-50 to-gray-200" id="services">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-6 drop-shadow-lg">Nos services</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Nous accompagnons vos équipes dans la gestion de projet agile et proposons des tests classés par objectifs fonctionnels/non fonctionnels et par méthodes d'exécution <span className="text-blue-600 font-semibold">statique</span>/<span className="text-green-600 font-semibold">dynamique</span>.
          </p>
        </div>

        {/* Bloc Gestion de projet agile */}
        <div className="mb-20">
          <div className="flex flex-col items-center mb-8">
            <span className="inline-block mb-4 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">Accompagnement méthodologique</span>
            <div className="bg-gradient-to-br from-orange-500 to-orange-400 text-white rounded-full p-6 shadow text-4xl mb-4">
              <FaUsers />
            </div>
            <h3 className="text-3xl font-bold text-orange-700 mb-2">Gestion de projet agile</h3>
          </div>
          <div className="flex justify-center">
            <a 
              href={agileProjectManagement.link}
              className="group relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-orange-200 w-full max-w-md"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4 bg-orange-50 p-3 rounded-full">
                  {agileProjectManagement.icon}
                </div>
                <h4 className={`text-xl font-bold ${agileProjectManagement.color} group-hover:text-orange-600 transition-colors`}>
                  {agileProjectManagement.title}
                </h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {agileProjectManagement.tooltip}
              </p>
              <div className="flex items-center text-orange-600 font-medium text-sm group-hover:text-orange-700 transition-colors">
                <span className="mr-2">En savoir plus</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </a>
          </div>
        </div>

        {/* Bloc Test fonctionnel */}
        <div className="mb-20">
          <div className="flex flex-col items-center mb-8">
            <span className="inline-block mb-4 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">Test statique</span>
            <div className="bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-full p-6 shadow text-4xl mb-4">
              <FaPuzzlePiece />
            </div>
            <h3 className="text-3xl font-bold text-blue-700 mb-2">Test fonctionnel</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {functionalTests.map((test, idx) => (
              <a 
                key={idx} 
                href={test.link}
                className="flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-lg border border-blue-100 min-h-[100px] h-full w-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className={`flex items-center gap-3 mb-3 text-lg font-bold ${test.color} group-hover:text-blue-600 transition-colors`}>
                  {test.icon} {test.title}
                </div>
                <div className="text-sm text-gray-700 text-center leading-relaxed group-hover:text-gray-900 transition-colors">
                  {test.tooltip}
                </div>
                <div className="mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus →
                </div>
              </a>
            ))}
          </div>
        </div>
        {/* Bloc Test non-fonctionnel */}
        <div>
          <div className="flex flex-col items-center mb-8">
            <span className="inline-block mb-4 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full shadow-sm">Test statique</span>
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full p-6 shadow text-4xl mb-4">
              <FaRocket />
            </div>
            <h3 className="text-3xl font-bold text-blue-700 mb-2">Test non-fonctionnel</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {nonFunctionalTests.map((test, idx) => (
              <a 
                key={idx} 
                href={test.link}
                className="flex flex-col items-center justify-center bg-white rounded-xl p-6 shadow-lg border border-blue-100 min-h-[100px] h-full w-full hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className={`flex items-center gap-3 mb-3 text-lg font-bold ${test.color} group-hover:text-blue-600 transition-colors`}>
                  {test.icon} {test.title}
                </div>
                <div className="text-sm text-gray-700 text-center leading-relaxed group-hover:text-gray-900 transition-colors">
                  {test.tooltip}
                </div>
                <div className="mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  En savoir plus →
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}