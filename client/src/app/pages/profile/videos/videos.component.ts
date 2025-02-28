import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {VideoCardVerticalComponent} from "../../../components/video-card-vertical/video-card-vertical.component";
import {Observable, Subscription} from 'rxjs';
import {VideoState} from '../../../../ngrxs/video/video.state';
import {Store} from '@ngrx/store';
import {VideoModel} from '../../../../models/video.model';

import * as VideoActions from '../../../../ngrxs/video/video.actions';
@Component({
  selector: 'app-videos',
  standalone: true,
    imports: [
        AsyncPipe,
        CdkFixedSizeVirtualScroll,
        CdkVirtualScrollViewport,
        VideoCardVerticalComponent
    ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit {
  videos$: Observable<VideoModel[]>;

  constructor(
    private store: Store<{
      video: VideoState
    }>,
    private cdr: ChangeDetectorRef,
  ) {
    this.videos$ = this.store.select((state) => state.video.videos);
  }

  ngOnInit() {
    this.store.dispatch(VideoActions.getAllVideos());
  }

  trackByFn(index: number, item: VideoModel): string {
    return item.id;
  }
}
