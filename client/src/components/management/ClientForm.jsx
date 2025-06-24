import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Collapse,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const ClientForm = ({ onAddClient }) => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    name: "",
    phone: "",
    email: "",
    vehicleImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddClient(formData);
      setFormData({
        plateNumber: "",
        name: "",
        phone: "",
        email: "",
        vehicleImage: "",
      });
      setExpanded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openImageUploadSite = () => {
    window.open("https://postimages.org/", "_blank", "noopener,noreferrer");
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Button
        variant="contained"
        color="error"
        onClick={() => setExpanded(!expanded)}
        sx={{ mb: 2 }}
        disabled={isSubmitting}
      >
        {expanded ? "Cancel" : "Create New Client"}
      </Button>

      <Collapse in={expanded}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Client Information
          </Typography>

          {["plateNumber", "name", "phone", "email"].map((field) => (
            <TextField
              key={field}
              fullWidth
              margin="normal"
              label={
                field === "name"
                  ? "Driver/Company Name"
                  : field === "plateNumber"
                  ? "Plate Number"
                  : field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/([A-Z])/g, " $1")
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          ))}

          {/* New Image URL Field with Helper Button */}
          <TextField
            fullWidth
            margin="normal"
            label="Vehicle Image URL"
            name="vehicleImage"
            value={formData.vehicleImage}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Upload image and get URL">
                    <IconButton
                      onClick={openImageUploadSite}
                      edge="end"
                      sx={{ mr: -1 }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
            helperText="Use PostImages.org to upload and get direct link"
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Client"}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ClientForm;
