import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PortFolioData } from '../models/portfolio.model';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private jsonUrl = 'portfolio_data.json'; // Path is relative to the app's root URL
    data = signal<PortFolioData[]>([]);
    dataReady = false;
    constructor(private http: HttpClient) {
        console.log('loading portfolio data');
        this.loadJsonData();
    }

    private loadJsonData(): void {
        this.getJsonData().subscribe({
            next: (response) => {
                this.data.set(response);
                this.dataReady = true;
            },
            error: (error) => {
                console.error('Error loading portfolio data:', error);
                this.data.set([]);
                this.dataReady = true;
            },
        });
    }

    getJsonData(): Observable<any> {
        return this.http.get(this.jsonUrl, {priority: 'high'});
    }

    getData(): Promise<PortFolioData[]> {
        return new Promise((resolve, reject) => {
            let id = setInterval(() => {
                if (this.dataReady) {
                    clearInterval(id);
                    resolve(this.data());
                    console.log(`loaded ${this.data().length} items`);
                }
            }, 10);
        });
    }
}
