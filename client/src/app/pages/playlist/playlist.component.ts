import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { PlaylistCardComponent } from '../../components/playlist-card/playlist-card.component';
import { Store } from '@ngrx/store';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { Observable, Subscription } from 'rxjs';
import { PlaylistModel } from '../../../models/playlist.model';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { UserState } from '../../../ngrxs/user/user.state';
import { UserModel } from '../../../models/user.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule, PlaylistCardComponent],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
})
export class PlaylistComponent implements OnInit, OnDestroy {
  playlists$!: Observable<PlaylistModel[]>;
  user!: UserModel;
  subscriptions: Subscription[] = [];
  isGetPlaylistByUserIdSuccess$!: Observable<boolean>;
  isDeletePlaylistByIdSuccess$!: Observable<boolean>;
  isUpsertPlaylistByIdSuccess$!: Observable<boolean>;
  @Input() playlist!: PlaylistModel;

  constructor(
    private store: Store<{ playlist: PlaylistState; user: UserState }>,
    private alertService: AlertService,
  ) {
    this.playlists$ = this.store.select('playlist', 'playlists');
    this.isDeletePlaylistByIdSuccess$ = this.store.select(
      (state) => state.playlist.isDeletingPlaylistById,
    );
    this.isUpsertPlaylistByIdSuccess$ = this.store.select(
      (state) => state.playlist.isUpsertPlaylistByIdSuccess,
    );
    this.isGetPlaylistByUserIdSuccess$ = this.store.select(
      (state) => state.playlist.isGetPlaylistByUserIdSuccess,
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('user', 'user').subscribe((user: UserModel) => {
        if (user.id) {
          this.user = user;
        }
      }),
      this.store
        .select('user', 'isGetUserSuccess')
        .subscribe((isGetUserSuccess) => {
          if (isGetUserSuccess) {
            this.store.dispatch(
              PlaylistActions.getPlaylistByUserId({
                id: this.user.id,
              }),
            );
          }
        }),
      this.isDeletePlaylistByIdSuccess$.subscribe((isSuccess) => {
        console.log('isSuccess', isSuccess);
        if (isSuccess) {
          this.alertService.showAlert(
            `Playlist has been deleted`,
            'Close',
            3000,
            'end',
            'top',
          );
          this.store.dispatch(
            PlaylistActions.getPlaylistByUserId({
              id: this.user.id,
            }),
          );
          this.store.dispatch(PlaylistActions.clearPlaylistState());
        }
      }),

      this.isUpsertPlaylistByIdSuccess$.subscribe((isSuccess) => {
        if (isSuccess) {
          this.alertService.showAlert(
            `Playlist has been updated`,
            'Close',
            3000,
            'end',
            'top',
          );
          this.store.dispatch(
            PlaylistActions.getPlaylistByUserId({
              id: this.user.id,
            }),
          );
          this.store.dispatch(PlaylistActions.clearPlaylistState());
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
