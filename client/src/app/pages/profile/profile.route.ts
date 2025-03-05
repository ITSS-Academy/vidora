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
        redirectTo: 'videos',
        pathMatch: 'full',
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
