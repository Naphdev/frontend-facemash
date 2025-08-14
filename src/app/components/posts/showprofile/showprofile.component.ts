import { Component, Inject, OnInit  } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-showprofile',
  standalone: true,
  imports: [MatToolbarModule,
            MatFormFieldModule,
            MatButtonModule,
            MatInputModule],
  templateUrl: './showprofile.component.html',
  styleUrl: './showprofile.component.scss'
})
export class ShowprofileComponent implements OnInit{

  aid: any;
  userId: any;
  avatar_img: any;
  name: any;
  email: any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private authService: AuthService,
    private route: ActivatedRoute) {
    console.log(this.data); 
    this.aid = data.facemash_id;
  }
  ngOnInit(): void {
    this.getUsedetail();
  }

  getUsedetail() {
    // this.route.queryParams.subscribe(params => {
    //   // Get the value of 'email' parameter from the URL
    //   this.userId = params['userId'];
    // });
    this.authService.getUsedetail(this.aid)
      .subscribe((response: any) => {

        this.aid = response?._id;
        this.avatar_img = response?.avatar_img;
        this.name = response?.name;
        this.email = response?.email;



      }, (error) => {
        console.error("Error occurred while fetching user details:", error);
      }
      );
  }


}
