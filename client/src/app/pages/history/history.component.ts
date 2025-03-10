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
import * as AuthActions from '../../../ngrxs/auth/auth.actions';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { AlertService } from '../../../services/alert.service';
import { AuthState } from '../../../ngrxs/auth/auth.state';

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
  user$!: Observable<UserModel>;
  isGettingAllVideosInHistory$: Observable<boolean>;
  search = '';
  isCheckLogin$!: Observable<boolean>;

  constructor(
    private store: Store<{
      history: HistoryState;
      user: UserState;
      auth: AuthState;
    }>,
    private dialog: MatDialog, // Inject MatDialog
    private alertService: AlertService, // Inject AlertService
  ) {
    this.videos$ = this.store.select((state) => state.history.history);
    this.isGettingAllVideosInHistory$ = this.store.select(
      (state) => state.history.isGettingAllVideosInHistory,
    );
    this.user$ = this.store.select((state) => state.user.user);
    this.isCheckLogin$ = this.store.select(
      (state) => state.auth.isCheckLoggedIn,
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
      this.store
        .select('history', 'isClearHistorySuccess')
        .subscribe((isClearHistorySuccess: boolean) => {
          if (isClearHistorySuccess) {
            this.store.dispatch(HistoryActions.clearState());
            this.alertService.showAlert(
              `All history has been cleared`,
              'Close',
              3000,
              'end',
              'top',
            );
            this.store.dispatch(
              HistoryActions.getHistoryByUserId({
                userId: this.user?.id as any,
              }),
            );
          }
        }),
      this.store
        .select('history', 'isRemoveVideoFromHistorySuccess')
        .subscribe((isRemoveVideoFromHistorySuccess: boolean) => {
          if (isRemoveVideoFromHistorySuccess) {
            this.store.dispatch(HistoryActions.clearState());

            this.alertService.showAlert(
              `Video has been removed from history`,
              'Close',
              3000,
              'end',
              'top',
            );
            this.store.dispatch(
              HistoryActions.getHistoryByUserId({
                userId: this.user?.id as any,
              }),
            );
          }
        }),
    );
  }

  clearAllHistory(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to clear all history?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.user?.id) {
        this.store.dispatch(
          HistoryActions.clearHistoryByUserId({ userId: this.user.id }),
        );
      }
    });
  }

  searchVideos(): void {
    if (this.search !== '') {
      if (this.user?.id) {
        this.store.dispatch(
          HistoryActions.searchHistoryByUserId({
            userId: this.user.id,
            search: this.search,
          }),
        );
      }
    } else {
      if (this.user?.id) {
        this.store.dispatch(
          HistoryActions.getHistoryByUserId({ userId: this.user.id }),
        );
      }
    }
  }

  signInWithGoogle(): void {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
