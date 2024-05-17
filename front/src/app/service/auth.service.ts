import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signUpUrl = "http://localhost:3000/api/v1/user"

  private loginUpUrl = "http://localhost:3000/api/v1/auth"

  private updateUrl = "http://localhost:3000/api/v1/user/"

  private getUrl = "http://localhost:3000/api/v1/user/"

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) { }

  signUpUser(user:any) {
    return this.http.post<any>(this.signUpUrl,user)
  }
  loginUser(user:any) {
    return this.http.post<any>(this.loginUpUrl,user)
  }
  updateUser(id:string,user:any) {
    return this.http.put<any>(this.updateUrl + id,user)
  }
  //Comprobamos si el token esta guardado en el local Storage para saber si ha iniciado sesion
  isLogged() {
    return !!localStorage.getItem('token')
  }
  //Obtenemos la informacion del usuario descifrando el token, que está siendo enviado en la constante headers
  getUserbyToken(token:string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    return this.http.get<any>(this.loginUpUrl,{headers})
  }
}
