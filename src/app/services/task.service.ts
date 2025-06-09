import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Task,
  TaskFilter,
  TaskStatus,
  TaskPriority,
  TaskCategory,
} from '../models/task.model';

// This service uses mock data for demonstration purposes
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private mockTasks: Task[] = [
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

  getTasks(filter?: TaskFilter): Observable<Task[]> {
    let filteredTasks = [...this.mockTasks];
    if (filter) {
      if (filter.status && filter.status.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.status?.includes(task.status)
        );
      }
      if (filter.priority && filter.priority.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.priority?.includes(task.priority)
        );
      }
      if (filter.category && filter.category.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          filter.category?.includes(task.category)
        );
      }
      if (filter.assignedTo) {
        filteredTasks = filteredTasks.filter((task) =>
          task.assignedTo
            .toLowerCase()
            .includes(filter.assignedTo!.toLowerCase())
        );
      }
      if (filter.dueDateRange) {
        filteredTasks = filteredTasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          return (
            dueDate >= filter.dueDateRange!.start &&
            dueDate <= filter.dueDateRange!.end
          );
        });
      }
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm)
        );
      }
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
    return of(task);
  }

  createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: (this.mockTasks.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.mockTasks.push(newTask);
    return of(newTask);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    const index = this.mockTasks.findIndex((t) => t.id === id);
    if (index === -1) {
      return of(this.mockTasks[0]); // Fallback for demo
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
    }
    return of(void 0);
  }

  addComment(
    taskId: string,
    comment: { content: string; author: string }
  ): Observable<Task> {
    const task = this.mockTasks.find((t) => t.id === taskId);
    if (!task) {
      return of(this.mockTasks[0]); // Fallback for demo
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
      return of(this.mockTasks[0]); // Fallback for demo
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
