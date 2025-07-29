/* global NodeJS, Console */
// Global type declarations for the application

declare global {
  // Node.js globals
  var process: NodeJS.Process;
  var console: Console;

  // Browser globals
  var fetch: typeof globalThis.fetch;
}

export {};
