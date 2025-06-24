import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import ClientForm from "../components/management/ClientForm";
import ClientCard from "../components/management/ClientCard";
import { createClient, getClients, deleteClient } from "../api/clientApi"; // Fixed import
import AlertMessage from "../components/AlertMessage";

export default function ManagementPage() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [clients, setClients] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        showAlert("error", "Failed to load clients");
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = async (newClient) => {
    try {
      const createdClient = await createClient(newClient);
      setClients((prevClients) => [...prevClients, createdClient]);
      showAlert("success", "Client created successfully!");
    } catch (error) {
      showAlert("error", error.message || "Failed to create client");
    }
  };

  // This is the function that was missing the imported deleteClient
  const handleDeleteClient = async (plateNumber) => {
    try {
      await deleteClient(plateNumber); // Now properly imported
      setClients(clients.filter((c) => c.plateNumber !== plateNumber));
      showAlert("success", `Client ${plateNumber} deleted successfully`);
    } catch (error) {
      showAlert("error", error.message || "Failed to delete client");
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3, overflowY: "auto" }}>
      <AlertMessage
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={handleCloseAlert}
      />

      <Typography variant="h4" gutterBottom>
        Client Management
      </Typography>

      <ClientForm onAddClient={handleAddClient} />

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Client Records
      </Typography>

      <Box sx={{ flex: 1, overflowY: "auto", pb: 2 }}>
        <Grid container spacing={isMobile ? 1 : 3}>
          {clients.map((client) => (
            <Grid item key={client._id} xs={12} sm={6} md={4} lg={3}>
              <ClientCard client={client} onDelete={handleDeleteClient} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
