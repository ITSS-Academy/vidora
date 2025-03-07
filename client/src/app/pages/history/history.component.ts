import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Observable, Subscription } from 'rxjs';
import { HistoryModel } from '../../../models/history.model';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { HistoryState } from '../../../ngrxs/history/history.state';
import { UserState } from '../../../ngrxs/user/user.state';
import * as HistoryActions from '../../../ngrxs/history/history.actions';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class HistoryComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  videos$: Observable<HistoryModel[]>;
  user!: UserModel | null;
  isGettingAllVideosInHistory$: Observable<boolean>;

  constructor(
    private store: Store<{
      history: HistoryState;
      user: UserState;
    }>,
  ) {
    this.videos$ = this.store.select((state) => state.history.history);
    this.isGettingAllVideosInHistory$ = this.store.select(
      (state) => state.history.isGettingAllVideosInHistory,
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store
        .select((state) => state.user.user)
        .subscribe((user) => {
          this.user = user;
          if (user.id) {
            this.store.dispatch(
              HistoryActions.getHistoryByUserId({ userId: user.id }),
            );
          }
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
