import { Injectable } from '@angular/core';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class TarefasService {
  private db = getFirestore();

  constructor() {}

  private production = true;
  public globalTasks: any[] = [];
  public mockTasks: any[] = [
    {
      id: '1',
      title: 'Tarefa 1',
      description: 'descrição',
      prazo: '2023-07-28',
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
      prazo: '2023-07-04',
      prioridade: 'Alta',
      projeto: 'Projeto Amendis',
      responsavel: 'Pedro',
      status: 'Em andamento',
      userID: 'vDJ1fa0ztXYlXyfmKFpHkHHfnPu1',
    },
    {
      id: '2',
      title: 'Tarefa 2',
      description: 'descrição',
      prazo: '2023-07-12',
      prioridade: 'Baixa',
      projeto: 'Projeto Amendis',
      responsavel: 'Pedro',
      status: 'Não iniciada',
      userID: 'vDJ1fa0ztXYlXyfmKFpHkHHfnPu1',
    },
  ];

  async injectTasks(userID: string, res = false, proj = false) {
    if (this.globalTasks.length === 0 && this.production === true) {
      this.globalTasks = await this.getTasksByUserID(userID);

      // converter prazo para devolver pro input
      for (let i = 0; i < this.globalTasks.length; i++) {
        let s = new Date(this.globalTasks[i].prazo.toDate().getTime());
        this.globalTasks[i].prazo = s.toISOString().substring(0, 10);
      }
    }
    if (res && this.production === true) {
      return this.getAllResponsaveis(userID);
    }
    if (proj && this.production === true) {
      return this.getAllProjetos(userID);
    }

    if (this.production === false) {
      this.globalTasks = this.mockTasks;
    }

    return this.globalTasks;
  }

  async bypassCache(userID: string) {
    this.globalTasks = await this.getTasksByUserID(userID);

    // converter prazo para devolver pro input
    for (let i = 0; i < this.globalTasks.length; i++) {
      let s = new Date(this.globalTasks[i].prazo.toDate().getTime());
      this.globalTasks[i].prazo = s.toISOString().substring(0, 10);
    }

    return this.globalTasks;
  }

  pushTask(title, description, prioridade, status, prazo, responsavel, projeto, userID, createdAt) {
    let task = {
      title,
      description,
      prioridade,
      status,
      prazo,
      responsavel,
      projeto,
      userID,
      createdAt,
    };

    this.globalTasks.push(task);
  }

  async getTasks() {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'tasks'));
      const tasks: any[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    } catch (e) {
      console.error('Erro: ', e);
      return [];
    }
  }

  async getTasksByUserID(userID: string) {
    try {
      const q = query(collection(this.db, 'tasks'), where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const tasks: any[] = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      console.log('db called');
      return tasks;
    } catch (e) {
      console.error('Erro: ', e);
      return [];
    }
  }

  async getAllResponsaveis(userID: string) {
    try {
      // const q = query(collection(this.db, 'tasks'));
      const q = query(collection(this.db, 'tasks'), where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const responsaveis: string[] = [];
      querySnapshot.forEach((doc) => {
        const responsavel = doc.data()['responsavel'];
        if (responsavel && !responsaveis.includes(responsavel)) {
          responsaveis.push(responsavel);
        }
      });
      return responsaveis;
    } catch (e) {
      console.error('Erro: ', e);
      return [];
    }
  }

  async getAllProjetos(userID: string) {
    try {
      // const q = query(collection(this.db, 'tasks'));
      const q = query(collection(this.db, 'tasks'), where('userID', '==', userID));
      const querySnapshot = await getDocs(q);
      const projetos: string[] = [];
      querySnapshot.forEach((doc) => {
        const projeto = doc.data()['projeto'];
        if (projeto && !projetos.includes(projeto)) {
          projetos.push(projeto);
        }
      });
      return projetos;
    } catch (e) {
      console.error('Erro: ', e);
      return [];
    }
  }

  async createTask(task: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'tasks'), task);
      console.log('Criado com sucesso: ', docRef.id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }

  async updateTask(id, task: any) {
    try {
      const docRef = doc(this.db, 'tasks', id);
      await updateDoc(docRef, task);
      console.log('Atualizado com sucesso: ', docRef.id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }

  // delete using only the id
  async deleteTask(id: string) {
    try {
      await deleteDoc(doc(this.db, 'tasks', id));
      console.log('Deletado com sucesso: ', id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }
}
