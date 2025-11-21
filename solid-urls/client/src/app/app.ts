import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';


const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('client');
  url = new FormControl('', [
    Validators.required,
    Validators.pattern(urlRegex)
  ]);
  urlValue = signal('');

  handleSubmit() {
    console.log(`url: ${this.urlValue()} is ${this.url.invalid? 'invalid': 'valid'}`);
  }
}
