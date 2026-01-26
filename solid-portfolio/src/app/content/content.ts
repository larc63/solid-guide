import { Component, Input, signal } from '@angular/core';
import { DataService } from '../data-service';
import { PortFolioData } from '../models/portfolio.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-content',
    imports: [CommonModule],
    templateUrl: './content.html',
    styleUrl: './content.scss',
})
export class Content {
    @Input() idx!: number[];

    protected data!: PortFolioData[];
    loading = signal(true);

    constructor(private dataService: DataService) {}

    async ngOnInit(): Promise<void> {
        // Initialize component
        this.data = await this.dataService.getData();
        this.loading.set(false);
        console.log(`after oninit - ${this.idx}`);
    }
}
