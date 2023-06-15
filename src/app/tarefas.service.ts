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
      const q = query(
        collection(this.db, 'tasks'),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByProjetoUserID(projeto: string, userID: string) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('projeto', '==', projeto),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByStatusUserID(status: string, userID: string) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('status', '==', status),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByResponsavelUserID(responsavel: string, userID: string) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('responsavel', '==', responsavel),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByProjetoStatusUserID(
    projeto: string,
    status: string,
    userID: string
  ) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('projeto', '==', projeto),
        where('status', '==', status),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByProjetoResponsavelUserID(
    projeto: string,
    responsavel: string,
    userID: string
  ) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('projeto', '==', projeto),
        where('responsavel', '==', responsavel),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async getTasksByAllUserID(
    projeto: string,
    status: string,
    responsavel: string,
    userID: string
  ) {
    try {
      const q = query(
        collection(this.db, 'tasks'),
        where('projeto', '==', projeto),
        where('status', '==', status),
        where('responsavel', '==', responsavel),
        where('userID', '==', userID)
      );
      const querySnapshot = await getDocs(q);
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

  async createTask(task: any) {
    try {
      const docRef = await addDoc(collection(this.db, 'tasks'), task);
      console.log('Adicionado com sucesso: ', docRef.id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }

  async updateTask(task: any) {
    try {
      const docRef = doc(this.db, 'tasks', task.id);
      await updateDoc(docRef, task);
      console.log('Atualizado com sucesso: ', docRef.id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }

  async deleteTask(task: any) {
    try {
      const docRef = doc(this.db, 'tasks', task.id);
      await deleteDoc(docRef);
      console.log('Deletado com sucesso: ', docRef.id);
    } catch (e) {
      console.error('Erro: ', e);
    }
  }
}
