import { Routes } from '@angular/router';
import { UserSelectComponent } from './user-select/user-select.component';

export const routes: Routes = [
  { path: 'user-select', title: 'User select', component: UserSelectComponent },
  { path: '', redirectTo: '/user-select', pathMatch: 'full' },
];
