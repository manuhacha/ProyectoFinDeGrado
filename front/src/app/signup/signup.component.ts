import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signUpUser = {
    username: '',
    email: '',
    password: '',
    repeatpassword: ''
  }

  constructor(private auth: AuthService) { }

  signUp() {
    this.auth.signUpUser(this.signUpUser)
      .subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => console.log(err)
      })
  }
}
