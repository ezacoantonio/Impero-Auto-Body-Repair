// client/src/components/InvoicePreview.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

// Theme colors (match app theme)
const RED = "#A01414";
const BLACK = "#0F0F10";
const MID = "#3A3A3C";
const LIGHT = "#F5F5F7";
const BORDER = "1px solid rgba(0,0,0,.08)";

const currency = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  });

export default function InvoicePreview({ invoice }) {
  if (!invoice) return null;

  // Fallbacks in case your API doesn’t include them
  const lineItems = [
    ...(invoice.items || []), // backend should already combine services + expenses
  ];

  // Defensive compute (backend already returns these—safe to recompute)
  const subtotal =
    invoice.subtotal ??
    lineItems.reduce((sum, it) => sum + Number(it.price || it.cost || 0), 0);
  const taxRate = invoice.taxRate ?? 0.13;
  const tax = invoice.tax ?? subtotal * taxRate;
  const total = invoice.total ?? subtotal + tax;

  const shop = invoice.shop || {
    name: "Impero Auto Body Repair",
    address: "Addis Ababa Ethiopia",
    phone: "0911259161",
    email: "info@imperoautobody.ca",
  };

  const client = invoice.client || {};
  const vehicle = client.vehicle || invoice.vehicle || {};

  return (
    <Box
      sx={{
        // A4-ish canvas (good for screen + print)
        width: "100%",
        maxWidth: "900px",
        mx: "auto",
        position: "relative",
        // background watermark
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.92), rgba(255,255,255,.96)), url('/invoice-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: BORDER,
        boxShadow: "0 12px 36px rgba(0,0,0,.08)",
      }}
    >
      {/* Print styles (kept local) */}
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print-shadow { box-shadow: none !important; border: none !important; }
          .invoice-root { border: none !important; box-shadow: none !important; }
        }
        .tight td, .tight th { padding: 8px 12px; }
      `}</style>

      {/* Top band */}
      <Box
        sx={{
          height: 10,
          background: `linear-gradient(90deg, ${BLACK}, ${RED})`,
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
      />

      <Paper
        className="invoice-root no-print-shadow"
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          background: "transparent",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          {/* Logo + shop */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Logo box */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 2,
                overflow: "hidden",
                border: BORDER,
                backgroundColor: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  // simple fallback box if no logo
                  e.currentTarget.style.display = "none";
                }}
              />
              {/* If no logo, you still get a white square frame */}
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: BLACK, lineHeight: 1 }}
              >
                {shop.name}
              </Typography>
              <Typography sx={{ color: MID, fontSize: 14 }}>
                {shop.address}
              </Typography>
              <Typography sx={{ color: MID, fontSize: 14 }}>
                {shop.phone} • {shop.email}
              </Typography>
            </Box>
          </Stack>

          {/* Invoice meta */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1.5,
              background: "#fff",
              border: `1px solid ${RED}30`,
              minWidth: 220,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: RED, letterSpacing: 1, fontWeight: 700 }}
            >
              INVOICE
            </Typography>
            <Stack spacing={0.5} sx={{ mt: 0.5 }}>
              <Row
                label="Invoice #"
                value={invoice.invoiceNumber || invoice._id?.slice(-8)}
              />
              <Row
                label="Date"
                value={new Date(
                  invoice.date || Date.now()
                ).toLocaleDateString()}
              />
              <Row
                label="Status"
                value={(invoice.status || "Unpaid").toUpperCase()}
              />
            </Stack>
          </Box>
        </Stack>

        {/* Parties */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: BORDER,
            background: "#fff",
            mb: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            divider={<Divider flexItem orientation="vertical" />}
          >
            <Box sx={{ flex: 1 }}>
              <SectionTitle>Bill To</SectionTitle>
              <Typography sx={{ fontWeight: 600 }}>
                {client.fullName}
              </Typography>
              <Typography sx={{ color: MID, fontSize: 14 }}>
                Phone: {client.phone || "—"}
              </Typography>
              <Typography sx={{ color: MID, fontSize: 14 }}>
                Plate: {client.plateNumber || "—"}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <SectionTitle>Vehicle</SectionTitle>
              <Typography sx={{ fontWeight: 600 }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Typography>
              <Typography sx={{ color: MID, fontSize: 14 }}>
                VIN: {vehicle.vin || "—"}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Items */}
        <Paper
          elevation={0}
          sx={{
            border: BORDER,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Table
            size="small"
            sx={{ "& th": { background: LIGHT } }}
            className="tight"
          >
            <TableHead>
              <TableRow>
                <Th>Description</Th>
                <Th align="right" sx={{ width: 140 }}>
                  Price
                </Th>
              </TableRow>
            </TableHead>
            <TableBody>
              {lineItems.map((it, idx) => (
                <TableRow key={idx}>
                  <Td>
                    <Typography sx={{ fontWeight: 600 }}>
                      {it.name || it.item || "Service"}
                    </Typography>
                    {typeof it.progress === "number" && (
                      <Typography sx={{ color: MID, fontSize: 12 }}>
                        Progress: {it.progress}% {it.done ? "— Done" : ""}
                      </Typography>
                    )}
                  </Td>
                  <Td align="right">{currency(it.price ?? it.cost)}</Td>
                </TableRow>
              ))}
              {!lineItems.length && (
                <TableRow>
                  <Td colSpan={2} align="center" sx={{ color: MID }}>
                    No items.
                  </Td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Totals */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "flex-end" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Box sx={{ flex: 1, color: MID }}>
            <Typography variant="body2">
              Thank you for choosing <strong>{shop.name}</strong>.<br />
              All parts and labour are covered by our standard warranty.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: BORDER,
              background: "#fff",
              minWidth: 300,
              p: 2,
            }}
          >
            <KeyValue label="Subtotal" value={currency(subtotal)} />
            <KeyValue label={`Tax (13%)`} value={currency(tax)} />
            <Divider sx={{ my: 1 }} />
            <KeyValue label="Total" value={currency(total)} strong accent />
          </Paper>
        </Stack>

        {/* Footer band */}
        <Box
          sx={{
            mt: 3,
            height: 8,
            background: `linear-gradient(90deg, ${RED}, ${BLACK})`,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
          }}
        />
      </Paper>
    </Box>
  );
}

/** Small presentational helpers */
function SectionTitle({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{ color: "#666", letterSpacing: 1, fontWeight: 700 }}
    >
      {children}
    </Typography>
  );
}

function Th(props) {
  return (
    <TableCell
      {...props}
      sx={{
        borderBottom: BORDER,
        color: BLACK,
        fontWeight: 700,
        ...props.sx,
      }}
    />
  );
}
function Td(props) {
  return (
    <TableCell
      {...props}
      sx={{
        borderBottom: BORDER,
        color: MID,
        ...props.sx,
      }}
    />
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography sx={{ color: MID, fontSize: 13 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{value}</Typography>
    </Stack>
  );
}

function KeyValue({ label, value, strong, accent }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ my: 0.5 }}>
      <Typography sx={{ color: MID, fontWeight: strong ? 700 : 500 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: strong ? 800 : 600,
          color: accent ? RED : BLACK,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
