import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import api from "../services/api";
import Loader from "../components/Loader";
import ClientForm from "../components/ClientForm";
import ClientList from "../components/ClientList";

export default function Dashboard() {
  const [clients, setClients] = useState(null);
  const load = async ()=> { const { data } = await api.get("/clients"); setClients(data); };
  useEffect(()=>{ load(); }, []);
  if (clients === null) return <Loader/>;
  return (
    <Container sx={{ py:2 }}>
      <Typography variant="h5" sx={{ mb:1 }}>Clients</Typography>
      <ClientForm onCreated={()=>load()}/>
      <ClientList clients={clients}/>
    </Container>
  );
}
