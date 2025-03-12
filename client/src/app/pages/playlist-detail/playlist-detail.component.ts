import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlaylistDialogComponent } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';
import { NgClass } from '@angular/common';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { PlaylistDetailModel } from '../../../models/playlist.model';
import { Store } from '@ngrx/store';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { UserState } from '../../../ngrxs/user/user.state';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { filter, take } from 'rxjs/operators';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import * as CommentActions from '../../../ngrxs/comment/comment.actions';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-playlist-detail',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
  ],
  templateUrl: './playlist-detail.component.html',
  styleUrl: './playlist-detail.component.scss',
})
export class PlaylistDetailComponent implements OnInit, OnDestroy {
  user$: Observable<UserModel>;
  user!: UserModel;
  playlistDetail$: Observable<PlaylistDetailModel>;
  playlistDetail!: PlaylistDetailModel;
  isGetPlaylistByIdSuccess$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{ playlist: PlaylistState; user: UserState }>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
  ) {
    this.user$ = this.store.select('user', 'user');
    this.playlistDetail$ = this.store.select('playlist', 'playlistDetail');
    this.isGetPlaylistByIdSuccess$ = this.store.select(
      'playlist',
      'isGetPlaylistByIdSuccess',
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('user', 'user').subscribe((user: UserModel) => {
        if (user.id) {
          this.user = user;
        }
      }),

      this.playlistDetail$.subscribe((playlistDetail) => {
        if (playlistDetail) {
          this.playlistDetail = playlistDetail;
        }
      }),
      this.store
        .select('playlist', 'isDeleteVideoInPlaylistSuccess')
        .subscribe((isDeleteVideoInPlaylistSuccess) => {
          if (isDeleteVideoInPlaylistSuccess) {
            this.store.dispatch(PlaylistActions.clearPlaylistState());
            this.alertService.showAlert(
              `Video has been removed from playlist`,
              'Close',
              3000,
              'end',
              'top',
            );
            this.store.dispatch(
              PlaylistActions.getPlaylistById({
                id: this.playlistDetail.playlist.id,
              }),
            );
          }
        }),
      this.store
        .select('user', 'isGetUserSuccess')
        .pipe(
          filter((isGetSuccess) => isGetSuccess),
          take(1),
        )
        .subscribe(() => {
          combineLatest([
            this.activatedRoute.queryParamMap,
            this.store.select('user', 'isGetUserSuccess'),
            this.store.select('user', 'isGettingUser'),
          ]).subscribe(([params, isGetSuccess, isGetting]) => {
            const list = params.get('list') || '';

            if (isGetSuccess && !isGetting) {
              this.store.dispatch(
                PlaylistActions.getPlaylistById({ id: list as string }),
              );
            }
          });
        }),
    );
  }

  playAll() {
    this.router.navigate(['/watch'], {
      queryParams: {
        v: this.playlistDetail.videos[0].id,
        list: this.playlistDetail.playlist.id,
        index: 0,
      },
    });
  }

  playShuffle() {
    const randomIndex = Math.floor(
      Math.random() * this.playlistDetail.videos.length,
    );
    this.router.navigate(['/watch'], {
      queryParams: {
        v: this.playlistDetail.videos[randomIndex].id,
        list: this.playlistDetail.playlist.id,
        index: randomIndex,
      },
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PlaylistActions.clearPlaylistState());
  }
}
