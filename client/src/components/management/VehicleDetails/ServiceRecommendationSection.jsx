import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  Divider,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { saveReport, completeJob } from "../../../api/serviceReportApi";

export default function ServiceRecommendationSection({ client }) {
  // State for services and parts
  const [bodyWork, setBodyWork] = useState([]);
  const [mechanicWork, setMechanicWork] = useState([]);
  const [parts, setParts] = useState([]);
  const [report, setReport] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [newService, setNewService] = useState({
    type: "body",
    name: "",
    note: "",
    price: "",
  });
  const [newPart, setNewPart] = useState({
    name: "",
    quantity: 1,
    price: "",
  });

  // Load existing report on client change
  useEffect(() => {
    const loadReport = async () => {
      try {
        // Initialize with empty arrays if no report exists
        setBodyWork([]);
        setMechanicWork([]);
        setParts([]);
        setIsCompleted(false);
      } catch (err) {
        setError("Failed to load report");
      }
    };

    if (client?._id) {
      loadReport();
    }
  }, [client?._id]);

  const handleAddService = () => {
    if (newService.name.trim()) {
      const service = {
        ...newService,
        id: Date.now(),
        completed: false,
      };

      if (newService.type === "body") {
        setBodyWork([...bodyWork, service]);
      } else {
        setMechanicWork([...mechanicWork, service]);
      }

      setNewService({
        type: "body",
        name: "",
        note: "",
        price: "",
      });
    }
  };

  const handleAddPart = () => {
    if (newPart.name.trim()) {
      setParts([
        ...parts,
        {
          ...newPart,
          id: Date.now(),
        },
      ]);
      setNewPart({
        name: "",
        quantity: 1,
        price: "",
      });
    }
  };

  const handleSaveReport = async () => {
    try {
      const reportData = {
        services: [...bodyWork, ...mechanicWork].map(({ id, ...rest }) => rest),
        items: [], // Add your vehicle items here if needed
        parts: parts.map(({ id, ...rest }) => rest),
      };

      const savedReport = await saveReport(client._id, reportData);
      setReport(savedReport);
      setLastSaved(new Date());
      setError(null);
    } catch (err) {
      setError("Failed to save report");
    }
  };

  const handleCompleteJob = async () => {
    try {
      if (!report) return;

      const completedReport = await completeJob(report._id);
      setReport(completedReport);
      setIsCompleted(true);
      setError(null);
    } catch (err) {
      setError("Failed to complete job");
    }
  };

  const calculateTotals = () => {
    const laborTotal = [...bodyWork, ...mechanicWork]
      .filter((item) => !item.completed)
      .reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    const partsTotal = parts.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity) || 0),
      0
    );

    return {
      laborTotal,
      partsTotal,
      grandTotal: laborTotal + partsTotal,
    };
  };

  const { laborTotal, partsTotal, grandTotal } = calculateTotals();

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
      <Typography variant="h6" gutterBottom>
        Service Recommendation
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isCompleted && report?.completedAt && (
        <Alert
          icon={<CheckCircleIcon fontSize="inherit" />}
          severity="success"
          sx={{ mb: 2 }}
        >
          Job completed on {new Date(report.completedAt).toLocaleDateString()}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Add New Service
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            select
            size="small"
            value={newService.type}
            onChange={(e) =>
              setNewService({ ...newService, type: e.target.value })
            }
            SelectProps={{ native: true }}
            sx={{ minWidth: 120 }}
            disabled={isCompleted}
          >
            <option value="body">Body Work</option>
            <option value="mechanic">Mechanic Work</option>
          </TextField>
          <TextField
            fullWidth
            size="small"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            placeholder="Service name"
            disabled={isCompleted}
          />
          <TextField
            fullWidth
            size="small"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
            placeholder="Price"
            type="number"
            disabled={isCompleted}
          />
        </Box>
        <TextField
          fullWidth
          size="small"
          value={newService.note}
          onChange={(e) =>
            setNewService({ ...newService, note: e.target.value })
          }
          placeholder="Notes"
          multiline
          rows={2}
          sx={{ mb: 1 }}
          disabled={isCompleted}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddService}
          fullWidth
          disabled={isCompleted}
        >
          Add Service
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Body Work
          </Typography>
          <List dense sx={{ maxHeight: 150, overflowY: "auto" }}>
            {bodyWork.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <Checkbox
                  checked={item.completed}
                  onChange={(e) => {
                    setBodyWork(
                      bodyWork.map((i) =>
                        i.id === item.id
                          ? { ...i, completed: e.target.checked }
                          : i
                      )
                    );
                  }}
                  size="small"
                  disabled={isCompleted}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.note} • ${item.price}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    setBodyWork(bodyWork.filter((i) => i.id !== item.id))
                  }
                  disabled={isCompleted}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Mechanic Work
          </Typography>
          <List dense sx={{ maxHeight: 150, overflowY: "auto" }}>
            {mechanicWork.map((item) => (
              <ListItem key={item.id} sx={{ px: 0 }}>
                <Checkbox
                  checked={item.completed}
                  onChange={(e) => {
                    setMechanicWork(
                      mechanicWork.map((i) =>
                        i.id === item.id
                          ? { ...i, completed: e.target.checked }
                          : i
                      )
                    );
                  }}
                  size="small"
                  disabled={isCompleted}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.note} • ${item.price}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    setMechanicWork(
                      mechanicWork.filter((i) => i.id !== item.id)
                    )
                  }
                  disabled={isCompleted}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Parts Purchased
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            placeholder="Part name"
            disabled={isCompleted}
          />
          <TextField
            size="small"
            value={newPart.quantity}
            onChange={(e) =>
              setNewPart({ ...newPart, quantity: e.target.value })
            }
            placeholder="Qty"
            type="number"
            sx={{ width: 80 }}
            disabled={isCompleted}
          />
          <TextField
            size="small"
            value={newPart.price}
            onChange={(e) => setNewPart({ ...newPart, price: e.target.value })}
            placeholder="Price"
            type="number"
            sx={{ width: 100 }}
            disabled={isCompleted}
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPart}
          fullWidth
          disabled={isCompleted}
        >
          Add Part
        </Button>

        <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 150 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Part</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell>{part.name}</TableCell>
                  <TableCell align="right">{part.quantity}</TableCell>
                  <TableCell align="right">${part.price}</TableCell>
                  <TableCell align="right">
                    ${(part.quantity * part.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() =>
                        setParts(parts.filter((p) => p.id !== part.id))
                      }
                      disabled={isCompleted}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          backgroundColor: "grey.100",
          borderRadius: 1,
          p: 2,
          borderLeft: "4px solid",
          borderColor: "primary.main",
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Cost Summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">Labor Total:</Typography>
          <Typography variant="body2">${laborTotal.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2">Parts Total:</Typography>
          <Typography variant="body2">${partsTotal.toFixed(2)}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle2">Grand Total:</Typography>
          <Typography variant="subtitle2">${grandTotal.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveReport}
          disabled={isCompleted}
          sx={{ flex: 1 }}
        >
          Save Draft
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          onClick={handleCompleteJob}
          disabled={isCompleted || !report}
          sx={{ flex: 1 }}
        >
          Complete Job
        </Button>
      </Box>

      {lastSaved && (
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Last saved: {new Date(lastSaved).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
}
