import React, { useState } from "react";
import { Drawer, Button, Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import PAGE_CONFIG from "./config/pages"; // Import the external config

export default function App() {
  const [currentPage, setCurrentPage] = useState(PAGE_CONFIG[0].name);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            overflowX: "hidden",
          },
        }}
      >
        <Sidebar
          pages={PAGE_CONFIG}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          marginLeft: `${sidebarOpen ? 250 : 0}px`,
          transition: "margin 0.3s ease",
          backgroundColor: "#f5f5f5",
          overflow: "auto",
        }}
      >
        <Button onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mb: 2 }}>
          {sidebarOpen ? "◀ Hide Sidebar" : "Show Sidebar ▶"}
        </Button>

        {/* Render current page */}
        {PAGE_CONFIG.find((page) => page.name === currentPage)?.component}
      </Box>
    </Box>
  );
}
