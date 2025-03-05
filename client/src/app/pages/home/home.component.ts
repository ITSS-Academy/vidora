import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Observable, Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CategoryState } from '../../../ngrxs/category/category.state';
import { VideoState } from '../../../ngrxs/video/video.state';
import { Store } from '@ngrx/store';
import * as CategoryActions from '../../../ngrxs/category/category.actions';
import * as VideoActions from '../../../ngrxs/video/video.actions';
import { VideoModel } from '../../../models/video.model';
import { VideoCardVerticalComponent } from '../../components/video-card-vertical/video-card-vertical.component';
import { CategoryModel } from '../../../models/category.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardVerticalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription[] = [];
  categories$: Observable<CategoryModel[]>;
  videos$: Observable<VideoModel[]>;
  isGetCategories$!: Observable<boolean>;
  isGettingAllVideos$!: Observable<boolean>;
  selectedCategory: CategoryModel | null = null;

  @ViewChild('categoryListViewport')
  categoryListViewport!: CdkVirtualScrollViewport;
  isShowLeftButton = false;
  isShowRightButton = true;

  constructor(
    private store: Store<{
      video: VideoState;
      category: CategoryState;
    }>,
    private cdr: ChangeDetectorRef,
  ) {
    this.categories$ = this.store.select((state) => state.category.categories);
    this.videos$ = this.store.select((state) => state.video.videos);
    this.isGetCategories$ = this.store.select(
      (state) => state.category.isGettingAllCategories,
    );
    this.isGettingAllVideos$ = this.store.select(
      (state) => state.video.isGettingAllVideos,
    );
    this.store.dispatch(VideoActions.getAllVideos());
  }

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.getAllCategories());
    this.subscription.push(
      this.videos$.subscribe((videos) => {
        console.log('videos', videos);
      }),
    );
  }

  ngAfterViewInit(): void {
    this.categoryListViewport.elementScrolled().subscribe(() => {
      const currentOffset =
        this.categoryListViewport.measureScrollOffset('start');
      this.isShowLeftButton = currentOffset > 10;
      this.isShowRightButton = currentOffset < 1500;
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }

  scrollRight() {
    const currentOffset =
      this.categoryListViewport.measureScrollOffset('start');
    this.categoryListViewport.scrollTo({
      left: currentOffset + 500,
      behavior: 'smooth',
    });
  }

  scrollLeft() {
    const currentOffset =
      this.categoryListViewport.measureScrollOffset('start');
    this.categoryListViewport.scrollTo({
      left: currentOffset - 500,
      behavior: 'smooth',
    });
  }

  selectCategory(category: CategoryModel) {
    this.selectedCategory = category;
    this.store.dispatch(
      VideoActions.getVideoByCategoryId({ categoryId: category.id }),
    );
  }

  selectAllVideos() {
    this.selectedCategory = null;
    this.store.dispatch(VideoActions.getAllVideos());
  }

  getMaskImage(): string {
    if (this.isShowLeftButton && this.isShowRightButton) {
      return 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0))';
    } else if (this.isShowLeftButton) {
      return 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 20%)';
    } else if (this.isShowRightButton) {
      return 'linear-gradient(to right, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0))';
    }
    return 'none'; // Default case (no mask applied)
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => sub.unsubscribe());
    this.store.dispatch(VideoActions.clearState());
  }
}
