import { MangaAppServiceService } from './../services/manga-app-service.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manga-chapter',
  templateUrl: './manga-chapter.component.html',
  styleUrls: ['./manga-chapter.component.scss']
})
export class MangaChapterComponent implements OnInit {
  chapterImages: string[] = [];
  public chapterIndex: number;
  public chapters: string[] = [];
  public selectedChapter: number;

  constructor(private mangaAppService: MangaAppServiceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParamMap);
    this.route.params.subscribe(params => {
      this.chapterIndex = parseInt(params['chapterIndex']);
      this.selectedChapter = this.chapterIndex;
      this.mangaAppService.getChapterImages(this.chapterIndex).subscribe((images) => {
        this.chapterImages = images;
      });
    });

    this.mangaAppService.getChapters().subscribe(chapters => {
      this.chapters = chapters;
    });
  }

  onChapterSelected(){
    this.router.navigateByUrl(`manga-chapter/${this.selectedChapter}`);
  }

}
