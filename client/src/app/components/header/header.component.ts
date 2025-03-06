import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MaterialModule } from '../../../shared/modules/material.module';
import { SharedModule } from '../../../shared/modules/shared.module';
import { AuthState } from '../../../ngrxs/auth/auth.state';
import { Store } from '@ngrx/store';
import { UserState } from '../../../ngrxs/user/user.state';
import * as AuthActions from '../../../ngrxs/auth/auth.actions';
import * as UserActions from '../../../ngrxs/user/user.actions';
import { Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { CreateVideoDialogComponent } from '../../dialogs/create-video-dialog/create-video-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '../../../services/theme.service';
import { VideoState } from '../../../ngrxs/video/video.state';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, SharedModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  user$: Observable<UserModel>;
  isInputFocused: boolean = false;
  searchText: string = '';
  readonly dialog = inject(MatDialog);
  @Output() menuClick = new EventEmitter<void>();

  constructor(
    private store: Store<{
      auth: AuthState;
      user: UserState;
      video: VideoState;
    }>,
    public themeService: ThemeService,
    private router: Router,
  ) {
    this.user$ = this.store.select('user', 'user');
  }

  onMenuClick(): void {
    this.menuClick.emit();
  }

  onFocus() {
    this.isInputFocused = true;
  }

  onBlur() {
    this.isInputFocused = false;
  }

  openCreateVideoDialog() {
    const dialogRef = this.dialog.open(CreateVideoDialogComponent, {
      minWidth: '1000px',
      disableClose: true,
    });
  }

  clearSearch() {
    this.searchText = '';
  }

  search() {
    if (this.searchText === '') {
      return;
    }
    // trim search text
    this.searchText = this.searchText.trim();
    this.store.dispatch(VideoActions.searchVideos({ search: this.searchText }));
    this.router.navigate(['/search']);
  }

  signInWithGoogle() {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  signOut() {
    this.store.dispatch(AuthActions.signOut());
    this.store.dispatch(UserActions.clearState());
    this.store.dispatch(UserActions.clearState());
  }
}
