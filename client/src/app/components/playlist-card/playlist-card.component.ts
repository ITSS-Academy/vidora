import { Component, inject, Input } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { EditPlaylistDialogComponent } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistModel } from '../../../models/playlist.model';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [MaterialModule, NgClass],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent {
  @Input() playlist!: PlaylistModel;

  readonly dialog = inject(MatDialog);
  showOverlay: boolean = false;

  constructor(private router: Router) {}

  editPlaylist() {
    const dialogRef = this.dialog.open(EditPlaylistDialogComponent);
  }

  onMouseEnter() {
    this.showOverlay = true;
  }

  onMouseLeave() {
    this.showOverlay = false;
  }

  playAll(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['watch'], {
      queryParams: {
        v: this.playlist.video_id[0],
        list: this.playlist.id,
        index: 0,
      },
    });
  }

  viewFullPlaylist(event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/playlist'], {
      queryParams: { list: this.playlist.id },
    });
  }
}
