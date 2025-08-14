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
import { ImageUploadService } from '../../services/upload-service.service';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-ch-avatarimg',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule],
  templateUrl: './ch-avatarimg.component.html',
  styleUrl: './ch-avatarimg.component.scss'
})
export class ChAvatarimgComponent implements OnInit {
  errorMessage: string = '';
  AvatarForm: FormGroup = new FormGroup({});
  aid: any;
  avatar_img: any;
  selectedImage: any;
  newAvatarImg: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private uploadService: ImageUploadService
  ) { }

  ngOnInit(): void {
    this.AvatarForm = this.createFormGroup();

    // ตรวจสอบว่าเป็น browser ก่อนเข้าถึง localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
      this.avatar_img = localStorage.getItem('avatar_img');
      console.log('User ID from localStorage:', this.aid);
      console.log('Avatar from localStorage:', this.avatar_img);
    }

    if (this.aid !== null) {
      this.AvatarForm.patchValue({
        userId: this.aid
      });
    }

    this.selectedImage = this.avatar_img;
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      userId: new FormControl('', Validators.required),
      newAvatarImg: new FormControl('', Validators.required),
    });
  }

  changeAvatarImg() {
    console.log('Form values:', this.AvatarForm.value);
    console.log('Form valid:', this.AvatarForm.valid);
        
    if (this.AvatarForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const body = this.AvatarForm.value;
    console.log('Sending request with body:', body);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put<any>('https://backend-facemash-app-1.onrender.com/auth/changeAvatar', body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Avatar changed successfully:', response);
          
          // อัปเดต localStorage เมื่อเปลี่ยน avatar สำเร็จ
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('avatar_img', this.newAvatarImg);
          }
          
          this.snackbarService.openSnackBar('Avatar changed successfully.', 'success');
          this.AvatarForm.reset();
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Error occurred:', error);
          this.errorMessage = 'An error occurred. Please try again later.';
          this.snackbarService.openSnackBar(this.errorMessage, 'error');
        }
      });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }
    
  uploadFile(file: File): void {
    this.uploadService.uploadFile(file)
      .then(downloadURL => {
        console.log('File uploaded successfully. Download URL:', downloadURL);
        this.newAvatarImg = downloadURL;
        this.AvatarForm.patchValue({
          newAvatarImg: downloadURL
        });
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
      
    // Set selected image URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        this.selectedImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}