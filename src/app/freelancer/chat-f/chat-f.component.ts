import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Message } from 'src/app/models/Message';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-chat-f',
  templateUrl: './chat-f.component.html',
  styleUrls: ['./chat-f.component.scss']
})
export class ChatFComponent implements OnInit, OnDestroy ,AfterViewInit {
  newMessage: string = '';
  showLoader: boolean = false;
  loggedInUser: User | null = null;
  searchKeyword: string = '';

  @ViewChildren('messageContainer', { read: ElementRef })
  messageContainer: QueryList<ElementRef>;
  ngAfterViewInit() {
    const script = document.createElement('script');
    script.src = 'assets/js/chat.js';
    document.body.appendChild(script);
  this.messageContainer.changes.subscribe(() => {
  
    this.scrollToBottom();
  });
  }
  sideBarOpen = true;
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  private chatSubscription: Subscription | undefined;

  users: User[] = [];
  selectedUser: User | null = null;
  chatMessages: Message[] = [];
  id_user!: number;
  private chatMessagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<
    Message[]
  >([]);

  constructor(
    private webSocketService: WebSocketService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    
    this.messageContainer = new QueryList<ElementRef>();
  }

  ngOnInit(): void {
    this.loadUsers();

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.selectUser(parseInt(storedUserId, 10));
    }
    this.webSocketService.setChatComponent(this);

    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.id_user = user.id;
    }

    this.chatMessagesSubject.subscribe((messages) => {
      this.chatMessages = messages;
  
   
      if (messages.length > 0) {
        this.scrollToBottom();
      }
  
    
      this.cd.detectChanges();
    });
  

    this.loadInitialMessages();
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }
  selectUser(userId: number) {
    this.selectedUser = this.users.find((u) => u.id === userId) || null;
    localStorage.setItem('userId', userId.toString());
  

    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  

    const loggedInUserId = this.id_user;
  

    if (this.webSocketService.isConnected()) {
  
      this.chatSubscription = this.webSocketService
        .getChatMessages(loggedInUserId, userId)
        .subscribe({
          next: (messages: Message[]) => {
            this.chatMessagesSubject.next(messages);
            console.log('Received messages:', messages);
  
     
            this.showLoader = true;
  
          
            this.scrollToBottom();
          },
          error: (error: any) => {
            console.error('Error loading chat messages:', error);
          },
          complete: () => {
         
            this.showLoader = false;
          },
        });
    } else {
      console.error('WebSocket is not connected.');
    }
  }
  


  sendMessage() {
    if (this.selectedUser) {
      const message: Message = {
        id: 0,
        chatId: this.webSocketService.generateChatId(
          this.id_user,
          this.selectedUser.id || 0
        ),
        sender: { id: this.id_user },
        recipient: { id: this.selectedUser.id || 0 },
        content: this.newMessage,
        dateSent: new Date(),
      };

      console.log('Recipient ID:', message.recipient.id);
      console.log('Content:', message.content);

 
      this.webSocketService.sendMessage(message);

      this.newMessage = '';


      this.chatMessages.push(message);

  
      this.scrollToBottom();
    } else {
      console.error('Aucun utilisateur sélectionné pour envoyer un message.');
    }
  }

  loadInitialMessages() {
    if (this.selectedUser) {
      const loggedInUserId = this.id_user;
      const selectedUserId = this.selectedUser.id || 0;

      this.webSocketService
        .getInitialChatMessages(loggedInUserId, selectedUserId)
        .subscribe((messages) => {
          this.chatMessagesSubject.next(messages);
          console.log('Received initial messages:', messages);

          this.scrollToBottom();
        });
    }
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }
  loadChatMessages(userId: number) {
    this.selectUser(userId);
  }

 
  private scrollToBottom() {
    if (this.messageContainer && this.messageContainer.last) {
      this.messageContainer.last.nativeElement.scrollTop =
        this.messageContainer.last.nativeElement.scrollHeight;
    }
  }

  get filteredUsers(): User[] {
    return this.users.filter(user =>
      `${user.firstname} ${user.lastname}`.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }
}
