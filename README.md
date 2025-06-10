# LLMTestFrontend - test

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Pre Steps to Run the project

To run the project, you'll need to use a node version compatible with Angular 19, such as node v22.

Afterwards, you'll need to run the below command to install the libraries used in the project:

```bash
npm install
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Task Management Feature

This project now includes a comprehensive Task Management system for demonstration and code review purposes.

### Features

- Task CRUD operations (Create, Read, Update, Delete)
- Task filtering by status, priority, category, assignee, due date, tags, and search term
- Task status management and inline updates
- Responsive, modern UI using Angular Material
- TypeScript models and interfaces
- Error handling and loading states
- Unit tests for the main task list component

### Accessing the Task Management

- Start the Angular app as usual (`npm start` or `ng serve`).
- Navigate to `/tasks` in your browser (this is now the default route).

### Code Structure

- `src/app/components/task-list/` — Task list component (UI, logic, tests, styles)
- `src/app/services/task.service.ts` — Task API service
- `src/app/models/task.model.ts` — Task, enums, and filter interfaces
- `src/environments/environment.ts` — API URL configuration

### Note

- The TaskService expects a backend at `http://localhost:3000/api/tasks`. You can mock this endpoint or implement a simple backend for full CRUD functionality.
- The UI is built with Angular Material and is fully responsive.

---

For more details, see the code in the respective files.
