import { Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['rank', 'image', 'name', 'points', 'change'];

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.getWeeklyRankings();

      //getlocalStorage
      this.aid = localStorage.getItem('_id'); // Changed from 'aid' to '_id'
      this.avatar_img = localStorage.getItem('avatar_img');
      this.name = localStorage.getItem('name');
      this.email = localStorage.getItem('email');
    } else {
      console.warn('localStorage is not available. Skipping initialization.');
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
          points: this.formatPoints(image.points || 0), // Format points to 1 decimal place
          change: this.getRankChange(index + 1), // Mock rank change
          _id: image._id
        }));
        console.log('Processed rankings:', this.weeklyRankings);
      },
      error => {
        console.error('Error fetching weekly rankings:', error);
        // Fallback data for testing
        this.weeklyRankings = [
          { rank: 1, image: 'https://via.placeholder.com/100', name: 'Sample User 1', points: '95.0', change: '+2', _id: '1' },
          { rank: 2, image: 'https://via.placeholder.com/100', name: 'Sample User 2', points: '87.5', change: '-1', _id: '2' },
          { rank: 3, image: 'https://via.placeholder.com/100', name: 'Sample User 3', points: '82.3', change: '+3', _id: '3' },
          { rank: 4, image: 'https://via.placeholder.com/100', name: 'Sample User 4', points: '78.0', change: '0', _id: '4' },
          { rank: 5, image: 'https://via.placeholder.com/100', name: 'Sample User 5', points: '75.7', change: '-2', _id: '5' }
        ];
      }
    );
  }

  formatPoints(points: number): string {
    // Format points to show only 1 decimal place
    return points.toFixed(1);
  }

  getRankChange(rank: number): string {
    // Mock rank change - in real implementation, this would compare with previous week
    const changes = ['+2', '-1', '+3', '0', '-2', '+1', '-3', '+1', '0', '-1'];
    return changes[rank - 1] || '0';
  }

  getChangeColor(change: string): string {
    if (change.startsWith('+')) return 'green';
    if (change.startsWith('-')) return 'red';
    return 'gray';
  }
}
