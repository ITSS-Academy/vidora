import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../utils/http-client-auth';
import { UserModel } from '../models/user.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClientAuth) {}

  createUser() {
    return this.http.post(`users`, '');
  }

  updateUser(updateUserDto: UserModel) {
    return this.http.patch(`users`, updateUserDto);
  }

  getUserById() {
    return this.http.get(`users`);
  }

  updateProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/upload-profile-picture', formData);
  }

  updateProfileBanner(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('/api/upload-profile-banner', formData);
  }
}
