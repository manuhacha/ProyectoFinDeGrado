import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginUser = {
    email: '',
    password: ''
  }

  constructor(private auth:AuthService, private router: Router) { }

  login() {
    this.auth.loginUser(this.loginUser)
    .subscribe({
      next: (res) => {
        localStorage.setItem('token',res.jwtToken)
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}
