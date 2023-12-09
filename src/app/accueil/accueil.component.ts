import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent {
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService,private authService:AuthService) {}

  isLoggedIn(): boolean {
    // Use the isAuthenticated() method
    return this.authService.isAuthenticated();
  }
}
