import { createReducer, on } from '@ngrx/store';
import { VideoState } from './video.state';
import * as VideoActions from './video.actions';

const initialState: VideoState = {
  isCreatingVideo: false,
  isCreateVideoSuccess: false,
  createVideoErrorMessages: '',
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
);
