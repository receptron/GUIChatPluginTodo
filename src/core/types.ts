/**
 * Todo Plugin Types
 */

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoToolData {
  items: TodoItem[];
}

export interface TodoArgs {
  action:
    | "show"
    | "add"
    | "delete"
    | "clear_completed"
    | "update"
    | "check"
    | "uncheck";
  text?: string;
  newText?: string;
}
