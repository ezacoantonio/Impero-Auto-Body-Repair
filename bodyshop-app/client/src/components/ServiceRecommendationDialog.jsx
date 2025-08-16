import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from "@mui/material";

export default function ServiceRecommendationDialog({ open, onClose, initial, onSave }) {
  const [form, setForm] = useState({ name:"", price:"" });
  useEffect(()=>{ setForm(initial ? { name: initial.name ?? "", price: initial.price ?? "" } : { name:"", price:"" }); }, [initial, open]);
  const onChange = (e)=> setForm({ ...form, [e.target.name]: e.target.value });
  const save = ()=> onSave?.({ name: form.name, price: Number(form.price) });
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{initial ? "Edit Service" : "Add Service"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt:1 }}>
          <TextField label="Service name" name="name" value={form.name} onChange={onChange}/>
          <TextField label="Price" name="price" value={form.price} onChange={onChange}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
