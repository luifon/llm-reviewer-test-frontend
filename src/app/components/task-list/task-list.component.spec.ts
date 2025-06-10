import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      category: TaskCategory.DEVELOPMENT,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: 'John Doe',
      tags: ['test', 'angular'],
      estimatedHours: 4,
      actualHours: 2,
      attachments: [],
      comments: [],
    },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'updateTask',
      'deleteTask',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [
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
        BrowserAnimationsModule,
      ],
      providers: [FormBuilder, { provide: TaskService, useValue: spy }],
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService.getTasks.and.returnValue(of(mockTasks));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should update task status', () => {
    const taskId = '1';
    const newStatus = TaskStatus.IN_PROGRESS;
    taskService.updateTask.and.returnValue(
      of({ ...mockTasks[0], status: newStatus })
    );

    component.updateTaskStatus(taskId, newStatus);

    expect(taskService.updateTask).toHaveBeenCalledWith(taskId, {
      status: newStatus,
    });
    expect(component.tasks[0].status).toBe(newStatus);
  });

  it('should delete task', () => {
    const taskId = '1';
    taskService.deleteTask.and.returnValue(of(void 0));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteTask(taskId);

    expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
    expect(component.tasks.length).toBe(0);
  });

  it('should not delete task if user cancels', () => {
    const taskId = '1';
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteTask(taskId);

    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.tasks.length).toBe(1);
  });

  it('should handle error when loading tasks', () => {
    const errorMessage = 'Error loading tasks';
    taskService.getTasks.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.loadTasks();

    expect(component.error).toBe(errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should clear filters', () => {
    component.filterForm.patchValue({
      searchTerm: 'test',
      status: [TaskStatus.TODO],
      priority: [TaskPriority.HIGH],
      category: [TaskCategory.DEVELOPMENT],
      assignedTo: 'John',
      dueDateStart: new Date(),
      dueDateEnd: new Date(),
    });

    component.clearFilters();

    expect(component.filterForm.value).toEqual({
      searchTerm: '',
      status: [],
      priority: [],
      category: [],
      assignedTo: '',
      dueDateStart: null,
      dueDateEnd: null,
    });
  });

  it('should apply filters when form changes', () => {
    const filterValue = {
      searchTerm: 'test',
      status: [TaskStatus.TODO],
      priority: [TaskPriority.HIGH],
      category: [TaskCategory.DEVELOPMENT],
      assignedTo: 'John',
      dueDateStart: new Date(),
      dueDateEnd: new Date(),
    };

    component.filterForm.patchValue(filterValue);

    expect(taskService.getTasks).toHaveBeenCalledWith(filterValue);
  });
});
