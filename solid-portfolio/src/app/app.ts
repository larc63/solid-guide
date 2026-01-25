import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Content } from "./content/content";
import { GridView } from './grid-view/grid-view';

@Component({
  selector: 'app-root',
  imports: [Content, GridView, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
}
