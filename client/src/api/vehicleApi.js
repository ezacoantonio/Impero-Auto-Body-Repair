import axios from "axios";

export const getVehicleItems = async (clientId) => {
  const response = await axios.get(`/api/clients/${clientId}/items`);
  return response.data;
};

export const updateVehicleItems = async (clientId, items) => {
  const response = await axios.put(`/api/clients/${clientId}/items`, items);
  return response.data;
};
