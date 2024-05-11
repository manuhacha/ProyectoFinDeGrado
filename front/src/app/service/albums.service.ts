import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  private getAlbumsUrl = "http://localhost:3000/api/v1/album"


  constructor(private http: HttpClient) { }

  getAlbums() {
    return this.http.get<any>(this.getAlbumsUrl)
  }
}
