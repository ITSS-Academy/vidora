import { createReducer, on } from '@ngrx/store';
import { VideoState } from './video.state';
import * as VideoActions from './video.actions';

const initialState: VideoState = {
  videos: [],

  isCreatingVideo: false,
  isCreateVideoSuccess: false,
  createVideoErrorMessages: '',

  isGettingAllVideos: false,
  isGetAllVideosSuccess: false,
  getAllVideosErrorMessage: '',
};

export const videoReducer = createReducer(
  initialState,
  on(VideoActions.createVideo, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isCreatingVideo: true,
    };
  }),

  on(VideoActions.createVideoSuccess, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isCreatingVideo: false,
      isCreateVideoSuccess: true,
    };
  }),

  on(VideoActions.createVideoFailure, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isCreatingVideo: false,
      createVideoErrorMessages: action.error,
    };
  }),

  on(VideoActions.getAllVideos, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isGettingAllVideos: true,
    };
  }),

  on(VideoActions.getAllVideosSuccess, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isGettingAllVideos: false,
      isGetAllVideosSuccess: true,
      videos: action.videos,
    };
  }),

  on(VideoActions.getAllVideosFailure, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...state,
      isGettingAllVideos: false,
      getAllVideosErrorMessage: action.error,
    };
  }),

  on(VideoActions.clearState, (state, action) => {
    console.log(action.type);
    return <VideoState>{
      ...initialState,
    };
  }),
);
