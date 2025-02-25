import {Component, inject} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import {PlaylistDialogComponent} from '../../dialogs/playlist-dialog/playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-video-card-vertical',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './video-card-vertical.component.html',
  styleUrl: './video-card-vertical.component.scss',
})
export class VideoCardVerticalComponent {
  readonly dialog = inject(MatDialog);
  playlistDialog() {
    const dialogRef = this.dialog.open(PlaylistDialogComponent);
  }

}
