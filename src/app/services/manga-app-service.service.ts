import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangaAppServiceService {
  apiUrl = 'http://localhost:4200';

  constructor(private http: HttpClient) { }

  getChapterImages(chapterIndex: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chapter-images/${chapterIndex}`);
  }
  getChapters(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chapters`);
  }
}
