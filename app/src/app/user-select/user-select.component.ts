import { Component, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

import { HttpUserProvider } from '../core/http-user-provider';
import { User } from '../core/model';

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

  constructor(private userProvider: HttpUserProvider) {}
  ngOnInit(): void {
    this.userProvider.findAllUsers().subscribe((users) => {
      this.userList.set(users);
    });
  }
}
