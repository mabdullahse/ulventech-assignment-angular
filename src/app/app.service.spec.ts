import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AppService, IWordOccurances } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppService],
    });
    service = TestBed.inject(AppService);

    injector = getTestBed();
    service = injector.get(AppService);
    httpMock = injector.get(HttpTestingController);
  });

  it('counts the words from a body of text', () => {
    const expectedData: IWordOccurances[] = [
      { word: 'leads', occurences: 7 },
      { word: 'to', occurences: 7 },
      { word: 'Fear', occurences: 1 },
      { word: 'anger;', occurences: 1 },
      { word: 'anger', occurences: 1 },
      { word: 'hatred;', occurences: 1 },
      { word: 'hatred', occurences: 1 },
      { word: 'conflict;', occurences: 1 },
      { word: 'conflict', occurences: 1 },
      { word: 'suffering', occurences: 1 },
    ];

    const description: string =
      'Fear leads to anger; anger leads to hatred; hatred leads to conflict; conflict leads to suffering';
    const returnValue = service.countWords(description);
    expect(returnValue[0].occurences).toEqual(7);
    expect(JSON.stringify(returnValue)).toEqual(JSON.stringify(expectedData));
  });
});
