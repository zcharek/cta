import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import { MouseCursor } from "./MouseCursor";

interface Snippet {
  tab: string;
  code: string[];
}

interface Props {
  snippets: Snippet[];
}

function highlightPostman(line: string) {
  if (/^\s*\/\//.test(line))
    return `<span style="color:#8a9299">${escapeHtml(line)}</span>`;

  // Utiliser des placeholders uniques pour éviter les conflits
  const placeholders: Array<{ placeholder: string; replacement: string }> = [];
  let placeholderIndex = 0;
  
  function createPlaceholder(replacement: string): string {
    const placeholder = `\uE000PL${placeholderIndex++}\uE001`;
    placeholders.push({ placeholder, replacement });
    return placeholder;
  }
  
  // Étape 1: Protéger les chaînes de caractères
  let processed = line.replace(/('[^']*'|"[^"]*")/g, (match) => {
    return createPlaceholder(`<span style="color:#d12f6a">${escapeHtml(match)}</span>`);
  });
  
  // Étape 2: Échapper le HTML (les placeholders ne seront pas affectés)
  processed = escapeHtml(processed);
  
  // Étape 3: Protéger les méthodes pm.
  processed = processed.replace(/\b(pm)\./g, (match) => {
    return createPlaceholder(`<span style="color:#6c3ec1">${match}</span>`);
  });
  
  // Étape 4: Protéger les nombres
  processed = processed.replace(/\b\d+\b/g, (match) => {
    return createPlaceholder(`<span style="color:#4ec9b0">${match}</span>`);
  });
  
  // Étape 5: Restaurer tous les placeholders dans l'ordre inverse
  for (let i = placeholders.length - 1; i >= 0; i--) {
    processed = processed.replace(placeholders[i].placeholder, placeholders[i].replacement);
  }
  
  return processed;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function highlightJS(line: string) {
  if (/^\s*\/\//.test(line))
    return `<span style="color:#6b7280">${escapeHtml(line)}</span>`;

  // Utiliser des placeholders uniques pour éviter les conflits
  const placeholders: Array<{ placeholder: string; replacement: string }> = [];
  let placeholderIndex = 0;
  
  function createPlaceholder(replacement: string): string {
    const placeholder = `\uE000PL${placeholderIndex++}\uE001`;
    placeholders.push({ placeholder, replacement });
    return placeholder;
  }
  
  // Étape 1: Protéger les chaînes de caractères
  const stringPlaceholders: Array<{ placeholder: string; content: string }> = [];
  let processed = line.replace(/('[^']*'|"[^"]*")/g, (match) => {
    const placeholder = createPlaceholder(`<span style="color:#22c55e">${escapeHtml(match)}</span>`);
    stringPlaceholders.push({ placeholder, content: match });
    return placeholder;
  });
  
  // Étape 2: Échapper le HTML (les placeholders ne seront pas affectés)
  processed = escapeHtml(processed);
  
  // Étape 3: Protéger les méthodes AVANT les mots-clés (car "cy" pourrait être dans un mot-clé)
  processed = processed.replace(/\b(cy|http|pm)\./g, (match) => {
    return createPlaceholder(`<span style="color:#143666">${match}</span>`);
  });
  
  // Étape 4: Protéger les mots-clés
  processed = processed.replace(
    /\b(import|export|from|const|let|function|return|describe|it|check|sleep)\b/g,
    (match) => {
      return createPlaceholder(`<span style="color:#001233">${match}</span>`);
    }
  );
  
  // Étape 5: Protéger les nombres
  processed = processed.replace(/\b\d+\b/g, (match) => {
    return createPlaceholder(`<span style="color:#001233">${match}</span>`);
  });
  
  // Étape 6: Restaurer tous les placeholders dans l'ordre inverse
  for (let i = placeholders.length - 1; i >= 0; i--) {
    processed = processed.replace(placeholders[i].placeholder, placeholders[i].replacement);
  }
  
  return processed;
}

export function highlightCodeLine(line: string, tab: string) {
  if (!line) return <>&nbsp;</>;

  const rulesByTab: Record<string, (line: string) => string> = {
    "api.postman.json": highlightPostman,
    "tests.e2e.js": highlightJS,
    "load.k6.js": highlightJS,
  };

  const highlighter = rulesByTab[tab];
  if (!highlighter) return line;

  const html = highlighter(line);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export const IDECodePreview = ({ snippets }: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [autoDemo, setAutoDemo] = useState(true);
  const [clickedTab, setClickedTab] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 👉 Démo automatique avec curseur
  useEffect(() => {
    if (!autoDemo) return;

    const timeout = setTimeout(() => {
      const next = (activeTab + 1) % snippets.length;
      setClickedTab(next);
      setActiveTab(next);

      setTimeout(() => setClickedTab(null), 300);
    }, 4200);

    return () => clearTimeout(timeout);
  }, [autoDemo, activeTab, snippets.length]);

  const handleTabClick = (idx: number) => {
    // Définir clickedTab immédiatement pour une animation instantanée
    setClickedTab(idx);
    setActiveTab(idx);
    setAutoDemo(false);
    setTimeout(() => setClickedTab(null), 300);
    
    // Nettoyer le timeout précédent s'il existe
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    
    // Reprendre l'animation automatique après 3 secondes
    resumeTimeoutRef.current = setTimeout(() => {
      setAutoDemo(true);
      resumeTimeoutRef.current = null;
    }, 3000);
  };

  return (
    <div
      className="relative"
      onTouchStart={() => setAutoDemo(false)}
    >
      {/* 👆🏻 Curseur animé */}
      {autoDemo && (
        <MouseCursor
          targetIndex={activeTab}
          containerRef={tabsRef}
        />
      )}

      {/* Onglets */}
      <div
        ref={tabsRef}
        className="flex gap-2 absolute top-4 left-4 z-10 overflow-hidden flex-nowrap pr-4 w-[calc(100%-2rem)]"
        role="tablist"
      >
        {snippets.map((snippet, idx) => (
          <m.button
            key={snippet.tab}
            role="tab"
            aria-selected={activeTab === idx}
            aria-label={`Afficher le fichier ${snippet.tab}`}
            onClick={() => handleTabClick(idx)}
            onTap={() => handleTabClick(idx)}
            className={`px-2 md:px-3 py-2 rounded-t-lg font-mono text-[10px] md:text-sm transition flex-shrink-0 min-w-[80px] md:min-w-[110px] max-w-[120px] md:max-w-[160px] text-ellipsis overflow-hidden text-center items-center justify-center relative ${
              idx === activeTab
                ? "bg-white/60 text-brand-blue-900 shadow"
                : "bg-white/30 text-gray-400"
            }`}
            whileTap={{ scale: 0.95 }}
            animate={clickedTab === idx ? {
              scale: [1, 0.9, 1],
              transition: { duration: 0.2, ease: "easeOut" }
            } : {}}
          >
            {clickedTab === idx && (
              <m.span
                className="absolute inset-0 rounded-t-lg bg-white/40"
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
            {snippet.tab}
          </m.button>
        ))}
      </div>

      {/* Bloc code */}
      <div className="backdrop-blur-xl bg-white/30 border border-brand-blue-100 rounded-3xl shadow-2xl px-3 md:px-6 pt-12 md:pt-14 pb-4 md:pb-6 font-mono text-[10px] md:text-xs overflow-y-auto" style={{ minHeight: '300px', maxHeight: '370px', height: '370px' }}>
        <div className="flex flex-col w-full overflow-hidden">
          {snippets[activeTab].code.map((line, i) => (
            <div key={i} className="flex gap-1 md:gap-2 items-start min-h-[1.3em] md:min-h-[1.4em]">
              <span className="w-6 text-right pr-1 text-gray-400 text-[10px] md:text-xs select-none tabular-nums flex-shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 text-[10px] md:text-xs leading-tight font-mono overflow-hidden">
                {highlightCodeLine(line || '', snippets[activeTab].tab)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

