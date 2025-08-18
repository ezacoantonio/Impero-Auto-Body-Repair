// server/src/controllers/invoiceController.js
import Client from "../models/Client.js";

const HST_RATE = Number(process.env.HST_RATE ?? 0.13);

// GET /api/invoices/:id
export const generateInvoice = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  // Services: only include DONE ones on the invoice
  const doneServices = client.serviceRecommendations.filter((r) => r.done);
  const servicesItems = doneServices.map((s) => ({
    name: s.name,
    price: Number(s.price || 0),
    progress: Number(s.progress ?? 0),
    done: !!s.done,
    type: "service",
    _id: s._id,
  }));

  // Expenses: include all
  const expenseItems = client.expenses.map((e) => ({
    name: e.item,
    price: Number(e.cost || 0),
    type: "expense",
    _id: e._id,
  }));

  // Flat list for the UI
  const items = [...servicesItems, ...expenseItems];

  // Totals (top level to match the React component)
  const subtotal = +items
    .reduce((sum, it) => sum + Number(it.price || 0), 0)
    .toFixed(2);
  const taxRate = HST_RATE;
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  // Human invoice status (no payment model yet, so infer from work state)
  const totalServices = client.serviceRecommendations.length;
  const completedServices = client.serviceRecommendations.filter(
    (r) => r.done
  ).length;
  let status = "UNPAID"; // default label

  if (totalServices === 0) {
    status = "DRAFT";
  } else if (completedServices === totalServices) {
    status = "COMPLETE";
  } else if (
    client.serviceRecommendations.some((r) => Number(r.progress ?? 0) > 0)
  ) {
    status = "IN PROGRESS";
  } else {
    status = "DRAFT";
  }

  // Optional: lightweight invoice number
  const invoiceNumber = `${String(
    client.plateNumber || ""
  ).toUpperCase()}-${Date.now().toString().slice(-6)}`;

  res.json({
    invoiceNumber,
    date: new Date().toISOString(),
    status,
    taxRate,
    subtotal,
    tax,
    total,
    // the UI reads this:
    items,
    // context
    client: {
      _id: client._id,
      fullName: client.fullName,
      phone: client.phone,
      plateNumber: client.plateNumber,
      vehicle: client.vehicle,
    },
  });
};
