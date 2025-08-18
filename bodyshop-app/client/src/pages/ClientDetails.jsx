// client/src/pages/ClientDetails.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Checkbox,
  LinearProgress,
  Slider,
  Tooltip,
} from "@mui/material";
import api from "../services/api";
import Loader from "../components/Loader";
import ServiceRecommendationList from "../components/ServiceRecommendationList";
import InvoicePreview from "../components/InvoicePreview";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PrintIcon from "@mui/icons-material/Print";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import buildInvoiceHtml from "../utils/invoiceHtml";

const isObjectId = (s) => typeof s === "string" && /^[0-9a-fA-F]{24}$/.test(s);

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    make: "",
    model: "",
    year: "",
  });

  // Expense add form
  const [expense, setExpense] = useState({ item: "", cost: "" });
  // Expense edit state
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseDraft, setExpenseDraft] = useState({ item: "", cost: "" });

  // Work add form
  const [work, setWork] = useState({ description: "", recommendationId: "" });
  // Work edit state
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [workDraft, setWorkDraft] = useState({
    description: "",
    progress: 0,
    done: false,
  });

  const [invoice, setInvoice] = useState(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Invoice dialog state
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const invoiceRef = useRef(null);

  const load = async () => {
    const { data } = await api.get(`/clients/${id}`);
    setClient(data);
    setProfile({
      fullName: data.fullName,
      phone: data.phone,
      make: data.vehicle.make,
      model: data.vehicle.model,
      year: data.vehicle.year,
    });
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!client) return <Loader />;

  const saveProfile = async () => {
    const payload = {
      fullName: profile.fullName,
      phone: profile.phone,
      vehicle: {
        make: profile.make,
        model: profile.model,
        year: Number(profile.year),
      },
    };
    const { data } = await api.put(`/clients/${id}`, payload);
    setClient(data);
  };

  // Services
  const addService = async (data) => {
    await api.post(`/clients/${id}/recommendations`, data);
    await load();
  };
  const updateService = async (rid, body) => {
    await api.put(`/clients/${id}/recommendations/${rid}`, body);
    await load();
  };
  const deleteService = async (rid) => {
    await api.delete(`/clients/${id}/recommendations/${rid}`);
    await load();
  };

  // Expenses: add / edit / delete
  const addExpense = async () => {
    await api.post(`/clients/${id}/expenses`, {
      item: expense.item,
      cost: Number(expense.cost),
    });
    setExpense({ item: "", cost: "" });
    await load();
  };

  const startEditExpense = (e) => {
    setEditingExpenseId(e._id);
    setExpenseDraft({ item: e.item, cost: e.cost });
  };
  const cancelEditExpense = () => {
    setEditingExpenseId(null);
    setExpenseDraft({ item: "", cost: "" });
  };
  const saveExpense = async (expenseId) => {
    await api.put(`/clients/${id}/expenses/${expenseId}`, {
      item: expenseDraft.item,
      cost: Number(expenseDraft.cost),
    });
    cancelEditExpense();
    await load();
  };
  const removeExpense = async (expenseId) => {
    await api.delete(`/clients/${id}/expenses/${expenseId}`);
    await load();
  };

  // Work items: add / edit / delete
  const addWork = async () => {
    await api.post(`/clients/${id}/work-items`, {
      description: work.description,
      recommendationId: work.recommendationId || undefined,
    });
    setWork({ description: "", recommendationId: "" });
    await load();
  };

  const startEditWork = (w) => {
    setEditingWorkId(w._id);
    setWorkDraft({
      description: w.description,
      progress: Number(w.progress || 0),
      done: Boolean(w.done),
    });
  };
  const cancelEditWork = () => {
    setEditingWorkId(null);
    setWorkDraft({ description: "", progress: 0, done: false });
  };
  const saveWork = async (workItemId) => {
    await api.put(`/clients/${id}/work-items/${workItemId}`, {
      description: workDraft.description,
      progress: Number(workDraft.progress),
      done: Boolean(workDraft.done),
    });
    cancelEditWork();
    await load();
  };
  const removeWork = async (workItemId) => {
    await api.delete(`/clients/${id}/work-items/${workItemId}`);
    await load();
  };

  // Invoice preview
  const openInvoice = async () => {
    try {
      const cid = client?._id || id;
      if (!isObjectId(cid)) {
        alert("Invoice error: invalid client ID.");
        return;
      }
      const { data } = await api.get(`/invoices/${cid}`);
      setInvoice(data);
      setInvoiceOpen(true);
    } catch (err) {
      console.error(err);
      alert(
        `Could not load invoice: ${err?.response?.status || ""} ${
          err?.response?.statusText || err.message
        }`
      );
    }
  };

  // Export invoice as PDF
  const downloadPDF = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight);
    pdf.save(`invoice_${client.plateNumber}.pdf`);
  };

  // Print (browser print dialog)
  const printInvoice = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.outerHTML;
    const win = window.open("", "_blank", "width=900,height=650");
    win.document.write(`
      <html><head><title>Invoice</title>
      <style>body{margin:0;padding:20px;font-family:Arial,Helvetica,sans-serif}</style>
      </head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  // Delete client flow
  const openDelete = () => {
    setConfirmName("");
    setDeleteError("");
    setDeleteOpen(true);
  };
  const doDelete = async () => {
    if (confirmName.trim() !== client.fullName.trim()) {
      setDeleteError(
        "Name does not match. Type the full name exactly as shown."
      );
      return;
    }
    await api.delete(`/clients/${id}`);
    navigate("/");
  };
  const canDelete = confirmName.trim() === client.fullName.trim();

  // Save progress without entering edit mode
  const setWorkProgress = async (workItemId, value) => {
    await api.put(`/clients/${id}/work-items/${workItemId}`, {
      progress: Number(value),
      done: Number(value) === 100,
    });
    await load();
  };

  // Toggle done quickly
  const toggleWorkDone = async (workItemId, checked) => {
    await api.put(`/clients/${id}/work-items/${workItemId}`, {
      done: checked,
      progress: checked ? 100 : 0,
    });
    await load();
  };
  const openPrintableInvoice = async () => {
    // Get the fresh invoice data from your API
    const { data } = await api.get(`/invoices/${client._id}`);
    // Build the HTML doc
    const html = buildInvoiceHtml(data, {
      logoUrl: "/logo.png", // or a full URL
      bgUrl: "/invoice-bg.jpg", // or a full URL
      invoiceTitle: "Invoice",
    });

    // Open a new tab and write HTML
    const win = window.open("", "_blank", "width=900,height=650");
    if (!win) {
      alert("Please allow popups to view the invoice.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();

    // Optional: auto-print once loaded
    win.onload = () => {
      win.focus();
      win.print();
      // win.close(); // uncomment if you want to auto-close after printing
    };
  };
  return (
    <Container sx={{ py: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5">
          {client.fullName} — {client.plateNumber}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={openInvoice}
            startIcon={<PictureAsPdfIcon />}
          >
            View / Export Invoice
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={openDelete}
            startIcon={<DeleteForeverIcon />}
          >
            Delete Client
          </Button>
          <Button variant="outlined" onClick={openPrintableInvoice}>
            View / Print (HTML → PDF)
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Profile */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Profile</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <TextField
                label="Full Name"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, fullName: e.target.value }))
                }
              />
              <TextField
                label="Phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
              />
              <TextField
                label="Make"
                value={profile.make}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, make: e.target.value }))
                }
              />
              <TextField
                label="Model"
                value={profile.model}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, model: e.target.value }))
                }
              />
              <TextField
                label="Year"
                value={profile.year}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, year: e.target.value }))
                }
              />
              <Button variant="contained" onClick={saveProfile}>
                Save Profile
              </Button>
            </Stack>
          </Paper>
        </Grid>

        {/* Service Recommendations */}
        <Grid item xs={12} md={8}>
          <ServiceRecommendationList
            client={client}
            onAdd={addService}
            onUpdate={updateService}
            onDelete={deleteService}
          />
        </Grid>

        {/* Expenses */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Expenses</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <TextField
                label="Item"
                value={expense.item}
                onChange={(e) =>
                  setExpense((s) => ({ ...s, item: e.target.value }))
                }
              />
              <TextField
                label="Cost"
                value={expense.cost}
                onChange={(e) =>
                  setExpense((s) => ({ ...s, cost: e.target.value }))
                }
              />
              <Button variant="contained" onClick={addExpense}>
                Add
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {client.expenses.map((e) => (
                <Paper
                  key={e._id}
                  sx={{
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  {editingExpenseId === e._id ? (
                    <>
                      <Stack direction="row" spacing={1} sx={{ flex: 1 }}>
                        <TextField
                          size="small"
                          label="Item"
                          value={expenseDraft.item}
                          onChange={(ev) =>
                            setExpenseDraft((d) => ({
                              ...d,
                              item: ev.target.value,
                            }))
                          }
                        />
                        <TextField
                          size="small"
                          label="Cost"
                          value={expenseDraft.cost}
                          onChange={(ev) =>
                            setExpenseDraft((d) => ({
                              ...d,
                              cost: ev.target.value,
                            }))
                          }
                          sx={{ width: 120 }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Save">
                          <IconButton onClick={() => saveExpense(e._id)}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Cancel">
                          <IconButton onClick={cancelEditExpense}>
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ flex: 1 }}>
                        {e.item} — ${Number(e.cost).toFixed(2)}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit">
                          <IconButton onClick={() => startEditExpense(e)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => removeExpense(e._id)}>
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </>
                  )}
                </Paper>
              ))}
              {!client.expenses.length && (
                <Typography>No expenses yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Work Items */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Work Items</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <TextField
                label="Description"
                value={work.description}
                onChange={(e) =>
                  setWork((w) => ({ ...w, description: e.target.value }))
                }
              />
              <TextField
                label="(Optional) Recommendation ID"
                value={work.recommendationId}
                onChange={(e) =>
                  setWork((w) => ({ ...w, recommendationId: e.target.value }))
                }
              />
              <Button variant="contained" onClick={addWork}>
                Add
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
              {client.workItems.map((w) => (
                <Paper key={w._id} sx={{ p: 1.5 }}>
                  {editingWorkId === w._id ? (
                    <Stack spacing={1}>
                      <TextField
                        size="small"
                        label="Description"
                        value={workDraft.description}
                        onChange={(ev) =>
                          setWorkDraft((d) => ({
                            ...d,
                            description: ev.target.value,
                          }))
                        }
                      />
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          Progress
                        </Typography>
                        <Slider
                          value={workDraft.progress}
                          min={0}
                          max={100}
                          step={5}
                          onChange={(_, val) =>
                            setWorkDraft((d) => ({ ...d, progress: val }))
                          }
                          sx={{ flex: 1 }}
                        />
                        <Checkbox
                          checked={workDraft.done}
                          onChange={(ev) =>
                            setWorkDraft((d) => ({
                              ...d,
                              done: ev.target.checked,
                            }))
                          }
                        />
                        <Typography variant="body2">Done</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          startIcon={<SaveIcon />}
                          variant="contained"
                          onClick={() => saveWork(w._id)}
                        >
                          Save
                        </Button>
                        <Button
                          startIcon={<CloseIcon />}
                          onClick={cancelEditWork}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Typography>{w.description}</Typography>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Edit">
                            <IconButton onClick={() => startEditWork(w)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton onClick={() => removeWork(w._id)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                      <Slider
                        value={Number(w.progress || 0)}
                        min={0}
                        max={100}
                        step={5}
                        onChangeCommitted={(_, val) =>
                          setWorkProgress(w._id, val)
                        }
                      />
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Checkbox
                          checked={Boolean(w.done)}
                          onChange={(e) =>
                            toggleWorkDone(w._id, e.target.checked)
                          }
                        />
                        <Typography variant="caption">
                          {Number(w.progress || 0)}% {w.done ? "— Done" : ""}
                        </Typography>
                      </Stack>

                      {/* <LinearProgress
                        variant="determinate"
                        value={Number(w.progress || 0)}
                      /> */}
                      {/* <Typography variant="caption">
                        {Number(w.progress || 0)}% {w.done ? "— Done" : ""}
                      </Typography> */}
                    </Stack>
                  )}
                </Paper>
              ))}
              {!client.workItems.length && (
                <Typography>No work items yet.</Typography>
              )}
            </Stack>
          </Paper>
        </Grid>

        {/* Jobs (visits) – if you added the virtual */}
        {client.jobs?.length ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Jobs (visits)
              </Typography>
              {client.jobs.map((j) => (
                <Paper
                  key={j._id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography sx={{ fontWeight: 600 }}>{j.title}</Typography>
                    <Typography variant="body2">
                      Status: {j.status} • Opened:{" "}
                      {new Date(j.openedAt).toLocaleDateString()}
                      {j.closedAt
                        ? ` • Closed: ${new Date(
                            j.closedAt
                          ).toLocaleDateString()}`
                        : ""}
                    </Typography>
                  </div>
                  <Button variant="outlined" disabled>
                    Open (soon)
                  </Button>
                </Paper>
              ))}
            </Paper>
          </Grid>
        ) : null}
      </Grid>

      {/* Invoice dialog */}
      <Dialog
        open={invoiceOpen}
        onClose={() => setInvoiceOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent dividers>
          <div ref={invoiceRef}>
            <InvoicePreview invoice={invoice} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceOpen(false)}>Close</Button>
          <Button onClick={printInvoice} startIcon={<PrintIcon />}>
            Print
          </Button>
          <Button
            variant="contained"
            onClick={downloadPDF}
            startIcon={<PictureAsPdfIcon />}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth>
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            Type the client’s full name to confirm deletion:
            <strong> {client.fullName}</strong>
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Type full name exactly"
            value={confirmName}
            onChange={(e) => {
              setDeleteError("");
              setConfirmName(e.target.value);
            }}
          />
          {deleteError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            disabled={!canDelete}
            onClick={doDelete}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
