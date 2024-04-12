import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private signUpUrl = "http://localhost:3000/api/v1/user"

  private loginUpUrl = "http://localhost:3000/api/v1/auth"

  constructor(private http: HttpClient) { }

  signUpUser(user:any) {
    return this.http.post<any>(this.signUpUrl,user)
  }
}
