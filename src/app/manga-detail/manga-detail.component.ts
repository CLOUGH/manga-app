import { MangaAppServiceService } from './../services/manga-app-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manga-detail',
  templateUrl: './manga-detail.component.html',
  styleUrls: ['./manga-detail.component.scss']
})
export class MangaDetailComponent implements OnInit {
  public chapters: string[] =[];

  constructor(private mangaAppService: MangaAppServiceService) { }

  ngOnInit(): void {
    this.mangaAppService.getChapters().subscribe(chapters => {
      this.chapters = chapters;
    });
  }

}
