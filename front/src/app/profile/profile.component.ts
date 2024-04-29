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

  id = ''
  dboldpassword = ''
  oldpassword = ''
  newpassword = ''
  repeatnewpassword = ''
  err = ''
  msg = ''
  

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getId(localStorage.getItem('email'))
    .subscribe({
      next: (res) => {
        this.id = res._id
        this.updateUser.email = res.email
        this.updateUser.username = res.username
        this.dboldpassword = res.password
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  update() {
    //Generamos errores si la contraseña antigua no coincide con la base de datos, o si las contraseñas nuevas no coinciden
    if (this.newpassword !== this.repeatnewpassword) {
      this.err = 'Las contraseñas no coinciden'
    }

    else if (this.oldpassword !== this.dboldpassword) {
      this.err = 'Tu contraseña antigua es incorrecta'
    }

    else {
      this.updateUser.password = this.newpassword
      this.auth.updateUser(this.id,this.updateUser)
    .subscribe({
      next: (res) => {
        this.msg = res
      },
      error: (err) => {
        this.err = err
        console.log(err)
      }
    })
    }
  }
}
