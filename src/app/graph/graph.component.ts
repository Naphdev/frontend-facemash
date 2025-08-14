import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ImageService } from '../services/image.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterLink,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatCardModule
  ],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit {
  weeklyRankings: any[] = [];
  avatar_img: any;
  name: any;
  email: any;
  aid: any;
  displayedColumns: string[] = ['rank', 'image', 'name', 'points'];

  constructor(
    private imageService: ImageService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getWeeklyRankings();

      // get localStorage
      this.aid = localStorage.getItem('_id');
      this.avatar_img = localStorage.getItem('avatar_img');
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
    } else {
      console.warn('localStorage is not available on the server. Skipping initialization.');
    }
  }

  getWeeklyRankings(): void {
    this.imageService.getTopTenImages().subscribe(
      (data: any[]) => {
        console.log('Weekly rankings data:', data);
        this.weeklyRankings = data.map((image, index) => ({
          rank: index + 1,
          image: image.image_url,
          name: image.name || 'Unknown',
          points: this.formatPoints(image.points || 0),
          _id: image._id
        }));
      },
      error => {
        console.error('Error fetching weekly rankings:', error);
        this.weeklyRankings = [
          { rank: 1, image: 'https://via.placeholder.com/100', name: 'Sample User 1', points: '95.0', _id: '1' },
          { rank: 2, image: 'https://via.placeholder.com/100', name: 'Sample User 2', points: '87.5', _id: '2' },
          { rank: 3, image: 'https://via.placeholder.com/100', name: 'Sample User 3', points: '82.3', _id: '3' },
          { rank: 4, image: 'https://via.placeholder.com/100', name: 'Sample User 4', points: '78.0', _id: '4' },
          { rank: 5, image: 'https://via.placeholder.com/100', name: 'Sample User 5', points: '75.7', _id: '5' }
        ];
      }
    );
  }

  formatPoints(points: number): string {
    return points.toFixed(1);
  }
}
