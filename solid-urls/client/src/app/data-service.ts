import { inject, Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private http = inject(HttpClient); // Inject the HttpClient

constructor(@Inject(DOCUMENT) private document: Document) { }
postData(data: any): Observable < any > {
  const apiUrl = `${this.document.location.protocol}//${this.document.location.hostname}:8081/`;
  const headers = {
    'Content-Type': 'application/json',
    'mode': 'cors',
    'Access-Control-Allow-Origin': `${this.document.location.protocol}//${this.document.location.hostname}:4200`
  };
  // The post method takes the URL, the body, and optional options (like headers)
  return this.http.post<any>(apiUrl, data, { headers });
}
}
