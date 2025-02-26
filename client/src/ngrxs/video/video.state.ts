import { VideoModel } from '../../models/video.model';

export interface VideoState {
  videos: VideoModel[];

  isGettingAllVideos: boolean;
  isGetAllVideosSuccess: boolean;
  getAllVideosErrorMessage: string;

  isCreatingVideo: boolean;
  isCreateVideoSuccess: boolean;
  createVideoErrorMessages: string;
}
