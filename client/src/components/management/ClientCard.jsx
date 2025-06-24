import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import VehicleDetailsDialog from "./VehicleDetails/VehicleDetailsDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { updateClient } from "../../api/clientApi"; // Add this

export default function ClientCard({ client, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formData, setFormData] = useState({ ...client });

  const handleDelete = (plateNumber) => {
    if (typeof onDelete === "function") {
      onDelete(plateNumber);
    }
    setOpenDeleteDialog(false);
  };

  const handleEditSave = async () => {
    try {
      await updateClient(client._id, formData);
      window.location.reload(); // or better: update client state via parent
    } catch (error) {
      console.error("Edit error:", error);
    } finally {
      setOpenEditDialog(false);
    }
  };

  return (
    <>
      <Card sx={{ ...styles.card }}>
        <CardMedia
          component="img"
          height="160"
          image={client.vehicleImage || "https://i.imgur.com/default-car.jpg"}
          alt={`${client.plateNumber} vehicle`}
          sx={styles.media}
        />

        <CardContent sx={{ pb: "8px !important" }}>
          <Box sx={styles.header}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {client.plateNumber}
            </Typography>
            <Chip
              label="Active"
              size="small"
              color="success"
              sx={styles.chip}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            <strong>Name:</strong> {client.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Phone:</strong> {client.phone}
          </Typography>
        </CardContent>

        <Box sx={styles.actions}>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpenDetailsDialog(true)}
            sx={styles.viewBtn}
          >
            View
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpenEditDialog(true)}
            sx={styles.editBtn}
          >
            Edit
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpenDeleteDialog(true)}
            sx={styles.deleteBtn}
          >
            Delete
          </Button>
        </Box>
      </Card>

      {/* Dialogs */}
      <VehicleDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        client={client}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        plateNumber={client.plateNumber}
      />

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Client</DialogTitle>
        <DialogContent>
          {["name", "phone", "email", "vehicleImage"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              fullWidth
              margin="dense"
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const styles = {
  card: {
    width: "100%",
    maxWidth: 345,
    m: 1,
    borderRadius: 2,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    },
  },
  media: {
    objectFit: "cover",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1,
  },
  chip: {
    height: 20,
    fontSize: "0.7rem",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    p: 1,
    pt: 0,
    gap: 1,
  },
  viewBtn: {
    flex: 1,
    color: "grey.700",
    borderColor: "grey.400",
    "&:hover": {
      borderColor: "grey.600",
      backgroundColor: "grey.50",
    },
  },
  editBtn: {
    flex: 1,
    backgroundColor: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark",
    },
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "error.main",
    "&:hover": {
      backgroundColor: "error.dark",
    },
  },
};
