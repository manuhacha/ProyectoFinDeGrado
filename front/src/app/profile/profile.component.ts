import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  updateUser = {
    email: '',
    username: '',
    password: '',
    repeatpassword:'',
    profilepic: ''
  }

  id = ''

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.getId(localStorage.getItem('email'))
    .subscribe({
      next: (res) => {
        this.id = res._id
        console.log(this.id)
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  update() {
    this.auth.updateUser(this.id,this.updateUser)
    .subscribe({
      next: (res) => {
        console.log(res)
        this.updateUser.email = res.email
        this.updateUser.username = res.username
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
