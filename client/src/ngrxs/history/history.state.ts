import { HistoryModel } from '../../models/history.model';

export interface HistoryState {
  history: HistoryModel[];

  isGettingAllVideosInHistory: boolean;
  isGettingAllVideosInHistorySuccess: boolean;
  getAllVideosInHistoryErrorMessages: string;

  isClearingHistory: boolean;
  isClearHistorySuccess: boolean;
  clearHistoryErrorMessages: string;

  isRemovingVideoFromHistory: boolean;
  isRemoveVideoFromHistorySuccess: boolean;
  removeVideoFromHistoryErrorMessages: string;

  isSearchingHistory: boolean;
  isSearchHistorySuccess: boolean;
  searchHistoryErrorMessages: string;
}
