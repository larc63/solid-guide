import { Component, model, signal } from '@angular/core';
import { DataService } from '../services/data-service';
import { PortFolioData } from '../models/portfolio.model';
import { CommonModule } from '@angular/common';
import { Navigation } from '../navigation/navigation';
import { OverlayRef } from '@angular/cdk/overlay';

@Component({
    selector: 'app-content',
    imports: [CommonModule, Navigation],
    templateUrl: './content.html',
    styleUrl: './content.scss'
})
export class Content {
    protected data!: PortFolioData[];
    loading = signal(true);
    sIndex = model(0);
    tIndex = model(0);
    parentRef!: OverlayRef;

    constructor(private dataService: DataService) {}

    async ngOnInit(): Promise<void> {
        // Initialize component
        this.data = await this.dataService.getData();
        this.loading.set(false);
    }

    goRight() {
        // check if last tile of section
        if (this.tIndex() >= this.data[this.sIndex()].tiles.length - 1) {
            this.tIndex.set(0);
            this.sIndex.set((this.sIndex() + 1) % this.data.length);
        } else {
            this.tIndex.set(this.tIndex() + 1);
        }
    }

    goLeft() {
        // check if first tile of section
        if (this.tIndex() <= 0) {
            this.sIndex.set(this.sIndex() - 1 < 0 ? this.data.length - 1 : this.sIndex() - 1);
            this.tIndex.set(this.data[this.sIndex()].tiles.length - 1);
        } else {
            this.tIndex.set(this.tIndex() - 1);
        }
    }

    handleArrowClick(id: string): void {
        switch (id) {
            case 'right-arrow':
                this.goRight();
                break;
            case 'left-arrow':
                this.goLeft();
                break;
            case 'close-button':
                this.parentRef.dispose();
                break;
        }
        // console.log(`clicked id: ${id}, going to ${this.sIndex}, ${this.tIndex}`);
    }
}
