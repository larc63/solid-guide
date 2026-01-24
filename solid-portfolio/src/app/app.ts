import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Content } from "./content/content";

@Component({
  selector: 'app-root',
  imports: [Content, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
