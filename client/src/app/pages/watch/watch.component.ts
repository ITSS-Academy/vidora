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
import { combineLatestWith, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PlaylistState } from '../../../ngrxs/playlist/playlist.state';
import { UserState } from '../../../ngrxs/user/user.state';
import { VideoState } from '../../../ngrxs/video/video.state';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Store } from '@ngrx/store';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import * as PlaylistActions from '../../../ngrxs/playlist/playlist.actions';
import { filter, take } from 'rxjs/operators';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent implements OnInit, OnDestroy {
  @ViewChild('media', { static: true }) media!: ElementRef;
  isDescriptionExpanded = false;
  videoId!: string;
  listId: string | null = null;
  startRadio: string | null = null;
  video$: Observable<VideoModel>;
  playlistDetail$: Observable<PlaylistDetailModel>;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: Store<{
      video: VideoState;
      user: UserState;
      playlist: PlaylistState;
    }>,
    private vgApi: VgApiService,
  ) {
    this.video$ = this.store.select((state) => state.video.video);
    this.isGetVideoSuccess$ = this.store.select(
      (state) => state.video.isGetVideoByIdSuccess,
    );
    this.playlistDetail$ = this.store.select(
      (state) => state.playlist.playlistDetail,
    );
    this.videos$ = this.store.select((state) => state.video.videos);
    this.store.dispatch(VideoActions.getAllVideos());
  }

  toggleDescription(): void {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }

  ngOnInit(): void {
    this.subscription.push(
      this.activatedRoute.queryParamMap.subscribe((params: any) => {
        this.videoId = params.get('v');
        this.listId = params.get('list');
        this.startRadio = params.get('start_radio');
      }),
      this.store.select('user', 'user').subscribe((user) => {
        this.user = user;
      }),
      this.store
        .select('user', 'isGetUserSuccess')
        .pipe(combineLatestWith(this.store.select('user', 'isGettingUser')))
        .subscribe(([isGetSuccess, isGetting]) => {
          if (isGetSuccess && !isGetting) {
            if (this.user) {
              this.store.dispatch(
                VideoActions.getVideoById({
                  videoId: this.videoId,
                  userId: this.user.id,
                }),
              );
            }
            if (this.listId) {
              this.store.dispatch(
                PlaylistActions.getPlaylistById({ id: this.listId }),
              );
            }
          } else {
            this.store.dispatch(
              VideoActions.getVideoById({
                videoId: this.videoId,
                userId: null,
              }),
            );
          }
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
