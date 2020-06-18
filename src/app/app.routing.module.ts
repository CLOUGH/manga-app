import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MangaDetailComponent } from './manga-detail/manga-detail.component';
import { MangaChapterComponent } from './manga-chapter/manga-chapter.component';


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'manga-detail', component: MangaDetailComponent },
      { path: 'manga-chapter/:chapterIndex', component: MangaChapterComponent },
      { path: '', component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
