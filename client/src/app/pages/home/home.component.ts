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
import { CategoryModel } from '../../../../../../Vita/client/src/models/category.model';
import { Observable, Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CategoryState } from '../../../ngrxs/category/category.state';
import { VideoState } from '../../../ngrxs/video/video.state';
import { Store } from '@ngrx/store';
import * as CategoryActions from '../../../ngrxs/category/category.actions';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  subscription: Subscription[] = [];
  categories$: Observable<CategoryModel[]>;
  isGetCategoriesSuccess: Observable<boolean>;
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
    this.isGetCategoriesSuccess = this.store.select(
      (state) => state.category.isGetAllCategoriesSuccess,
    );
  }

  ngAfterViewInit(): void {
    this.categoryListViewport.elementScrolled().subscribe(() => {
      const currentOffset =
        this.categoryListViewport.measureScrollOffset('start');
      console.log('offset', currentOffset);
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

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.getAllCategories());
    this.subscription.push();
  }

  selectCategory(category: CategoryModel) {
    this.selectedCategory = category;
  }

  selectAllVideos() {
    this.selectedCategory = null;
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
  }
}
