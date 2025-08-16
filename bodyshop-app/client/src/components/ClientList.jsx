import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function ClientList({ clients }) {
  if (!clients?.length) return <Typography>No clients yet.</Typography>;
  return (
    <Stack spacing={2}>
      {clients.map(c=>(
        <Card key={c._id}>
          <CardContent>
            <Typography variant="h6">{c.fullName} — {c.plateNumber}</Typography>
            <Typography variant="body2">{c.vehicle.year} {c.vehicle.make} {c.vehicle.model} • {c.phone}</Typography>
            <Button sx={{ mt:1 }} variant="contained" component={Link} to={`/client/${c._id}`}>Open</Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
