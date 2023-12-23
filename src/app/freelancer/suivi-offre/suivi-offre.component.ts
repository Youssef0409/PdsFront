import { Component, OnInit } from '@angular/core';

import { TicketService } from 'src/app/services/ticket.service';
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
  selector: 'app-suivi-offre',
  templateUrl: './suivi-offre.component.html',
  styleUrls: ['./suivi-offre.component.scss']
})
export class SuiviOffreComponent implements OnInit {

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
  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.id_user = user.id;
      this.loadTickets();
    }
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

onDragStart(event: any, ticket: Ticket) {
  event.dataTransfer.setData('text/plain', ticket.id.toString());
}

onDragOver(event: any) {
  event.preventDefault();
  console.log('onDragOver called');
}

onDragEnter(event: any) {
  event.preventDefault();
  console.log('onDragEnter called');
}

onDrop(event: any, status: string) {
  event.preventDefault();
  const ticketId: number = +event.dataTransfer.getData('text/plain');
  console.log('onDrop called with ticketId:', ticketId, 'and status:', status);

  // Ensure the status is a valid member of the TicketStatus enum
  const statusEnum: TicketStatus = TicketStatus[status as keyof typeof TicketStatus];

  if (statusEnum !== undefined) {
    console.log('Valid status:', statusEnum);
    this.ticketService.updateTicketWorkflowStatus(ticketId, statusEnum).subscribe(
      (updatedTicket) => {
        this.loadTickets();
        console.log('Ticket status updated successfully:', updatedTicket);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'état du ticket:', error);
      }
    );
  } else {
    console.error('Erreur: status invalide');
  }
}
  
  
}