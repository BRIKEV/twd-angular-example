# TWD Project Patterns

## Project Configuration

- **Framework**: Angular 21 (Angular CLI, `@angular/build`, non-Vite)
- **Base path**: /
- **Dev server port**: 4200
- **App URL**: http://localhost:4200
- **Dev command**: npm run serve:dev
- **Default branch**: main
- **Entry point**: src/main.ts (manual `initTWD` block behind the `TWD_ENABLED` define)
- **Public folder**: public
- **Closing run**: full suite

New test files must be registered in the `tests` map in `src/main.ts` — there is no
Vite glob, so a `*.twd.test.ts` file that is not listed there never runs.

### Runner Commands

twd-cli drives its own headless browser — only the dev server has to be up (`npm run serve:dev`).

```bash
# Run all tests
npm run test:ci

# Run specific tests by name (matches "suite > test", case-insensitive; repeatable)
npx twd-cli run --test "should render the list"
npx twd-cli run --test "should create" --test "should show the error"

# Only the tests this branch added or changed
npx twd-cli run --changed-since origin/main

# Record a run to video (one clip per matched test, needs ffmpeg)
npx twd-cli run --record --test "should render the list"
```

Every run writes `.twd/report/`: `run.json` (the result), `summary.md` and `index.html`. The folder is replaced on each run.

## Standard Imports

```typescript
import { twd, userEvent, screenDom, expect } from "twd-js";
import { describe, it, beforeEach, afterEach } from "twd-js/runner";
// Project-specific imports go here (added by user)
```

## Visit Paths

```typescript
await twd.visit("/");
await twd.visit("/todos");
```

## Standard beforeEach / afterEach

```typescript
beforeEach(() => {
  twd.clearRequestMockRules();
  twd.clearComponentMocks();
});

afterEach(() => {
  twd.clearRequestMockRules();
});
```

## API Service Types

Service/API types are located in: `src/api`

Read files in this folder to understand endpoint URLs and response shapes when writing mock data.
The axios client points at `http://localhost:3001/api` (json-server, `npm run serve`).

## CSS / Component Library

- **Library**: Tailwind CSS 4
- **Docs**: https://tailwindcss.com/docs

When writing tests, refer to library docs for correct ARIA roles and component structure.

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals (modals, dropdowns, tooltips):

```typescript
import { screenDomGlobal } from "twd-js";
const modal = screenDomGlobal.getByRole("dialog");
```
