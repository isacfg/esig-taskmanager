import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  constructor(private router: Router) {}

  isLogged: boolean = false;

  ngOnInit(): void {
    // checar se usuario esta logado
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.isLogged = true;
        console.log('Usuario logado', uid);
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
