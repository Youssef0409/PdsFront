import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/register-request';
import { Role } from '../models/role';
import { User } from '../models/user';
import { Country } from '../models/country';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  registerRequest: RegisterRequest = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: Role.FREELANCER,
    pays:'',
    numTel :'',
    nomEntreprise:'',
    siteweb:''
     
  };
  countries = Object.values(Country);
  DataResponse :any;
  loginRequest: LoginRequest = { email: '', password: '' };
  email!: string;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService ,  
    private routes:Router,private authService: AuthService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
      
    }
    showSuccessMessage() {
      const config = new MatSnackBarConfig();
      config.duration = 3000; // Duration in milliseconds
      config.horizontalPosition = 'center'; // Set the horizontal position to center
      config.verticalPosition = 'top'; // Set the vertical position to top
  
      this.snackBar.open('Registration succeeded!', 'Close', config);
    }

    showFailMessage() {
      
      const config = new MatSnackBarConfig();
      config.duration = 3000; // Duration in milliseconds
      config.horizontalPosition = 'center'; // Set the horizontal position to center
      config.verticalPosition = 'top'; // Set the vertical position to top
  
      this.snackBar.open('Registration failed!', 'Close', config);
    }

    LoginFailMessage() {
      
      const config = new MatSnackBarConfig();
      config.duration = 3000; // Duration in milliseconds
      config.horizontalPosition = 'center'; // Set the horizontal position to center
      config.verticalPosition = 'top'; // Set the vertical position to top
  
      this.snackBar.open('Login failed!', 'Close', config);
    }

  login() {
    console.log(this.loginRequest);
    this.authService.login(this.loginRequest)

      .subscribe(
        (response) => {
        this.DataResponse = response
        if(this.DataResponse['access_token'] !=null){   // Handle successful login response
          const accessToken = response.access_token;
          const refreshToken = response.refresh_token;
         // console.log('Access Token:', accessToken);
          //console.log('Refresh Token:', refreshToken);

          // Store the tokens in local storage or session storage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);

          // Decode the access token to extract user information
          const decodedToken = this.authService.decodeToken(accessToken);
         // console.log('Decoded Token:', decodedToken);

          // Access user information from the decoded token
          localStorage.setItem('user_info', JSON.stringify(decodedToken));

          const user_info = localStorage.getItem('user_info');
          if (user_info !== null) {
            // Item exists, parse it into an object
            const userInfoObject = JSON.parse(user_info);
          
            // Extract the 'sub' property
             this.email = userInfoObject.sub;
          
            console.log(this.email);
          } else {
            // Item doesn't exist
            console.log('user_info not found in local storage');
          }
          this.authService.getUserByEmail(this.email).subscribe(
            (user: User) => {
              localStorage.setItem('user', JSON.stringify(user));  

              
              if (user.role === 'FREELANCER') {
                this.routes.navigate(['/home']);
              } 
              else {
                this.routes.navigate(['/home']);
                // Handle other roles or cases
              }

              
             
            // Use the user data received from the server
              console.log(user);
            },
            (error) => {
              // Handle error
              console.error(error);
            }
          );
        
         
         

        
        
        }
          // Redirect or perform further actions
          // e.g., navigate to a protected route
        },
        (error: any) => {
          this.LoginFailMessage();
          // Handle error response
          console.error('Login failed:', error);
        }
      );
  }


  register() {
    this.authService.register(this.registerRequest)
      .subscribe(
        (response: any) => {
          // Handle successful registration response
          const accessToken = response.access_token;
          const refreshToken = response.refresh_token;
          console.log('Access Token:', accessToken);
          console.log('Refresh Token:', refreshToken);

          // Store the tokens in local storage
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);

          // Decode the access token to extract user information
          const decodedToken = this.authService.decodeToken(accessToken);
          console.log('Decoded Token:', decodedToken);

          // Store the decoded token in local storage
          localStorage.setItem('user_info', JSON.stringify(decodedToken));
          this.showSuccessMessage();
          window.location.reload();
          // Redirect or perform further actions
          // e.g., navigate to a protected route
        },
        (error: any) => {
          this.showFailMessage();
          // Handle error response
          console.error('Registration failed:', error);
        }
      );
  }
}