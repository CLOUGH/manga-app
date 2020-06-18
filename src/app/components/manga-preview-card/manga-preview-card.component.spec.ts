import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaPreviewCardComponent } from './manga-preview-card.component';

describe('MangaPreviewCardComponent', () => {
  let component: MangaPreviewCardComponent;
  let fixture: ComponentFixture<MangaPreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MangaPreviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
