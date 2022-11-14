const path = require("path");
export default {
  npmClient: "yarn",
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  clickToComponent: {},
};
