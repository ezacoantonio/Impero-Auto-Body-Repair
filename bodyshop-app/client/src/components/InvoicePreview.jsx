// client/src/components/InvoicePreview.jsx
import React, { forwardRef } from "react";
import { Box, Typography, Divider } from "@mui/material";
import dayjs from "dayjs";

/**
 * Props:
 *  - invoice: {
 *      client:{ fullName, phone, plateNumber, vehicle:{make,model,year} },
 *      services:[{name,price}],
 *      expenses:[{item,cost}],
 *      amounts:{ servicesSubtotal, expensesSubtotal, subtotal, taxRate, tax, total },
 *      generatedAt: ISO
 *    }
 */
const InvoicePreview = forwardRef(({ invoice, shop = {} }, ref) => {
  if (!invoice) return null;

  const {
    client,
    services = [],
    expenses = [],
    amounts,
    generatedAt,
  } = invoice;

  const shopInfo = {
    name: shop.name || "Impero Auto Body Repair",
    address: shop.address || "123 Sample St, Toronto, ON",
    phone: shop.phone || "(647) 000-0000",
    email: shop.email || "shop@example.com",
  };

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
        background: "#fff",
        color: "#000",
        width: 800,
        mx: "auto",
        fontSize: 14,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {shopInfo.name}
          </Typography>
          <Typography>{shopInfo.address}</Typography>
          <Typography>
            {shopInfo.phone} • {shopInfo.email}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            INVOICE
          </Typography>
          <Typography>
            Generated: {dayjs(generatedAt).format("YYYY-MM-DD HH:mm")}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Client */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 600 }}>Bill To</Typography>
          <Typography>{client.fullName}</Typography>
          <Typography>{client.phone}</Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography sx={{ fontWeight: 600 }}>Vehicle</Typography>
          <Typography>
            {client.vehicle.year} {client.vehicle.make} {client.vehicle.model}
          </Typography>
          <Typography>Plate: {client.plateNumber}</Typography>
        </Box>
      </Box>

      {/* Services */}
      <Typography sx={{ mt: 2, fontWeight: 600 }}>Services</Typography>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                borderBottom: "1px solid #ddd",
                padding: "8px",
              }}
            >
              Description
            </th>
            <th
              style={{
                textAlign: "right",
                borderBottom: "1px solid #ddd",
                padding: "8px",
              }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ padding: "8px" }}>
                No completed services.
              </td>
            </tr>
          ) : (
            services.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: "8px" }}>{s.name}</td>
                <td style={{ padding: "8px", textAlign: "right" }}>
                  ${Number(s.price).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Expenses */}
      {expenses?.length ? (
        <>
          <Typography sx={{ mt: 3, fontWeight: 600 }}>Expenses</Typography>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    textAlign: "right",
                    borderBottom: "1px solid #ddd",
                    padding: "8px",
                  }}
                >
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e, i) => (
                <tr key={i}>
                  <td style={{ padding: "8px" }}>{e.item}</td>
                  <td style={{ padding: "8px", textAlign: "right" }}>
                    ${Number(e.cost).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      {/* Totals */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <table style={{ width: 360 }}>
          <tbody>
            <tr>
              <td style={{ padding: "6px" }}>Services Subtotal</td>
              <td style={{ padding: "6px", textAlign: "right" }}>
                ${amounts.servicesSubtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px" }}>Expenses Subtotal</td>
              <td style={{ padding: "6px", textAlign: "right" }}>
                ${amounts.expensesSubtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px", borderTop: "1px solid #ddd" }}>
                Subtotal
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "right",
                  borderTop: "1px solid #ddd",
                }}
              >
                ${amounts.subtotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px" }}>
                HST ({(amounts.taxRate * 100).toFixed(0)}%)
              </td>
              <td style={{ padding: "6px", textAlign: "right" }}>
                ${amounts.tax.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "6px",
                  fontWeight: 700,
                  borderTop: "2px solid #000",
                }}
              >
                Total
              </td>
              <td
                style={{
                  padding: "6px",
                  textAlign: "right",
                  fontWeight: 700,
                  borderTop: "2px solid #000",
                }}
              >
                ${amounts.total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </Box>

      <Typography sx={{ mt: 4, fontStyle: "italic" }}>
        Thank you for your business.
      </Typography>
    </Box>
  );
});

export default InvoicePreview;
