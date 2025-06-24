// src/api/clientApi.js
import axios from "axios";

const API_URL = "http://localhost:5001/api/clients";

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(API_URL, clientData);
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error.response?.data);
    throw error.response?.data?.error || "Failed to create client";
  }
};

export const getClients = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};
export const deleteClient = async (plateNumber) => {
  try {
    const response = await axios.delete(`${API_URL}/${plateNumber}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting client:", error.response?.data);
    throw error.response?.data?.error || "Failed to delete client";
  }
};
export const updateClient = async (id, data) => {
  const res = await axios.put(`http://localhost:5001/api/clients/${id}`, data);
  return res.data;
};
