import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PortFolioData } from './models/portfolio.model';

@Injectable({
    providedIn: 'root',
})
export class DataService {
    private jsonUrl = '/portfolio_data.json'; // Path is relative to the app's root URL
    data = signal<Array<PortFolioData>>([]);

    constructor(private http: HttpClient) {
        this.loadJsonData();
    }

    private loadJsonData(): void {
        this.getJsonData().subscribe(response => {
            this.data.set(response);
        });
    }

    getJsonData(): Observable<any> {
        return this.http.get(this.jsonUrl);
    }
}
