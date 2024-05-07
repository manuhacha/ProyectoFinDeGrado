import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SpotifyService } from '../service/spotify.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  updateUser = {
    email: '',
    username: '',
    oldpassword : '',
    password : '',
    repeatnewpassword : ''
  }
  config = {
    headers: {
        Authorization: 'Bearer ' + this.cookie.get('spotifytoken'),
        'Content-Type': 'application/json'
    }
}
  //Este enlace debería de ser construido a partir de variables de entorno, pero para este caso, no lo he visto necesario
  link = 'https://accounts.spotify.com/authorize?client_id=f4d50a9da82a4243b90423c1043f355e&response_type=token&redirect_uri=http://localhost:4200/&scope=user-read-private%20user-read-email'
  id = ''
  err = ''
  msg = ''
  playlisterr = ''
  cookiemsg = 'Cookies are turned off'
  profilepic = ''
  imagen?: File;
  constructor(private auth: AuthService, private Spotify: SpotifyService, private cookie: CookieService) { }

  ngOnInit() {
    if (localStorage.getItem('cookiesaceptadas') === 'true') {
      this.cookiemsg = 'Cookies are turned on'
    }
    this.auth.getId(localStorage.getItem('email'))
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

  getSpotifyProfile() {
    if (localStorage.getItem('cookiesaceptadas') === 'true') {
      this.Spotify.getUserProfile(this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
        }
      })
    }
    else {
      this.playlisterr = 'You cant use Spotify Services if cookies are not accepted, you can change this in the Profile Tab'
    }
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
