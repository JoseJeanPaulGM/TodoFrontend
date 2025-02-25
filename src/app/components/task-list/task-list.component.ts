// Importaciones necesarias
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { PagedResponse } from '../../models/PagedResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Almacena la lista de tareas
  tasks: Task[] = [];
  
  // Información de paginación
  paginationInfo: PagedResponse<Task> | null = null;
  currentPage = 1;
  pageSize = 10;
  Math = Math;

  // Modelo para nueva tarea o tarea en edición
  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    isComplete: false
  };

  // Control del modo edición
  editMode = false;
  editingId = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks(true);
  }

  // Métodos de paginación
  goToPage(page: number): void {
    this.currentPage = page;
    this.loadTasks(false);
  }

  calcularFin(): number {
    if (this.paginationInfo) {
      return Math.min(this.currentPage * this.pageSize, this.paginationInfo.totalCount);
    }
    return 0;
  }

  previousPage(): void {
    if (this.paginationInfo?.hasPrevious) {
      this.currentPage--;
      this.loadTasks(false);
    }
  }

  nextPage(): void {
    if (this.paginationInfo?.hasNext) {
      this.currentPage++;
      this.loadTasks(false);
    }
  }

  validateForm(): boolean {
    // [código existente sin cambios]
    if (!this.newTask.title || this.newTask.title.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El título de la tarea es obligatorio',
        confirmButtonColor: '#0d6efd',
        timer: 2000
      });
      return false;
    }

    if (this.newTask.title.length < 3) {
      Swal.fire({
        icon: 'warning',
        title: 'Título muy corto',
        text: 'El título debe tener al menos 3 caracteres',
        confirmButtonColor: '#0d6efd',
        timer: 2000
      });
      return false;
    }

    if (!this.newTask.description || this.newTask.description.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'La descripción de la tarea es obligatoria',
        confirmButtonColor: '#0d6efd',
        timer: 2000
      });
      return false;
    }

    return true;
  }

  onSubmit() {
    // [código existente sin cambios]
    if (!this.validateForm()) {
      return;
    }

    if (this.editMode && this.editingId) {
      Swal.fire({
        title: '¿Actualizar tarea?',
        text: '¿Está seguro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        width: '250px',
        timer: 3000,
        timerProgressBar: true,
        customClass: {
          popup: 'small-alert'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.taskService.updateTask(this.editingId, this.newTask).subscribe({
            next: () => {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Actualizado',
                showConfirmButton: false,
                timer: 1000,
                width: '300px',
              });
              this.loadTasks(false);
              this.cancelEdit();
            },
            error: (error) => {
              console.error('Error updating task:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la tarea',
                confirmButtonColor: '#dc3545',
                timer: 1500,
                width: '250px',
              });
            }
          });
        }
      });
    } else {
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Creado',
            showConfirmButton: false,
            timer: 3000,
            width: '300px',
          });
          this.loadTasks(false);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la tarea',
            confirmButtonColor: '#dc3545',
            timer: 1500,
            width: '250px',
          });
        }
      });
    }
  }

  // Métodos sin cambios
  editTask(task: Task) {
    this.editMode = true;
    this.editingId = task.id || 0;
    this.newTask = { ...task };
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = 0;
    this.resetForm();
  }

  resetForm() {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      isComplete: false
    };
  }

  deleteTask(id: number) {
    // [código existente sin cambios]
    Swal.fire({
      title: '¿Eliminar tarea?',
      text: '¿Está seguro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      width: '290px',
      timer: 3000,
      timerProgressBar: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Eliminado',
              showConfirmButton: false,
              timer: 3000,
              width: '300px',
            });
            this.loadTasks(false);
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar',
              confirmButtonColor: '#dc3545',
              timer: 1500,
              width: '250px',
            });
          }
        });
      }
    });
  }

  toggleStatus(task: Task) {
    // [código existente sin cambios]
    if (task.id) {
      this.taskService.updateStatus(task.id, !task.isComplete).subscribe({
        next: () => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: !task.isComplete ? 'Tarea completada' : 'Tarea pendiente',
            showConfirmButton: false,
            timer: 1500,
            width: '290px',
          });
          this.loadTasks(false);
        },
        error: (error) => {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el estado',
            confirmButtonColor: '#dc3545',
            timer: 1500,
            width: '250px',
          });
        }
      });
    }
  }

  // Método actualizado para usar paginación
  private loadTasks(showMessage: boolean = false) {
    this.taskService.getTasks({ pageNumber: this.currentPage, pageSize: this.pageSize }).subscribe({
      next: (response) => {
        this.tasks = response.items;
        this.paginationInfo = response;
        
        if (showMessage) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Cargando Lista de Tareas',
            showConfirmButton: false,
            timer: 1500,
            width: '300px',
            customClass: {
              popup: 'small-toast'
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las tareas',
          confirmButtonColor: '#dc3545',
          timer: 1500,
          width: '250px',
        });
      }
    });
  }
}