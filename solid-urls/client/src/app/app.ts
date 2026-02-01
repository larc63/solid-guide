import { Component, Inject, inject, model, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { DataService } from './data-service';
import { DOCUMENT } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { debounceTime } from 'rxjs';

const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/i;

@Component({
  selector: 'app-root',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private dataService = inject(DataService);

  constructor(@Inject(DOCUMENT) private document: Document) { };

  url = new FormControl('', [
    Validators.required,
    Validators.pattern(urlRegex)
  ]);

  showError = false;
  errorMessage = signal('');
  resultMessage = signal('');

  faCopy = faCopy;

  ngOnInit() {
    this.url.valueChanges
      .pipe(
        // Wait 500ms after each keystroke before emitting the value
        debounceTime(500)
      )
      .subscribe(() => {
        // Once the delay has passed, mark the custom flag as true
        this.showError = true;
      });
  }

  copyToClipboard() {
    this.document.defaultView?.navigator.clipboard.writeText(this.resultMessage());
  }

  handleSubmit() {
    console.log(`url: ${this.url.value} is ${this.url.invalid ? 'invalid' : 'valid'}`);
    const newItem = { url: '' + this.url.value };
    if (!this.url.invalid) {
      this.dataService.postData(newItem).subscribe({
        next: (response) => {
          console.log('Item created:', response);
          console.log(response.short_url);
          this.resultMessage.set(`${this.document.location.protocol}//${this.document.location.hostname}${response.short_url}`)
        },
        error: (error) => {
          console.error('Error creating item:', error);
          this.errorMessage.set('Error creating shortened URL');
          this.url.reset();
        },
        complete: () => {
          this.url.reset();
        }
      });
    } else {
      this.errorMessage.set('URL is invalid');
    }
  }
}
