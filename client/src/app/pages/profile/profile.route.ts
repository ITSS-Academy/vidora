import { Routes } from '@angular/router';
import { FeaturedComponent } from './featured/featured.component';
import { VideosComponent } from './videos/videos.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        redirectTo: 'featured',
        pathMatch: 'full',
      },
      {
        path: 'featured',
        component: FeaturedComponent,
      },
      {
        path: 'videos',
        component: VideosComponent,
      },
      {
        path: 'playlists',
        component: PlaylistsComponent,
      },
    ],
  },
];
