import { Component, EventEmitter, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { PreviewService } from '../../service/preview.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  cookiesaceptadas = localStorage.getItem('cookiesaceptadas')

  constructor(private cookie: CookieService, private auth: AuthService, private pservice: PreviewService, private router: Router) { }

  ngOnInit() {
    if (!this.cookiesaceptadas) {
    Swal.fire({
      title: 'This website access and saves your data in cookies in order to use Spotify Services, ¿do you accept this?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        cancelButton: 'order-1 right-gap',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem('cookiesaceptadas','true')
      }
      else if (result.isDenied) {
        localStorage.setItem('cookiesaceptadas','false')
      }
    })
  }
    const accessToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (accessToken) {
      this.cookie.set('spotifytoken',accessToken)
    }
    }
    //Mandamos el id del album para poder construir la url del embed al dirigir a /preview
    sendAlbumId(id:any) {
      this.pservice.sendAlbumId(id)
      this.router.navigate(['preview'])
    }
}
