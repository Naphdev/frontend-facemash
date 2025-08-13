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

@Component({
  selector: 'app-changpassword',
  standalone: true,
  imports: [ReactiveFormsModule,
            CommonModule,
            MatToolbarModule,
            MatFormFieldModule,
            MatButtonModule,
            MatInputModule],
  templateUrl: './changpassword.component.html',
  styleUrls: ['./changpassword.component.scss']

})
export class ChangpasswordComponent implements OnInit {
 
  errorMessage: string = '';
  passwordForm: FormGroup;
  aid: any;

  constructor(private http: HttpClient,
              private snackbarService: SnackbarService) {
    this.passwordForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
    console.log('User ID from localStorage:', this.aid);
    
    if (this.aid !== null) {
      this.passwordForm.patchValue({
        userId: this.aid
      });
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      userId: new FormControl('', Validators.required),
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(7)]),
    });
  }

  changePassword() {
    console.log('Form values:', this.passwordForm.value);
    console.log('Form valid:', this.passwordForm.valid);
    
    if (this.passwordForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const body = this.passwordForm.value;
    console.log('Sending request with body:', body);
    
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<any>('https://backend-facemash-app-1.onrender.com/auth/updatePassword', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Password changed successfully:', response);
          this.snackbarService.openSnackBar('Password changed successfully.', 'success');
          this.passwordForm.reset();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error occurred:', error);
          if (error.status === 401) {
            this.errorMessage = 'Old password is incorrect.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          this.snackbarService.openSnackBar(this.errorMessage, 'error');
        }
      });
  }
}
