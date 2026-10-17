import type { TodoArgs } from "../src/core/types";

type TodoAction = TodoArgs["action"];

// A Record (not an array) so a TodoAction added to or removed from the union fails typecheck here.
const TODO_ACTIONS: Record<TodoAction, true> = {
  show: true,
  add: true,
  delete: true,
  clear_completed: true,
  update: true,
  check: true,
  uncheck: true,
};

const isTodoAction = (value: unknown): value is TodoAction =>
  typeof value === "string" && Object.keys(TODO_ACTIONS).includes(value);

const isOptionalString = (value: unknown): boolean =>
  value === undefined || typeof value === "string";

export const isTodoArgs = (
  args: Record<string, unknown>,
): args is Record<string, unknown> & TodoArgs =>
  isTodoAction(args["action"]) &&
  isOptionalString(args["text"]) &&
  isOptionalString(args["newText"]);
