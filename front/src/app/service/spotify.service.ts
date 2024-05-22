import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  config = {
    headers: {
        Authorization: 'Bearer ' + this.cookie.get('spotifytoken'),
        'Content-Type': 'application/json'
    }
}

  private getUserUrl = 'https://api.spotify.com/v1/me'

  private searchUrl = 'https://api.spotify.com/v1/search?q='

  private getAlbum = 'https://api.spotify.com/v1/albums'
  
  private getArtist = 'https://api.spotify.com/v1/artists'

  private playlistUrl = 'https://api.spotify.com/v1/users/'

  private addTracksPlaylistUrl = 'https://api.spotify.com/v1/playlists/'

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getUserProfile() {
    return this.http.get<any>(this.getUserUrl,this.config)
  }
  getAlbumbyId(id: string) {
    return this.http.get<any>(this.getAlbum + '/' + id,this.config)
  }
  getSearchArtists() {
    return this.http.get<any>(this.searchUrl +  '&limit=50' + '&type=artist',this.config)
  }
  getArtistbyId(id: string) {
    return this.http.get<any>(this.getArtist + '/' + id,this.config)
  }
  createPlaylist(userid: string) {
    return this.http.post<any>(this.playlistUrl + userid + '/playlists',{name:'New Playlist',public: false},this.config)
  }
  getTrackbyGenre(genre: string,limit: number) {
    return this.http.get<any>(this.searchUrl + "genre=" + genre + '&limit=' + limit + '&type=track',this.config)
  }
  addTrackToPlaylist(id:string,uris: {}) {
    return this.http.post<any>(this.addTracksPlaylistUrl + id + '/tracks',uris,this.config)
  }
}
