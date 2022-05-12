import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

import { AppService, IWordOccurances } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  initialSubmit: boolean = false;
  isApiError = false;
  public userInputForm: FormGroup;
  public wordsOccurancesObs$: Observable<IWordOccurances[]> | undefined;

  constructor(private appService: AppService, private fb: FormBuilder) {
    const urlRegex =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.userInputForm = this.fb.group(
      {
        description: new FormControl(''),
        url: new FormControl('', [Validators.pattern(urlRegex)]),
      },
      { validator: atLeastOne(Validators.required, ['description', 'url']) }
    );
  }

  ngOnInit() {
    this.wordsOccurancesObs$ = this.appService.wordsOccurances;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.userInputForm.valid) return;
    this.isLoading = true;
    console.log(this.userInputForm);
    const { url, description } = this.userInputForm.value;

    if (description && !url) {
      this.appService.updatedDataSelection(description);
      this.initialSubmit = true;
      this.isLoading = false;
      this.isApiError = false;
      return;
    }
    this.appService.getInfoByUrl(url).subscribe(
      (description: string) => {
        this.initialSubmit = true;
        this.isLoading = false;
        this.userInputForm.patchValue({
          description,
        });
        this.appService.updatedDataSelection(description);
      },
      (error) => {
        this.isLoading = false;
        this.isApiError = true;
      }
    );
  }

  resetForm() {
    this.userInputForm.reset();
    this.isApiError = false;
    this.appService.updatedDataSelection('');
    this.isSubmitted = false;
  }

  public setUrl() {
    this.userInputForm.patchValue({
      url: 'https://random-data-api.com/api/restaurant/random_restaurant',
    });
  }
  get userForm(): { [key: string]: AbstractControl } {
    return this.userInputForm.controls;
  }

  get description(): string {
    return this.userInputForm.get('description')?.value;
  }
}

export const atLeastOne =
  (validator: ValidatorFn, controls: string[] = []) =>
  (group: FormGroup): ValidationErrors | null => {
    if (!controls) {
      controls = Object.keys(group.controls);
    }

    const hasAtLeastOne =
      group &&
      group.controls &&
      controls.some((k) => !validator(group.controls[k]));

    return hasAtLeastOne
      ? null
      : {
          atLeastOne: true,
        };
  };
