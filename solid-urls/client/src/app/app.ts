import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { DataService } from './data-service';


const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private dataService = inject(DataService);
  protected readonly title = signal('client');
  
  url = new FormControl('', [
    Validators.required,
    Validators.pattern(urlRegex)
  ]);
  urlValue = signal('');

  handleSubmit() {
    console.log(`url: ${this.urlValue()} is ${this.url.invalid? 'invalid': 'valid'}`);
    const newItem = { url: this.url.value };
    this.dataService.postData(newItem).subscribe({
      next: (response) => console.log('Item created:', response),
      error: (error) => console.error('Error creating item:', error)
    })
  }
}
