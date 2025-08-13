import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { EloService } from '../../services/elo.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ShowprofileComponent } from './showprofile/showprofile.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    NavigationComponent,
    RouterLink,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  images: any[] = [];
  character1Image: any = '';
  character2Image: any = '';
  originalCharacter1Image: any = '';
  originalCharacter2Image: any = '';
  userId: any;
  avatar_img: any;
  name: any;
  email: any;
  aid: any;

  constructor(private imageService: ImageService,
    private eloService: EloService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      // ทำงานก็ต่อเมื่อมี localStorage ในฝั่งของเบราว์เซอร์
      this.getAllImages();
      this.getUsedetail();

      this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
      this.avatar_img = localStorage.getItem('avatar_img');
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
    } else {
      console.warn('localStorage is not available. Skipping initialization.');
    }


  }

  getAllImages() {
    console.log('Fetching images from API...');
    this.imageService.getAllImages().subscribe(
      data => {
        console.log('API Response:', data);
        this.images = data;
        console.log('Images array:', this.images);
        this.randomizeImages();
      },
      error => {
        console.error('Error fetching images:', error);
        // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลตัวอย่าง
        this.images = [{
          _id: '1',
          image_url: 'https://via.placeholder.com/476x476/FF6B6B/FFFFFF?text=Character+1',
          facemash_id: 'user1',
          points: 1500.5,
          name: 'Character 1',
          avatar_img: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=U'
        }, {
          _id: '2', 
          image_url: 'https://via.placeholder.com/476x476/4ECDC4/FFFFFF?text=Character+2',
          facemash_id: 'user2',
          points: 1500.3,
          name: 'Character 2',
          avatar_img: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=U'
        }];
        this.randomizeImages();
      }
    );
  }

  // randomizeImages() {
  //   if (this.images.length > 0) {
  //     const data = this.images[0];
  //     const randomIndex1 = Math.floor(Math.random() * data.length);
  //     const randomIndex2 = Math.floor(Math.random() * data.length);
  //     this.character1Image = data[randomIndex1];
  //     this.character2Image = data[randomIndex2];
  //     this.originalCharacter1Image = this.character1Image;
  //     this.originalCharacter2Image = this.character2Image;
  //   }
  // }

  randomizeImages() {
    console.log('Randomizing images...');
    console.log('Images length:', this.images.length);
    
    if (this.images && this.images.length > 0) {
      // ถ้า images เป็น array ของ array ให้ใช้ index 0
      const data = Array.isArray(this.images[0]) ? this.images[0] : this.images;
      console.log('Data to randomize:', data);
      
      if (data.length >= 2) {
        let randomIndex1, randomIndex2;
        do {
          randomIndex1 = Math.floor(Math.random() * data.length);
          randomIndex2 = Math.floor(Math.random() * data.length);
        } while (randomIndex1 === randomIndex2);

        this.character1Image = data[randomIndex1];
        this.character2Image = data[randomIndex2];
        this.originalCharacter1Image = this.character1Image;
        this.originalCharacter2Image = this.character2Image;
        
        console.log('Selected character 1:', this.character1Image);
        console.log('Selected character 2:', this.character2Image);
      } else {
        console.log('Not enough images to randomize');
      }
    } else {
      console.log('No images available');
    }
  }

  formatPoints(points: number | null | undefined): string {
    // Handle null, undefined, or NaN values
    if (points === null || points === undefined || isNaN(points)) {
      return '0.0';
    }
    // Format points to show only 1 decimal place
    return points.toFixed(1);
  }

  onClickC1() {
    const newRating1 = this.eloService.calculateNewRating(this.character1Image.points, this.character2Image.points, true);
    const newRating2 = this.eloService.calculateNewRating(this.character2Image.points, this.character1Image.points, false);
    const id1 = this.character1Image._id;
    const id2 = this.character2Image._id;

    this.character1Image.points = newRating1;
    this.character2Image.points = newRating2;

    this.imageService.updatePoints(id1, newRating1).subscribe({
      next: (data) => {
        console.log('Character 1 points updated successfully', data);
      },
      error: (error) => {
        console.error('Failed to update Character 1 points:', error);
      }
    });

    this.imageService.updatePoints(id2, newRating2).subscribe({
      next: (data) => {
        console.log('Character 2 points updated successfully', data);
      },
      error: (error) => {
        console.error('Failed to update Character 2 points:', error);
      }
    });

    this.randomizeImages();
  }

  onClickC2() {
    const newRating1 = this.eloService.calculateNewRating(this.character1Image.points, this.character2Image.points, false);
    const newRating2 = this.eloService.calculateNewRating(this.character2Image.points, this.character1Image.points, true);
    const id1 = this.character1Image._id;
    const id2 = this.character2Image._id;

    this.character1Image.points = newRating1;
    this.character2Image.points = newRating2;

    this.imageService.updatePoints(id1, newRating1).subscribe({
      next: (data) => {
        console.log('Character 1 points updated successfully', data);
      },
      error: (error) => {
        console.error('Failed to update Character 1 points:', error);
      }
    });

    this.imageService.updatePoints(id2, newRating2).subscribe({
      next: (data) => {
        console.log('Character 2 points updated successfully', data);
      },
      error: (error) => {
        console.error('Failed to update Character 2 points:', error);
      }
    });

    this.randomizeImages();
  }


  getUsedetail() {
    this.route.queryParams.subscribe(params => {
      // Get the value of 'email' parameter from the URL
      this.userId = params['userId'];
    });
    this.authService.getUsedetail(this.userId)
      .subscribe((response: any) => {

        this.aid = response?._id;
        this.avatar_img = response?.avatar_img;
        this.name = response?.name;
        this.email = response?.email;

        // Set values in localStorage
        localStorage.setItem('_id', this.aid); // Changed from 'aid' to '_id'
        localStorage.setItem('avatar_img', this.avatar_img);
        localStorage.setItem('name', this.name);
        localStorage.setItem('email', this.email);

        console.log(response?._id);
        console.log(response?.avatar_img);
        console.log(response?.name);
        console.log(response?.email);

      }, (error) => {
        console.error("Error occurred while fetching user details:", error);
      }
      );
  }

  viewProfile(facemash_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "1000px";
    dialogConfig.height = "600px"; // Adjust height as needed
    dialogConfig.data = { facemash_id }; // Pass character data to profile component if needed
    this.dialog.open(ShowprofileComponent, dialogConfig);
}

}

