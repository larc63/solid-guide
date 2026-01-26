import { Component, OnInit, OutputEmitterRef, signal, output } from '@angular/core';
import { DataService } from '../services/data-service';
import { PortFolioData } from '../models/portfolio.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-grid-view',
    imports: [CommonModule],
    templateUrl: './grid-view.html',
    styleUrl: './grid-view.scss',
    providers: [DataService],
})
export class GridView implements OnInit {
    protected data!: PortFolioData[];
    loading = signal(true);
    constructor(private dataService: DataService) {}
    // TODO: change number[] to it own type in portfolio.model.ts
    clickEvent: OutputEmitterRef<number[]> = output<number[]>();

    async ngOnInit(): Promise<void> {
        // Initialize component
        this.data = await this.dataService.getData();
        this.loading.set(false);
        console.log('after oninit');
    }

    onItemClick(sectionIndex: number, tileIndex: number): void {
        // console.log(`Clicked item at index ${sectionIndex}, ${tileIndex}:`);
        this.clickEvent.emit([sectionIndex,tileIndex]);
    }
}
