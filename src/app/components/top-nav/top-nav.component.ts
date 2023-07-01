import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Router, NavigationEnd } from '@angular/router';
import { TarefasService } from '../../tarefas.service';


@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}
  
  isLogged: boolean = false;
  public uid: string = '';

  tasks = []
  tasksFiltered = []
  searchValue: string = '';

    // selecionar tarefa
  selectedID: string = '';
  selectedTitle: string = '';

    description: string = '';
  prazo;
  prioridade: string = '';
  projeto: string = '';
  responsavel: string = '';
  status: string = '';
  title: string = '';

  // pegar tarefas do banco
  async getTasks() {
    while (this.uid == '') {
      await new Promise((r) => setTimeout(r, 500));
    } // espera o uid ser preenchido

    // pega as tarefas do banco de dados por usuario
    let tasksR = await this.tarefasService.injectTasks(this.uid);

    this.tasks = tasksR;
    this.tasksFiltered = tasksR;

  }

  // buscar o titulo da tarefa no arrayOriginal e atualizar o arrayTitles
   searchTitle() {
     
     this.tasksFiltered = this.tasks.filter((task) => {
        return task.title.toLowerCase().includes(this.searchValue.toLowerCase())
     }
      )
   }
  
    async updateInputs(title, description, prioridade, status, prazo, responsavel, projeto, id) {
    this.title = title;
    this.description = description;
    this.prioridade = prioridade;
    this.status = status;
    this.responsavel = responsavel;
    this.projeto = projeto;
    this.selectedID = id;
    this.prazo = prazo;
  }
  
    clearInputs() {
    this.title = '';
    this.description = '';
    this.prioridade = '';
    this.status = '';
    this.prazo = '';
    this.responsavel = '';
    this.projeto = '';
    this.selectedID = '';
  }
  

  logout() {
    const auth = getAuth();
    auth.signOut();
    this.router.navigate(['/login']);
  }

    ngOnInit(): void {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid;
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
      this.getTasks();

  }

}
