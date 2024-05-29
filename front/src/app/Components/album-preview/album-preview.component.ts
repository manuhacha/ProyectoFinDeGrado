import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PreviewService } from '../../service/preview.service';

@Component({
  selector: 'app-album-preview',
  templateUrl: './album-preview.component.html',
  styleUrls: ['./album-preview.component.css']
})
export class AlbumPreviewComponent implements OnInit {
  albumpreviewurl: SafeResourceUrl = '';
  albumid = '';

  constructor(private pservice: PreviewService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.albumid = this.pservice.getAlbumId();

    // Construimos la url del embed del album
    const albumUrl = `https://open.spotify.com/embed/album/${this.albumid}?utm_source=generator&theme=0`;

    // Sanitiza la URL para poder usarla desde el HTML
    this.albumpreviewurl = this.sanitizer.bypassSecurityTrustResourceUrl(albumUrl);
  }
}

