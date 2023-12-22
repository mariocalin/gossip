import { Observable } from 'rxjs';
import { User } from './model';
import { Injectable } from '@angular/core';
import { Api } from './api';

@Injectable({ providedIn: 'root' })
export class HttpUserProvider {
  private readonly endpoints = {
    FIND_ALL_USERS: '/user',
  };

  constructor(private api: Api) {}

  findAllUsers(): Observable<User[]> {
    return this.api.get<User[]>(this.endpoints.FIND_ALL_USERS);
  }
}
