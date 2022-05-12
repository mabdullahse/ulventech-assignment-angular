import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IRestaurant {
  id: number;
  uid: string;
  name: string;
  type: string;
  description: string;
  review: string;
  logo: string;
  phone_number: string;
  address: string;
}

export interface IWordOccurances {
  word: string;
  occurences: number;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private wordsOccurancesSource = new BehaviorSubject<IWordOccurances[]>([]);
  wordsOccurances = this.wordsOccurancesSource.asObservable();

  constructor(private http: HttpClient) {}

  updatedDataSelection(description: string) {
    this.wordsOccurancesSource.next(this.countWords(description));
  }

  /**Fetch Data */
  getInfoByUrl(url: string): Observable<string> {
    return this.http.get<IRestaurant>(url).pipe(
      map((restaurant: IRestaurant): string => {
        return restaurant.description;
      })
    );
  }

  /** Find TOP 10 most Frequent words */
  public countWords(sentence: string): IWordOccurances[] {
    if (!sentence) return [];
    const wordsList: string[] = sentence.replace(/[.]/g, '').split(/\s/);
    const wordsFrequency: { [key: string]: number } = {};
    wordsList.forEach((w: string) => {
      wordsFrequency[w] = (wordsFrequency[w] + 1) | 1;
    });
    const wordsFrequencyArray: IWordOccurances[] = [];

    for (const key in wordsFrequency) {
      wordsFrequencyArray.push({ word: key, occurences: wordsFrequency[key] });
    }
    wordsFrequencyArray.sort((a, b) =>
      a.occurences < b.occurences ? 1 : b.occurences < a.occurences ? -1 : 0
    );
    return wordsFrequencyArray.length > 10
      ? wordsFrequencyArray.slice(0, 10)
      : wordsFrequencyArray;
  }
}
