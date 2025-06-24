import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VehicleInfoSection from "./VehicleInfoSection";
import VehicleItemsSection from "./VehicleItemsSection";
import ServiceRecommendationSection from "./ServiceRecommendationSection";

export default function VehicleDetailsDialog({ open, onClose, client }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={isMobile ? "sm" : "lg"}
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          minHeight: isMobile ? "100vh" : "80vh",
          maxWidth: isMobile ? "100%" : "90%",
          margin: isMobile ? 0 : "32px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: theme.palette.primary.main,
          color: "white",
          py: 2,
          position: isMobile ? "sticky" : "relative",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h6">Vehicle Details</Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          overflowY: "auto",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            p: 3,
            width: "100%",
            margin: 0,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              minWidth: isMobile ? "100%" : 300,
            }}
          >
            <VehicleInfoSection client={client} />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              minWidth: isMobile ? "100%" : 300,
            }}
          >
            <VehicleItemsSection />
          </Grid>

          <Grid
            item
            xs={12}
            md={4}
            sx={{
              minWidth: isMobile ? "100%" : 400, // Wider for service section
              maxWidth: "100%",
            }}
          >
            <ServiceRecommendationSection />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          justifyContent: "space-between",
          position: isMobile ? "sticky" : "relative",
          bottom: 0,
          backgroundColor: "white",
          zIndex: 1,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          sx={{ minWidth: 120 }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Save clicked")}
          sx={{ minWidth: 120 }}
        >
          Save Details
        </Button>
      </DialogActions>
    </Dialog>
  );
}
