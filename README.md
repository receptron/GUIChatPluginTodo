# @gui-chat-plugin/todo

Todo list plugin for GUI Chat applications. Manage tasks with a persistent todo list that syncs via localStorage.

## Features

- Add, update, and delete todo items
- Mark tasks as completed/uncompleted
- Clear all completed items at once
- Persistent storage via localStorage
- Inline text editing capability

## Installation

```bash
yarn add @gui-chat-plugin/todo
```

## Usage

### Vue Integration

```typescript
// In src/tools/index.ts
import TodoPlugin from "@gui-chat-plugin/todo/vue";

const pluginList = [
  // ... other plugins
  TodoPlugin,
];

// In src/main.ts
import "@gui-chat-plugin/todo/style.css";
```

### Core-only Usage

```typescript
import { executeTodo, TOOL_DEFINITION } from "@gui-chat-plugin/todo";

// Show the todo list
const result = await executeTodo(context, {
  action: "show",
});

// Add a new item
const result = await executeTodo(context, {
  action: "add",
  text: "Buy groceries",
});
```

## API

### TodoArgs

```typescript
interface TodoArgs {
  action: "show" | "add" | "toggle" | "delete" | "clear_completed" | "update";
  text?: string;     // For add/update actions
  itemId?: string;   // For toggle/delete/update actions
}
```

### TodoItem

```typescript
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
```

## Development

```bash
# Install dependencies
yarn install

# Run demo
yarn dev

# Build
yarn build

# Lint
yarn lint
```

## License

MIT
