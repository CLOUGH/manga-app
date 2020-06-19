import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class MangaAppServiceService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient ) { }

  getChapterImages(chapterIndex: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chapters/${chapterIndex}/images`);
  }
  getChapters(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/chapters`);
  }
}
