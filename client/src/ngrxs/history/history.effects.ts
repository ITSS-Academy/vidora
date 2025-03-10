import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError } from 'rxjs/operators';
import * as HistoryActions from './history.actions';
import { HistoryService } from '../../services/history.service';

export const getHistoryByUserId$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const historyService = inject(HistoryService);
    return actions$.pipe(
      ofType(HistoryActions.getHistoryByUserId),
      exhaustMap((action) => {
        return historyService.getAllHistory(action.userId).pipe(
          map((response) =>
            HistoryActions.getHistoryByUserIdSuccess({
              history: response,
            }),
          ),
          catchError((obj) => {
            return of(
              HistoryActions.getHistoryByUserIdFailure({
                error: obj.error.message,
              }),
            );
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const clearHistoryByUserId$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const historyService = inject(HistoryService);
    return actions$.pipe(
      ofType(HistoryActions.clearHistoryByUserId),
      exhaustMap((action) => {
        return historyService.clearHistory(action.userId).pipe(
          map((response) => HistoryActions.clearHistoryByUserIdSuccess()),
          catchError((obj) => {
            return of(
              HistoryActions.clearHistoryByUserIdFailure({
                error: obj.error.message,
              }),
            );
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const removeVideoFromHistory$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const historyService = inject(HistoryService);
    return actions$.pipe(
      ofType(HistoryActions.removeVideoFromHistory),
      exhaustMap((action) => {
        return historyService
          .removeVideoFromHistory(action.userId, action.videoId)
          .pipe(
            map((response) => HistoryActions.removeVideoFromHistorySuccess()),
            catchError((obj) => {
              return of(
                HistoryActions.removeVideoFromHistoryFailure({
                  error: obj.error.message,
                }),
              );
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const searchHistoryByUserId$ = createEffect(
  () => {
    const actions$ = inject(Actions);
    const historyService = inject(HistoryService);
    return actions$.pipe(
      ofType(HistoryActions.searchHistoryByUserId),
      exhaustMap((action) => {
        return historyService.searchHistory(action.userId, action.search).pipe(
          map((response) =>
            HistoryActions.searchHistoryByUserIdSuccess({
              history: response,
            }),
          ),
          catchError((obj) => {
            return of(
              HistoryActions.searchHistoryByUserIdFailure({
                error: obj.error.message,
              }),
            );
          }),
        );
      }),
    );
  },
  { functional: true },
);
