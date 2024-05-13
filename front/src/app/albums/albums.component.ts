import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SpotifyService } from '../service/spotify.service';
import { AlbumsService } from '../service/albums.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [NgFor],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {

  albums: any[] = []

  
  constructor(private service: AlbumsService, private spotify: SpotifyService) { }

  ngOnInit() {
    this.añadirAlbumes()
     this.service.getAlbums() 
      .subscribe({
        next: (res) => {
          this.albums = res
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
  //Este método sólo se ejecuta si no hay álbumes, básicamente añade 100 álbumes de la api de spotify a la bbdd, basándose en un género
  añadirAlbumes() {
    this.spotify.getSearchAlbums('blackmetal')
      .subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
}
  