import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any, options?: { headers?: Record<string, string> }) {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params, ...options });
  }

  post<T>(endpoint: string, body: any, options?: { headers?: Record<string, string> }) {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  put<T>(endpoint: string, body: any, options?: { headers?: Record<string, string> }) {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, options);
  }

  delete<T>(endpoint: string, options?: { headers?: Record<string, string> }) {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options);
  }
}
