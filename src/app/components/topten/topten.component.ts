import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationComponent } from '../navigation/navigation.component';
import { PreviousRankPipe } from '../../previous-rank.pipe';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-topten',
  standalone: true,
  imports: [RouterLink, NgFor, MatToolbarModule, NavigationComponent, PreviousRankPipe ,HttpClientModule
  ],
  templateUrl: './topten.component.html',
  styleUrl: './topten.component.scss'
})
export class ToptenComponent implements OnInit {
  images: any[] = [];
  topTenImages: any[] = [];
  previousTopTenImages: any[] = []; // เพิ่มตัวแปรเก็บข้อมูล Top 10 ของวันก่อนหน้า
  avatar_img: any;
  name: any;
  email: any;
  aid: any;

  constructor(private imageService: ImageService) { }

  async ngOnInit(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      try {
        this.topTenImages = await this.getTopTenImages();
      } catch (error) {
        console.error('Error loading top ten images:', error);
        // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลตัวอย่าง
        this.topTenImages = [
          {
            _id: '1',
            image_url: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Top+1',
            points: 2000.5,
            name: 'Top Character 1',
            facemash_id: 'user1'
          },
          {
            _id: '2',
            image_url: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Top+2',
            points: 1800.3,
            name: 'Top Character 2',
            facemash_id: 'user2'
          }
        ];
      }
  
      //getlocalStorage
      this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
      this.avatar_img = localStorage.getItem('avatar_img');
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
    } else {
      console.warn('localStorage is not available. Skipping initialization.');
    }
  
  }

  async getTopTenImages(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      console.log('Fetching top ten images...');
      this.imageService.getTopTenImages().subscribe(
        (data: any[]) => {
          console.log('Top ten API response:', data);
          this.previousTopTenImages = this.topTenImages; // บันทึกข้อมูล Top 10 ของวันก่อนหน้า
          this.topTenImages = data;
          console.log('Top ten images set:', this.topTenImages);
          resolve(this.topTenImages);
        },
        error => {
          console.error('Error fetching top ten images:', error);
          // ถ้าไม่มีข้อมูล ให้สร้างข้อมูลตัวอย่าง
          this.topTenImages = [
            {
              _id: '1',
              image_url: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Top+1',
              points: 2000.5,
              name: 'Top Character 1',
              facemash_id: 'user1'
            },
            {
              _id: '2',
              image_url: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Top+2',
              points: 1800.3,
              name: 'Top Character 2',
              facemash_id: 'user2'
            }
          ];
          resolve(this.topTenImages);
        }
      );
    });
  }

  formatPoints(points: number): string {
    // Format points to show only 1 decimal place
    return points.toFixed(1);
  }
  
}

