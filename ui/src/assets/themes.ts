import { createMuiTheme } from "@material-ui/core";

const primaryColor = "#5b44f2";
const secondaryColor = "#44dbb3";
const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      paper: "#202020",
      default: "#181818",
    },
    type: "dark",
  },
  typography: {
    fontFamily: "Open Sans",
  },
});

const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      paper: "#ffffff",
      default: "#f9f9f9",
    },

    type: "light",
  },
  typography: {
    fontFamily: "Open Sans",
  },
});

export { darkTheme, lightTheme };
