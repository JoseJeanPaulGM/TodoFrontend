// src/app/features/tasks/components/task-list/task-list.component.ts
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service'; 
import { Task } from '../../models/task.model'; 

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {
    id: 0,
    title: '',
    description: '',
    isComplete: false
  };
  editMode = false;
  editingId: number | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  onSubmit() {
    if (this.editMode && this.editingId) {
      // Actualizar tarea existente
      this.taskService.updateTask(this.editingId, this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.cancelEdit();
        },
        error: (error) => console.error('Error updating task:', error)
      });
    } else {
      // Crear nueva tarea
      this.taskService.createTask(this.newTask).subscribe({
        next: () => {
          this.loadTasks();
          this.resetForm();
        },
        error: (error) => console.error('Error creating task:', error)
      });
    }
  }

  editTask(task: Task) {
    this.editMode = true;
    this.editingId = task.id;
    this.newTask = { ...task };
  }

  cancelEdit() {
    this.editMode = false;
    this.editingId = null;
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
    if (confirm('¿Está seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  toggleStatus(task: Task) {
    this.taskService.updateStatus(task.id!, !task.isComplete).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Error updating status:', error)
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => console.error('Error loading tasks:', error)
    });
  }
}