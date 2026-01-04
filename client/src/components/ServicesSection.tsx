import { FaPuzzlePiece, FaRocket, FaCheckCircle, FaExchangeAlt, FaRedo, FaUser, FaChartLine, FaBolt, FaArrowsAltH, FaKeyboard, FaTabletAlt, FaUserFriends, FaUsers, FaTasks } from "react-icons/fa";

// Service de gestion de projet agile
const agileProjectManagement = {
  icon: <FaUsers className="text-brand-blue-700 text-lg" />, 
  title: "Gestion de projet agile", 
  color: "text-brand-blue-900",
  tooltip: "Structuration d'équipes Scrum avec création de feature teams et accompagnement méthodologique.",
  link: "/#/services/gestion-projet-agile"
};

const functionalTests = [
  {
    icon: <FaCheckCircle className="text-brand-blue-700 text-lg" />, 
    title: "Validation", 
    color: "text-brand-blue-900",
    tooltip: "Vérifie que l'application répond au cahier des charges et aux user stories.",
    link: "/#/services/validation"
  },
  {
    icon: <FaExchangeAlt className="text-brand-blue-700 text-lg" />, 
    title: "Intégration", 
    color: "text-brand-blue-900", 
    tooltip: "Vérifie les interactions entre modules (UI/API).",
    link: "/#/services/integration"
  },
  {
    icon: <FaRedo className="text-blue-500 text-lg" />, 
    title: "Régression", 
    color: "text-brand-blue-900", 
    tooltip: "S'assure que l'existant fonctionne après chaque modification.",
    link: "/#/services/regression"
  },
  {
    icon: <FaUser className="text-brand-blue-700 text-lg" />, 
    title: "Acceptation utilisateur", 
    color: "text-brand-blue-900", 
    tooltip: "Tests réalisés par ou avec les clients/utilisateurs.",
    link: "/#/services/acceptation"
  },
];

const nonFunctionalTests = [
  {
    icon: <FaChartLine className="text-brand-blue-700 text-lg" />, 
    title: "Charge", 
    color: "text-brand-blue-900",
    tooltip: "Combien d'utilisateurs simultanés peuvent être supportés ?",
    link: "/#/services/charge"
  },
  {
    icon: <FaBolt className="text-blue-500 text-lg" />, 
    title: "Stress", 
    color: "text-brand-blue-900",
    tooltip: "Que se passe-t-il si on dépasse les limites ?",
    link: "/#/services/stress"
  },
  {
    icon: <FaArrowsAltH className="text-brand-blue-600 text-lg" />, 
    title: "Montée en charge", 
    color: "text-brand-blue-900",
    tooltip: "La performance reste-t-elle stable avec plus d'utilisateurs ?",
    link: "/#/services/montee-charge"
  },
  {
    icon: <FaKeyboard className="text-brand-blue-900 text-lg" />, 
    title: "Accessibilité", 
    color: "text-brand-blue-900",
    tooltip: "L'application est-elle utilisable par tous (navigation clavier, etc.) ?",
    link: "/#/services/accessibilite"
  },
  {
    icon: <FaTabletAlt className="text-brand-blue-900 text-lg" />, 
    title: "Compatibilité", 
    color: "text-brand-blue-900",
    tooltip: "Fonctionne-t-elle sur tous les navigateurs, résolutions, appareils ?",
    link: "/#/services/compatibilite"
  },
  {
    icon: <FaUserFriends className="text-brand-blue-700 text-lg" />, 
    title: "Utilisabilité (UX)", 
    color: "text-brand-blue-900",
    tooltip: "Le parcours utilisateur est-il simple et cohérent ?",
    link: "/#/services/ux"
  },
];

import PatternBackground from "./PatternBackground";

export default function ServicesSection() {
  return (
    <PatternBackground 
      variant="light" 
      opacity={0.1}
      className="py-16 md:py-24 bg-white"
    >
    <section id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête simplifié */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue-900 mb-4">
            Nos services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Accompagnement méthodologique et tests logiciels pour garantir la qualité de vos applications
          </p>
        </div>

        {/* Gestion de projet agile - Carte principale */}
        <div className="mb-16 md:mb-20">
          <a 
            href={agileProjectManagement.link}
            className="group block bg-gradient-to-br from-brand-blue-50 via-white to-brand-blue-50 rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-2xl border-2 border-brand-blue-100 hover:border-brand-blue-300 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0 bg-gradient-to-br from-brand-blue-600 to-brand-blue-700 text-white rounded-2xl p-5 shadow-lg group-hover:scale-105 transition-transform">
                <FaUsers className="text-4xl" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block mb-3 bg-brand-blue-100 text-brand-blue-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Accompagnement méthodologique
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-blue-900 mb-3 group-hover:text-brand-blue-700 transition-colors">
                  {agileProjectManagement.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4 max-w-2xl">
                  {agileProjectManagement.tooltip}
                </p>
                <div className="inline-flex items-center text-brand-blue-700 font-semibold text-sm group-hover:text-brand-blue-900 transition-colors">
                  <span className="mr-2">Découvrir</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Tests fonctionnels */}
        <div className="mb-16 md:mb-20">
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-700 text-white rounded-xl p-3 shadow-md">
                <FaPuzzlePiece className="text-2xl" />
              </div>
              <div>
                <div className="text-xs font-semibold text-brand-blue-700 uppercase tracking-wide mb-1">
                  Tests statiques
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-blue-900">
                  Tests fonctionnels
                </h3>
              </div>
            </div>
            <p className="text-gray-600 ml-16 max-w-2xl">
              Vérifiez que votre application répond aux spécifications et fonctionne comme prévu
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {functionalTests.map((test, idx) => (
              <a 
                key={idx} 
                href={test.link}
                className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-brand-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 bg-brand-blue-50 p-3 rounded-lg group-hover:bg-brand-blue-100 transition-colors">
                    {test.icon}
                  </div>
                  <h4 className={`text-lg font-bold ${test.color} group-hover:text-brand-blue-700 transition-colors pt-1`}>
                    {test.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed ml-14">
                  {test.tooltip}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Tests non-fonctionnels */}
        <div>
          <div className="mb-8 md:mb-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-brand-blue-600 to-brand-blue-700 text-white rounded-xl p-3 shadow-md">
                <FaRocket className="text-2xl" />
              </div>
              <div>
                <div className="text-xs font-semibold text-brand-blue-700 uppercase tracking-wide mb-1">
                  Tests statiques
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-brand-blue-900">
                  Tests non-fonctionnels
                </h3>
              </div>
            </div>
            <p className="text-gray-600 ml-16 max-w-2xl">
              Évaluez les performances, la qualité et l'expérience utilisateur de votre application
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {nonFunctionalTests.map((test, idx) => (
              <a 
                key={idx} 
                href={test.link}
                className="group bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-brand-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 bg-brand-blue-50 p-3 rounded-lg group-hover:bg-brand-blue-100 transition-colors">
                    {test.icon}
                  </div>
                  <h4 className={`text-lg font-bold ${test.color} group-hover:text-brand-blue-700 transition-colors pt-1`}>
                    {test.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed ml-14">
                  {test.tooltip}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
    </PatternBackground>
  );
}