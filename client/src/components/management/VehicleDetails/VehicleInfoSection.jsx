import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material";

export default function VehicleInfoSection({ client }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        p: 2,
        height: "100%",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: "primary.main",
            mb: 1,
          }}
        >
          {client.name.charAt(0)}
        </Avatar>
        <Typography variant="h6" align="center">
          {client.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          {client.plateNumber}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <List dense>
        <ListItem>
          <ListItemIcon>
            <CarIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Plate Number" secondary={client.plateNumber} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PersonIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Owner Name" secondary={client.name} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Phone" secondary={client.phone} />
        </ListItem>
        {client.email && (
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Email" secondary={client.email} />
          </ListItem>
        )}
      </List>

      <Box sx={{ mt: 2, textAlign: "center" }}>
        <img
          src={client.vehicleImage || "https://i.imgur.com/default-car.jpg"}
          alt="Vehicle"
          style={{
            maxWidth: "100%",
            maxHeight: 200,
            borderRadius: 8,
          }}
        />
      </Box>
    </Box>
  );
}
