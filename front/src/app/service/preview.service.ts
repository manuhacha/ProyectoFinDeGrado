import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//Servicio para comunicar el id de los albumes entre home y /preview

export class PreviewService {

  albumid = ''

  constructor() { }

  getAlbumId() {
    return this.albumid
  }
  sendAlbumId(id:any) {
    this.albumid = id
  }
}
