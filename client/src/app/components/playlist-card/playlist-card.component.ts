import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { MatDialog } from '@angular/material/dialog';
import { EditPlaylistDialogComponent } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { PlaylistModel } from '../../../models/playlist.model';
import { Store } from '@ngrx/store';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { AlertService } from '../../../services/alert.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-playlist-card',
  standalone: true,
  imports: [MaterialModule, NgClass],
  templateUrl: './playlist-card.component.html',
  styleUrl: './playlist-card.component.scss',
})
export class PlaylistCardComponent implements OnInit, OnDestroy {
  @Input() playlist!: PlaylistModel;

  readonly dialog = inject(MatDialog);
  showOverlay: boolean = false;
  isDeletePlaylistByIdSuccess$: Observable<boolean>;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private store: Store<{ playlist: PlaylistState }>,
    private alertService: AlertService,
  ) {
    this.isDeletePlaylistByIdSuccess$ = this.store.select(
      (state) => state.playlist.isDeletePlaylistByIdSuccess,
    );
  }

  ngOnInit() {}

  editPlaylist() {
    const dialogRef = this.dialog.open(EditPlaylistDialogComponent, {
      data: { playlist: this.playlist },
    });
  }

  deleteDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this playlist?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          PlaylistActions.deletePlaylistById({ playlistId: this.playlist.id }),
        );
        // Perform deletion logic here
      } else {
        console.log('User cancelled deletion');
      }
    });
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

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
