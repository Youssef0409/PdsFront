// Dans votre service (offre.service.ts)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from '../models/offre';
import { DomaineExpertise } from '../models/domaine-expertise';
import { Technologie } from '../models/technologie';
import { Page } from '../models/page';

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

  tousLesOffres(page: number = 0, size: number = 4): Observable<Offre[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Offre[]>(`${this.apiUrl}/offer/pagination/All`, { params });
  }


  rechercherOffresParDomaineEtTechnologie(domaine: DomaineExpertise, technologie: Technologie): Observable<Object[]> {
    return this.http.get<Object[]>(`${this.apiUrl}/offer/recherche/${domaine}/${technologie}`);
  }

  findAll(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}proj/All`);
  }


  tousLesOffresProjets(page: number = 0, size: number = 4): Observable<any[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any[]>(`${this.apiUrl}/offres-et-projets`, { params });
  }
}
