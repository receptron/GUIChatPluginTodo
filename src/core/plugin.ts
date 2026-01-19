/**
 * Todo Plugin Core
 */

import type { ToolPluginCore, ToolContext, ToolResult } from "gui-chat-protocol";
import type { TodoToolData, TodoArgs, TodoItem } from "./types";
import { TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";

export { TOOL_NAME, TOOL_DEFINITION, SYSTEM_PROMPT } from "./definition";

const STORAGE_KEY = "mulmo_todo_list";

function loadTodos(): TodoItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading todos:", error);
  }
  return [];
}

function saveTodos(items: TodoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error saving todos:", error);
  }
}

export const executeTodo = async (
  _context: ToolContext,
  args: TodoArgs,
): Promise<ToolResult<TodoToolData, unknown>> => {
  const { action, text, newText } = args;

  try {
    const items = loadTodos();

    switch (action) {
      case "show": {
        return {
          message: `Todo list displayed with ${items.length} item${items.length !== 1 ? "s" : ""}`,
          data: { items },
          jsonData: {
            totalItems: items.length,
            completed: items.filter((item) => item.completed).length,
            pending: items.filter((item) => !item.completed).length,
            items: items.map((item) => ({
              text: item.text,
              completed: item.completed,
            })),
          },
          instructions:
            "The todo list has been displayed. Acknowledge the current state of the list to the user.",
          updating: true,
        };
      }

      case "add": {
        if (!text || typeof text !== "string" || text.trim() === "") {
          return {
            message: "Cannot add todo: text is required",
            data: { items },
            instructions:
              "Tell the user that a todo item text is required to add an item.",
            updating: true,
          };
        }

        const newItem: TodoItem = {
          id: `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: text.trim(),
          completed: false,
          createdAt: Date.now(),
        };

        items.push(newItem);
        saveTodos(items);

        return {
          message: `Added todo: "${newItem.text}"`,
          data: { items },
          jsonData: {
            added: newItem.text,
            totalItems: items.length,
          },
          instructions: `Confirm to the user that "${newItem.text}" has been added to their todo list.`,
          updating: true,
        };
      }

      case "delete": {
        if (!text || typeof text !== "string") {
          return {
            message: "Cannot delete todo: text is required",
            data: { items },
            instructions:
              "Tell the user which todo item they want to delete. List the current items if needed.",
            updating: true,
          };
        }

        const indexToDelete = items.findIndex(
          (item) => item.text.toLowerCase() === text.toLowerCase(),
        );

        if (indexToDelete === -1) {
          return {
            message: `Todo item not found: "${text}"`,
            data: { items },
            jsonData: {
              availableItems: items.map((item) => item.text),
            },
            instructions: `Tell the user that "${text}" was not found in the todo list. Show them the current items if helpful.`,
            updating: true,
          };
        }

        const deletedItem = items[indexToDelete];
        items.splice(indexToDelete, 1);
        saveTodos(items);

        return {
          message: `Deleted todo: "${deletedItem.text}"`,
          data: { items },
          jsonData: {
            deleted: deletedItem.text,
            totalItems: items.length,
          },
          instructions: `Confirm to the user that "${deletedItem.text}" has been removed from their todo list.`,
          updating: true,
        };
      }

      case "clear_completed": {
        const completedItems = items.filter((item) => item.completed);
        const remainingItems = items.filter((item) => !item.completed);

        if (completedItems.length === 0) {
          return {
            message: "No completed items to clear",
            data: { items },
            jsonData: {
              totalItems: items.length,
            },
            instructions:
              "Tell the user that there are no completed items to clear.",
            updating: true,
          };
        }

        saveTodos(remainingItems);

        return {
          message: `Cleared ${completedItems.length} completed item${completedItems.length !== 1 ? "s" : ""}`,
          data: { items: remainingItems },
          jsonData: {
            clearedCount: completedItems.length,
            totalItems: remainingItems.length,
          },
          instructions: `Confirm to the user that ${completedItems.length} completed item${completedItems.length !== 1 ? "s have" : " has"} been removed from their todo list.`,
          updating: true,
        };
      }

      case "update": {
        if (!text || typeof text !== "string") {
          return {
            message:
              "Cannot update todo: text is required to identify the item",
            data: { items },
            instructions: "Tell the user which todo item they want to update.",
            updating: true,
          };
        }

        if (!newText || typeof newText !== "string" || newText.trim() === "") {
          return {
            message: "Cannot update todo: newText is required",
            data: { items },
            instructions:
              "Tell the user what the new text should be for the todo item.",
            updating: true,
          };
        }

        const itemToUpdate = items.find(
          (item) => item.text.toLowerCase() === text.toLowerCase(),
        );

        if (!itemToUpdate) {
          return {
            message: `Todo item not found: "${text}"`,
            data: { items },
            jsonData: {
              availableItems: items.map((item) => item.text),
            },
            instructions: `Tell the user that "${text}" was not found in the todo list. Show them the current items if helpful.`,
            updating: true,
          };
        }

        const oldText = itemToUpdate.text;
        itemToUpdate.text = newText.trim();
        saveTodos(items);

        return {
          message: `Updated todo from "${oldText}" to "${itemToUpdate.text}"`,
          data: { items },
          jsonData: {
            oldText,
            newText: itemToUpdate.text,
            totalItems: items.length,
          },
          instructions: `Confirm to the user that the todo item has been updated from "${oldText}" to "${itemToUpdate.text}".`,
          updating: true,
        };
      }

      case "check": {
        if (!text || typeof text !== "string") {
          return {
            message: "Cannot check todo: text is required to identify the item",
            data: { items },
            instructions:
              "Tell the user which todo item they want to mark as completed.",
            updating: true,
          };
        }

        const itemToCheck = items.find(
          (item) => item.text.toLowerCase() === text.toLowerCase(),
        );

        if (!itemToCheck) {
          return {
            message: `Todo item not found: "${text}"`,
            data: { items },
            jsonData: {
              availableItems: items.map((item) => item.text),
            },
            instructions: `Tell the user that "${text}" was not found in the todo list. Show them the current items if helpful.`,
            updating: true,
          };
        }

        if (itemToCheck.completed) {
          return {
            message: `Todo item "${itemToCheck.text}" is already completed`,
            data: { items },
            instructions: `Tell the user that "${itemToCheck.text}" is already marked as completed.`,
            updating: true,
          };
        }

        itemToCheck.completed = true;
        saveTodos(items);

        return {
          message: `Checked todo: "${itemToCheck.text}"`,
          data: { items },
          jsonData: {
            checkedItem: itemToCheck.text,
            totalItems: items.length,
            completedItems: items.filter((item) => item.completed).length,
          },
          instructions: `Confirm to the user that "${itemToCheck.text}" has been marked as completed.`,
          updating: true,
        };
      }

      case "uncheck": {
        if (!text || typeof text !== "string") {
          return {
            message:
              "Cannot uncheck todo: text is required to identify the item",
            data: { items },
            instructions:
              "Tell the user which todo item they want to mark as not completed.",
            updating: true,
          };
        }

        const itemToUncheck = items.find(
          (item) => item.text.toLowerCase() === text.toLowerCase(),
        );

        if (!itemToUncheck) {
          return {
            message: `Todo item not found: "${text}"`,
            data: { items },
            jsonData: {
              availableItems: items.map((item) => item.text),
            },
            instructions: `Tell the user that "${text}" was not found in the todo list. Show them the current items if helpful.`,
            updating: true,
          };
        }

        if (!itemToUncheck.completed) {
          return {
            message: `Todo item "${itemToUncheck.text}" is already not completed`,
            data: { items },
            instructions: `Tell the user that "${itemToUncheck.text}" is already marked as not completed.`,
            updating: true,
          };
        }

        itemToUncheck.completed = false;
        saveTodos(items);

        return {
          message: `Unchecked todo: "${itemToUncheck.text}"`,
          data: { items },
          jsonData: {
            uncheckedItem: itemToUncheck.text,
            totalItems: items.length,
            completedItems: items.filter((item) => item.completed).length,
          },
          instructions: `Confirm to the user that "${itemToUncheck.text}" has been marked as not completed.`,
          updating: true,
        };
      }

      default:
        return {
          message: `Unknown action: ${action}`,
          data: { items },
          instructions:
            "Tell the user that the action was not recognized. Valid actions are: show, add, delete, clear_completed, update, check, uncheck.",
          updating: true,
        };
    }
  } catch (error) {
    console.error("ERR: exception in manageTodoList", error);
    return {
      message: `Todo list error: ${error instanceof Error ? error.message : "Unknown error"}`,
      data: { items: [] },
      instructions:
        "Acknowledge that there was an error managing the todo list.",
    };
  }
};

export const pluginCore: ToolPluginCore<TodoToolData, unknown, TodoArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeTodo,
  generatingMessage: "Managing todo list...",
  isEnabled: () => true,
  systemPrompt: SYSTEM_PROMPT,
};
