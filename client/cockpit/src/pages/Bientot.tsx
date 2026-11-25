import { Carte, EnTete } from "../ui";

/** Page d'un module prévu dans une phase suivante. */
export default function Bientot({ titre, description, phase }: { titre: string; description: string; phase?: number }) {
  return (
    <>
      <EnTete titre={titre} />
      <Carte className="text-center">
        <p className="mx-auto max-w-md text-ck-texte-2">{description}</p>
        {phase && <p className="mt-3 text-sm font-semibold text-ck-orange-texte">Arrive en phase {phase}.</p>}
      </Carte>
    </>
  );
}
