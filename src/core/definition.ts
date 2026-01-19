/**
 * Todo Tool Definition
 */

import type { ToolDefinition } from "gui-chat-protocol";

export const TOOL_NAME = "manageTodoList";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Manage a todo list - show current items, add new items, or delete items. Use this to help users track tasks and remember things.",
  parameters: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: [
          "show",
          "add",
          "delete",
          "clear_completed",
          "update",
          "check",
          "uncheck",
        ],
        description:
          "Action to perform: 'show' displays the list, 'add' creates a new item, 'delete' removes an item, 'clear_completed' removes all checked items, 'update' modifies an existing item, 'check' marks an item as completed, 'uncheck' marks an item as not completed",
      },
      text: {
        type: "string",
        description:
          "For 'add': the todo item text. For 'delete'/'update'/'check'/'uncheck': the text of the item to find (must match exactly). Not required for 'show' or 'clear_completed'",
      },
      newText: {
        type: "string",
        description:
          "For 'update' action only: the new text to replace the existing item text",
      },
    },
    required: ["action"],
  },
};

export const SYSTEM_PROMPT = `When users mention tasks they need to do, things to remember, or ask about their todo list, use the ${TOOL_NAME} function to help them track these items.`;
