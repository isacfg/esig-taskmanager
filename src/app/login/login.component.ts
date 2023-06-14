import { Component, OnInit } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {}

  email: string = '';
  password: string = '';
  isLogged: boolean = false;
  errorMsg: string = '';

  async loginWithEmail(email: string, password: string) {
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result.user);
      console.log('usuario logado');
      this.isLogged = true;

      this.router.navigate(['/']);
    } catch (error: any) {
      console.log();
      this.errorMsg = error.message;
    }
  }

  ngOnInit(): void {
    // checar se usuario esta logado
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const uid = user.uid;
        this.isLogged = true;
        console.log('Usuario logado', uid);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      } else {
        this.isLogged = false;
        console.log('Usuario não logado');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }
    });
  }
}
