import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Replaced at build time by the `define` option in angular.json.
// `isDevMode()` would work at runtime, but it is a function call: esbuild cannot
// prove the branch is dead, so every `await import()` below stays in the production
// bundle as an (unused) lazy chunk. A build-time constant gets folded away instead.
// Declared as possibly undefined so a missing `define` cannot throw at module scope.
declare const TWD_ENABLED: boolean | undefined;

if (typeof TWD_ENABLED !== 'undefined' && TWD_ENABLED) {
  const { initTWD } = await import('twd-js/bundled');
  const tests = {
    './twd-tests/helloWorld.twd.test.ts': () => import('./twd-tests/helloWorld.twd.test'),
    './twd-tests/todoList.twd.test.ts': () => import('./twd-tests/todoList.twd.test'),
  };
  initTWD(tests);
  const { createBrowserClient } = await import('twd-relay/browser');
  const client = createBrowserClient({
    url: 'ws://localhost:9876/__twd/ws',
  });
  client.connect();
} else if (typeof TWD_ENABLED === 'undefined') {
  console.warn('[TWD] TWD_ENABLED is not defined — add the `define` option to angular.json.');
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
