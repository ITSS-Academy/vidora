import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlaylistDialogComponent } from '../../dialogs/edit-playlist-dialog/edit-playlist-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';
import { NgClass } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { PlaylistDetailModel } from '../../../models/playlist.model';
import { Store } from '@ngrx/store';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { UserState } from '../../../ngrxs/user/user.state';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';

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
  isGetPlaylistByUserIdSuccess$: Observable<boolean>;
  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{ playlist: PlaylistState; user: UserState }>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.user$ = this.store.select('user', 'user');
    this.playlistDetail$ = this.store.select('playlist', 'playlistDetail');
    this.isGetPlaylistByUserIdSuccess$ = this.store.select(
      'playlist',
      'isGetPlaylistByUserIdSuccess',
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('user', 'user').subscribe((user: UserModel) => {
        if (user.id) {
          this.user = user;
        }
      }),
      this.activatedRoute.queryParamMap.subscribe((params) => {
        const list = params.get('list');
        this.store.dispatch(
          PlaylistActions.getPlaylistById({ id: list as string }),
        );
      }),
      this.playlistDetail$.subscribe((playlistDetail) => {
        if (playlistDetail) {
          this.playlistDetail = playlistDetail;
        }
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
