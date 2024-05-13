import { Component } from '@angular/core';
import { AlbumsService } from '../service/albums.service';
import { BandsService } from '../service/bands.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bands',
  standalone: true,
  imports: [NgFor],
  templateUrl: './bands.component.html',
  styleUrl: './bands.component.css'
})
export class BandsComponent {

  bands: any[] = []

  
  constructor(private service: BandsService) { }

  ngOnInit() {
     this.service.getArtists()
      .subscribe({
        next: (res) => {
          this.bands = res
          console.log(res)
        },
        error: (err) => {
          console.log(err)
        }
      })
  }
}
