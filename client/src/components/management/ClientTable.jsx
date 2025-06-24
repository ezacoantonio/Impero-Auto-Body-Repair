import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button } from "@mui/material";

const ClientTable = ({ clients, onDelete }) => {
  const columns = [
    { field: "plateNumber", headerName: "Plate Number", width: 150 },
    { field: "name", headerName: "Driver/Company", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          color="error"
          onClick={() => onDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Client Records
      </Typography>
      <DataGrid
        rows={clients}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default ClientTable;
