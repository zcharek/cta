import { m } from "framer-motion";

interface Props {
  step: {
    number: number;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

export const WorkflowStep = ({ step, index }: Props) => {
  return (
    <m.div
      role="listitem"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 * index }}
      className="relative flex flex-col items-center w-full md:w-72 max-w-xs mx-auto"
    >
      {/* Icône */}
      <span
        aria-hidden
        className="z-10 flex items-center justify-center w-14 h-14 rounded-full
        bg-gradient-to-tr from-brand-blue-700 to-brand-blue-600 text-white text-2xl
        shadow-xl border-4 border-white ring-4 ring-brand-blue-100 mb-2"
      >
        <i className={`fas ${step.icon}`} />
      </span>

      {/* Titre */}
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-brand-blue-900">{step.title}</h3>
        <p className="text-sm italic text-brand-blue-900">
          Étape {step.number}
        </p>
      </div>

      {/* Carte */}
      <div className="bg-white/90 rounded-3xl shadow-2xl border border-brand-blue-100
        px-6 py-6 w-full min-h-[180px] md:min-h-[210px] flex items-center">
        <p className="text-gray-800 text-xs md:text-sm leading-relaxed text-center">
          {step.description}
        </p>
      </div>
    </m.div>
  );
};

