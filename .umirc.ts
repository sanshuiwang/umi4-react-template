const path = require("path");
export default {
  npmClient: "yarn",
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  clickToComponent: {},
  hash: true,
  routes: [
    { path: "/", component: "home" },
    { path: "/docs", component: "docs" },
  ],
  targets: {
    ie: 11,
    chrome: 80,
  },
  theme: {},
  title: "Todo List",
  verifyCommit: {
    scope: [
      "feat",
      "fix",
      "docs",
      "style",
      "refactor",
      "perf",
      "test",
      "workflow",
      "build",
      "ci",
      "chore",
      "types",
      "wip",
      "release",
      "dep",
      "deps",
      "example",
      "examples",
      "merge",
      "revert",
    ],
    allowEmoji: true,
  },
};
