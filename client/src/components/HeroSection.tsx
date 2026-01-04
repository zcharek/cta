import { useState, useRef, useEffect, Suspense, lazy } from "react";
import { m } from "framer-motion";
import React from 'react';
import { IDECodePreview } from "./IDECodePreview";
import PatternBackground from "./PatternBackground";

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

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <>
      <PatternBackground 
        variant="light" 
        opacity={0.1}
        className="relative bg-gradient-to-b from-white via-gray-50 to-gray-200 overflow-hidden py-16 md:py-20 lg:py-24"
      >
      <section
        id="home"
        className="container mx-auto px-4 sm:px-6 lg:px-8"
      >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Colonne texte à gauche (desktop) */}
            <div className="order-2 lg:order-1">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="inline-block mb-6 px-4 py-2 rounded-full bg-gradient-to-tr from-brand-blue-900 to-brand-blue-700 text-white text-sm font-bold shadow-md tracking-widest uppercase">
                  Expert QA
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
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-brand-blue-900 to-brand-blue-600">
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
                      className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-brand-blue-900 via-brand-blue-700 to-brand-blue-600 text-white text-center font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:ring-offset-2"
                    >
                      Nos Services
                    </a>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand-blue-700 text-brand-blue-700 text-center font-semibold rounded-xl shadow hover:bg-brand-blue-700 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-blue-600 focus:ring-offset-2"
                    >
                      Contactez-nous
                    </button>
                  </div>
                </m.div>
              </m.div>
              {/* IDE mobile : juste après le texte */}
              <div className="block md:hidden w-full mt-8">
                <IDECodePreview snippets={codeSnippets} />
                
                {/* Carte "Zéro défaut" - Mobile */}
                <div className="mt-8">
                  <div 
                    className="backdrop-blur-md rounded-2xl shadow-xl border border-brand-blue-100 px-6 py-6 transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setIsCardHovered(true)}
                    onMouseLeave={() => setIsCardHovered(false)}
                    onTouchStart={() => setIsCardHovered(true)}
                    onTouchEnd={() => setIsCardHovered(false)}
                    style={{
                      background: isCardHovered 
                        ? 'linear-gradient(to right, #001233, #08224c, #143666)'
                        : 'transparent'
                    }}
                  >
                    <div className="text-center">
                      <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                        isCardHovered ? 'text-white' : 'text-gray-900'
                      }`}>
                        Zéro défaut. Zéro surprise.
                      </h3>
                      <p className={`font-medium transition-colors duration-300 ${
                        isCardHovered ? 'text-white' : 'text-gray-600'
                      }`}>
                        Testé, validé, déployé.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite : IDE desktop (à droite sur desktop) */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-2xl mt-8 lg:mt-0 w-full hidden md:block">
                <IDECodePreview snippets={codeSnippets} />
                
                {/* Carte "Zéro défaut" - Desktop */}
                <div className="mt-8">
                  <div 
                   className="backdrop-blur-md rounded-3xl shadow-2xl border border-brand-blue-100 px-10 py-8 hover:shadow-3xl hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center group"
                    onMouseEnter={() => setIsCardHovered(true)}
                    onMouseLeave={() => setIsCardHovered(false)}
                    style={{ 
                      width: '80%',
                      height: '92px',
                      maxWidth: '1200px',
                      minWidth: '550px',
                      margin: '0 auto',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      background: isCardHovered 
                        ? 'linear-gradient(to right, #001233, #08224c, #143666)'
                        : 'transparent'
                    }}
                  >
                    <div className="text-center">
                      <h3 className={`text-xl font-bold mb-3 tracking-tight transition-colors duration-300 ${
                        isCardHovered ? 'text-white' : 'text-gray-900'
                      }`}>
                        Zéro défaut. Zéro surprise.
                      </h3>
                      <p className={`font-medium text-base transition-colors duration-300 ${
                        isCardHovered ? 'text-white' : 'text-gray-600'
                      }`}>
                        Testé, validé, déployé.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
      </section>
    </PatternBackground>
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
