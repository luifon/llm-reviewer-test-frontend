import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  Task,
  TaskFilter,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filterForm: FormGroup;
  loading = false;
  error: string | null = null;
  readonly TaskStatus = TaskStatus;
  readonly TaskPriority = TaskPriority;
  readonly TaskCategory = TaskCategory;

  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: [[]],
      priority: [[]],
      category: [[]],
      assignedTo: [''],
      dueDateStart: [null],
      dueDateEnd: [null],
      searchTerm: [''],
      tags: [[]],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.loading = true;
    this.error = null;

    const filter: TaskFilter = {
      status: this.filterForm.get('status')?.value,
      priority: this.filterForm.get('priority')?.value,
      category: this.filterForm.get('category')?.value,
      assignedTo: this.filterForm.get('assignedTo')?.value,
      dueDateRange:
        this.filterForm.get('dueDateStart')?.value &&
        this.filterForm.get('dueDateEnd')?.value
          ? {
              start: this.filterForm.get('dueDateStart')?.value,
              end: this.filterForm.get('dueDateEnd')?.value,
            }
          : undefined,
      searchTerm: this.filterForm.get('searchTerm')?.value,
      tags: this.filterForm.get('tags')?.value,
    };

    this.taskService
      .getTasks(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load tasks. Please try again.';
          this.loading = false;
          console.error('Error loading tasks:', error);
        },
      });
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.loadTasks();
      });
  }

  updateTaskStatus(taskId: string, newStatus: TaskStatus): void {
    this.taskService
      .updateTask(taskId, { status: newStatus })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          const index = this.tasks.findIndex((t) => t.id === taskId);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
        },
        error: (error) => {
          this.error = 'Failed to update task status. Please try again.';
          console.error('Error updating task status:', error);
        },
      });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService
        .deleteTask(taskId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.tasks = this.tasks.filter((t) => t.id !== taskId);
          },
          error: (error) => {
            this.error = 'Failed to delete task. Please try again.';
            console.error('Error deleting task:', error);
          },
        });
    }
  }

  clearFilters(): void {
    this.filterForm.reset({
      status: [],
      priority: [],
      category: [],
      assignedTo: '',
      dueDateStart: null,
      dueDateEnd: null,
      searchTerm: '',
      tags: [],
    });
  }
}
