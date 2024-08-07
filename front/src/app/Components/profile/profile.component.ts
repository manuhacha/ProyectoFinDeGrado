import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { CookieService } from 'ngx-cookie-service';
import { SpotifyService } from '../../service/spotify.service';
import { AlbumsService } from '../../service/albums.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  //Clase con los datos del usuario
  updateUser = {
    email: '',
    username: '',
    oldpassword: '',
    password: '',
    repeatnewpassword: '',
  };
  //Array de generos seleccionables para la creacion de playlists
  genres: { name: string; selected: boolean; value: string }[] = [
    {
      name: 'Symphonic Black Metal',
      selected: false,
      value: 'symphonic black metal',
    },
    {
      name: 'Melodic Black Metal',
      selected: false,
      value: 'melodic black metal',
    },
    {
      name: 'Norwegian Black Metal',
      selected: false,
      value: 'norwegian black metal',
    },
    {
      name: 'Depressive Suicidal Black Metal',
      selected: false,
      value: 'emotional black metal',
    },
    {
      name: 'Atmospheric Black Metal',
      selected: false,
      value: 'atmospheric black metal',
    },
    { name: 'Dungeon Synth', selected: false, value: 'dungeon synth' },
  ];
  //Array para las canciones que se añadiran a la playlist
  tracks: string[] = [];
  uris = {};
  selectedGenre: string = '';
  //Este enlace debería de ser construido a partir de variables de entorno, pero para este caso, no lo he visto necesario
  id = '';
  Spotifyuserid = '';
  err = '';
  msg = '';
  playlisterr = '';
  playlistmsg = '';
  communityalbumerr = '';
  useralbumserr = '';
  profilepic = '';
  imagen?: File;
  playlistid = '';
  numerocanciones = null;
  albumid = '';
  newalbum = {
    name: '',
    artist: '',
    date: '',
    picture: '',
    spotifyid: '',
    userid: '',
    link: '',
  };
  olduser = {
    email: '',
    username: '',
  };
  useralbums: any[] = [];
  constructor(
    private auth: AuthService,
    private Spotify: SpotifyService,
    private cookie: CookieService,
    private service: AlbumsService
  ) {}

  //Ejecutamos el método para obtener la informacion del usuario a partir del token
  ngOnInit() {
    this.auth.getUserbyToken(localStorage.getItem('token')!).subscribe({
      next: (res) => {
        this.id = res._id;
        this.updateUser.email = res.email;
        this.updateUser.username = res.username;
        this.profilepic = res.profilepic;
        this.olduser.email = res.email;
        this.olduser.username = res.username;
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.service.getCommunityAlbumsbyId(this.id).subscribe({
      next: (res) => {
        this.useralbums = res;
      },
      error: (err) => {
        this.useralbumserr = err.error;
      },
    });
  }

  onFileSelected(event: any) {
    this.imagen = event.target.files[0];
    console.log(this.imagen);
  }

  //Metemos los generos seleccionados en un array
  onRadioChange(selectedGenre: string) {
    this.selectedGenre = selectedGenre;
  }

  //Método para actualizar usuario
  updateconfoto() {
    this.msg = '';
    this.err = '';

    //Comprobamos que haya cambiado el correo o usuario, para que si no ha tocado nada no pueda darle al boton de actualizar
    if (this.updateUser.email === this.olduser.email && this.updateUser.username === this.olduser.username && !this.imagen && !this.updateUser.password) {
      this.err = 'You have to change a field'
    }
    else {
       //Si el usuario quiere cambiar su perfil entramos en este if
       if (this.imagen !== undefined) {
        const fd = new FormData();
        fd.append('image', this.imagen, this.imagen.name);
        fd.append('email', this.updateUser.email);
        fd.append('username', this.updateUser.username);
        fd.append('oldpassword', this.updateUser.oldpassword);
        fd.append('password', this.updateUser.password);
        fd.append('repeatnewpassword', this.updateUser.repeatnewpassword);
        if (this.validateEmail(this.updateUser.email)) {
          this.auth.updateUser(this.id, fd).subscribe({
            next: (res) => {
              this.msg = res;
              this.imagen = undefined;
              location.reload();
            },
            error: (err) => {
              console.log(err);
            },
          });
        } else {
          this.err = 'Enter a valid email address';
        }
      }
      //Si el usuario no quiere cambiar su foto de perfil, ejecutariamos el método de abajo
      else {
        if (this.validateEmail(this.updateUser.email)) {
          this.auth.updateUser(this.id, this.updateUser).subscribe({
            next: (res) => {
              this.ngOnInit();
              this.msg = res;
            },
            error: (err) => {
              this.err = err.error;
            },
          });
        } else {
          this.err = 'Enter a valid email address';
        }
      }
    }
  }

  //Obtiene el perfil de Spotify, necesario para crear la playlist
  getSpotifyProfile() {
    if (localStorage.getItem('cookiesaceptadas') === 'true') {
      if (this.cookie.get('spotifytoken')) {
        this.Spotify.getUserProfile().subscribe({
          next: (res) => {
            this.Spotifyuserid = res.id;
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.playlisterr =
          'You have to Log In via Spotify to Create a Playlist';
      }
    } else {
      this.playlisterr =
        'You cant use Spotify Services if cookies are not accepted, you can change this in the Profile Tab';
    }
  }
  //Método para la creacion de playlists
  createPlaylist() {
    if (this.cookie.get('spotifytoken')) {
      if (this.numerocanciones! > 100 || this.numerocanciones! < 1) {
        this.playlisterr = 'You have to type a number between 1 and 100';
      } else {
        this.Spotify.createPlaylist(this.Spotifyuserid).subscribe({
          next: (res) => {
            this.playlistid = res.id;
            //Busco los generos y los meto en un array
            this.Spotify.getTrackbyGenre(
              this.selectedGenre,
              this.numerocanciones!
            ).subscribe({
              next: (res) => {
                for (let i = 0; i < res.tracks.items.length; i++) {
                  const song = res.tracks.items[i].uri;
                  this.tracks.push(song);
                }
                this.uris = { uris: this.tracks };
                this.uris = JSON.stringify(this.uris, null, 4);
                //Añado las canciones a la playlist
                this.Spotify.addTrackToPlaylist(
                  this.playlistid,
                  this.uris
                ).subscribe({
                  next: (res) => {
                    this.playlistmsg = 'Playlist Created Succesfully';
                    this.playlisterr = '';
                  },
                  error: (err) => {
                    this.playlisterr = err;
                  },
                });
              },
              error: (err) => {
                console.log(err);
              },
            });
          },
          error: (err) => {
            this.playlisterr = err;
          },
        });
      }
    } else {
      this.playlisterr = 'You have to Log In via Spotify to Create a Playlist';
    }
  }

  createAlbum() {
    if (this.cookie.get('spotifytoken')) {
      this.Spotify.getAlbumbyId(this.albumid).subscribe({
        next: (res) => {
          this.newalbum.spotifyid = this.albumid;
          this.newalbum.name = res.name;
          this.newalbum.artist = res.artists[0].name;
          this.newalbum.date = res.release_date;
          this.newalbum.picture = res.images[0].url;
          this.newalbum.userid = this.updateUser.username;
          this.newalbum.link = res.external_urls.spotify;
          this.service.createCommunityAlbum(this.newalbum).subscribe({
            next: (res) => {
              location.reload();
            },
            error: (err) => {
              this.communityalbumerr = err.error;
            },
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.communityalbumerr = 'You have to Log In to Spotify';
    }
  }

  deleteAlbum() {
    this.service.deleteCommunityAlbum(this.useralbums[0]._id).subscribe({
      next: (res) => {
        location.reload();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
