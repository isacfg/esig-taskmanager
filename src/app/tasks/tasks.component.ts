import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';

import {
  faPlus,
  faMagnifyingGlass,
  faCircleInfo,
  faPen,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}

  faPlus = faPlus;
  faSearch = faMagnifyingGlass;
  faInfo = faCircleInfo;
  faEdit = faPen;
  faDelete = faTrash;

  tasks = [
    {
      id: 1,
      title: 'Tarefa 1',
      description: 'Descrição da tarefa 1',
      prioridade: 'Alta',
      status: 'Não iniciada',
      prazo: '2021-10-10',
      responsavel: 'Laura',
      projeto: 'Projeto 1',
    },
    {
      id: 2,
      title: 'Tarefa 2',
      description: 'Descrição da tarefa 2',
      prioridade: 'Média',
      status: 'Em andamento',
      prazo: '2021-10-10',
      responsavel: 'Laura',
      projeto: 'Projeto 2',
    },
    {
      id: 3,
      title: 'Tarefa 3',
      description: 'Descrição da tarefa 3',
      prioridade: 'Baixa',
      status: 'Concluída',
      prazo: '2021-10-10',
      responsavel: 'Laura',
      projeto: 'Projeto 3',
    },
  ];

  private uid: string = '';

  // pegar tarefas do banco de dados
  async getTasks() {
    while (this.uid == '') {
      await new Promise((r) => setTimeout(r, 500));
    } // espera o uid ser preenchido

    // pega as tarefas do banco de dados por usuario
    let tasksR = await this.tarefasService.getTasksByUserID(this.uid);
    console.log(tasksR);
    this.tasks = tasksR;
  }

  isLogged: boolean = false;

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
      }
    });

    this.getTasks();
  }
}
