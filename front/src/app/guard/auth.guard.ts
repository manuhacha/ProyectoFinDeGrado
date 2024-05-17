import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router){}
  //Definimos el método canActivate,que devuelve true si el usuario esta loggeado, y false si 
  //no lo está
  canActivate(): boolean {
    if (this.authService.isLogged()) {
      return true
    }
    else {
      this.router.navigate(['/login'])
      return false
    }
  }
}