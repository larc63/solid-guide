import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient); // Inject the HttpClient
  private apiUrl = 'http://localhost:8081/'; // Replace with your API endpoint

  constructor() { }
  postData(data: any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'mode': 'cors',
      'Access-Control-Allow-Origin': 'http://localhost:4200'
    };
    // The post method takes the URL, the body, and optional options (like headers)
    return this.http.post<any>(this.apiUrl, data, { headers });
  }
}
