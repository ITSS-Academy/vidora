import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../utils/http-client-auth';
import { CreateVideoDto } from '../models/video.model';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(
    private http: HttpClientAuth,
    private socket: Socket,
  ) {}

  create(createVideoDto: CreateVideoDto, videoFile: File, imageFile: File) {
    const formData = new FormData();
    formData.append('files', videoFile); // Cả video và image đều vào 'files'
    formData.append('files', imageFile);
    formData.append('createVideoDto', JSON.stringify(createVideoDto));

    return this.http.post('videos', formData);
  }

  getUploadProgress(): Observable<number> {
    return this.socket.fromEvent<number>('uploadProgress');
  }

  getAllVideos() {
    return this.http.get('videos/all');
  }
}
