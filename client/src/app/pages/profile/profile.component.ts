import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, filter, Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MoreInfoDialogComponent } from '../../dialogs/more-info-dialog/more-info-dialog.component';
import { Store } from '@ngrx/store';
import { UserModel } from '../../../models/user.model';
import { UserState } from '../../../ngrxs/user/user.state';
import { CustomizeProfileDialogComponent } from '../../dialogs/customize-profile-dialog/customize-profile-dialog.component';
import * as UserActions from '../../../ngrxs/user/user.actions';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  activeTabIndex = 0;
  userProfile$: Observable<UserModel>;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<{ user: UserState }>,
  ) {
    this.userProfile$ = this.store.select((state) => state.user.user);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.url.subscribe((url) => {
        const path = this.route.snapshot.firstChild?.url[0]?.path;
        switch (path) {
          case 'videos':
            this.activeTabIndex = 0;
            break;
          case 'playlists':
            this.activeTabIndex = 1;
            break;
        }
      }),
      combineLatest([
        this.store.select((state) => state.user.isUpdateChannelImageSuccess),
        this.store.select((state) => state.user.isUpdateAvatarSuccess),
        this.store.select((state) => state.user.isUpdateDescribeSuccess),
      ])
        .pipe(
          filter(
            ([
              isUpdateChannelImageSuccess,
              isUpdateAvatarSuccess,
              isUpdateDescribeSuccess,
            ]) =>
              isUpdateChannelImageSuccess ||
              isUpdateAvatarSuccess ||
              isUpdateDescribeSuccess,
          ),
        )
        .subscribe(() => {
          this.store.dispatch(UserActions.getUserById());
        }),
    );
  }

  openMoreInfoDialog() {
    this.dialog.open(MoreInfoDialogComponent);
  }

  onCustomizeProfileDialog() {
    this.dialog.open(CustomizeProfileDialogComponent, {
      minWidth: 800,
      minHeight: 600,
    });
  }

  onTabChange(event: any) {
    const tabIndex = event.index;
    let route = '';
    switch (tabIndex) {
      case 0:
        route = 'profile/videos';
        break;
      case 1:
        route = 'profile/playlists';
        break;
    }
    this.router.navigate([route]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
