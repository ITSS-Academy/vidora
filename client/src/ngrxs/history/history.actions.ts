import { createAction, props } from '@ngrx/store';
import { HistoryModel } from '../../models/history.model';

export const getHistoryByUserId = createAction(
  '[History] Get History By User Id',
  props<{ userId: string }>(),
);

export const getHistoryByUserIdSuccess = createAction(
  '[History] Get History By User Id Success',
  props<{ history: HistoryModel[] }>(),
);

export const getHistoryByUserIdFailure = createAction(
  '[History] Get History By User Id Failure',
  props<{ error: string }>(),
);

export const clearHistoryByUserId = createAction(
  '[History] Clear History By User Id',
  props<{ userId: string }>(),
);

export const clearHistoryByUserIdSuccess = createAction(
  '[History] Clear History By User Id Success',
);

export const clearHistoryByUserIdFailure = createAction(
  '[History] Clear History By User Id Failure',
  props<{ error: string }>(),
);

export const removeVideoFromHistory = createAction(
  '[History] Remove Video From History',
  props<{ userId: string; videoId: string }>(),
);

export const removeVideoFromHistorySuccess = createAction(
  '[History] Remove Video From History Success',
);

export const removeVideoFromHistoryFailure = createAction(
  '[History] Remove Video From History Failure',
  props<{ error: string }>(),
);

export const searchHistoryByUserId = createAction(
  '[History] Search History By User Id',
  props<{ userId: string; search: string }>(),
);

export const searchHistoryByUserIdSuccess = createAction(
  '[History] Search History By User Id Success',
  props<{ history: HistoryModel[] }>(),
);

export const searchHistoryByUserIdFailure = createAction(
  '[History] Search History By User Id Failure',
  props<{ error: string }>(),
);

export const clearState = createAction('[History] Clear State');
