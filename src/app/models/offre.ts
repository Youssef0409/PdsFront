import { User } from "./user";
import { DomaineExpertise } from "./domaine-expertise";
import { Technologie } from "./technologie";
import { ProductImages } from "./product-images";

export interface Offre {
    id: number;
    description?: string;
    prix_heure?: number;
    domaineExpertise?: DomaineExpertise;
    technologie?: Technologie;
    freelancer?: User; // Assuming you have a User interface as well
    productImagess?:ProductImages[];
  }