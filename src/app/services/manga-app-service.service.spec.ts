import { TestBed } from '@angular/core/testing';

import { MangaAppServiceService } from './manga-app-service.service';

describe('MangaAppServiceService', () => {
  let service: MangaAppServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MangaAppServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
