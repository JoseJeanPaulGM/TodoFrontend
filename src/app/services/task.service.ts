import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry,catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7202/api/task';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Ocurrió un error:', error);
    console.log('API URL:', this.apiUrl)
    return throwError(() => new Error('Algo falló en la petición; por favor intente nuevamente'));
  }

  getTasks(): Observable<Task[]> {
    console.log('Solicitando tareas a:', this.apiUrl);
    return this.http.get<Task[]>(this.apiUrl).pipe(
      retry(3), 
      catchError(this.handleError)
    
    );
  }

  createTask(task: Task): Observable<Task> {
    console.log('Creando tarea:', task);
    const { id, ...taskWithoutId } = task;
    return this.http.post<Task>(this.apiUrl, taskWithoutId).pipe(
      tap(response => console.log('Respuesta al crear:', response)),
      catchError(this.handleError)
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    console.log(`Actualizando tarea ${id}:`, task);
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(response => console.log('Respuesta al actualizar:', response)),
      catchError(this.handleError)
    );
  }

  updateStatus(id: number, isComplete: boolean): Observable<any> {
    console.log(`Actualizando estado de tarea ${id} a:`, isComplete);
    return this.http.put(`${this.apiUrl}/estado/${id}`, { isComplete }).pipe(
      tap(response => console.log('Respuesta al cambiar estado:', response)),
      catchError(this.handleError)
    );
  }

  deleteTask(id: number): Observable<any> {
    console.log('Eliminando tarea:', id);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Respuesta al eliminar:', response)),
      catchError(this.handleError)
    );
  }
}