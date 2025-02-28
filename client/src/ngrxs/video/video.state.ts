import { VideoModel } from '../../models/video.model';

export interface VideoState {
  videos: VideoModel[];
  isMuteVolume: boolean;

  isGettingAllVideos: boolean;
  isGetAllVideosSuccess: boolean;
  getAllVideosErrorMessage: string;

  isGettingVideoByCategoryId: boolean;
  isGetVideoByCategoryIdSuccess: boolean;
  getVideoByIdErrorMessage: string;

  isCreatingVideo: boolean;
  isCreateVideoSuccess: boolean;
  createVideoErrorMessages: string;
}
