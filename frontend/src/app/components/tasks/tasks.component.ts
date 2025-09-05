import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { Task } from './task.model';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    MatFormFieldModule 
  ],
  template: `
    <div class="toolbar">
      <button mat-raised-button color="primary" (click)="showCreateModal = !showCreateModal">
        {{ showCreateModal ? 'Fechar' : '+ Nova Tarefa' }}
      </button>
      <button mat-stroked-button color="warn" (click)="onLogout()">Sair</button>
    </div>

    <div class="modal-overlay" *ngIf="showCreateModal">
      <div class="create-modal">
        <h2>Nova Tarefa</h2>
        <mat-form-field class="full">
          <input matInput [(ngModel)]="newTaskTitle" placeholder="Título (obrigatório)">
        </mat-form-field>
        <mat-form-field class="full">
          <textarea matInput [(ngModel)]="newTaskDescription" placeholder="Descrição"></textarea>
        </mat-form-field>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="createTask()" [disabled]="!newTaskTitle.trim()">Criar</button>
          <button mat-button (click)="showCreateModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="board">
      <mat-card *ngFor="let task of tasks" [class.editing]="editingTaskId === task.id">
        <mat-card-title class="card-header">
          <span class="card-title">{{ task.title }}</span>
          <span class="card-status" [class.done]="task.completed">
            {{ task.completed ? '✔ Concluída' : '⏳ Pendente' }}
          </span>
        </mat-card-title>

        <mat-card-content>
          <div *ngIf="editingTaskId !== task.id; else editMode">
            <p class="card-description">{{ task.description }}</p>
          </div>

          <ng-template #editMode>
            <mat-form-field class="full">
              <input matInput [(ngModel)]="task.title" placeholder="Título">
            </mat-form-field>
            <mat-form-field class="full">
              <textarea matInput [(ngModel)]="task.description" placeholder="Descrição"></textarea>
            </mat-form-field>
            <mat-checkbox [(ngModel)]="task.completed">Concluída</mat-checkbox>
          </ng-template>
        </mat-card-content>

        <mat-card-actions class="card-footer">
          <button mat-button color="primary" (click)="selectTask(task)">Editar</button>
          <button mat-button color="warn" (click)="deleteTask(task.id)">Deletar</button>
          <button mat-button (click)="cancelEdit()">Cancelar</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  showCreateModal = false;
  newTaskTitle = '';
  newTaskDescription = '';
  editingTaskId: number | null = null;

  constructor(
    private api: ApiService,
    private router: Router,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.api.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTasks();
  }

  loadTasks() {
    this.api.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        this.snack.open('❌ Erro ao carregar tarefas: ' + err.message, 'Fechar', { duration: 3000 });
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  createTask() {
    if (this.newTaskTitle.trim()) {
      this.api.createTask(this.newTaskTitle, this.newTaskDescription).subscribe({
        next: (task) => {
          this.tasks.push(task);
          this.newTaskTitle = '';
          this.newTaskDescription = '';
          this.showCreateModal = false;
          this.cdr.detectChanges();
          this.snack.open('✅ Tarefa criada com sucesso!', 'Fechar', { duration: 2000 });
        },
        error: (err) => {
          this.snack.open('❌ Erro ao criar tarefa', 'Fechar', { duration: 2000 });
        }
      });
    } else {
      this.snack.open('❌ Título é obrigatório', 'Fechar', { duration: 2000 });
    }
  }

  selectTask(task: Task) {
    this.editingTaskId = task.id;
  }

  saveTask(task: Task) {
    if (task.title.trim()) {
      this.api.updateTask(task.id, task.title, task.description, task.completed).subscribe({
        next: () => {
          this.editingTaskId = null;
          this.cdr.detectChanges(); 
          this.snack.open('✅ Tarefa atualizada!', 'Fechar', { duration: 2000 });
        },
        error: (err) => {
          this.snack.open('❌ Erro ao atualizar tarefa', 'Fechar', { duration: 2000 });
        }
      });
    } else {
      this.snack.open('❌ Título é obrigatório', 'Fechar', { duration: 2000 });
    }
  }

  deleteTask(id: number) {
    this.api.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.cdr.detectChanges(); 
        this.snack.open('✅ Tarefa deletada!', 'Fechar', { duration: 2000 });
      },
      error: (err) => {
        this.snack.open('❌ Erro ao deletar tarefa', 'Fechar', { duration: 2000 });
      }
    });
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.loadTasks();  
  }

  onLogout() {
    this.api.logout();
    this.snack.open('👋 Logout realizado!', 'Fechar', { duration: 2000 });
    this.router.navigate(['/login']);
  }
}