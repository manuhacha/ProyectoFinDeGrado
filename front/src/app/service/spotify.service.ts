import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private getUserUrl = "https://api.spotify.com/v1/me"


  constructor(private http: HttpClient) { }

  getUserProfile(config:any) {
    return this.http.get<any>(this.getUserUrl,config)
  }
}
