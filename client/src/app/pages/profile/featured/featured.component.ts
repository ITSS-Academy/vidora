import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardMdImage,
  MatCardSubtitle,
  MatCardTitle,
  MatCardTitleGroup,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { EditPlaylistDialogComponent } from '../../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { PlaylistDialogComponent } from '../../../dialogs/playlist-dialog/playlist-dialog.component';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatCardHeader,
    MatCard,
    MatCardTitle,
    MatCardTitleGroup,
    MatCardContent,
    MatCardSubtitle,
    MatCardMdImage,
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent {
  readonly dialog = inject(MatDialog);

  playlistDialog() {
    const dialogRef = this.dialog.open(PlaylistDialogComponent);
  }
}
