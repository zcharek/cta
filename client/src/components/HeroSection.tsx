import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { m } from "framer-motion";
import React from 'react';

const ContactModal = lazy(() => import("./ContactModal"));

const codeSnippets = [
  {
    tab: 'tests.e2e.js',
    code: [
      "describe('E2E Login', () => {",
      "  it('should login', () => {",
      "    cy.visit('/login')",
      "    cy.get('input[name=email]').type('user@test.com')",
      "    cy.get('input[name=password]').type('******')",
      "    cy.contains('Se connecter').click()",
      "    cy.url().should('include', '/dashboard')",
      "    cy.get('.user-avatar').should('be.visible')",
      "  })",
      "  it('should logout', () => {",
      "    cy.get('.logout-btn').click()",
      "    cy.url().should('include', '/login')",
      "  })",
      "})",
      "",
    ],
  },
  {
    tab: 'load.k6.js',
    code: [
      "import http from 'k6/http';",
      "import { check, sleep } from 'k6';",
      "",
      "export let options = {",
      "  vus: 50,",
      "  duration: '30s',",
      "};",
      "",
      "export default function () {",
      "  let res = http.get('https://api.test.com/health');",
      "  check(res, {",
      "    'status is 200': (r) => r.status === 200,",
      "    'body is ok': (r) => r.body.includes('ok'),",
      "  });",
      "  sleep(1);",
      "}",
    ],
  },
  {
    tab: 'api.postman.json',
    code: [
      
      'pm.test("Status code is 200", function () {',
      '    pm.response.to.have.status(200);',
      '});',
      '',
      
      'var jsonData = pm.response.json();',
      'pm.environment.set("authToken", jsonData.token);',
      '',
      
      'pm.test("Token présent", function () {',
      'pm.expect(pm.environment.get("authToken")).to.not.be.undefined;',
      '});',
    ],
  },
];

const getTabColor = (tab: string, active: boolean): string => {
  if (active) return 'text-blue-700 bg-white/60 shadow';
  return 'text-gray-400 bg-white/30';
};

