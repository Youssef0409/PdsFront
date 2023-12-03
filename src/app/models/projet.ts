import { DomaineExpertise } from "./domaine-expertise";
import { Technologie } from "./technologie";
import { User } from "./user";

export interface Projet {
    id: number;
    titre?: string;
    description?: string;
    domaineExpertise?: DomaineExpertise;
    technologie?: Technologie;
    imageUrl?: string;
    budget?: number;
    duree?: number;
    statusProjet?: string;
    entreprise?: User;
}
