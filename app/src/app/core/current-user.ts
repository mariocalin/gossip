import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './model';

@Injectable({ providedIn: 'root' })
export class CurrentSession {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  setSession(user: User) {
    this.currentUserSubject.next(user);
  }

  clearSession() {
    this.currentUserSubject.next(null);
  }

  getSession(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}
