// client/src/theme.js
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#A01414", // dark red
      dark: "#7C0F0F",
      light: "#C53A3A",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#455A64",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: { root: { boxShadow: "0 4px 12px rgba(0,0,0,.08)" } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid rgba(0,0,0,.06)",
          boxShadow: "0 8px 24px rgba(0,0,0,.04)",
        },
      },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiButton: { defaultProps: { size: "small" } },
    MuiIconButton: { defaultProps: { size: "small" } },
    MuiDialog: { defaultProps: { fullWidth: true, maxWidth: "md" } },
    MuiContainer: { defaultProps: { maxWidth: "lg" } },
  },
});
theme = responsiveFontSizes(theme);
export default theme;
