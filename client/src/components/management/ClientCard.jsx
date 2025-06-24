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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VehicleDetailsDialog from "./VehicleDetails/VehicleDetailsDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function ClientCard({ client, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleDelete = (plateNumber) => {
    if (typeof onDelete === "function") {
      onDelete(plateNumber);
    } else {
      console.error("onDelete is not a function");
    }
    setOpenDeleteDialog(false);
  };

  return (
    <>
      {/* Client Card */}
      <Card
        sx={{
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
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={client.vehicleImage || "https://i.imgur.com/default-car.jpg"}
          alt={`${client.plateNumber} vehicle`}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />

        <CardContent sx={{ pb: "8px !important" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {client.plateNumber}
            </Typography>
            <Chip
              label="Active"
              size="small"
              color="success"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                fontWeight: 500,
              }}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Name:</strong> {client.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            <strong>Phone:</strong> {client.phone}
          </Typography>
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            pt: 0,
            gap: 1,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpenDetailsDialog(true)}
            sx={{
              flex: 1,
              color: theme.palette.grey[700],
              borderColor: theme.palette.grey[400],
              "&:hover": {
                borderColor: theme.palette.grey[600],
                backgroundColor: theme.palette.grey[50],
              },
            }}
          >
            View
          </Button>

          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            size={isMobile ? "small" : "medium"}
            onClick={() => setOpenDeleteDialog(true)}
            sx={{
              flex: 1,
              backgroundColor: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Card>

      {/* Vehicle Details Dialog */}
      <VehicleDetailsDialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        client={client}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        plateNumber={client.plateNumber}
      />
    </>
  );
}
