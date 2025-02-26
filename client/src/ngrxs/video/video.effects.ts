import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import * as VideoActions from './video.actions';
import { VideoService } from '../../services/video.service';
import { inject } from '@angular/core';

export const createVideo$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const videoService = inject(VideoService);
    return actions$.pipe(
      ofType(VideoActions.createVideo),
      exhaustMap((action) => {
        return videoService
          .create(action.createVideoDto, action.videoFile, action.imageFile)
          .pipe(
            map(() => {
              return VideoActions.createVideoSuccess();
            }),
            catchError((error) => {
              return of(VideoActions.createVideoFailure({ error: error }));
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const getVideos$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const videoService = inject(VideoService);
    return actions$.pipe(
      ofType(VideoActions.getAllVideos),
      exhaustMap(() => {
        return videoService.getAllVideos().pipe(
          map((videos) => {
            return VideoActions.getAllVideosSuccess({ videos });
          }),
          catchError((error) => {
            return of(VideoActions.getAllVideosFailure({ error: error }));
          }),
        );
      }),
    );
  },
  { functional: true },
);
