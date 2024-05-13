import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BandsService {

  private getBandsUrl = "http://localhost:3000/api/v1/artist"


  constructor(private http: HttpClient) { }

  getArtists() {
    return this.http.get<any>(this.getBandsUrl)
  }
}
