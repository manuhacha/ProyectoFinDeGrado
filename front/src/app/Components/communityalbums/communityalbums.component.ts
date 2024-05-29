import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { AlbumsService } from '../../service/albums.service';

@Component({
  selector: 'app-communityalbums',
  standalone: true,
  imports: [NgFor],
  templateUrl: './communityalbums.component.html',
  styleUrl: './communityalbums.component.css'
})
export class CommunityalbumsComponent {

  albums: any[] = []
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(private service: AlbumsService) { }

  //Obtenemos todos los albumes de la comunidad a traves del servicio
  ngOnInit() {
    this.service.getCommunityAlbums()
      .subscribe({
        next: (res) => {
          this.albums = res
          console.log(this.albums[0].link)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  // Métodos de paginación
  get paginatedAlbums(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.albums.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  totalPages(): number {
    return Math.ceil(this.albums.length / this.itemsPerPage);
  }
}
