import { Injectable } from '@angular/core';
import { HttpClientAuth } from '../utils/http-client-auth';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  constructor(private http: HttpClientAuth) {}

  getAllHistory(userId: string) {
    return this.http.get(`history?userId=${userId}`);
  }

  clearHistory(userId: string) {
    return this.http.get(`history/clear?userId=${userId}`);
  }

  removeVideoFromHistory(userId: string, videoId: string) {
    return this.http.get(`history/remove?userId=${userId}&videoId=${videoId}`);
  }

  searchHistory(userId: string, search: string) {
    return this.http.get(`history/search?userId=${userId}&search=${search}`);
  }
}
