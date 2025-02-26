import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { EditPlaylistDialogComponent } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [MaterialModule, NgClass],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  playlist = {
    title: 'Playlist 1',
    image:
      'https://i.ytimg.com/vi/a2jNL1Jusi0/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLC-YRu9VYrK8L8ayV6jwb80hcwD1g',
  };

  readonly dialog = inject(MatDialog);

  editPlaylist() {

    const dialogRef = this.dialog.open(EditPlaylistDialogComponent);
  }
  showOverlay: boolean = false;

  // Handle mouse enter and leave events
  onMouseEnter() {
    this.showOverlay = true;
  }

  onMouseLeave() {
    this.showOverlay = false;
  }

  // Handle the "Play All" click event
  playAll() {
    console.log('Play All clicked');
    // Implement your play functionality here
  }

}
