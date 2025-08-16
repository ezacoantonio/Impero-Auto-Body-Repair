import Client from "../models/Client.js";
const HST_RATE = Number(process.env.HST_RATE ?? 0.13);

// Invoice only counts services that are DONE (100%)
export const generateInvoice = async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const services = client.serviceRecommendations.filter((r) => r.done);
  const servicesSubtotal = services.reduce((sum, r) => sum + (r.price || 0), 0);
  const expensesSubtotal = client.expenses.reduce(
    (sum, e) => sum + (e.cost || 0),
    0
  );
  const includeExpenses = true;

  const subtotal = servicesSubtotal + (includeExpenses ? expensesSubtotal : 0);
  const tax = +(subtotal * HST_RATE).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);

  res.json({
    client: {
      fullName: client.fullName,
      phone: client.phone,
      plateNumber: client.plateNumber,
      vehicle: client.vehicle,
    },
    services: services.map((s) => ({
      name: s.name,
      price: s.price,
      progress: s.progress,
    })),
    expenses: includeExpenses ? client.expenses : [],
    amounts: {
      servicesSubtotal: +servicesSubtotal.toFixed(2),
      expensesSubtotal: includeExpenses ? +expensesSubtotal.toFixed(2) : 0,
      subtotal: +subtotal.toFixed(2),
      taxRate: HST_RATE,
      tax,
      total,
    },
    generatedAt: new Date().toISOString(),
  });
};
