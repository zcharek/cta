import { Routeur } from "./router.js";
import { routesAccueil } from "./routes-accueil.js";
import { routesAuth } from "./routes-auth.js";
import { routesCabinets } from "./routes-cabinets.js";
import { routesEquipe } from "./routes-equipe.js";
import { routesFactures } from "./routes-factures.js";
import { routesPaie } from "./routes-paie.js";
import { routesPortail } from "./routes-portail.js";
import { routesProfil } from "./routes-profil.js";
import { routesSuivi } from "./routes-suivi.js";
import { routesTemps } from "./routes-temps.js";

const routeur = new Routeur();
routesAuth(routeur);
routesEquipe(routeur);
routesTemps(routeur);
routesSuivi(routeur);
routesCabinets(routeur);
routesAccueil(routeur);
routesPortail(routeur);
routesProfil(routeur);
routesFactures(routeur);
routesPaie(routeur);

export const traiter = (req: Request) => routeur.traiter(req);
