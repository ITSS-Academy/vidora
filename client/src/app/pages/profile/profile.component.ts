import { Component, OnInit} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Router, ActivatedRoute } from '@angular/router';
import { VideoCardVerticalComponent } from '../../components/video-card-vertical/video-card-vertical.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MoreInfoDialogComponent } from '../../dialogs/more-info-dialog/more-info-dialog.component';
import { Store } from '@ngrx/store';
import { getUserById } from '../../../ngrxs/user/user.actions';
import { UserModel } from '../../../models/user.model';
import {UserState} from '../../../ngrxs/user/user.state';
import {
  CustomizeProfileDialogComponent
} from '../../dialogs/customize-profile-dialog/customize-profile-dialog.component';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule, VideoCardVerticalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  videos$: Observable<unknown> | undefined;
  activeTabIndex = 0;
  userProfile$: Observable<UserModel>;



  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store<
    { user: UserState }>,
  ) {
    this.userProfile$ = this.store.select((state) => state.user.user);
  }

  ngOnInit() {
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
    });

  }

  openMoreInfoDialog() {
    this.dialog.open(MoreInfoDialogComponent)
  }

  onCustomizeProfileDialog() {
    this.dialog.open(CustomizeProfileDialogComponent)
  }

  onTabChange(event: any) {
    const tabIndex = event.index;
    let route = '';
    switch (tabIndex) {
      // case 0:
      //   route = 'profile/featured';
      //   break;
      case 0:
        route = 'profile/videos';
        break;
      case 1:
        route = 'profile/playlists';
        break;
    }
    this.router.navigate([route]);
  }
}
