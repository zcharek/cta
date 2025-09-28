import { useState, useEffect, useMemo } from "react";
import { m } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import { faqsData, FAQCategory, FAQItem } from "../components/faqData";

const categories: { id: FAQCategory; label: string; icon: string }[] = [
  { id: "Services", label: "Services", icon: "🛠️" },
  { id: "Tarifs", label: "Tarifs", icon: "💸" },
  { id: "Technique", label: "Technique", icon: "🤖" },
  { id: "Processus", label: "Processus", icon: "🔄" },
];

const TimelineFAQ = ({ icon, question, answer, isLast, delay }: any) => (
  <m.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="relative flex md:items-center gap-6 md:gap-10 group"
  >
    {/* Timeline line */}
    <div className="flex flex-col items-center">
      <span className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-2xl shadow-xl border-4 border-white ring-4 ring-blue-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition">
        {icon}
      </span>
      {!isLast && (
        <span className="w-1 h-24 bg-gradient-to-b from-blue-100 to-blue-300 block mt-1 mb-1 mx-auto rounded-full opacity-70"></span>
      )}
    </div>
    {/* Content */}
    <div className="flex-1 md:flex md:items-center md:gap-8">
      <div className="md:w-56 mb-2 md:mb-0">
        <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-1">{question}</h3>
      </div>
      <div className="flex-1">
        <div className="bg-white/90 rounded-3xl shadow-2xl group-hover:shadow-3xl group-hover:-trangray-y-1 border border-blue-100 px-8 py-8 transition-all duration-300">
          <p className="text-gray-800 leading-relaxed text-base md:text-lg">{answer}</p>
        </div>
      </div>
    </div>
  </m.div>
);

const FAQ = () => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<FAQCategory | "All">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filtrage dynamique
  const filteredFaqs = useMemo(() => {
    let faqs: FAQItem[] = faqsData;
    if (selectedCat !== "All") {
      faqs = faqs.filter((f: FAQItem) => f.category === selectedCat);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      faqs = faqs.filter((f: FAQItem) =>
        f.question.toLowerCase().includes(s) ||
        f.answer.toLowerCase().includes(s)
      );
    }
    return faqs;
  }, [search, selectedCat]);

  useEffect(() => {
    document.title = "FAQ - Questions Fréquentes | Central Test Consulting";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Questions fréquentes sur nos services de tests logiciels et automatisation QA en Algérie. Trouvez toutes les réponses sur Playwright, Cypress, tarifs et méthodes.');
    }
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 relative overflow-x-hidden">
        <section className="py-16">
          <div className="container max-w-3xl mx-auto px-2 sm:px-6">
            <m.div
              className="text-center mb-14"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-3">
                Foire aux questions
              </h1>
              <p className="text-lg text-blue-800 max-w-2xl mx-auto">
                Toutes les réponses à vos interrogations sur nos services, méthodes et tarifs.
              </p>
            </m.div>
            {/* Barre de recherche + catégories */}
            <div className="sticky top-2 z-10 bg-white/95 pt-3 pb-6 mb-12 rounded-3xl border border-blue-100 shadow-2xl flex flex-col gap-2 px-4">
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Rechercher une question..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-full border border-gray-300 px-6 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white text-gray-900 placeholder-gray-500 shadow transition"
                  style={{ fontSize: '1.1rem' }}
                />
                <span className="absolute right-5 top-1/2 -trangray-y-1/2 text-gray-500 text-2xl pointer-events-none transition-all duration-200 group-hover:text-blue-600">
                  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-3.5-3.5"/></svg>
                </span>
              </div>
              <div className="flex flex-wrap gap-x-1.5 gap-y-1 sm:gap-x-2.5 mt-2 justify-center">
                <button
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 font-semibold flex items-center gap-2 text-xs sm:text-base min-w-[80px] sm:min-w-[110px] max-w-xs truncate transition-all duration-200 focus:outline-none ${selectedCat === "All" ? "border-blue-600 bg-white text-blue-700 shadow-lg z-10 focus:ring-0" : "border-transparent bg-blue-100 text-blue-700 hover:shadow-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"}`}
                  aria-pressed={selectedCat === "All"}
                  onClick={() => setSelectedCat("All")}
                >
                  <span className="text-xl">📚</span> Toutes
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full border-2 font-semibold flex items-center gap-2 text-xs sm:text-base min-w-[80px] sm:min-w-[110px] max-w-xs truncate transition-all duration-200 focus:outline-none ${selectedCat === cat.id ? "border-blue-600 bg-white text-blue-700 shadow-lg z-10 focus:ring-0" : "border-transparent bg-blue-100 text-blue-700 hover:shadow-md hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"}`}
                    aria-pressed={selectedCat === cat.id}
                    onClick={() => setSelectedCat(cat.id)}
                  >
                    <span className="text-xl">{cat.icon}</span> {cat.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Timeline FAQ */}
            <div className="relative mt-14 mb-10">
              <div className="absolute left-6 md:left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-100 to-blue-300 opacity-60 z-0" />
              <div className="space-y-20 relative z-10">
                {filteredFaqs.map((faq, idx) => (
                  <div key={faq.id}>
                    <div
                      className="cursor-pointer select-none flex items-center gap-3 group"
                      onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    >
                      <span className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-2xl shadow-xl border-4 border-white ring-4 ring-blue-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition">
                        {faq.icon}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-1 group-hover:underline">
                        {faq.question}
                      </h3>
                      <span className={`transition-transform duration-300 ml-2 ${openIndex === idx ? 'rotate-90' : ''}`}>
                        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8L10 12L14 8" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                    {openIndex === idx && (
                      <div className="ml-16 bg-white/90 rounded-3xl shadow-2xl border border-blue-100 px-8 py-8 mt-2 transition-all duration-300">
                        <p className="text-gray-800 leading-relaxed text-base md:text-lg">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Aucune question ne correspond à votre recherche.</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-trangray-y-1"
                >
                  <span className="mr-2">💬</span>
                  Contactez-nous
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FAQ;