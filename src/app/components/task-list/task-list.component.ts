// Importaciones necesarias
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import Swal from 'sweetalert2';

/**
 * Componente para la gestión de tareas
 * Permite crear, editar, eliminar y cambiar estado de tareas
 */
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // Almacena la lista de tareas
  tasks: Task[] = [];

  // Modelo para nueva tarea o tarea en edición
  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    isComplete: false
  };

  // Control del modo edición
  editMode = false;
  // ID de la tarea en edición
  editingId = 0;

  /**
   * Constructor del componente
   * @param taskService Servicio para operaciones CRUD de tareas
   */
  constructor(private taskService: TaskService) {}

  /**
   * Inicialización del componente
   * Carga las tareas al inicio
   */
  ngOnInit() {
    this.loadTasks(true);
  }

  /**
   * Valida el formulario de tarea
   * Verifica título y descripción
   * @returns boolean - true si el formulario es válido
   */
  validateForm(): boolean {
    // Validación del título
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

    // Validación de longitud mínima del título
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

    // Validación de la descripción
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

  /**
   * Maneja el envío del formulario
   * Crea nueva tarea o actualiza existente
   */
  onSubmit() {
    // Validación inicial del formulario
    if (!this.validateForm()) {
      return;
    }

    // Lógica para actualizar tarea existente
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
          // Llamada al servicio para actualizar
          this.taskService.updateTask(this.editingId, this.newTask).subscribe({
            next: () => {
              // Notificación de éxito
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
              // Manejo de error
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
      // Lógica para crear nueva tarea
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          // Notificación de éxito
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
          // Manejo de error
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

  /**
   * Activa el modo edición para una tarea
   * @param task Tarea a editar
   */
  editTask(task: Task) {
    this.editMode = true;
    this.editingId = task.id || 0;
    this.newTask = { ...task }; // Copia la tarea para edición
  }

  /**
   * Cancela el modo edición
   * Limpia el formulario
   */
  cancelEdit() {
    this.editMode = false;
    this.editingId = 0;
    this.resetForm();
  }

  /**
   * Reinicia el formulario a valores por defecto
   */
  resetForm() {
    this.newTask = {
      id: 0,
      title: '',
      description: '',
      isComplete: false
    };
  }

  /**
   * Elimina una tarea
   * @param id ID de la tarea a eliminar
   */
  deleteTask(id: number) {
    // Confirmación de eliminación
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
        // Llamada al servicio para eliminar
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            // Notificación de éxito
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
            // Manejo de error
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

  /**
   * Cambia el estado de una tarea (completada/pendiente)
   * @param task Tarea a modificar
   */
  toggleStatus(task: Task) {
    if (task.id) {
      // Llamada al servicio para actualizar estado
      this.taskService.updateStatus(task.id, !task.isComplete).subscribe({
        next: () => {
          // Notificación de éxito
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
          // Manejo de error
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

  /**
   * Carga la lista de tareas desde el servidor
   * @param showMessage Indica si se debe mostrar mensaje de carga
   */
  private loadTasks(showMessage: boolean = false) {
    // Llamada al servicio para obtener tareas
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        if (showMessage) {
          // Notificación de carga exitosa
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
        // Manejo de error
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