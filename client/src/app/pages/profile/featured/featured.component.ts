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
import {VideoCardVerticalComponent} from '../../../components/video-card-vertical/video-card-vertical.component';

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
    VideoCardVerticalComponent,
  ],
  templateUrl: './featured.component.html',
  styleUrl: './featured.component.scss',
})
export class FeaturedComponent {
  readonly dialog = inject(MatDialog);

  playlistDialog() {
    const dialogRef = this.dialog.open(PlaylistDialogComponent);
  }

  video = {
    title: 'Hòm 300$ Và Khẩu OP Dragon Lore 100 Củ Của Tôi... /SKINCLUB/',
    imageUrl: 'https://i.ytimg.com/vi/8aY26OAbfEI/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLCdFxVJBg0_py36IhkKFh4eZiEvxA',
    views: '1K views',
    timeAgo: '1 hour ago'
  };


}
