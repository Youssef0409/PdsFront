import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && refreshToken) {
          const refreshReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${refreshToken}`
            }
          });

          return this.authService.refreshAccessToken().pipe(
            switchMap((newAccessToken: string) => {
              localStorage.setItem('access_token', newAccessToken);

              const updatedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              return next.handle(updatedReq);
            }),
            catchError(() => {
              this.authService.logout();
              return throwError(error);
            })
          );
        }

        return throwError(error);
      })
    );
  }
}