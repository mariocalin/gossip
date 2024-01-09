import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CurrentSession } from './current-user';

@Injectable({ providedIn: 'root' })
export class Api {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private currentSession: CurrentSession
  ) {
    this.baseUrl = environment.apiUrl;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }
}
