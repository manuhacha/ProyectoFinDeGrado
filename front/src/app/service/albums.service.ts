import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BandsService } from './bands.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {

  private getAlbumsUrl = "http://localhost:3000/api/v1/album"
  private communityalbums = 'http://localhost:3000/api/v1/communityalbums'


  constructor(private http: HttpClient, private bandsservice: BandsService) { }

  getAlbums() {
    return this.http.get<any>(this.getAlbumsUrl)
  }
  createAlbum(album:any) {
    return this.http.post<any>(this.getAlbumsUrl,album)
  }
  getCommunityAlbums() {
    return this.http.get<any>(this.communityalbums)
  } 
  createCommunityAlbum(communityalbum:any) {
    return this.http.post<any>(this.communityalbums,communityalbum)
  }
  getCommunityAlbumsbyId(userid:string) {
    return this.http.get<any>(this.communityalbums + '/' + userid)
  }
}
