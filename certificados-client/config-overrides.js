const { override, fixBabelImports, addLessLoader } = require("customize-cra");

const colorTexto = "#404041";
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true, // change importing css to less
  }),
  addLessLoader({
    modifyVars: {
      //   "primary-color": "#9d2449",
      "table-body-sort-bg": "inherit",
      "info-color": "#1890ff",
      "layout-header-background": "rgb(19, 50, 43)",
      "menu-dark-submenu-bg": "rgba(19, 50, 43,0.4)",
      "menu-dark-item-active-bg": "rgb(54,81,75)",
      "menu-dark-selected-item-icon-color": "rgb(203,187,152)",
      "menu-dark-selected-item-text-color": "rgb(203,187,152)",
      "layout-trigger-background": "#0C231E",
      "menu-dark-highlight-color": "#D4C19C",
      "menu-dark-color": "white",
      "heading-color": "inherit",
      "text-color": "inherit",
      "zindex-modal": "1100",
      "zindex-modal-mask": "1100",
      "zindex-message": "1110",
      "zindex-notification": "1110",
      "zindex-popover": "1130",
      "zindex-dropdown": "1150",
      "zindex-picker": "1150",
      "zindex-tooltip": "1160",

      "tabs-card-head-background": "#DDDDDD",
      "tabs-card-active-color": "#9d2449",
      "tabs-hover-color": "#9d2449",
    },
    javascriptEnabled: true,
  })
);
