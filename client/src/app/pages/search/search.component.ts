import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Store } from '@ngrx/store';
import { VideoState } from '../../../ngrxs/video/video.state';
import { Observable } from 'rxjs';
import { VideoModel } from '../../../models/video.model';
import { VideoCardHorizontalComponent } from '../../components/video-card-horizontal/video-card-horizontal.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    SharedModule,
    MaterialModule,
    VideoModule,
    VideoCardHorizontalComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  videos$!: Observable<VideoModel[]>;

  constructor(private store: Store<{ video: VideoState }>) {
    this.videos$ = this.store.select('video', 'videos');
  }
}
