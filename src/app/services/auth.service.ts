import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://backend-facemash-app-1.onrender.com/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
  userId: string | undefined;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient, 
    private errorHandlerService: ErrorHandlerService,
    private router: Router) {}

  signup(user: Omit<User, "_id">): Observable<User> {
    return this.http
    .post<User>(`${this.url}/signup`, user, this.httpOptions)
    .pipe(
      first(),
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError(this.errorHandlerService.handlerError<User>("signup"))
    );
  }
  
  login(
    email: string,
    password: string
  ): Observable<{ token: string; userId: string; actype: string }> {
    return this.http
      .post<{ token: string; userId: string; actype: string }>(`${this.url}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject) => {
          this.userId = tokenObject.userId;
          localStorage.setItem("token", tokenObject.token);
          this.isUserLoggedIn$.next(true);
        }),
        catchError(this.errorHandlerService.handlerError<{ token: string; userId: string; actype: string }>("login"))
      );
  }

  getCurrentUser(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  getUsedetail(userId: string): Observable<any> {
    const geturl = `${this.url}/getUsedetail`;
    return this.http.post<any>(geturl, { userId });
  }

  getaccount(): Observable<any[]> {
    const url = `${this.url}/getaccount`;
    return this.http.get<any[]>(url);
  }
}
