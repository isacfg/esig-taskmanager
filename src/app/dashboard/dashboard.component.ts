import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { Router } from '@angular/router';
import { TarefasService } from '../tarefas.service';
import { Timestamp } from 'firebase/firestore';
// import { Chart, CategoryScale } from 'chart.js';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
// Add any additional code here
export class DashboardComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private tarefasService: TarefasService) {}

  tasks = [];

  tasksHighPriority = [];
  numeroTarefasConcluidas = [];
  numeroTarefasEmAndamento = [];
  numeroTarefasAltaPrioridade = [];

  // criar tarefa
  description: string = '';
  prazo;
  prioridade: string = '';
  projeto: string = '';
  responsavel: string = '';
  status: string = '';
  title: string = '';

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

  taskCounts() {
    let td = this.taskDates();
    let tc = [];
    td.forEach((date: any) => {
      const key = `${date.month}-${date.year}`;
      tc[key] = (tc[key] || 0) + 1;
    });
    return tc;
  }

  taskDates() {
    let td = this.tasks;
    // console.log(td[0].prazo);
    // let td = [
    //   { prazo: '2022-01-01' },
    //   { prazo: '2022-01-01' },
    //   { prazo: '2022-02-01' },
    //   { prazo: '2022-02-01' },
    //   { prazo: '2022-03-01' },
    //   { prazo: '2022-03-01' },
    //   { prazo: '2022-03-01' },
    // ];
    return td.map((task) => {
      const date = new Date(task.prazo);
      const name = task.title;
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
        name,
      };
    });
  }

  chart = null;
  @ViewChild('myChart', { static: true }) myChart: ElementRef;
  // Chart.registerScaleType('category', CategoryScale);


 createChart() {
  const taskCounts = this.taskCounts();
   const taskDates = this.taskDates();
   
  const ctx = document.getElementById('myChart') as HTMLCanvasElement;

  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(taskCounts),
      datasets: [
        {
          label: 'Número de tarefas por dia',
          data: Object.values(taskCounts),
          backgroundColor: '#4ad894',
          borderColor: '#4ad894',
          fill: false,
          tension: 0.1
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          ticks: {
            callback: (value: any) => {
              const date = taskDates[value];
              return `${date.month}-${date.year}`;
            },
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: '#fff', 
          bodyFont: {
            size: 14,
            weight: 'bold'
          },
          callbacks: {
            label: (context: any) => {
              const date = taskDates[context.dataIndex];
              let names = '';
              this.tasks.forEach((task) => {
                const taskDate = new Date(task.prazo);
                if (
                  taskDate.getMonth() == date.month &&
                  taskDate.getFullYear() == date.year
                ) {
                  names += task.title + ', ';
                }
              });
              return `${date.month} - ${date.year} -  ${names}`;
            }, 
            labelTextColor: (context: any) => {
              return '#263238'
            }
          }
        }
      }
    },
  });
}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart();
    }, 3000);
  }

  prevWidth = 0;
 @HostListener('window:resize', ['$event'])
onResize(event: any) {
  const newWidth = event.target.innerWidth;
  const widthDiff = Math.abs(this.prevWidth - newWidth);
  if (widthDiff > 200) {
    this.prevWidth = newWidth;
    this.chart.destroy();
    this.createChart();
  }
}
}
