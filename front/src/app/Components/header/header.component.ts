import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ProfileComponent } from '../profile/profile.component';
ProfileComponent
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

profileimage = 'assets/img/profile.png'

constructor (private auth:AuthService) {}

ngOnInit() {
  this.auth.getUserbyToken(localStorage.getItem('token')!)
  .subscribe({
    next: (res) => {
      if (res.profilepic) {
        this.profileimage = res.profilepic
      }
    },
    error: (err) => {
      console.log(err)
    }
  })
}

cambiarHeader(): boolean {
  return this.auth.isLogged();
}
logout() {
  this.auth.logout()
}
}