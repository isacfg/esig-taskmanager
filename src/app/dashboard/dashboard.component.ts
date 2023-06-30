import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
// Add any additional code here
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}

  tasks = [];

  tasksHighPriority = [];
  numeroTarefasConcluidas = [];
  numeroTarefasEmAndamento = [];
  numeroTarefasAltaPrioridade = [];

  arrayResponsaveis = [];
  public uid: string = '';

  // pegar tarefas do banco de dados
  async getTasks() {
    while (this.uid == '') {
      await new Promise((r) => setTimeout(r, 500));
    } // espera o uid ser preenchido

    // pega as tarefas do banco de dados por usuario
    let tasksR = await this.tarefasService.getTasksByUserID(this.uid);

    // converter prazo para devolver pro input
    for (let i = 0; i < tasksR.length; i++) {
      let s = tasksR[i].prazo.toDate();
      tasksR[i].prazo = s.toISOString().substring(0, 10);
    }

    this.tasks = tasksR;
    this.arrayResponsaveis = await this.tarefasService.getAllResponsaveis(
      this.uid
    );

    // pegar tarefas com prioridade alta
    this.tasksHighPriority = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].prioridade == 'Alta') {
        this.tasksHighPriority.push(this.tasks[i]);
      }
    }

    // pegar numero de concluidas
    this.numeroTarefasConcluidas = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status == 'Concluída') {
        this.numeroTarefasConcluidas.push(this.tasks[i]);
      }
    }

    // pegar numero de em andamento
    this.numeroTarefasEmAndamento = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status == 'Em andamento') {
        this.numeroTarefasEmAndamento.push(this.tasks[i]);
      }
    }
  }

  isLogged: boolean = false;

  ngOnInit(): void {
    // checar se usuario esta logado
    // const auth = getAuth();
    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     this.uid = user.uid;
    //     this.isLogged = true;
    //     console.log('Usuario logado', this.uid);
    //   } else {
    //     console.log('Usuario não logado');
    //     this.isLogged = false;
    //     setTimeout(() => {
    //       this.router.navigate(['/login']);
    //     }, 500);
    //   }
    // });
    // this.getTasks();
    // if (this.tarefasService.fetched == false) {
    //   this.getTasks();
    //   this.tarefasService.fetched = true;
    // }
  }
}
