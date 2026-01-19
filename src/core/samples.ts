/**
 * Todo Plugin Samples
 */

import type { ToolSample } from "gui-chat-protocol";

export const samples: ToolSample[] = [
  {
    name: "Show List",
    args: {
      action: "show",
    },
  },
  {
    name: "Add Item",
    args: {
      action: "add",
      text: "Buy groceries",
    },
  },
  {
    name: "Check Item",
    args: {
      action: "check",
      text: "Buy groceries",
    },
  },
];
