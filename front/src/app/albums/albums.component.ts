import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpotifyService } from '../service/spotify.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {

  album = {
    name: '',
    artist: '',
    year: '',
    picture: ''
  }

  err = ''

  config = {
    headers: {
        Authorization: 'Bearer ' + this.cookie.get('spotifytoken'),
        'Content-Type': 'application/json'
    }
}
  
  constructor(private Spotify: SpotifyService, private cookie: CookieService) { }

  ngOnInit() {
    if (this.cookie.get('spotifytoken')) {
      this.Spotify.getSearchAlbums(this.config,"blackmetal")
      .subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.log(err)
          console.log(this.config)
        }
      })
    }
    else {
      console.log('No se puede')
    }
  }
}
  