import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';
import { Timestamp } from 'firebase/firestore';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

import { faMagnifyingGlass, faCircleInfo, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}

  faSearch = faMagnifyingGlass;
  faInfo = faCircleInfo;
  faEdit = faPen;
  faDelete = faTrash;

  arrayResponsaveis = [];
  arrayProjetos = [];

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
  tasks = [];

  public uid: string = '';

  // pegar tarefas do banco de dados
  async getTasks() {
    while (this.uid == '') {
      await new Promise((r) => setTimeout(r, 500));
    } // espera o uid ser preenchido

    // pega as tarefas do banco de dados por usuario
    let tasksR = await this.tarefasService.injectTasks(this.uid);

    this.tasks = tasksR;
    this.tasksFiltro = tasksR;
    this.arrayResponsaveis = await this.tarefasService.injectTasks(this.uid, true, false);
    this.arrayProjetos = await this.tarefasService.injectTasks(this.uid, false, true);
  }

  // criar tarefa
  async createTask() {
    // create task in the database
    const s = new Date(this.prazo);
    this.prazo = Timestamp.fromDate(s);
    const createdAt = new Date();

    await this.tarefasService.createTask({
      title: this.title,
      description: this.description,
      prioridade: this.prioridade,
      status: this.status,
      prazo: this.prazo,
      responsavel: this.responsavel,
      projeto: this.projeto,
      userID: this.uid,
      createdAt: createdAt.toISOString(),
    });

    this.tarefasService.pushTask(
      this.title,
      this.description,
      this.prioridade,
      this.status,
      this.prazo,
      this.responsavel,
      this.projeto,
      this.uid,
      createdAt.toISOString()
    );

    // update task list
    this.getTasks();
    this.tasks = await this.tarefasService.bypassCache(this.uid);
    this.tasksFiltro = this.tasks;

    // clear fields
    this.title = '';
    this.description = '';
    this.prioridade = '';
    this.status = '';
    this.prazo = '';
    this.responsavel = '';
    this.projeto = '';

    // close modal
    const closeBtn = document.getElementById('closeBtn');
    closeBtn?.click();
  }

  // selectionar tarefa
  selectTarefa(taskID) {
    this.selectedID = taskID;
  }

  // editar tarefa
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

    this.tasks = await this.tarefasService.bypassCache(this.uid);
    this.tasksFiltro = this.tasks;

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
  projetoSearch: string = 'default';
  lastNDays: string = 'default';

async search() {
  // if nothing is selected, return all tasks
  if (
    this.responsavelSearch == 'default' &&
    this.statusSearch == 'default' &&
    this.prioridadeSearch == 'default' &&
    this.projetoSearch == 'default' &&
    this.searchInput == '' &&
    this.lastNDays == 'default'
  ) {
    this.tasks = this.tasksFiltro;
  } else {
    // search by title
    if (this.searchInput != '') {
      this.tasks = this.tasksFiltro.filter((task) =>
        task.title.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    }

    // search by responsavel
    if (
      this.responsavelSearch != 'default' &&
      this.statusSearch == 'default' &&
      this.prioridadeSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter((task) => task.responsavel == this.responsavelSearch);
    }

    // search by responsavel and status
    if (
      this.responsavelSearch != 'default' &&
      this.statusSearch != 'default' &&
      this.prioridadeSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter(
        (task) => task.responsavel == this.responsavelSearch && task.status == this.statusSearch
      );
    }

    // search by responsavel and prioridade
    if (
      this.responsavelSearch != 'default' &&
      this.prioridadeSearch != 'default' &&
      this.statusSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter(
        (task) => task.responsavel == this.responsavelSearch && task.prioridade == this.prioridadeSearch
      );
    }

    // search by status
    if (
      this.statusSearch != 'default' &&
      this.prioridadeSearch == 'default' &&
      this.responsavelSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter((task) => task.status == this.statusSearch);
    }

    // search by status and prioridade
    if (
      this.statusSearch != 'default' &&
      this.prioridadeSearch != 'default' &&
      this.responsavelSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter(
        (task) => task.status == this.statusSearch && task.prioridade == this.prioridadeSearch
      );
    }

    // search by prioridade
    if (
      this.prioridadeSearch != 'default' &&
      this.statusSearch == 'default' &&
      this.responsavelSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter((task) => task.prioridade == this.prioridadeSearch);
    }

    // search by projeto
    if (
      this.projetoSearch != 'default' &&
      this.statusSearch == 'default' &&
      this.prioridadeSearch == 'default' &&
      this.responsavelSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter((task) => task.projeto == this.projetoSearch);
    }

    // search by responsavel, status and prioridade
    if (
      this.responsavelSearch != 'default' &&
      this.statusSearch != 'default' &&
      this.prioridadeSearch != 'default' &&
      this.projetoSearch == 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter(
        (task) =>
          task.responsavel == this.responsavelSearch &&
          task.status == this.statusSearch &&
          task.prioridade == this.prioridadeSearch
      );
    }

    // search by responsavel, status, prioridade and projeto
    if (
      this.responsavelSearch != 'default' &&
      this.statusSearch != 'default' &&
      this.prioridadeSearch != 'default' &&
      this.projetoSearch != 'default' &&
      this.lastNDays == 'default'
    ) {
      this.tasks = this.tasksFiltro.filter(
        (task) =>
          task.responsavel == this.responsavelSearch &&
          task.status == this.statusSearch &&
          task.prioridade == this.prioridadeSearch &&
          task.projeto == this.projetoSearch
      );
    }

    // search by createdAt
    if (this.lastNDays != 'default') {
      const today = new Date();
      const daysAgo = new Date(today.getTime() - parseInt(this.lastNDays) * 24 * 60 * 60 * 1000);
      const createdAtLimit = daysAgo.toISOString();
      this.tasks = this.tasksFiltro.filter((task) => task.createdAt >= createdAtLimit);
    }
  }

  // reset search inputs
  this.searchInput = '';
  this.responsavelSearch = 'default';
  this.statusSearch = 'default';
  this.prioridadeSearch = 'default';
  this.projetoSearch = 'default';
  this.lastNDays = 'default';
}

  private production: boolean = true;
  isLogged: boolean = false;

  ngOnInit(): void {
    if (this.production == false) {
      this.isLogged = true;
    } else {
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
}
