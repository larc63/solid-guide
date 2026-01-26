import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Content } from './content/content';
import { GridView } from './grid-view/grid-view';
import { DataService } from './services/data-service';
import { PortFolioData } from './models/portfolio.model';
import { ModalService } from './services/modal-service';

@Component({
    selector: 'app-root',
    imports: [GridView, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    providers: [DataService],
})
export class App {
    protected readonly title = 'portfolio';
    private readonly data!: PortFolioData[];
    showDetails = false;

    constructor(private dataService: DataService, private modalService: ModalService) {
        this.data = this.dataService.data();
    }

    handleTileClick(o: number[]): void {
        console.log(`Received event for  ${o[0]}, ${o[1]}:`);
        this.modalService.open(Content, o);
    }
}
