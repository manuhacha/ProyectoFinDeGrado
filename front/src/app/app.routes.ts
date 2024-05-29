import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { BandsComponent } from './Components/bands/bands.component';
import { AlbumsComponent } from './Components/albums/albums.component';
import { ProfileComponent } from './Components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { AlbumPreviewComponent } from './Components/album-preview/album-preview.component';
import { CommunityalbumsComponent } from './Components/communityalbums/communityalbums.component';

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
        component: ProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'preview',
        component: AlbumPreviewComponent
    },
    {
        path: 'communityalbums',
        component: CommunityalbumsComponent
    }
];
