import { Component } from '@angular/core';
import { BandsService } from '../../service/bands.service';
import { NgFor, NgIf } from '@angular/common';
import { SpotifyService } from '../../service/spotify.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [NgFor,FormsModule,ReactiveFormsModule, NgIf],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {

  adminemail = ''
  artistid = ''
  togglealbumcreation = false
  newband = {
    name: '',
    genre: '',
    picture: '',
    link: ''
  }

  genreArray = ''
  currentPage: number = 1;
  itemsPerPage: number = 12;
  bands: any[] = []

  
  constructor(private service: BandsService, private spotify: SpotifyService, private auth: AuthService) { }

  ngOnInit() {
    this.auth.getUserbyToken(localStorage.getItem('token')!)
      .subscribe({
        next: (res) => {
          if (res.email === 'bymanuxxyt@hotmail.com') {
            this.adminemail = res.email
          }
        },
        error: (err) => {
          console.log(err)
        }
      })
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

  // addBands() {
  //   this.spotify.getSearchArtists('blackmetal').subscribe({
  //     next: (res) => {
  //       console.log(res)
  //       for (let i = 0; i < res.artists.items.length; i++) {
  //         // Verificar que genres sea un array antes de usarlo
  //         if (Array.isArray(res.artists.items[i].genres)) {
  //           const genresArray: string[] = res.artists.items[i].genres.slice(0, 3)
  //           const artist = {
  //             name: res.artists.items[i].name,
  //             genre: genresArray.join(', '),
  //             picture: res.artists.items[i].images[0].url,
  //             link: res.artists.items[i].external_urls.spotify
  //           };
  //           this.service.createArtist(artist).subscribe({
  //             next: (res) => {
  //               console.log('Band created successfully');
  //             },
  //             error: (err) => {
  //               console.log('Error creating band');
  //             }
  //           });
  //         } else {
  //           console.log('Genres is not an array');
  //         }
  //       }
  //     },
  //     error: (err) => {
  //       console.log('Error getting Spotify artists');
  //     }
  //   });
  // }
  createArtist() {
    this.spotify.getArtistbyId(this.artistid)
      .subscribe({
        next: (res) => {
          this.newband.link = res.external_urls.spotify
          this.newband.picture = res.images[0].url
          this.newband.name = res.name
          this.newband.genre = res.genres.slice(0, 3).join(', ')
          this.service.createArtist(this.newband)
            .subscribe({
              next: (res) => {
                this.togglealbumcreation = false
                location.reload()  
              }
            })
        },
        error: (err) => {
          console.log(err)
          this.togglealbumcreation = false
        }
      })
  }
  addArtist() {
    this.togglealbumcreation = true
  }
  // Métodos de paginación
  get paginatedBands(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.bands.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.bands.length / this.itemsPerPage);
  }
}
