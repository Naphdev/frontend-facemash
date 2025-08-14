import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SnackbarService } from '../../services/snackbar.service';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-chname',
  standalone: true,
  imports: [ReactiveFormsModule,
            CommonModule,
            MatToolbarModule,
            MatFormFieldModule,
            MatButtonModule,
            MatInputModule],
  templateUrl: './chname.component.html',
  styleUrl: './chname.component.scss'
})
export class ChnameComponent implements OnInit {

  errorMessage: string = '';
  nameForm: FormGroup = new FormGroup({}); 
  aid: any;
  name: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.nameForm = this.createFormGroup();

    // ตรวจสอบว่าเป็น browser ก่อนเข้าถึง localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
      this.name = localStorage.getItem('name');
      console.log('User ID from localStorage:', this.aid);
      console.log('User name from localStorage:', this.name);
    }

    if (this.aid !== null) {
      this.nameForm.patchValue({
        userId: this.aid
      });
    }

    if (this.name !== null) {
      this.nameForm.patchValue({
        newName: this.name
      });
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      userId: new FormControl('', Validators.required),
      newName: new FormControl('', Validators.required),
    });
  }

  changeName() {
    console.log('Form values:', this.nameForm.value);
    console.log('Form valid:', this.nameForm.valid);
    
    if (this.nameForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const body = this.nameForm.value;
    console.log('Sending request with body:', body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<any>('https://backend-facemash-app-1.onrender.com/auth/changeName', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Name changed successfully:', response);
          
          // อัปเดต localStorage เมื่อเปลี่ยนชื่อสำเร็จ
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('name', this.nameForm.value.newName);
          }
          
          this.snackbarService.openSnackBar('Name changed successfully.', 'success');
          this.nameForm.reset();
          this.errorMessage = '';
          
          // Reset ค่า userId และ newName หลังจาก reset form
          if (this.aid !== null) {
            this.nameForm.patchValue({
              userId: this.aid
            });
          }
          
          // อัปเดตชื่อใหม่ใน form และ property
          if (isPlatformBrowser(this.platformId)) {
            this.name = localStorage.getItem('name');
            this.nameForm.patchValue({
              newName: this.name
            });
          }
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.errorMessage = 'An error occurred. Please try again later.';
          this.snackbarService.openSnackBar(this.errorMessage, 'error');
        }
      });
  }

}