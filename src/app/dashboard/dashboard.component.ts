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
  public email: string = '';

  // pegar tarefas do banco de dados
  async getTasks() {
    while (this.uid == '') {
      await new Promise((r) => setTimeout(r, 500));
    } // espera o uid ser preenchido

    // pega as tarefas do banco de dados por usuario
    let tasksR = await this.tarefasService.injectTasks(this.uid);

    this.tasks = tasksR;
    this.arrayResponsaveis = await this.tarefasService.getAllResponsaveis(this.uid);

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

  private production: boolean = true;
  isLogged: boolean = false;

  ngOnInit(): void {
    if (this.production == false) {
      this.isLogged = true;

      this.tasks = [
        {
          id: '1',
          title: 'Tarefa 1',
          description: 'descrição',
          prazo: 'June 28, 2023 at 9:00:00 PM UTC-3',
          prioridade: 'Média',
          projeto: 'Projeto Amendis',
          responsavel: 'Pedro',
          status: 'Concluída',
          userID: 'vDJ1fa0ztXYlXyfmKFpHkHHfnPu1',
        },
        {
          id: '2',
          title: 'Tarefa 2',
          description: 'descrição',
          prazo: 'June 28, 2023 at 9:00:00 PM UTC-3',
          prioridade: 'Alta',
          projeto: 'Projeto Amendis',
          responsavel: 'Pedro',
          status: 'Concluída',
          userID: 'vDJ1fa0ztXYlXyfmKFpHkHHfnPu1',
        },
        {
          id: '2',
          title: 'Tarefa 2',
          description: 'descrição',
          prazo: 'June 28, 2023 at 9:00:00 PM UTC-3',
          prioridade: 'Baixa',
          projeto: 'Projeto Amendis',
          responsavel: 'Pedro',
          status: 'Concluída',
          userID: 'vDJ1fa0ztXYlXyfmKFpHkHHfnPu1',
        },
      ];
    } else {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.uid = user.uid;
          this.email = user.email;
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
}
