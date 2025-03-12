import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../utils/http-client-auth';
import { UserModel } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientAuth) {}

  createUser() {
    return this.http.post(`users`, '');
  }

  getUserById() {
    return this.http.get(`users`);
  }

  updateChannelImage(file: File, userId: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    return this.http.put(`users/channel`, formData);
  }
}
