import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet';
import { Offre } from '../models/offre';

@Injectable({
  providedIn: 'root'
})
export class ProjetService {
  private apiRoot = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}


  ajouterUnProjet(projet: Projet, imageFiles: File[]): Observable<Projet> {
    const formData = new FormData();
    formData.append('projet', JSON.stringify(projet));

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('imageFile', imageFiles[i]);
    }

    return this.http.post<Projet>(`${this.apiRoot}proj/create`, formData);
  }

  updateUnProjet(projet: Projet, id: number): Observable<Projet> {
    const formData = new FormData();
    formData.append('projet', JSON.stringify(projet));

    return this.http.put<Projet>(`${this.apiRoot}proj/${id}`, formData);
  }

  supprimerUnProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiRoot}proj/${id}`);
  }

  getProjetById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiRoot}proj/${id}`);
  }

  tousLesProjets(page: number = 0, size: number = 10): Observable<Projet[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Projet[]>(`${this.apiRoot}/proj/pagination/All`, { params });
  }


  rechercherProjetsParDomaineEtTechnologie(domaine: string, technologie: string): Observable<any> {
    return this.http.get(`${this.apiRoot}proj/recherche/${domaine}/${technologie}`);
  }


  findAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiRoot}/proj/All`);
  }

  getProjetByUserId(id: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.apiRoot}/proj/user/${id}`);
  }
}