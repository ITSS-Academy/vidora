import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Store } from '@ngrx/store';
import { SidebarState } from '../../../ngrxs/sidebar/sidebar.state';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-card-vertical-skeleton',
  standalone: true,
  imports: [NgxSkeletonLoaderModule],
  templateUrl: './video-card-vertical-skeleton.component.html',
  styleUrl: './video-card-vertical-skeleton.component.scss',
})
export class VideoCardVerticalSkeletonComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isSidebarOpen$!: Observable<boolean>;
  skeletonWidth: string = '420px';

  constructor(
    private store: Store<{ sidebar: SidebarState }>,
    private router: Router,
  ) {
    this.isSidebarOpen$ = this.store.select('sidebar', 'isSidebarOpen');
  }

  ngOnInit() {
    this.isSidebarOpen$.subscribe((isSidebarOpen) => {
      if (isSidebarOpen) {
        if (this.router.url.includes('/profile/videos')) {
          this.skeletonWidth = '290px';
        } else if (this.router.url.includes('/home')) {
          this.skeletonWidth = '420px';
        }
      } else {
        if (this.router.url.includes('/profile/videos')) {
          this.skeletonWidth = '320px';
        } else if (this.router.url.includes('/home')) {
          this.skeletonWidth = '340px';
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  protected readonly top = top;
}
