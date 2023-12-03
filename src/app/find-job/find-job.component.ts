import { Component, OnInit, Renderer2 } from '@angular/core';

import { Offre } from '../models/offre';
import { OffreService } from '../services/offre.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Page } from '../models/page';
import { ProjetService } from '../services/projet.service';
import { Projet } from '../models/projet';
@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {
  currentPage: number = 0;
  offres!: Offre[];
  projets!: Projet[];
  projetOffre: any;
  data!: Page<Offre>;
  totalPages: number = 0;
  isFreelanceChecked: boolean = false;
  isProjetChecked: boolean = false;
  constructor(private router : Router,private offreService: OffreService,private renderer: Renderer2,private projetService: ProjetService) {}

  ngOnInit(): void {
    this.getTousLesOffres();
    this.getTousLesProjets();
    }
  DetailsPage(id: number,type:string): void {
    this.router.navigate(['/jobDetails', id,type]);
  }

  onFreelanceCheckboxChange(event: any): void {
    this.isFreelanceChecked = event.target.checked;
    this.getTousLesOffres();
}

onProjetCheckboxChange(event: any): void {
  this.isProjetChecked = event.target.checked;
  this.getTousLesProjets();
}

  getTousLesOffres(): void {
    this.offreService.tousLesOffres(this.currentPage).subscribe(
      (response: any) => {
        // Assuming your array is nested under a key 'content'
        this.offres = response.content;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  getTousLesProjets(): void {
    this.projetService.tousLesProjets(this.currentPage).subscribe(
      (response: any) => {
        // Assuming your array is nested under a key 'content'
        this.projets = response.content;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  getTousLesProjetsOffres(): void {
    this.offreService.tousLesOffresProjets(this.currentPage).subscribe(
      (response: any) => {
        // Assuming your array is nested under a key 'content'
        this.projetOffre = response.content;
        this.totalPages = response.totalPages;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  


  goToNextPage(): void {
    // Increment the current page number
    this.currentPage++;

    // Fetch data for the next page
    this.getTousLesOffres();
  }
  goToPage(page: number): void {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

    this.currentPage = page;
    this.getTousLesOffres(); // Fetch data for the selected page
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }



  goToNextPage1(): void {
    // Increment the current page number
    this.currentPage++;

    // Fetch data for the next page
    this.getTousLesProjets();
  }
  goToPage1(page: number): void {
    this.renderer.setProperty(document.documentElement, 'scrollTop', 0);

    this.currentPage = page;
    this.getTousLesProjets(); // Fetch data for the selected page
  }

  getPageNumbers1(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
