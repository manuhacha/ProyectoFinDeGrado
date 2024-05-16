import { Component } from '@angular/core';
import { BandsService } from '../service/bands.service';
import { NgFor } from '@angular/common';
import { SpotifyService } from '../service/spotify.service';

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {

  band = {
    name: '',
    genre: '',
    picture: '',
    link: ''
  }

  genreArray = ''

  bands: any[] = []

  
  constructor(private service: BandsService, private spotify: SpotifyService) { }

  ngOnInit() {
     this.service.getArtists()
      .subscribe({
        next: (res) => {
          this.bands = res
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  addBands() {
    this.spotify.getSearchArtists('blackmetal').subscribe({
      next: (res) => {
        console.log(res)
        for (let i = 0; i < res.artists.items.length; i++) {
          // Verificar que genres sea un array antes de usarlo
          if (Array.isArray(res.artists.items[i].genres)) {
            const genresArray: string[] = res.artists.items[i].genres.slice(0, 3)
            const artist = {
              name: res.artists.items[i].name,
              genre: genresArray.join(', '),
              picture: res.artists.items[i].images[0].url,
              link: res.artists.items[i].external_urls.spotify
            };
            this.service.createArtist(artist).subscribe({
              next: (res) => {
                console.log('Band created successfully');
              },
              error: (err) => {
                console.log('Error creating band');
              }
            });
          } else {
            console.log('Genres is not an array');
          }
        }
      },
      error: (err) => {
        console.log('Error getting Spotify artists');
      }
    });
  }
  
}
