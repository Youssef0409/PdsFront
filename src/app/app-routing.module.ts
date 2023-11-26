import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FindJobComponent } from './find-job/find-job.component';
import { JobDetailsComponent } from './job-details/job-details.component';

const routes: Routes = [

  { path: 'home', component: AccueilComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'findJob', component: FindJobComponent },
  { path: 'jobDetails', component: JobDetailsComponent },
 
  // Add more routes as needed
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/home' }, // Wildcard route for 404


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})




export class AppRoutingModule { }
