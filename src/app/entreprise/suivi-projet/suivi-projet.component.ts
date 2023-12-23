import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticket.service';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
export enum TicketStatus {
  TO_DO,
  IN_PROGRESS,
  DONE,
}

export interface Ticket {
  id: number;
  summary: string;
  status: TicketStatus;
  lastUpdated: string;
  assignedTo: any;
  createdBy: any;
}
@Component({
  selector: 'app-suivi-projet',
  templateUrl: './suivi-projet.component.html',
  styleUrls: ['./suivi-projet.component.scss']
})
export class SuiviProjetComponent  implements OnInit {
  sideBarOpen = true;
  id_user!: number;
  ticketStatusArray = Object.values(TicketStatus);

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  tickets: Ticket[] = [];
  TicketStatus = TicketStatus;
  todoTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  doneTickets: Ticket[] = [];
  constructor(private ticketService: TicketService , public dialog: MatDialog) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.id_user = user.id;
      this.loadTickets();
    }
  }
  openCreateIssueDialog(): void {
    const dialogRef = this.dialog.open(CreateIssueDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'create') {
       
      }
    });
  }
  loadTickets() {
    this.ticketService.getTicketsByUserId(this.id_user).subscribe(
      (tickets) => {
        this.tickets = tickets;
        console.log('Tickets loaded successfully:', this.tickets);
        
        // Filtrer les tickets pour chaque état
        this.todoTickets = this.getTicketsByStatus(TicketStatus.TO_DO);
        this.inProgressTickets = this.getTicketsByStatus(TicketStatus.IN_PROGRESS);
        this.doneTickets = this.getTicketsByStatus(TicketStatus.DONE);
        
      },
      (error) => {
        console.error('Erreur lors du chargement des tickets:', error);
      }
    );
  }

getTicketsByStatus(status: TicketStatus): Ticket[] {
  console.log('Requested status:', status);

  const filteredTickets = this.tickets.filter((ticket) => {
    if (typeof ticket.status === 'string') {
      // Assuming ticket.status is a string
      return ticket.status === TicketStatus[status]; // Use enum name to compare
    }
    return false;
  });

  console.log('Filtered tickets:', filteredTickets);

  return filteredTickets;
}


  
}