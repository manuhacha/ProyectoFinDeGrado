import { Component } from '@angular/core';
import { SpotifyService } from '../service/spotify.service';
import { AlbumsService } from '../service/albums.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PreviewService } from '../service/preview.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [NgFor,NgIf,FormsModule,ReactiveFormsModule],
  templateUrl: './albums.component.html',
  styleUrl: './albums.component.css'
})
export class AlbumsComponent {

  albums: any[] = []
  adminemail = ''
  togglealbumcreation = false
  albumid = ''
  newalbum = {
    name: '',
    artist: '',
    date: '',
    picture: '',
    spotifyid: ''
  }
  currentPage: number = 1;
  itemsPerPage: number = 12;
  
  constructor(private service: AlbumsService, private spotify: SpotifyService,private auth: AuthService, private pservice: PreviewService, private router: Router) { }

  ngOnInit() {
    //Nos suscribimos a el metodo para poder obtener el perfil, y comprobar si es mi correo, haciendo que mi cuenta sea una especie de usuario admin
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
    this.togglealbumcreation = true
  }
  createAlbum() {
    console.log(this.albumid)
    this.spotify.getAlbumbyId(this.albumid)
      .subscribe({
        next: (res) => {
          this.newalbum.spotifyid = this.albumid
          this.newalbum.name = res.name
          this.newalbum.artist = res.artists[0].name
          this.newalbum.date = res.release_date
          this.newalbum.picture = res.images[0].url
          this.service.createAlbum(this.newalbum)
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
  //Mandamos el id del album para poder construir la url del embed al dirigir a /preview
  sendAlbumId(id:any) {
    this.pservice.sendAlbumId(id)
    this.router.navigate(['preview'])
  }
  
  // Métodos de paginación
  get paginatedAlbums(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.albums.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.albums.length / this.itemsPerPage);
  }
}
  