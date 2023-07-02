import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = false;
  uid = '';

  constructor(private router: Router) {}

  async checkAuth() {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.isLogged = true;
        console.log('Usuario logado', this.uid);
        return true;
      } else {
        console.log('Usuario não logado');
        this.isLogged = false;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 500);
        return false;
      }
    });
  }
}
