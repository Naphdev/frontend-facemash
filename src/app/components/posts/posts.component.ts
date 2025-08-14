import { Component, OnInit, Inject } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { RouterLink, Router } from '@angular/router';
import { NgIf, isPlatformBrowser } from '@angular/common';
import { EloService } from '../../services/elo.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ShowprofileComponent } from './showprofile/showprofile.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PLATFORM_ID } from '@angular/core';

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

  constructor(
    private imageService: ImageService,
    private eloService: EloService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getAllImages();
      this.getUsedetail();

      this.aid = localStorage.getItem('_id');
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
        this.randomizeImages();
      },
      error => {
        console.error('Error fetching images:', error);
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

  randomizeImages() {
    console.log('Randomizing images...');
    if (this.images && this.images.length > 0) {
      const data = Array.isArray(this.images[0]) ? this.images[0] : this.images;
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
      } else {
        console.log('Not enough images to randomize');
      }
    } else {
      console.log('No images available');
    }
  }

  formatPoints(points: number | null | undefined): string {
    if (points === null || points === undefined || isNaN(points)) {
      return '0.0';
    }
    return points.toFixed(1);
  }

  onClickC1() {
    const newRating1 = this.eloService.calculateNewRating(this.character1Image.points, this.character2Image.points, true);
    const newRating2 = this.eloService.calculateNewRating(this.character2Image.points, this.character1Image.points, false);
    const id1 = this.character1Image._id;
    const id2 = this.character2Image._id;

    this.character1Image.points = newRating1;
    this.character2Image.points = newRating2;

    this.imageService.updatePoints(id1, newRating1).subscribe();
    this.imageService.updatePoints(id2, newRating2).subscribe();

    this.randomizeImages();
  }

  onClickC2() {
    const newRating1 = this.eloService.calculateNewRating(this.character1Image.points, this.character2Image.points, false);
    const newRating2 = this.eloService.calculateNewRating(this.character2Image.points, this.character1Image.points, true);
    const id1 = this.character1Image._id;
    const id2 = this.character2Image._id;

    this.character1Image.points = newRating1;
    this.character2Image.points = newRating2;

    this.imageService.updatePoints(id1, newRating1).subscribe();
    this.imageService.updatePoints(id2, newRating2).subscribe();

    this.randomizeImages();
  }

  getUsedetail() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    });
    this.authService.getUsedetail(this.userId)
      .subscribe((response: any) => {
        if (isPlatformBrowser(this.platformId)) {
          this.aid = response?._id;
          this.avatar_img = response?.avatar_img;
          this.name = response?.name;
          this.email = response?.email;

          localStorage.setItem('_id', this.aid);
          localStorage.setItem('avatar_img', this.avatar_img);
          localStorage.setItem('name', this.name);
          localStorage.setItem('email', this.email);
        }

        console.log(response?._id);
        console.log(response?.avatar_img);
        console.log(response?.name);
        console.log(response?.email);

      }, (error) => {
        console.error("Error occurred while fetching user details:", error);
      });
  }

  viewProfile(facemash_id: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "1000px";
    dialogConfig.height = "600px";
    dialogConfig.data = { facemash_id };
    this.dialog.open(ShowprofileComponent, dialogConfig);
  }
}
