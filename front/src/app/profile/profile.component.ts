import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


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
    password: '',
    profilepic: ''
  }
  //Este enlace debería de ser construido a partir de variables de entorno, pero para este caso, no lo he visto necesario
  link = 'https://accounts.spotify.com/authorize?client_id=f4d50a9da82a4243b90423c1043f355e&response_type=token&redirect_uri=http://localhost:4200/&scope=user-read-private%20user-read-email'
  token = this.getSpotifyToken()
  id = ''
  dboldpassword = ''
  oldpassword = ''
  newpassword = ''
  repeatnewpassword = ''
  err = ''
  msg = ''
  imagen?: File;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getId(localStorage.getItem('email'))
    .subscribe({
      next: (res) => {
        this.id = res._id
        this.updateUser.email = res.email
        this.updateUser.username = res.username
        this.dboldpassword = res.password
        this.updateUser.profilepic = res.profilepic
        console.log(this.token)
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

  //Este sería el metodo update a realizar en el caso de que el usuario cambie su foto de perfil
  updateconfoto() {
    console.log(this.imagen)
    this.msg = ''
    this.err = ''

    if (this.oldpassword) {
      if (this.newpassword !== this.repeatnewpassword) {
        this.err = 'Las contraseñas no coinciden'
      }
      else if (this.oldpassword !== this.dboldpassword) {
        this.err = 'Tu contraseña antigua es incorrecta'
      }
    }

    if (this.imagen) {
      //Comprobamos si el usuario ha querido cambiar la contraseña
        this.updateUser.password = this.dboldpassword
        const fd = new FormData()
        fd.append('image',this.imagen,this.imagen.name)
        fd.append('email',this.updateUser.email)
        fd.append('username',this.updateUser.username)
        fd.append('password',this.updateUser.password)
        this.auth.updateUser(this.id,fd)
          .subscribe({
            next: (res) => {
              this.msg = res
              this.ngOnInit()
            },
            error: (err) => {
              console.log(err)
            }
          })
    }
    //Si el usuario no quiere cambiar su foto de perfil, ejecutariamos el método de abajo
    else {
      this.updateUser.password = this.dboldpassword
      this.auth.updateUser(this.id,this.updateUser)
    .subscribe({
      next: (res) => {
        this.msg = res
        this.ngOnInit()
      },
      error: (err) => {
        this.err = err.error
      }
    })
    }
  }
  getSpotifyToken() {
  const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
  return accessToken
  }
}
