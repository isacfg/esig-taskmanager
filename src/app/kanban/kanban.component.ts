import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}

  isLogged: boolean = false;
  public uid: string = '';

  tasks = [];
  tasksNaoIniciadas = [];
  tasksEmAndamento = [];
  tasksConcluidas = [];

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

    // pegar tarefas nao iniciadas
    this.tasksNaoIniciadas = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status == 'Não iniciada') {
        this.tasksNaoIniciadas.push(this.tasks[i]);
      }
    }

    // pegar tarefas em andamento
    this.tasksEmAndamento = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status == 'Em andamento') {
        this.tasksEmAndamento.push(this.tasks[i]);
      }
    }

    // pegar tarefas concluidas
    this.tasksConcluidas = [];
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].status == 'Concluída') {
        this.tasksConcluidas.push(this.tasks[i]);
      }
    }
  }

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
  }
}
