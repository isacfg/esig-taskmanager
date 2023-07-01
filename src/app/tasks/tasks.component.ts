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

  private production: boolean = true;

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
    let tasksR = await this.tarefasService.getTasksByUserID(this.uid);

    // converter prazo para devolver pro input
    for (let i = 0; i < tasksR.length; i++) {
      let s = tasksR[i].prazo.toDate();
      tasksR[i].prazo = s.toISOString().substring(0, 10);
    }

    this.tasks = tasksR;
    this.tasksFiltro = tasksR;
    this.arrayResponsaveis = await this.tarefasService.getAllResponsaveis(this.uid);
    this.arrayProjetos = await this.tarefasService.getAllProjetos(this.uid);
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

  async search() {
    // if nothing is selected, return all tasks
    if (
      this.responsavelSearch == 'default' &&
      this.statusSearch == 'default' &&
      this.prioridadeSearch == 'default' &&
      this.projetoSearch == 'default' &&
      this.searchInput == ''
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
        this.projetoSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter((task) => task.responsavel == this.responsavelSearch);
      }

      // search by responsavel and status
      if (
        this.responsavelSearch != 'default' &&
        this.statusSearch != 'default' &&
        this.prioridadeSearch == 'default' &&
        this.projetoSearch == 'default'
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
        this.projetoSearch == 'default'
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
        this.projetoSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter((task) => task.status == this.statusSearch);
      }

      // search by status and prioridade
      if (
        this.statusSearch != 'default' &&
        this.prioridadeSearch != 'default' &&
        this.responsavelSearch == 'default' &&
        this.projetoSearch == 'default'
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
        this.projetoSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter((task) => task.prioridade == this.prioridadeSearch);
      }

      // search by projeto
      if (
        this.projetoSearch != 'default' &&
        this.statusSearch == 'default' &&
        this.prioridadeSearch == 'default' &&
        this.responsavelSearch == 'default'
      ) {
        this.tasks = this.tasksFiltro.filter((task) => task.projeto == this.projetoSearch);
      }

      // search by responsavel, status and prioridade
      if (
        this.responsavelSearch != 'default' &&
        this.statusSearch != 'default' &&
        this.prioridadeSearch != 'default' &&
        this.projetoSearch == 'default'
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
        this.projetoSearch != 'default'
      ) {
        this.tasks = this.tasksFiltro.filter(
          (task) =>
            task.responsavel == this.responsavelSearch &&
            task.status == this.statusSearch &&
            task.prioridade == this.prioridadeSearch &&
            task.projeto == this.projetoSearch
        );
      }
    }

    // reset search inputs
    this.searchInput = '';
    this.responsavelSearch = 'default';
    this.statusSearch = 'default';
    this.prioridadeSearch = 'default';
    this.projetoSearch = 'default';
  }

  isLogged: boolean = false; // trocar pra false in production

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
