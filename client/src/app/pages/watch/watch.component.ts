import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { VideoModel } from '../../../models/video.model';
import { PlaylistDetailModel } from '../../../models/playlist.model';
import { UserModel } from '../../../models/user.model';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { UserState } from '../../../ngrxs/user/user.state';
import { VideoState } from '../../../ngrxs/video/video.state';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Store } from '@ngrx/store';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import * as CommentActions from '../../../ngrxs/comment/comment.actions';
import { filter, map, take } from 'rxjs/operators';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';
import { CommentState } from '../../../ngrxs/comment/comment.state';
import { CommentCardComponent } from '../../components/comment-card/comment-card.component';
import {CommentModel, CreateCommentDto} from '../../../models/comment.model';
import { AuthState } from '../../../ngrxs/auth/auth.state';
import {NgForOf, NgIf} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {signInWithGoogle} from '../../../ngrxs/auth/auth.actions';
import {Auth} from '@angular/fire/auth';
import {AuthService} from '../../../services/auth.service';
import * as AuthActions from '../../../ngrxs/auth/auth.actions';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
    CommentCardComponent,
    CommentCardComponent,
    NgIf,
    NgForOf,
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit, OnDestroy {
  @ViewChild('media', { static: true }) media!: ElementRef;
  isDescriptionExpanded = false;
  videoId!: string;
  listId!: string;
  startRadio!: number;
  video$: Observable<VideoModel>;
  playlistDetail$: Observable<PlaylistDetailModel>;
  isGetPlaylistByIdSuccess$: Observable<boolean>;
  user!: UserModel | null;
  isGetVideoSuccess$: Observable<boolean>;
  subscription: Subscription[] = [];
  currentTime: number = 0;
  totalDuration: number = 0;
  totalWatchTime: number = 0;
  isPlaying: boolean = false;
  totalViews: number = 0;
  watchHistory: number[] = [];
  videos$!: Observable<VideoModel[]>;
  filteredVideos$!: Observable<VideoModel[]>;
  comment: string = '';
  createCommentFailure: Observable<string>;
  comments$!: Observable<CommentModel[]>;
  isCheckLogin$!: Observable<boolean>;
  trackByCommentId: any;
  user$: Observable<UserModel | null> | undefined;



  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<{
      video: VideoState;
      user: UserState;
      playlist: PlaylistState;
      comment: CommentState;
      auth: AuthState;
    }>,
    private vgApi: VgApiService,
    private router: Router,
  ) {
    this.video$ = this.store.select((state) => state.video.video);
    this.isGetVideoSuccess$ = this.store.select(
      (state) => state.video.isGetVideoByIdSuccess,
    );
    this.playlistDetail$ = this.store.select(
      (state) => state.playlist.playlistDetail,
    );
    this.videos$ = this.store.select((state) => state.video.videos);
    this.createCommentFailure = this.store.select(
      (state) => state.comment.createCommentErrorMessage,
    );
    this.comments$ = this.store.select((state) => state.comment.comments);
    this.store.dispatch(VideoActions.getAllVideos());
    this.isGetPlaylistByIdSuccess$ = this.store.select(
      (state) => state.playlist.isGetPlaylistByIdSuccess,
    );
    this.isCheckLogin$ = this.store.select('auth', 'isCheckLoggedIn');
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  ngOnInit(): void {
    this.filteredVideos$ = this.store
      .select((state) => state.video.videos)
      .pipe(
        map((videos) => videos.filter((video) => video.id !== this.videoId)),
      );
    this.subscription.push(
      combineLatest([
        this.store.select('user', 'user'),
        this.activatedRoute.queryParamMap,
      ]).subscribe(([user, params]) => {
        this.user = user;
        this.isCheckLogin$ = this.store
          .select('user', 'user')
          .pipe(map((user) => !!user));
        this.videoId = params.get('v') || '';
        this.listId = params.get('list') || '';
        this.startRadio = Number(params.get('index') || 0);

        // Dispatch action lấy video
        this.store.dispatch(
          VideoActions.getVideoById({
            videoId: this.videoId,
            userId: this.user?.id ? this.user.id : null,
          }),
        );

        // Dispatch action lấy playlist nếu có listId
        if (this.listId) {
          this.store.dispatch(
            PlaylistActions.getPlaylistById({ id: this.listId }),
          );
        }

        // Dispatch action lấy tất cả video
        this.store.dispatch(VideoActions.getAllVideos());

        // Dispatch action lấy comments của video
        this.store.dispatch(
          CommentActions.getCommentsByVideoId({ videoId: this.videoId }),
        );
      }),
      this.isGetVideoSuccess$.subscribe((isGetVideoSuccess) => {
        if (isGetVideoSuccess && this.vgApi) {
          const media = this.vgApi.getDefaultMedia();
          if (media && media.subscriptions) {
            this.setupVideoListeners(media);
          } else {
            console.error('Media or subscriptions is undefined.');
          }
        }
      }),
      this.store
        .select('comment', 'isCreateCommentSuccess')
        .subscribe((isCreateCommentSuccess) => {
          if (isCreateCommentSuccess) {
            this.store.dispatch(
              CommentActions.getCommentsByVideoId({ videoId: this.videoId }),
            );
          }
        }),
    );
  }

  /**
   * Thiết lập các listener để theo dõi thời gian xem video chính xác
   */
  setupVideoListeners(media: any): void {
    // Lấy tổng thời gian của video
    media.subscriptions.loadedMetadata.subscribe(() => {
      this.totalDuration = this.media.nativeElement.duration;
    });

    // Khi video bắt đầu phát
    media.subscriptions.playing.subscribe(() => {
      this.isPlaying = true;
      this.currentTime = this.media.nativeElement.currentTime;
    });

    // Cập nhật thời gian xem khi video phát
    media.subscriptions.timeUpdate.subscribe(() => {
      if (this.isPlaying) {
        const newTime = this.media.nativeElement.currentTime;
        if (newTime > this.currentTime) {
          this.totalWatchTime += newTime - this.currentTime;
        }
        this.currentTime = newTime;
      }
    });

    // Khi video bị tạm dừng
    media.subscriptions.pause.subscribe(() => {
      this.isPlaying = false;
      console.log(
        `Video paused. Total watch time so far: ${this.totalWatchTime}`,
      );
    });

    // Khi video kết thúc
    media.subscriptions.ended.subscribe(() => {
      this.isPlaying = false;
      console.log(`Video ended. Total watch time: ${this.totalWatchTime}`);

      // Nếu người dùng xem trên 30 giây => tính là một lượt xem hợp lệ
      if (this.totalWatchTime >= 30) {
        this.registerView();
      }

      // Reset thời gian xem khi phát lại
      this.totalWatchTime = 0;
      this.currentTime = 0;

      // Play the next video
      this.playNextVideo();
    });
  }

  playNextVideo(): void {
    this.playlistDetail$.pipe(take(1)).subscribe((playlistDetail) => {
      if (
        playlistDetail &&
        playlistDetail.videos &&
        playlistDetail.videos.length > 0
      ) {
        const currentIndex = playlistDetail.videos.findIndex(
          (video) => video.id === this.videoId,
        );
        const nextVideo = playlistDetail.videos[currentIndex + 1];
        if (nextVideo) {
          this.router.navigate(['/watch'], {
            queryParams: {
              v: nextVideo.id,
              list: this.listId,
              index: currentIndex,
            },
          });
        } else {
          console.log('No more videos in the playlist.');
        }
      } else {
        this.filteredVideos$.pipe(take(1)).subscribe((videos) => {
          const currentIndex = videos.findIndex(
            (video) => video.id === this.videoId,
          );
          const nextVideo = videos[currentIndex + 1];
          if (nextVideo) {
            this.router.navigate(['/watch'], {
              queryParams: { v: nextVideo.id },
            });
          } else {
            console.log('No more videos to play.');
          }
          this.store.dispatch(PlaylistActions.clearPlaylistState());
        });
      }
    });
  }

  /**
   * Ghi nhận lượt xem nếu hợp lệ
   */
  registerView(): void {
    const now = Date.now();
    this.watchHistory.push(now);

    // Xóa các lượt xem quá cũ (hơn 5 phút)
    this.watchHistory = this.watchHistory.filter(
      (time) => now - time < 5 * 60 * 1000,
    );

    // Kiểm tra nếu không có spam, tăng số lượt xem và gửi lên server
    if (this.watchHistory.length <= 5) {
      // Giới hạn tối đa 5 lượt xem hợp lệ trong 5 phút
      this.totalViews += 1;
      console.log(
        `Video được tính là một lượt xem hợp lệ (${this.totalViews} lần)`,
      );

      // Gửi lên server cập nhật lượt xem
      this.store.dispatch(VideoActions.increaseViewCount({ id: this.videoId }));
    } else {
      console.log('Phát hiện spam, không tính thêm lượt xem!');
    }
  }

  onPlayerReady(api: VgApiService): void {
    this.vgApi = api; // Lưu trữ API sau khi khởi tạo
  }

  signInWithGoogle() {
    this.store.dispatch(AuthActions.signInWithGoogle());
  }

  onCommentFieldClick(): void {
    if (!this.user?.id) {
      this.signInWithGoogle();

    }
  }

  createComment(): void {
          const newComment: CreateCommentDto = {
            content: this.comment,
            video_id: this.videoId,
            user_id: this.user?.id as string,
          };
          this.store.dispatch(CommentActions.createComment({ comment: newComment }));
          this.comment = '';
        }

  ngOnDestroy(): void {
    if (this.watchHistory.length === 0 && this.totalWatchTime >= 30) {
      this.registerView();
    }
    if (this.user) {
      this.store.dispatch(
        VideoActions.updateWatchTime({
          videoId: this.videoId,
          userId: this.user.id,
          watchTime: this.totalWatchTime,
        }),
      );

      // Lắng nghe updateWatchTimeSuccess rồi mới clearVideo và unsubscribe
      const updateWatchTimeSuccessSub = this.store
        .select('video', 'isUpdateWatchTimeSuccess') // Chọn trạng thái từ store
        .pipe(
          filter((success) => success),
          take(1),
        ) // Lọc khi success = true và lấy duy nhất 1 lần
        .subscribe(() => {
          this.store.dispatch(VideoActions.clearState()); // Chỉ dispatch khi thành công
          this.subscription.forEach((sub) => sub.unsubscribe());
        });
    } else {
      // Nếu không có user thì clear và unsubscribe ngay
      this.store.dispatch(VideoActions.clearState());
      this.subscription.forEach((sub) => sub.unsubscribe());
    }
  }

}
