import React, { useState } from "react";
import { Paper, Stack, TextField, Button, Typography } from "@mui/material";
import api from "../services/api";

export default function ClientForm({ onCreated }) {
  const [form, setForm] = useState({ fullName:"", phone:"", plateNumber:"", make:"", model:"", year:"" });
  const onChange = (e)=> setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async ()=>{
    const payload = {
      fullName: form.fullName,
      phone: form.phone,
      plateNumber: form.plateNumber,
      vehicle: { make: form.make, model: form.model, year: Number(form.year) }
    };
    const { data } = await api.post("/clients", payload);
    setForm({ fullName:"", phone:"", plateNumber:"", make:"", model:"", year:"" });
    onCreated?.(data);
  };
  return (
    <Paper sx={{ p:2, mb:2 }}>
      <Typography variant="h6">Add Client</Typography>
      <Stack spacing={1} sx={{ mt:1 }}>
        <TextField label="Full Name" name="fullName" value={form.fullName} onChange={onChange}/>
        <TextField label="Phone" name="phone" value={form.phone} onChange={onChange}/>
        <TextField label="Plate Number" name="plateNumber" value={form.plateNumber} onChange={onChange}/>
        <TextField label="Make" name="make" value={form.make} onChange={onChange}/>
        <TextField label="Model" name="model" value={form.model} onChange={onChange}/>
        <TextField label="Year" name="year" value={form.year} onChange={onChange}/>
        <Button variant="contained" onClick={submit}>Save</Button>
      </Stack>
    </Paper>
  );
}
