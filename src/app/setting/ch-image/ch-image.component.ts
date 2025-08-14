import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SnackbarService } from '../../services/snackbar.service';
import { ImageService } from '../../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { ImageUploadService } from '../../services/upload-service.service';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ch-image',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './ch-image.component.html',
  styleUrl: './ch-image.component.scss'
})
export class ChImageComponent {
  downloadURL1: any;
  mid: any;

  constructor(private imageService: ImageService, private route: ActivatedRoute,private uploadService: ImageUploadService,private router:Router,private location: Location) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];

      this.mid = id;
    });

  }

    goBack(): void {
    this.location.back();
    // หรือใช้วิธีอื่น:
    // this.router.navigate(['/main']);
    // window.history.back();
  }

updateImage(image_url: any, image_id: any) {
  this.imageService.updateImg(image_url, image_id).subscribe(
    response => {
      console.log('Image updated successfully', response);
      // เพิ่มการอัพเดทคะแนนเป็น 0 หลังจากเปลี่ยนรูป
      this.imageService.updatePoints(image_id, 0).subscribe(
        pointsResponse => {
          console.log('Points reset to 0');
          this.router.navigate(['/main']);
        },
        pointsError => {
          console.error('Error resetting points', pointsError);
          this.router.navigate(['/main']); // ไปต่อแม้จะ error
        }
      );
    },
    error => {
      console.error('Error updating image', image_url, image_id);
    }
  );
}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadImage(file);
    }
  }

  uploadImage(file: File): void {
    this.uploadService.uploadFile(file)
      .then(downloadURL => {
        console.log('File uploaded successfully. Download URL:', downloadURL);
        this.downloadURL1 = downloadURL;
        
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  }
}
