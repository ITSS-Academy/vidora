import { createAction, props } from '@ngrx/store';
import { CreateVideoDto } from '../../models/video.model';

export const createVideo = createAction(
  '[Video] Create Video',
  props<{ createVideoDto: CreateVideoDto; videoFile: File; imageFile: File }>(),
);

export const createVideoSuccess = createAction('[Video] Create Video Success');

export const createVideoFailure = createAction(
  '[Video] Create Video Failure',
  props<{ error: string }>(),
);
