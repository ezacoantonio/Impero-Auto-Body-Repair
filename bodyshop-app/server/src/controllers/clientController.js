import Client from "../models/Client.js";

// Clients
export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const listClients = async (_req, res) => {
  const clients = await Client.find().sort({ createdAt: -1 }).lean();
  // If you want counts, you can add an aggregation later; for now, just return clients
  res.json(clients);
};
// server/src/controllers/clientController.js
export const getClient = async (req, res) => {
  const client = await Client.findById(req.params.id).populate({
    path: "jobs",
    select: "title status openedAt closedAt createdAt updatedAt",
  });
  if (!client) return res.status(404).json({ error: "Client not found" });
  res.json(client);
};
export const updateClientProfile = async (req, res) => {
  try {
    const { fullName, phone, vehicle } = req.body;
    const updated = await Client.findByIdAndUpdate(
      req.params.id,
      { $set: { fullName, phone, vehicle } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Client not found" });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteClient = async (req, res) => {
  const deleted = await Client.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Client not found" });
  res.json({ message: "Client deleted" });
};

// Recommendations
export const addRecommendation = async (req, res) => {
  const { name, price } = req.body;
  const client = await Client.findById(req.params.id).populate({
    path: "jobs",
    select: "title status openedAt closedAt createdAt updatedAt",
  });

  if (!client) return res.status(404).json({ error: "Client not found" });
  client.serviceRecommendations.push({ name, price });
  await client.save();
  res.status(201).json(client);
};

export const updateRecommendation = async (req, res) => {
  const { recommendationId } = req.params;
  const { name, price, progress, done } = req.body;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const rec = client.serviceRecommendations.id(recommendationId);
  if (!rec) return res.status(404).json({ error: "Recommendation not found" });

  if (name !== undefined) rec.name = name;
  if (price !== undefined) rec.price = price;
  if (progress !== undefined) rec.progress = progress;
  if (done !== undefined) rec.done = done;

  await client.save();
  res.json(client);
};

export const deleteRecommendation = async (req, res) => {
  const { recommendationId } = req.params;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const rec = client.serviceRecommendations.id(recommendationId);
  if (!rec) return res.status(404).json({ error: "Recommendation not found" });

  rec.deleteOne();
  await client.save();
  res.json(client);
};

// Expenses
export const addExpense = async (req, res) => {
  const { item, cost } = req.body;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  client.expenses.push({ item, cost });
  await client.save();
  res.status(201).json(client);
};

export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const exp = client.expenses.id(expenseId);
  if (!exp) return res.status(404).json({ error: "Expense not found" });

  exp.deleteOne();
  await client.save();
  res.json(client);
};

// Work Items
export const addWorkItem = async (req, res) => {
  const { description, recommendationId } = req.body;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  client.workItems.push({ description, recommendationId });
  await client.save();
  res.status(201).json(client);
};

export const updateWorkItem = async (req, res) => {
  const { workItemId } = req.params;
  const { description, progress, done } = req.body;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  const wi = client.workItems.id(workItemId);
  if (!wi) return res.status(404).json({ error: "Work item not found" });

  if (description !== undefined) wi.description = description;
  if (progress !== undefined) wi.progress = progress;
  if (done !== undefined) wi.done = done;

  await client.save();
  res.json(client);
};

export const deleteWorkItem = async (req, res) => {
  const { workItemId } = req.params;
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(404).json({ error: "Client not found" });
  const wi = client.workItems.id(workItemId);
  if (!wi) return res.status(404).json({ error: "Work item not found" });
  wi.deleteOne();
  await client.save();
  res.json(client);
};

// --- SEARCH CLIENTS (name, phone, plate, make, model, year) ---
export const searchClients = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    // Build case-insensitive OR conditions
    const or = [
      { fullName: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
      { plateNumber: { $regex: q, $options: "i" } },
      { "vehicle.make": { $regex: q, $options: "i" } },
      { "vehicle.model": { $regex: q, $options: "i" } },
    ];

    // If q is a number, also try match vehicle.year exactly
    const yearNum = Number(q);
    if (!Number.isNaN(yearNum)) {
      or.push({ "vehicle.year": yearNum });
    }

    const results = await Client.find({ $or: or })
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("_id fullName phone plateNumber vehicle"); // trim payload

    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { item, cost } = req.body;
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const exp = client.expenses.id(expenseId);
    if (!exp) return res.status(404).json({ error: "Expense not found" });

    if (item !== undefined) exp.item = item;
    if (cost !== undefined) exp.cost = cost;

    await client.save();
    res.json(client);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
