import { Component } from '@angular/core';
import {
  faPlus,
  faListCheck,
  faFolder,
  faCircleUser,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  faPlus = faPlus;
  faListCheck = faListCheck;
  faFolder = faFolder;
  faCircleUser = faCircleUser;
  faChartLine = faChartLine;
}
