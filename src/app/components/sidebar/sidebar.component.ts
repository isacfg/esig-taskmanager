import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {}

  faPlus = faPlus;
  faKanban = faClipboard;

  toggleSidebar() {
    // id="abrir-gaveta"
    const sidebar = document.getElementById('abrir-gaveta');
    sidebar.click();
  }

  // gambiarra temporaria para deixar o icone do dashboard ativo
  getUrl() {
    // console.log(this.router.url);
    const dashboard = document.querySelector('.dashboard');
    const kanban = document.querySelector('.kanban');
    const tasks = document.querySelector('.tasks');

    if (this.router.url === '/') {
      dashboard.classList.add('dashboard-img-active');
      kanban.classList.remove('dashboard-img-active');
      tasks.classList.remove('dashboard-img-active');
    } else if (this.router.url === '/kanban') {
      kanban.classList.add('dashboard-img-active');
      dashboard.classList.remove('dashboard-img-active');
      tasks.classList.remove('dashboard-img-active');
    } else if (this.router.url === '/tasks') {
      tasks.classList.add('dashboard-img-active');
      dashboard.classList.remove('dashboard-img-active');
      kanban.classList.remove('dashboard-img-active');
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getUrl();
      }
    });
    // subscribe faz com que o evento seja disparado toda vez que a rota muda e NavigationEnd é o evento que é disparado quando a rota muda
  }
}
