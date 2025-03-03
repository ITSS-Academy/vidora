import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import {Router} from '@angular/router';
import {EditPlaylistDialogComponent} from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {VideoCardHorizontalComponent} from '../../components/video-card-horizontal/video-card-horizontal.component';
import {NgClass} from '@angular/common';


@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule, VideoCardHorizontalComponent,NgClass],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss',
})
export class PlaylistDetailComponent {
  playlist = {
    title: 'Playlist 1',
    image:
      'https://i.ytimg.com/vi/a2jNL1Jusi0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC-YRu9VYrK8L8ayV6jwb80hcwD1g',
  };
  showOverlay: any;
  constructor(private router: Router, private dialog: MatDialog) {}

  editPlaylist() {
    const dialogRef = this.dialog.open(EditPlaylistDialogComponent);
  }

  onMouseEnter() {
    this.showOverlay = true;
  }

  onMouseLeave() {
    this.showOverlay = false;
  }

  playAll() {
    console.log('Play All clicked');
  }

  viewFullPlaylist() {
    this.router.navigate(['/playlist'], {
      queryParams: { list: 'playlistId' },
    });
  }
}
