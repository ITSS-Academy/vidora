import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { VideoModel } from '../../../models/video.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { Observable, Subscription } from 'rxjs';
import { UserState } from '../../../ngrxs/user/user.state';
import { UserModel } from '../../../models/user.model';
import { AlertService } from '../../../services/alert.service';
import { SidebarState } from '../../../ngrxs/sidebar/sidebar.state';
import * as HistoryActions from '../../../ngrxs/history/history.actions';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { PlaylistDialogComponent } from '../../dialogs/playlist-dialog/playlist-dialog.component';

@Component({
  selector: 'app-video-card-horizontal',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './video-card-horizontal.component.html',
  styleUrls: ['./video-card-horizontal.component.scss'],
})
export class VideoCardHorizontalComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  subscriptions: Subscription[] = [];
  user$: Observable<UserModel>;
  user!: UserModel;
  isSidebarOpen$!: Observable<boolean>;
  routerLink!: string;

  @Input() video!: VideoModel;
  @Input() playlistId: string | undefined;
  @Input() index!: number;
  @Input() highlight = false;

  constructor(
    private router: Router,
    private store: Store<{
      playlist: PlaylistState;
      user: UserState;
      sidebar: SidebarState;
    }>,
    private alertService: AlertService,
    private renderer: Renderer2,
    private el: ElementRef,
    private dialog: MatDialog, // Inject MatDialog
  ) {
    this.user$ = this.store.select('user', 'user');
    this.isSidebarOpen$ = this.store.select('sidebar', 'isSidebarOpen');
    this.routerLink = this.router.url;
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select('user', 'user').subscribe((user: UserModel) => {
        if (user.id) {
          this.user = user;
        }
      }),
      this.store
        .select('playlist', 'isUpdateWatchLaterPlaylistSuccess')
        .subscribe((isUpdateWatchLaterSuccess) => {
          if (isUpdateWatchLaterSuccess) {
            this.alertService.showAlert(
              'Added to Watch Later',
              'Close',
              3000,
              'end',
              'top',
            );
          }
        }),
      this.store
        .select('playlist', 'isDeleteWatchLaterPlaylistSuccess')
        .subscribe((isRemoveVideoInWatchLaterPlaylistSuccess) => {
          if (isRemoveVideoInWatchLaterPlaylistSuccess) {
            this.alertService.showAlert(
              'Deleted from Watch Later',
              'Close',
              3000,
              'end',
              'top',
            );
          }
        }),
    );
  }

  ngAfterViewInit(): void {
    if (this.router.url.includes('/watch?')) {
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.card'),
        'height',
        'calc(180px / 16 * 9)',
      );
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('#img-container'),
        'width',
        '150px',
      );
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('#img-container'),
        'height',
        'calc(150px / 16 * 9)',
      );
    } else if (this.router.url.includes('/results')) {
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('.card'),
        'height',
        'calc(550px / 16 * 9)',
      );
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('#img-container'),
        'width',
        '520px',
      );
      this.renderer.setStyle(
        this.el.nativeElement.querySelector('#img-container'),
        'height',
        'calc(520px / 16 * 9)',
      );
    }
  }

  onVideoClick(video: VideoModel) {
    if (this.playlistId !== undefined) {
      this.router.navigate(['/watch'], {
        queryParams: { v: video.id, list: this.playlistId, index: this.index },
      });
      return;
    } else {
      this.router.navigate(['/watch'], {
        queryParams: { v: video.id },
      });
      this.store.dispatch(PlaylistActions.clearPlaylistState());
    }
  }

  removeVideoInWatchLaterPlaylist() {
    this.store.dispatch(
      PlaylistActions.deleteWatchLaterPlaylist({
        userId: this.user.id,
        videoId: this.video.id,
      }),
    );
  }

  removeVideoInHistory() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to remove this video from history?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.user?.id) {
        this.store.dispatch(
          HistoryActions.removeVideoFromHistory({
            videoId: this.video.id,
            userId: this.user.id,
          }),
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openPlaylistDialog() {
    const dialogRef = this.dialog.open(PlaylistDialogComponent, {
      data: this.video.id,
      disableClose: true,
    });
  }

  openDialog(event: MouseEvent) {
    event.stopPropagation();
  }

  removeVideoInPlaylist() {
    if (this.user) {
      this.store.dispatch(
        PlaylistActions.deleteVideoInPlaylist({
          playlistId: this.playlistId as string,
          videoId: this.video.id,
        }),
      );
    }
  }

  addToWatchLater() {
    if (this.user) {
      this.store.dispatch(
        PlaylistActions.updateWatchLaterPlaylist({
          videoId: this.video.id,
          userId: this.user.id,
        }),
      );
    }
  }
}
