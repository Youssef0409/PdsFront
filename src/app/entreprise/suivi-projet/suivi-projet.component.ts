import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TicketService } from 'src/app/services/ticket.service';
import { CreateIssueDialogComponent } from '../create-issue-dialog/create-issue-dialog.component';
import { TicketDetailsComponent } from 'src/app/freelancer/ticket-details/ticket-details.component';
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
  description : string
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

pageSize = 3; 
currentPage = 1; 
  tickets: Ticket[] = [];
  TicketStatus = TicketStatus;
  todoTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  doneTickets: Ticket[] = [];
  constructor(private ticketService: TicketService , public dialog: MatDialog , public dialogg: MatDialog ) {}

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

        this.todoTickets = this.getTicketsByStatus(TicketStatus.TO_DO);
        this.inProgressTickets = this.getTicketsByStatus(TicketStatus.IN_PROGRESS);
        this.doneTickets = this.getTicketsByStatus(TicketStatus.DONE);

        this.updatePagination();
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
     
      return ticket.status === TicketStatus[status]; 
    }
    return false;
  });

  console.log('Filtered tickets:', filteredTickets);

  return filteredTickets;
}

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.todoTickets = this.getTicketsByStatus(TicketStatus.TO_DO).slice(startIndex, endIndex);
    this.inProgressTickets = this.getTicketsByStatus(TicketStatus.IN_PROGRESS).slice(startIndex, endIndex);
    this.doneTickets = this.getTicketsByStatus(TicketStatus.DONE).slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }
  


  openTicketDetails(ticket: Ticket): void {
    const dialogRef = this.dialogg.open(TicketDetailsComponent, {
      width: '700px',
      data: ticket,
      panelClass: 'custom-dialog-class' 
  
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The ticket details dialog was closed');
    });
  }

  deleteTicket(ticketId: number) {
    this.ticketService.deleteTicket(ticketId).subscribe(
      () => {
        console.log(`Ticket with ID ${ticketId} deleted successfully`);
        this.loadTickets();
      },
      (error) => {
        console.error('Error deleting ticket:', error);
      }
    );
  }
}