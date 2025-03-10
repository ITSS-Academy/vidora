import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PlaylistCardComponent} from '../../../components/playlist-card/playlist-card.component';
import {PlaylistService} from '../../../../services/playlist.service';
import {AsyncPipe} from '@angular/common';
import {Observable, Subscription} from 'rxjs';
import {PlaylistModel} from '../../../../models/playlist.model';
import {Store} from '@ngrx/store';
import {PlaylistState} from '../../../../ngrxs/playlist/playlist.state';

import * as PlaylistActions from '../../../../ngrxs/playlist/playlist.actions';
import {VideoCardVerticalComponent} from '../../../components/video-card-vertical/video-card-vertical.component';
import {PlaylistComponent} from '../../playlist/playlist.component';
import {UserModel} from '../../../../models/user.model';
import {UserState} from '../../../../ngrxs/user/user.state';
import {AlertService} from '../../../../services/alert.service';
import {CdkFixedSizeVirtualScroll} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-playlists',
  standalone: true,
  imports: [PlaylistCardComponent, AsyncPipe, VideoCardVerticalComponent, PlaylistComponent, CdkFixedSizeVirtualScroll],
  templateUrl: './playlists.component.html',
  styleUrl: './playlists.component.scss'
})
export class PlaylistsComponent implements OnInit {
  playlists$: Observable<PlaylistModel[]>;
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
