import { Component } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent {
  constructor(private router: Router) {}

  logout() {
    const auth = getAuth();
    auth.signOut();
    this.router.navigate(['/login']);
  }
}
