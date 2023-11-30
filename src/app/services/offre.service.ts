// Dans votre service (offre.service.ts)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from '../models/offre';
import { DomaineExpertise } from '../models/domaine-expertise';
import { Technologie } from '../models/technologie';

@Injectable({
  providedIn: 'root',
})
export class OffreService {
  private apiUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  ajouterUneOffre(offre: Offre): Observable<Offre> {
    return this.http.post<Offre>(`${this.apiUrl}/offer/create`, offre);
  }

  supprimerUneOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/offer/${id}`);
  }

  updateUneOffre(offre: Offre, id: number): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/offer/${id}`, offre);
  }

  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/offer/${id}`);
  }

  tousLesOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/offer/All`);
  }

  rechercherOffresParDomaineEtTechnologie(domaine: DomaineExpertise, technologie: Technologie): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.apiUrl}/offer/recherche/${domaine}/${technologie}`);
  }
}
