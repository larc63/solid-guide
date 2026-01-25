import { Component, OnInit, signal } from '@angular/core';
import { DataService } from '../data-service';
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

    async ngOnInit(): Promise<void> {
        // Initialize component
        this.data = await this.dataService.getData();
        this.loading.set(false);
        console.log('after oninit');
    }
}
