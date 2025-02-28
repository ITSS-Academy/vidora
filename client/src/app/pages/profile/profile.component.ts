import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { MaterialModule } from '../../../shared/modules/material.module';
import { VideoModule } from '../../../shared/modules/video.module';
import { Router } from '@angular/router';
import {VideoCardVerticalComponent} from '../../components/video-card-vertical/video-card-vertical.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, MaterialModule, VideoModule, VideoCardVerticalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  videos$: Observable<unknown> | undefined;
  constructor(private router: Router) {}

  onTabChange(event: any) {
    const tabIndex = event.index;
    let route = '';
    switch (tabIndex) {
      case 0:
        route = 'profile/featured';
        break;
      case 1:
        route = 'profile/videos';
        break;
      case 2:
        route = 'profile/playlists';
        break;
    }
    this.router.navigate([route]);
  }
}
