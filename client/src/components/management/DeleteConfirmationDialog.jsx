// src/components/management/DeleteConfirmationDialog.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  plateNumber,
}) {
  const [inputPlate, setInputPlate] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (inputPlate !== plateNumber) {
      setError("Plate number does not match");
      return;
    }
    onConfirm(plateNumber);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          To confirm deletion, please enter the plate number:
        </Typography>
        <Typography variant="h6" color="error" gutterBottom>
          {plateNumber}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Plate Number"
          value={inputPlate}
          onChange={(e) => {
            setInputPlate(e.target.value);
            setError("");
          }}
          error={!!error}
          helperText={error}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          disabled={inputPlate !== plateNumber}
        >
          Confirm Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
