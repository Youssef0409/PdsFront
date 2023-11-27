import { Role } from "./role";

export interface User {
    id?: string;
    firstname?: string;
    lastname?: string;
    
   
    email?: string;
    numTel?: number;
    pays:string ;
    password?: string;
    role?: Role;
    nomEntreprise:string;
}
