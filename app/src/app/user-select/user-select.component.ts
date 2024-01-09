import { Component, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

import { HttpUserProvider } from '../core/http-user-provider';
import { User } from '../core/model';
import { Router } from '@angular/router';
import { CurrentSession } from '../core/current-user';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatListModule, MatGridListModule, MatIconModule],
  providers: [HttpUserProvider],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.css',
})
export class UserSelectComponent implements OnInit {
  userList = signal<User[]>([]);

  constructor(
    private userProvider: HttpUserProvider,
    private router: Router,
    private currentSession: CurrentSession
  ) {}
  ngOnInit(): void {
    this.userProvider.findAllUsers().subscribe((users) => {
      this.userList.set(users);
    });
  }

  selectUser(user: User) {
    this.currentSession.setSession(user);
    this.router.navigate(['gossips']);
  }
}
