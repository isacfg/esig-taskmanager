import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  constructor(private router: Router) {}


   private production: boolean = true;
  isLogged: boolean = false;
  public uid: string = '';
  public user: any;
  public extractedName: string = '';

  ngOnInit(): void {
    if (this.production == false) {
      this.isLogged = true;

    } else {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid;
          this.user = user;

          this.extractedName = this.user.email.split('@')[0];

          // console.log(user)
          this.isLogged = true;
          console.log('Usuario logado', this.uid);
        } else {
          console.log('Usuario não logado');
          this.isLogged = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        }
      });
    }
  }

}
