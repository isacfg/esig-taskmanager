import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

import {
  faPlus,
  faListCheck,
  faFolder,
  faCircleUser,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(private router: Router) {}

  faPlus = faPlus;
  faListCheck = faListCheck;
  faFolder = faFolder;
  faCircleUser = faCircleUser;
  faChartLine = faChartLine;
  faKanban = faClipboard;

  logout() {
    const auth = getAuth();
    auth.signOut();
    this.router.navigate(['/login']);
  }
}
