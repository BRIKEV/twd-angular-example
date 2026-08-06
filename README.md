# TWD Angular Example

This is a showcase project demonstrating how to use [TWD (Test Web Dev)](https://brikev.github.io/twd/) with Angular for testing web applications. TWD is a powerful testing framework that allows you to write tests that interact with your web app like a real user would.

## About TWD

[TWD](https://brikev.github.io/twd/) is a comprehensive testing framework for web applications. It provides:
- User-centric testing approach
- Integration with modern development workflows
- Support for multiple frameworks including Angular

## Features

This showcase includes:
- **Home Page** (`/`) - Counter component demonstrating basic interactions
- **Todo List** (`/todos`) - Full CRUD operations with API integration
- **TWD Tests** - Comprehensive test scenarios for both pages

## Development server

To start a local development server, run:

```bash
npm start
```

Or alternatively:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

When running in development mode, TWD will automatically load and initialize its testing framework from the test files in `src/twd-tests/`.

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

To build the project for production, run:

```bash
npm run build
```

Or alternatively:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Keeping TWD out of production builds

TWD is not tree-shaken automatically. It is excluded by a build-time constant, `TWD_ENABLED`, injected through the `define` option in `angular.json`:

```jsonc
"build": {
  "options": {
    "define": { "TWD_ENABLED": "false" }   // default: off
  },
  "configurations": {
    "development": {
      "define": { "TWD_ENABLED": "true" }  // opt in for dev only
    }
  }
}
```

Because `TWD_ENABLED` is a literal by the time esbuild sees it, the whole `if` block in `src/main.ts` is dead-code eliminated and none of its lazy chunks are emitted. Measured in this repo:

| `src/main.ts` guard | `dist/.../browser` | JS chunks |
|---|---|---|
| `if (isDevMode())` | 912 K | 10 |
| `if (typeof TWD_ENABLED !== 'undefined' && TWD_ENABLED)` | 332 K | 2 |

`isDevMode()` is a *function call*, so esbuild cannot prove the branch is dead. It keeps the branch and emits every `await import()` inside it as a lazy chunk — around 580 K of `twd-js` (including a copy of React) that the browser never fetches, because `isDevMode()` returns `false` at runtime. It is dead weight in the deployed artifact rather than a performance bug, and it is easy to miss: the *initial* bundle grows by only ~1 kB, so budgets and Lighthouse stay quiet.

Two details worth keeping:

- **Default `TWD_ENABLED` to `"false"`** in `options` and opt in under `development`, so a configuration added later cannot silently ship TWD.
- **Keep the `typeof` check.** A bare `if (TWD_ENABLED)` throws `TWD_ENABLED is not defined` at module scope if the `define` is ever missing — before `bootstrapApplication` runs, so the page renders nothing. The `typeof` form boots normally and just logs a warning.

## Running Tests with TWD

This project uses TWD for testing. Tests are automatically loaded in development mode and can be run through the TWD interface in your browser.

To run the development server with TWD:

```bash
npm start
```

Then navigate to `http://localhost:4200/` and access the TWD testing interface. The test files are located in `src/twd-tests/`:
- `helloWorld.twd.test.ts` - Tests for the home page counter
- `todoList.twd.test.ts` - Tests for the todo list functionality

## Adding New Tests

To add new TWD tests to this project:

1. Create a new test file in `src/twd-tests/` with the `.twd.test.ts` extension
2. Add the import path to the tests object in `src/main.ts`:

```typescript
const tests = {
  './twd-tests/helloWorld.twd.test.ts': () => import('./twd-tests/helloWorld.twd.test'),
  './twd-tests/todoList.twd.test.ts': () => import('./twd-tests/todoList.twd.test'),
  './twd-tests/your-new-test.twd.test.ts': () => import('./twd-tests/your-new-test.twd.test'),
};
```

For more information on writing TWD tests, visit the [TWD documentation](https://brikev.github.io/twd/).

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

Or alternatively:

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

- [TWD Documentation](https://brikev.github.io/twd/) - Learn how to write and run tests with TWD
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) - Angular CLI documentation
- [Angular Documentation](https://angular.dev/) - Complete Angular framework documentation
