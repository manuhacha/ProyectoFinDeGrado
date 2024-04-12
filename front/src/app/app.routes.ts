import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BandsComponent } from './bands/bands.component';
import { AlbumsComponent } from './albums/albums.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'albums',
        component: AlbumsComponent
    },
    {
        path: 'bands',
        component: BandsComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];
