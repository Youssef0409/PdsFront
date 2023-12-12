import { Component } from '@angular/core';

@Component({
  selector: 'app-demande-projet',
  templateUrl: './demande-projet.component.html',
  styleUrls: ['./demande-projet.component.scss']
})
export class DemandeProjetComponent {
  sideBarOpen = true;
  
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
