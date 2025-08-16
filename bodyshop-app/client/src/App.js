import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomeIcon from "@mui/icons-material/Home";
import Dashboard from "./pages/Dashboard";
import ClientDetails from "./pages/ClientDetails";
import ClientSearch from "./components/ClientSearch";
import theme from "./components/theme";

export default function App() {
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="sticky" color="primary">
          <Toolbar sx={{ gap: 1 }}>
            <Typography
              variant="h6"
              sx={{ mr: 1, display: { xs: "none", sm: "block" } }}
            >
              BodyShop Manager
            </Typography>

            {/* centered search; full width on phones */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <ClientSearch fullWidthOnMobile />
            </Box>

            {isXs ? (
              <IconButton
                color="inherit"
                component={Link}
                to="/"
                aria-label="home"
              >
                <HomeIcon />
              </IconButton>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
              >
                Home
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container sx={{ my: { xs: 1.5, sm: 3 } }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client/:id" element={<ClientDetails />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}
