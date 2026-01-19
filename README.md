# @gui-chat-plugin/todo

A todo list plugin for [MulmoChat](https://github.com/receptron/MulmoChat) - a multi-modal voice chat application with OpenAI's GPT-4 Realtime API.

## What this plugin does

This plugin provides a persistent todo list that allows users to:

- View their current todo items
- Add new tasks
- Mark tasks as completed/uncompleted
- Delete individual items
- Clear all completed items
- Update existing item text

Data is persisted in localStorage for persistence across sessions.

## Installation

```bash
yarn add @gui-chat-plugin/todo
```

## Usage

### Vue Implementation (for MulmoChat)

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

### Core Only (Framework-agnostic)

```typescript
import { pluginCore, TOOL_NAME } from "@gui-chat-plugin/todo";
// or
import pluginCore from "@gui-chat-plugin/todo";
```

## Package Exports

| Export | Description |
|--------|-------------|
| `@gui-chat-plugin/todo` | Core (framework-agnostic) |
| `@gui-chat-plugin/todo/vue` | Vue implementation with UI components |
| `@gui-chat-plugin/todo/style.css` | Tailwind CSS styles |

## Development

```bash
# Install dependencies
yarn install

# Start dev server (http://localhost:5173/)
yarn dev

# Build
yarn build

# Type check
yarn typecheck

# Lint
yarn lint
```

## License

MIT
