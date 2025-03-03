import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';
import { UserModel } from '../../../models/user.model';
import { Observable, Subscription } from 'rxjs';
import { PlaylistDetailModel } from '../../../models/playlist.model';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { UserState } from '../../../ngrxs/user/user.state';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';

@Component({
  selector: 'app-watch-later',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
  ],
  templateUrl: './watch-later.component.html',
  styleUrl: './watch-later.component.scss',
})
export class WatchLaterComponent implements OnInit, OnDestroy {
  user!: UserModel;
  user$: Observable<UserModel | null>;
  playlistDetail$: Observable<PlaylistDetailModel>;
  playlistDetail!: PlaylistDetailModel;

  private subscriptions: Subscription[] = [];

  constructor(
    private store: Store<{ playlist: PlaylistState; user: UserState }>,
    private router: Router,
  ) {
    this.playlistDetail$ = this.store.select('playlist', 'playlistDetail');
    this.user$ = this.store.select('user', 'user');
  }

  ngOnInit() {
    this.subscriptions.push(
      this.user$.subscribe((user) => {
        if (user) {
          this.user = user;
          this.store.dispatch(
            PlaylistActions.getWatchLaterPlaylistByUserId({ userId: user.id }),
          );
        }
      }),
      this.playlistDetail$.subscribe((playlistDetail) => {
        this.playlistDetail = playlistDetail;
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(PlaylistActions.clearPlaylistState());
  }
}
