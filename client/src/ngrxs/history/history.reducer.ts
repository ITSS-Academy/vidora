import { createReducer, on } from '@ngrx/store';
import { HistoryState } from './history.state';
import * as HistoryActions from './history.actions';

const initialState: HistoryState = {
  history: [],

  isGettingAllVideosInHistory: false,
  isGettingAllVideosInHistorySuccess: false,
  getAllVideosInHistoryErrorMessages: '',

  isClearingHistory: false,
  isClearHistorySuccess: false,
  clearHistoryErrorMessages: '',

  isRemovingVideoFromHistory: false,
  isRemoveVideoFromHistorySuccess: false,
  removeVideoFromHistoryErrorMessages: '',

  isSearchingHistory: false,
  isSearchHistorySuccess: false,
  searchHistoryErrorMessages: '',
};

export const historyReducer = createReducer(
  initialState,
  on(HistoryActions.getHistoryByUserId, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isGettingAllVideosInHistory: true,
    };
  }),

  on(HistoryActions.getHistoryByUserIdSuccess, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isGettingAllVideosInHistory: false,
      isGettingAllVideosInHistorySuccess: true,
      history: action.history,
    };
  }),

  on(HistoryActions.getHistoryByUserIdFailure, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isGettingAllVideosInHistory: false,
      getAllVideosInHistoryErrorMessages: action.error,
    };
  }),

  on(HistoryActions.clearHistoryByUserId, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isClearingHistory: true,
    };
  }),

  on(HistoryActions.clearHistoryByUserIdSuccess, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isClearingHistory: false,
      isClearHistorySuccess: true,
    };
  }),

  on(HistoryActions.clearHistoryByUserIdFailure, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isClearingHistory: false,
      clearHistoryErrorMessages: action.error,
    };
  }),

  on(HistoryActions.removeVideoFromHistory, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isRemovingVideoFromHistory: true,
    };
  }),

  on(HistoryActions.removeVideoFromHistorySuccess, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isRemovingVideoFromHistory: false,
      isRemoveVideoFromHistorySuccess: true,
    };
  }),

  on(HistoryActions.removeVideoFromHistoryFailure, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isRemovingVideoFromHistory: false,
      removeVideoFromHistoryErrorMessages: action.error,
    };
  }),

  on(HistoryActions.searchHistoryByUserId, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isSearchingHistory: true,
    };
  }),

  on(HistoryActions.searchHistoryByUserIdSuccess, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isSearchingHistory: false,
      isSearchHistorySuccess: true,
      history: action.history,
    };
  }),

  on(HistoryActions.searchHistoryByUserIdFailure, (state, action) => {
    console.log(action.type);
    return <HistoryState>{
      ...state,
      isSearchingHistory: false,
      searchHistoryErrorMessages: action.error,
    };
  }),

  on(HistoryActions.clearState, (state) => {
    return <HistoryState>{
      ...state,
      isGettingAllVideosInHistory: false,
      isGettingAllVideosInHistorySuccess: false,
      getAllVideosInHistoryErrorMessages: '',

      isClearingHistory: false,
      isClearHistorySuccess: false,
      clearHistoryErrorMessages: '',

      isRemovingVideoFromHistory: false,
      isRemoveVideoFromHistorySuccess: false,
      removeVideoFromHistoryErrorMessages: '',

      isSearchingHistory: false,
      isSearchHistorySuccess: false,
      searchHistoryErrorMessages: '',
    };
  }),
);
