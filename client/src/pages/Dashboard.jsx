import { Box, Typography, Paper } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to Impero Auto Body Repair
        </Typography>
        <Typography paragraph>
          Today's appointments: 12 | Vehicles in shop: 5
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6">Recent Activity</Typography>
          {/* Add your content here */}
        </Paper>
        <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6">Quick Actions</Typography>
          {/* Add your content here */}
        </Paper>
      </Box>
    </Box>
  );
}
