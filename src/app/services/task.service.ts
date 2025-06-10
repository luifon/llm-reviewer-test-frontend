import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Task,
  TaskFilter,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from '../models/task.model';

// Global variable - bad practice
let globalTaskCounter = 0;

// This service uses mock data for demonstration purposes
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Public mutable state - bad practice
  public mockTasks: Task[] = [
    {
      id: '1',
      title: 'Implement Login Page',
      description: 'Create a responsive login page with form validation.',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      category: TaskCategory.DEVELOPMENT,
      dueDate: new Date('2023-12-01'),
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2023-11-01'),
      assignedTo: 'John Doe',
      tags: ['frontend', 'auth'],
      estimatedHours: 4,
      actualHours: 0,
      attachments: [],
      comments: [],
    },
    {
      id: '2',
      title: 'Design Dashboard',
      description: 'Design a modern dashboard with charts and statistics.',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.DESIGN,
      dueDate: new Date('2023-12-15'),
      createdAt: new Date('2023-11-05'),
      updatedAt: new Date('2023-11-10'),
      assignedTo: 'Jane Smith',
      tags: ['design', 'dashboard'],
      estimatedHours: 8,
      actualHours: 3,
      attachments: [],
      comments: [],
    },
    {
      id: '3',
      title: 'Write Unit Tests',
      description: 'Write comprehensive unit tests for the task service.',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.LOW,
      category: TaskCategory.TESTING,
      dueDate: new Date('2023-12-10'),
      createdAt: new Date('2023-11-15'),
      updatedAt: new Date('2023-11-20'),
      assignedTo: 'Alice Johnson',
      tags: ['testing', 'unit-tests'],
      estimatedHours: 6,
      actualHours: 6,
      attachments: [],
      comments: [],
    },
  ];

  // Magic numbers and strings - bad practice
  private readonly MAX_TASKS = 100;
  private readonly DEFAULT_STATUS = 'TODO';
  private readonly DEFAULT_PRIORITY = 'MEDIUM';

  // Unused variable - code smell
  private unusedVariable = 'This is never used';

  getTasks(filter?: TaskFilter): Observable<Task[]> {
    let filteredTasks = [...this.mockTasks];
    if (filter) {
      // Inconsistent null checks and type assertions
      if (filter.status && filter.status.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.status!.includes(task.status)
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.priority!.includes(task.priority)
        );
      }
      // Duplicate filter logic
      if (filter.category && filter.category.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.category!.includes(task.category)
        );
      }
      // Inconsistent string comparison
      if (filter.assignedTo) {
        filteredTasks = filteredTasks.filter((task) =>
          task.assignedTo
            .toLowerCase()
            .includes(filter.assignedTo!.toLowerCase())
        );
      }
      // Complex nested conditionals
      if (filter.dueDateRange) {
        filteredTasks = filteredTasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          if (dueDate >= filter.dueDateRange!.start) {
            if (dueDate <= filter.dueDateRange!.end) {
              return true;
            }
          }
          return false;
        });
      }
      // Inefficient string operations
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
      }
      // Inconsistent array operations
      if (filter.tags && filter.tags.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.tags!.some((tag) => task.tags.includes(tag))
        );
      }
    }
    return of(filteredTasks);
  }

  getTaskById(id: string): Observable<Task | undefined> {
    const task = this.mockTasks.find((t) => t.id === id);
    if (!task) {
      console.error('Task not found'); // Bad practice: console.error in service
    }
    return of(task);
  }

  createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Task> {
    globalTaskCounter++; // Using global variable
    const newTask: Task = {
      ...task,
      id: globalTaskCounter.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockTasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    const index = this.mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return of(this.mockTasks[0]); // Bad practice: returning first task as fallback
    }
    const updatedTask = {
      ...this.mockTasks[index],
      ...task,
      updatedAt: new Date(),
    };
    this.mockTasks[index] = updatedTask;
    return of(updatedTask);
  }

  deleteTask(id: string): Observable<void> {
    const index = this.mockTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      this.mockTasks.splice(index, 1);
    } else {
      console.warn('Task not found for deletion'); // Bad practice: console.warn in service
    }
    return of(void 0);
  }

  addComment(
    taskId: string,
    comment: { content: string; author: string }
  ): Observable<Task> {
    const task = this.mockTasks.find((t) => t.id === taskId);
    if (!task) {
      return of(this.mockTasks[0]); // Bad practice: returning first task as fallback
    }
    const newComment = {
      id: (task.comments.length + 1).toString(),
      content: comment.content,
      author: comment.author,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    task.comments.push(newComment);
    return of(task);
  }

  uploadAttachment(taskId: string, file: File): Observable<Task> {
    const task = this.mockTasks.find((t) => t.id === taskId);
    if (!task) {
      return of(this.mockTasks[0]); // Bad practice: returning first task as fallback
    }
    const newAttachment = {
      id: (task.attachments.length + 1).toString(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date(),
      url: URL.createObjectURL(file),
    };
    task.attachments.push(newAttachment);
    return of(task);
  }
}
