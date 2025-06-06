import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ItemsService {

 private apiUrl = 'https://dressing-assurance-pirates-errors.trycloudflare.com/'; // Cambia con il tuo endpoint

  constructor(private http: HttpClient) {}

  getItemById(id: string | string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}item/${id}`);
}

  getCategories(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}latest-items`);
}

}
