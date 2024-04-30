import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private apiArtistsUrl = 'https://api.spotify.com/v1/artists/'

  private accessToken = '7180600d4ab9402aa13798a1e2f7b543'

  constructor(private http: HttpClient) { }

  getArtist(id:string):Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });
    return this.http.get<any>(this.apiArtistsUrl + id, {headers})
  }
}
