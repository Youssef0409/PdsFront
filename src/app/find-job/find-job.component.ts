import { Component, OnInit, ViewChild } from '@angular/core';
import { Offre } from '../models/offre';
import { OffreService } from '../services/offre.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-find-job',
  templateUrl: './find-job.component.html',
  styleUrls: ['./find-job.component.scss']
})
export class FindJobComponent implements OnInit {

  offres!: Offre[];

  constructor(private router : Router,private offreService: OffreService) {}

  ngOnInit(): void {
    this.offreService.tousLesOffres().subscribe(
      (data: Offre[]) => {
        this.offres = data;
      },
      (error) => {
        console.error('Error fetching offres:', error);
      }
    );
  }
  DetailsPage(id: number): void {
    this.router.navigate(['/jobDetails', id]);
  }
}
