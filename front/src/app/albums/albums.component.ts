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
  album = {
    name: '',
    artist: '',
    date: '',
    picture: '',
    link: ''
  }

  
  constructor(private service: AlbumsService, private spotify: SpotifyService) { }

  ngOnInit() {
     this.service.getAlbums() 
      .subscribe({
        next: (res) => {
          this.albums = res
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
  //Este método sólo se ejecuta si no hay álbumes, básicamente añade 100 álbumes de la api de spotify a la bbdd, basándose en un género
  addAlbums() {
    this.spotify.getSearchAlbums('blackmetal').subscribe({
      next: (res) => {
        console.log(res)
        for (let i = 0; i < res.albums.items.length; i++) {
          const album = {
            name: res.albums.items[i].name,
            artist: res.albums.items[i].artists[0].name,
            date: res.albums.items[i].release_date,
            picture: res.albums.items[i].images[0].url,
            link: res.albums.items[i].external_urls.spotify
          };
  
          this.service.createAlbum(album).subscribe({
            next: (res) => {
              console.log('Album created succesfully');
            },
            error: (err) => {
              console.log('Error creating album');
            }
          });
        }
        location.reload()
      },
      error: (err) => {
        console.log('Error getting spotify albums');
      }
    });
  }
  
}
  