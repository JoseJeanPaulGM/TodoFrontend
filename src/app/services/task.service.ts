import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { PagedResponse } from '../models/PagedResponse';
import { PaginationParameters } from '../models/PaginationParameters';

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
  
  // Método actualizado para obtener tareas paginadas
  getTasks(parameters: PaginationParameters = { pageNumber: 1, pageSize: 10 }): Observable<PagedResponse<Task>> {
    console.log('Solicitando tareas paginadas a:', this.apiUrl);
    let params = new HttpParams()
      .set('pageNumber', parameters.pageNumber.toString())
      .set('pageSize', parameters.pageSize.toString());
      
    return this.http.get<PagedResponse<Task>>(this.apiUrl, { params }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Método para obtener tareas por estado con paginación
  getTasksByCompletion(isComplete: boolean, parameters: PaginationParameters = { pageNumber: 1, pageSize: 10 }): Observable<PagedResponse<Task>> {
    console.log(`Solicitando tareas ${isComplete ? 'completadas' : 'pendientes'} paginadas`);
    let params = new HttpParams()
      .set('pageNumber', parameters.pageNumber.toString())
      .set('pageSize', parameters.pageSize.toString());
      
    return this.http.get<PagedResponse<Task>>(`${this.apiUrl}/estado/${isComplete}`, { params }).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  
  // Métodos existentes
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