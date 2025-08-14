import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarService } from '../../services/snackbar.service';
import { GlobalConstants } from '../../global/global-constants';
import { Router } from '@angular/router';
import jwt_decode, { jwtDecode } from 'jwt-decode';

import { isPlatformBrowser } from '@angular/common';  
import { PLATFORM_ID, Inject } from '@angular/core';  

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    RouterLink,
    MatDividerModule,
    MatToolbarModule,
    HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  responseMessage: any;
  actype: any;
  errorMessage: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService
  ) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit(): void {
    // เพิ่มการตรวจสอบนี้ก่อนใช้ localStorage
    if (isPlatformBrowser(this.platformId)) {
      // ย้ายโค้ด localStorage ทั้งหมดมาใส่ในนี้
      this.loginForm = this.createFormGroup();
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),//ตรวจสอบค่าที่รับมามีรูปแบบของอีเมล์
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7)]),
    })
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe((response: any) => {
        
        // ตรวจสอบ platform ก่อนใช้ localStorage
        if (isPlatformBrowser(this.platformId)) {
          const token: any = localStorage.getItem("token");
          let decodedToken: any;
          try {
            decodedToken = jwtDecode(token);
            // ใช้ decodedToken.userId (string) จาก JWT
            console.log(decodedToken.userId);
          } catch (err) {
            localStorage.clear();
            this.router.navigate(["login"]);
            return;
          }

          this.responseMessage = response?.message;
          this.actype = response?.actype;
          this.snackbarService.openSnackBar(this.responseMessage, "");
          
          if (this.responseMessage === "login successfully") {
            // Store user details in localStorage
            localStorage.setItem('_id', decodedToken.userId);
            localStorage.setItem('email', this.loginForm.value.email);
            localStorage.setItem('actype', this.actype);
            
            // Get user details from backend and store them
            this.authService.getUsedetail(decodedToken.userId).subscribe((userDetails: any) => {
              if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('name', userDetails.name);
                localStorage.setItem('avatar_img', userDetails.avatar_img);
              }
              
              if (this.actype == "user") {
                this.router.navigate(["posts"], { queryParams: { userId: decodedToken.userId } });
              } else if (this.actype == "admin") {
                this.router.navigate(["dashboard"], { queryParams: { userId: decodedToken.userId } });
              }
            }, (error) => {
              console.error('Error fetching user details:', error);
              // Still navigate even if user details fetch fails
              if (this.actype == "user") {
                this.router.navigate(["posts"], { queryParams: { userId: decodedToken.userId } });
              } else if (this.actype == "admin") {
                this.router.navigate(["dashboard"], { queryParams: { userId: decodedToken.userId } });
              }
            });
          } else {
            this.router.navigate(["login"]);
          }
        }
      }, (error) => {
        console.error('Error occurred:', error);
        if (error.status === 401) {
          this.errorMessage = 'Wrong password!';
        } else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
        this.snackbarService.openSnackBar(this.errorMessage, 'error');
      }
      );
  }

}