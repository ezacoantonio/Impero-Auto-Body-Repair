import * as React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

export default function Sidebar({ pages, currentPage, setCurrentPage }) {
  return (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        backgroundColor: "#424242", // Dark gray background
        color: "white", // White text
      }}
      role="presentation"
    >
      {/* Branding Section */}
      <Box
        sx={{
          p: 3,
          textAlign: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <Box
          component="img"
          src="https://example.com/path/to/your/logo.png" // Your logo URL here
          alt="Brand Logo"
          sx={{
            width: 64,
            height: 64,
            mb: 2,
            borderRadius: "50%", // Makes it circular
            objectFit: "cover", // Ensures proper image scaling
            border: "2px solid white", // Optional white border
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)", // Optional subtle shadow
            backgroundColor: "rgba(255,255,255,0.1)", // Fallback background
          }}
          onError={(e) => {
            e.target.src =
              "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=178,fit=crop,q=95/YX4PQ9a3yZIv02LO/dall_e_2024-06-26_19.54.59_-_a_minimalist_logo_of_a_mountain_with_three_peaks__the_middle_peak_being_the_highest__in_a_circular_frame._the_mountains_are_green_with_a_slightly_ligh-removebg-preview-dWxlX9DnXzH7JJoy.png"; // Fallback if URL fails
          }}
        />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          KorebTech
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ mt: 2 }}>
        {pages.map((page, index) => (
          <ListItem key={page.name} disablePadding>
            <ListItemButton
              selected={currentPage === page.name}
              onClick={() => setCurrentPage(page.name)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.16)",
                },
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={page.name}
                primaryTypographyProps={{
                  fontWeight: currentPage === page.name ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
