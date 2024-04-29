import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,NgIf,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginUser = {
    email: '',
    password: ''
  }
  err:string = ''

  constructor(private auth:AuthService, private router: Router) { }

  login() {
    this.auth.loginUser(this.loginUser)
    .subscribe({
      next: (res) => {
        localStorage.setItem('token',res.jwtToken)
        localStorage.setItem('email',this.loginUser.email)
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err)
        this.err = err.error
      }
    })
  }
}
