import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { SpotifyService } from '../service/spotify.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  //Clase con los datos del usuario
  updateUser = {
    email: '',
    username: '',
    oldpassword : '',
    password : '',
    repeatnewpassword : ''
  }
  //Array de generos seleccionables para la creacion de playlists
  genres: { name: string, selected: boolean,value: string }[] = [
    { name: 'Symphonic Black Metal', selected: false,value: 'symphonic black metal' },
    { name: 'Melodic Black Metal', selected: false,value: 'melodic black metal' },
    { name: 'Norwegian Black Metal', selected: false,value: 'norwegian black metal' },
    { name: 'Depressive Suicidal Black Metal', selected: false,value: 'emotional black metal' },
    { name: 'Atmospheric Black Metal', selected: false,value: 'atmospheric black metal' },
    { name: 'Dungeon Synth', selected: false,value: 'dungeon synth' },
    { name: 'Dungeon Synth', selected: false,value: "black 'n' roll" }
  ];
  //Array para las canciones que se añadiran a la playlist 
  tracks: string[] = []
  uris = {}
  selectedGenres: string[] = [];
  //Este enlace debería de ser construido a partir de variables de entorno, pero para este caso, no lo he visto necesario
  link = 'https://accounts.spotify.com/authorize?client_id=f4d50a9da82a4243b90423c1043f355e&response_type=token&redirect_uri=http://localhost:4200/&scope=user-read-private%20user-read-email%20playlist-modify-private'
  id = ''
  spotifyuserid = ''
  err = ''
  msg = ''
  playlisterr = ''
  cookiemsg = 'Cookies are turned off'
  profilepic = ''
  imagen?: File;
  playlistid = ''
  constructor(private auth: AuthService, private Spotify: SpotifyService, private cookie: CookieService) { }

  //Ejecutamos el método para obtener la informacion del usuario a partir del token
  ngOnInit() {
    if (localStorage.getItem('cookiesaceptadas') === 'true') {
      this.cookiemsg = 'Cookies are turned on'
    }
    this.auth.getUserbyToken(localStorage.getItem('token')!)
    .subscribe({
      next: (res) => {
        this.id = res._id
        this.updateUser.email = res.email
        this.updateUser.username = res.username
        this.profilepic = res.profilepic
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0]
    console.log(this.imagen)
  }

  //Metemos los generos seleccionados en un array
  onCheckboxChange(genre: { name: string, selected: boolean }) {
    if (genre.selected) {
      this.selectedGenres.push(genre.name);
    } 
    //Elimina el subgenero del array si esta deseleccionado
    else {
      const i = this.selectedGenres.indexOf(genre.name);
      if (i > -1) {
        this.selectedGenres.splice(i, 1);
      }
    }
  }

  //Método para actualizar usuario
  updateconfoto() {
    this.msg = ''
    this.err = ''
    //Si el usuario quiere cambiar su perfil entramos en este if
    if (this.imagen !== undefined) {
        const fd = new FormData()
        fd.append('image',this.imagen,this.imagen.name)
        fd.append('email',this.updateUser.email)
        fd.append('username',this.updateUser.username)
        fd.append('oldpassword',this.updateUser.oldpassword)
        fd.append('password',this.updateUser.password)
        fd.append('rnewpassword',this.updateUser.repeatnewpassword)
        this.auth.updateUser(this.id,fd)
          .subscribe({
            next: (res) => {
              this.msg = res
              this.imagen = undefined
              location.reload()
            },
            error: (err) => {
              console.log(err)
            }
          })
    }
    //Si el usuario no quiere cambiar su foto de perfil, ejecutariamos el método de abajo
    else {
      this.auth.updateUser(this.id,this.updateUser)
    .subscribe({
      next: (res) => {
        this.ngOnInit()
        this.msg = res
      },
      error: (err) => {
        this.err = err.error
      }
    })
    }
  }

  //Obtiene el perfil de spotify, necesario para crear la playlist
  getSpotifyProfile() {
    if (localStorage.getItem('cookiesaceptadas') === 'true') {
      this.Spotify.getUserProfile()
      .subscribe({
        next: (res) => {
          this.spotifyuserid = res.id
        },
        error: (err) => {
        }
      })
    }
    else {
      this.playlisterr = 'You cant use Spotify Services if cookies are not accepted, you can change this in the Profile Tab'
    }
  }
  //Método para la creacion de playlists
  createPlaylist() {
    this.Spotify.createPlaylist(this.spotifyuserid)
      .subscribe({
        next: (res) => {
          this.playlistid = res.id
          //Busco los generos y los meto en un array
        this.Spotify.getTrackbyGenre('symphonic black metal',10)
      .subscribe({
        next: (res) => {
          for (let i = 0; i < res.tracks.items.length; i++) {
            const song = res.tracks.items[i].uri;
            this.tracks.push(song)
          }
          this.uris = {"uris": this.tracks}
          this.uris = JSON.stringify(this.uris, null, 4)
          //Añado las canciones a la playlist
          this.Spotify.addTrackToPlaylist(this.playlistid,this.uris)
            .subscribe({
              next: (res) => {
                console.log('Playlist Created Succesfully')
              },
              error: (err) => {
                console.log(err)
              }
            })
        },
        error: (err) => {
          console.log(err)
        }
      })
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
  activarCookies() {
    localStorage.setItem('cookiesaceptadas','true')
    location.reload()
  }
  desactivarCookies() {
    localStorage.setItem('cookiesaceptadas','false')
    location.reload()
  }
}
