import { Component, OnInit } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';
import { Timestamp } from 'firebase/firestore';

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

  arrayResponsaveis = ['Laura', 'João'];

  // criar tarefa
  description: string = '';
  prazo;
  prioridade: string = '';
  projeto: string = '';
  responsavel: string = '';
  status: string = '';
  title: string = '';

  // selecionar tarefa
  selectedID: string = '';

  tasksFiltro = [];
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
    this.tasksFiltro = tasksR;
    this.arrayResponsaveis = await this.tarefasService.getAllResponsaveis();
  }

  // criar tarefa
  async createTask() {
    // cria a tarefa no banco de dados
    let s = new Date(this.prazo);
    this.prazo = Timestamp.fromDate(s);

    await this.tarefasService.createTask({
      title: this.title,
      description: this.description,
      prioridade: this.prioridade,
      status: this.status,
      prazo: this.prazo,
      responsavel: this.responsavel,
      projeto: this.projeto,
      userID: this.uid,
    });

    // atualiza a lista de tarefas
    this.getTasks();

    // limpa os campos
    this.title = '';
    this.description = '';
    this.prioridade = '';
    this.status = '';
    this.prazo = '';
    this.responsavel = '';
    this.projeto = '';

    // fecha o modal
    let closeBtn = document.getElementById('closeBtn');
    closeBtn?.click();
  }

  // selectionar tarefa
  selectTarefa(taskID) {
    this.selectedID = taskID;
  }

  // editar tarefa
  async updateInputs(
    title,
    description,
    prioridade,
    status,
    prazo,
    responsavel,
    projeto,
    id
  ) {
    this.title = title;
    this.description = description;
    this.prioridade = prioridade;
    this.status = status;
    this.responsavel = responsavel;
    this.projeto = projeto;
    this.selectedID = id;
    this.prazo = prazo;
  }

  async updateTarefa() {
    // atualiza a tarefa no banco de dados
    let s = new Date(this.prazo);
    this.prazo = Timestamp.fromDate(s);

    await this.tarefasService.updateTask(this.selectedID, {
      title: this.title,
      description: this.description,
      prioridade: this.prioridade,
      status: this.status,
      prazo: this.prazo,
      responsavel: this.responsavel,
      projeto: this.projeto,
    });

    // atualiza a lista de tarefas
    this.getTasks();

    // limpa os campos
    this.title = '';
    this.description = '';
    this.prioridade = '';
    this.status = '';
    this.prazo = '';
    this.responsavel = '';
    this.projeto = '';
    this.selectedID = '';

    // fecha o modal
    let closeBtn = document.getElementById('closeBtnEdit');
    closeBtn?.click();
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

  // deletar tarefa
  async deleteTarefa() {
    let id = this.selectedID;
    await this.tarefasService.deleteTask(id);
    this.getTasks();
    let closeBtn = document.getElementById('deleteModalBtn');
    closeBtn?.click();
    this.selectedID = '';
  }

  // gerenciador de busca
  searchInput: string = '';
  responsavelSearch: string = 'default';
  statusSearch: string = 'default';
  prioridadeSearch: string = 'default';

  async search() {
    // se nada for selecionado, retorna todas as tarefas
    if (
      this.responsavelSearch == 'default' &&
      this.statusSearch == 'default' &&
      this.prioridadeSearch == 'default' &&
      this.searchInput == ''
    ) {
      // this.getTasks();
      this.tasks = this.tasksFiltro;
      // console.log('busca vazia');
    } else {
      // this.tasks = this.tasksFiltro.filter((task) =>

      // busca por titulo
      if (this.searchInput != '') {
        this.tasks = this.tasksFiltro.filter((task) =>
          task.title.toLowerCase().includes(this.searchInput.toLowerCase())
        );
      }

      // busca por responsavel
      if (
        this.responsavelSearch != 'default' &&
        this.statusSearch == 'default' &&
        this.prioridadeSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) => task.responsavel == this.responsavelSearch
        );
        // this.tasks = await this.tarefasService.getTasksByResponsavelUserID(
        //   this.responsavelSearch,
        //   this.uid
        // );
      }

      // busca por responsavel e status
      if (
        this.responsavelSearch != 'default' &&
        this.statusSearch != 'default' &&
        this.prioridadeSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) =>
            task.responsavel == this.responsavelSearch &&
            task.status == this.statusSearch
        );
      }

      // busca por responsavel e prioridade
      if (
        this.responsavelSearch != 'default' &&
        this.prioridadeSearch != 'default' &&
        this.statusSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) =>
            task.responsavel == this.responsavelSearch &&
            task.prioridade == this.prioridadeSearch
        );
      }

      // busca por status
      if (
        this.statusSearch != 'default' &&
        this.prioridadeSearch == 'default' &&
        this.responsavelSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) => task.status == this.statusSearch
        );
      }

      // busca por status e prioridade
      if (
        this.statusSearch != 'default' &&
        this.prioridadeSearch != 'default' &&
        this.responsavelSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) =>
            task.status == this.statusSearch &&
            task.prioridade == this.prioridadeSearch
        );
      }

      // busca por prioridade
      if (
        this.prioridadeSearch != 'default' &&
        this.statusSearch == 'default' &&
        this.responsavelSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) => task.prioridade == this.prioridadeSearch
        );
      }

      // busca por responsavel, status e prioridade
      if (
        this.responsavelSearch != 'default' &&
        this.statusSearch != 'default' &&
        this.prioridadeSearch != 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) =>
            task.responsavel == this.responsavelSearch &&
            task.status == this.statusSearch &&
            task.prioridade == this.prioridadeSearch
        );
      }
    }

    // voltar para os inputs vazios
    this.searchInput = '';
    this.responsavelSearch = 'default';
    this.statusSearch = 'default';
    this.prioridadeSearch = 'default';
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
