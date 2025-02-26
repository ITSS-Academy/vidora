import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.route').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./pages/history/history.route').then((m) => m.HISTORY_ROUTES),
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('./pages/subscriptions/subscriptions.route').then(
        (m) => m.SUBSCRIPTIONS_ROUTES,
      ),
  },
  {
    path: 'watch',
    loadChildren: () =>
      import('./pages/watch/watch.route').then((m) => m.WATCH_ROUTES),
  },
  {
    path: 'playlists',
    loadChildren: () =>
      import('./pages/playlist/playlist.route').then((m) => m.PLAYLIST_ROUTES),
  },
  {
    path: 'playlist',
    loadChildren: () =>
      import('./pages/playlist-detail/playlist-detail.route').then(
        (m) => m.PLAYLIST_DETAIL_ROUTES,
      ),
  },
  {
    path: 'watch-later',
    loadChildren: () =>
      import('./pages/watch-later/watch-later.route').then(
        (m) => m.WATCH_LATER_ROUTES,
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./pages/profile/profile.route').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'search',
    loadChildren: () =>
      import('./pages/search/search.route').then((m) => m.SEARCH_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
