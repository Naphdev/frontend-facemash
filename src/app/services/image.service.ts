import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private apiUrl = 'https://backend-facemash-app-1.onrender.com/img';

  constructor(private http: HttpClient) { }

  getAllImages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  updatePoints(image_id: string, newPoints: number): Observable<any> {
    const url = `${this.apiUrl}/update-score/${image_id}`;
    return this.http.put(url, { points: newPoints });
  }

  getTopTenImages(): Observable<any[]> {
    const url = `${this.apiUrl}/top-ten`;
    return this.http.get<any[]>(url);
  }

  getName(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getOnly(_id: string): Observable<any> {
    const url = `${this.apiUrl}/find/${_id}`;
    return this.http.get(url);
  }

  getOnlyimage(mid: string): Observable<any> {
    const url = `${this.apiUrl}/findimage/${mid}`;
    return this.http.get(url);
  }

  getAdd(image_url: string, facemash_id: string): Observable<any> {
    const url = `${this.apiUrl}/add-image`; 
    const params = { image_url: image_url, facemash_id: facemash_id };
    return this.http.post(url, params);
  } 

  delete(mid: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${mid}`; 
    return this.http.delete(url);
  }

  updateImg(image_url: string, image_id: string): Observable<any> {
    const body = {
      image_url: image_url,
      image_id: image_id
    };
    return this.http.put<any>(`${this.apiUrl}/changeImg`, body);
  }
  // fetchTopTenUser7day(): Observable<any[]> {
  //   const url = `${this.apiUrl}/topTenUser7day`;
  //   return this.http.get<any[]>(url);
  // }
}
