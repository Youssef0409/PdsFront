import { Component, OnInit, Renderer2 } from '@angular/core';

import { Offre } from '../models/offre';
import { OffreService } from '../services/offre.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Page } from '../models/page';
@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {
  currentPage: number = 0;
  offres!: Offre[];
  data!: Page<Offre>;
  totalPages: number = 0;

  constructor(private router : Router,private offreService: OffreService,private renderer: Renderer2) {}

  ngOnInit(): void {
   this.getTousLesOffres();
    }
  DetailsPage(id: number): void {
    this.router.navigate(['/jobDetails', id]);
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
}
