import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signUpUrl = "http://localhost:3000/api/v1/user"

  private loginUpUrl = "http://localhost:3000/api/v1/auth"

  constructor(private http: HttpClient, private router: Router) { }

  signUpUser(user:any) {
    return this.http.post<any>(this.signUpUrl,user)
  }
  loginUser(user:any) {
    return this.http.post<any>(this.loginUpUrl,user)
  }
  //Comprobamos si el token esta guardado en el local Storage para saber si ha iniciado sesion
  isLogged() {
    return !!localStorage.getItem('token')
  }
  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
  }
}