// Coloration syntaxique simple pour simuler un IDE
function highlightCodeLine(line: string, tab: string) {
  if (!line) return <>&nbsp;</>;
  // Onglet Postman JS (api.postman.json)
  if (tab === 'api.postman.json') {
    // Commentaires
    if (/^\s*\/\//.test(line)) return <span style={{ color: '#8a9299' }}>{line}</span>;
    // Chaînes de caractères
    line = line.replace(/('[^']*'|"[^"]*")/g, '<span style="color:#d12f6a">$1</span>');
    // Mots-clés JS
    line = line.replace(/\b(let|function|var|const|return|if|else|for|while|do|switch|case|break|continue|new)\b/g, '<span style="color:#6c3ec1">$1</span>');
    // Méthodes Postman (pm.)
    line = line.replace(/\b(pm)\./g, '<span style="color:#6c3ec1">$1.</span>');
    // Nombres
    line = line.replace(/\b\d+\b/g, '<span style="color:#4ec9b0">$&</span>');
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  }
  // Autres onglets (coloration simple)
  if (tab === 'tests.e2e.js' || tab === 'load.k6.js') {
    // Comments
    if (/^\s*\/\//.test(line)) return <span style={{ color: '#6b7280' }}>{line}</span>; // gray-500
    // Strings
    line = line.replace(/('[^']*'|"[^"]*")/g, '<span style="color:#22c55e">$1</span>'); // green-400
    // Keywords
    line = line.replace(/\b(import|from|export|let|const|function|return|if|else|default|describe|it|check|sleep)\b/g, '<span style="color:#3b82f6">$1</span>'); // blue-400
    // Functions
    line = line.replace(/\b(cy|http|pm)\./g, '<span style="color:#a78bfa">$&</span>'); // purple-400
    // Numbers
    line = line.replace(/\b\d+\b/g, '<span style="color:#fb923c">$&</span>'); // orange-300
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  }
  return line;
}

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setActiveTab((prev) => (prev + 1) % codeSnippets.length);
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <>
      <section
        id="home"
        className="relative bg-gradient-to-b from-white via-gray-50 to-gray-200 overflow-hidden py-16 md:py-20 lg:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Colonne texte à gauche (desktop) */}
            <div className="order-2 lg:order-1">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-sm font-bold shadow-md tracking-widest uppercase">
                  Expert QA Algérie
                </span>
                <m.h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  Offrez à Vos Utilisateurs la{" "}
                  <br className="hidden sm:block" />
                  Qualité Qu'ils{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-800 to-blue-400">
                    Méritent.
                  </span>
                </m.h1>
                <m.p
                  className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                >
                  Nous testons, sécurisons et optimisons vos produits digitaux pour garantir une expérience utilisateur irréprochable, fiable et sans surprise.
                </m.p>
                
                <m.div
                  className="mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <a
                      href="#services"
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 text-white text-center font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                      Nos Services
                    </a>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 text-center font-semibold rounded-xl shadow hover:bg-blue-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    >
                      Contactez-nous
                    </button>
                  </div>
                </m.div>
              </m.div>
              {/* IDE mobile : juste après le texte */}
              <div className="block md:hidden w-full mt-8">
                {/* Barre d'onglets façon IDE */}
                <div className="flex items-center overflow-hidden flex-nowrap gap-1 pr-4 w-full">
                  {codeSnippets.map((snippet, idx) => (
                    <span
                      key={snippet.tab}
                      className={`text-[10px] font-mono px-2 py-2 rounded-t-lg cursor-pointer transition flex-shrink-0 min-w-[80px] max-w-[120px] text-ellipsis overflow-hidden text-center ${getTabColor(snippet.tab, idx === activeTab)}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      {snippet.tab}
                    </span>
                  ))}
                </div>
                {/* Bloc code façon IDE */}
                <div
                  className="backdrop-blur-xl bg-white/30 border border-blue-100 rounded-3xl shadow-2xl px-3 pt-12 pb-4 font-mono text-left relative w-full overflow-hidden"
                  style={{ minHeight: 300, maxHeight: 300, height: 300 }}
                >
                  {/* Code QA multi-outils avec numéros alignés */}
                  <div className="flex flex-col w-full h-full overflow-hidden">
                    {Array.from({ length: 13 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-row items-start min-h-[1.3em] gap-x-1"
                      >
                        <div className="w-6 text-right pr-1 text-gray-400 text-[10px] select-none tabular-nums flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-[10px] leading-tight font-mono overflow-hidden">
                          {highlightCodeLine(codeSnippets[activeTab].code[i] || '', codeSnippets[activeTab].tab)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite : IDE desktop (à droite sur desktop) */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-2xl mt-8 lg:mt-0 w-full hidden md:block">
                {/* Barre d'onglets façon IDE */}
                <div className="flex items-center absolute top-4 left-4 z-10 overflow-hidden flex-nowrap gap-2 pr-4 w-[calc(100%-2rem)]">
                  {codeSnippets.map((snippet, idx) => (
                    <span
                      key={snippet.tab}
                      className={`text-sm font-mono px-3 py-2 rounded-t-lg cursor-pointer transition flex-shrink-0 min-w-[110px] max-w-[160px] text-ellipsis overflow-hidden text-center items-center justify-center ${getTabColor(snippet.tab, idx === activeTab)}`}
                      onClick={() => setActiveTab(idx)}
                    >
                      {snippet.tab}
                    </span>
                  ))}
                </div>
                {/* Bloc code façon IDE */}
                <div
                  className="backdrop-blur-xl bg-white/30 border border-blue-100 rounded-3xl shadow-2xl px-6 pt-14 pb-6 font-mono text-left relative w-full overflow-hidden"
                  style={{ minHeight: 370, maxHeight: 370, height: 370 }}
                >
                  {/* Code QA multi-outils avec numéros alignés */}
                  <div className="flex flex-col w-full h-full overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex flex-row items-start min-h-[1.4em] gap-x-2"
                      >
                        <div className="w-6 text-right pr-1 text-gray-400 text-xs select-none tabular-nums flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 text-xs leading-tight font-mono overflow-hidden">
                          {highlightCodeLine(codeSnippets[activeTab].code[i] || '', codeSnippets[activeTab].tab)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Carte "Zéro défaut" - Desktop */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block z-10">
                <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-50 px-10 py-8 min-w-[420px] hover:shadow-3xl transition-all duration-300">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                      Zéro défaut. Zéro surprise.
                    </h3>
                    <p className="text-gray-600 font-medium text-base">
                      Testé, validé, déployé.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Carte "Zéro défaut" - Mobile */}
              <div className="block md:hidden mt-8 px-4">
                <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-blue-50 px-6 py-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Zéro défaut. Zéro surprise.
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Testé, validé, déployé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <Suspense fallback={<div />}>
          <ContactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default HeroSection;
