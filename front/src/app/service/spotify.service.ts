// spotify.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

@Injectable()
export class SpotifyService {

  private clientId = 'YOUR_CLIENT_ID';
  private clientSecret = 'YOUR_CLIENT_SECRET';
  private redirectUri = 'http://localhost:4200/callback';
  private spotifyApiUrl = 'https://api.spotify.com/v1';

  private accessToken: string;
  private accessTokenSubject: any;

  constructor(private http: HttpClient) { }

  getAccessToken(): Observable<string> {
    if (!this.accessTokenSubject) {
      this.accessTokenSubject = this.fetchAccessToken()
        .share();
    }

    return this.accessTokenSubject;
  }

  private fetchAccessToken(): Observable<string> {
    if (this.accessToken) {
      return Observable.of(this.accessToken);
    }

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${this.redirectUri}&scope=user-read-artist`;
    window.location.href = authUrl;

    return Observable.fromEvent(window, 'message')
      .filter((event: MessageEvent) => event.source === window && event.data.type === 'spotify-auth')
      .map((event: MessageEvent) => event.data.authorizationCode)
      .switchMap(code => {
        const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`;
        return this.http.post('https://accounts.spotify.com/api/token', body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          .map(response => response.json())
          .map(data => {
            this.accessToken = data.access_token;
            return data.access_token;
          });
      })
      .catch(error => {
        console.error('Error getting access token:', error);
        return Observable.throw(error);
      });
  }

  // ... other methods for interacting with the Spotify API
}
