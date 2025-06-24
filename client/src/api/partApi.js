import axios from "axios";

export const getClientParts = async (clientId) => {
  const response = await axios.get(`/api/clients/${clientId}/parts`);
  return response.data;
};

export const createPart = async (clientId, partData) => {
  const response = await axios.post(`/api/clients/${clientId}/parts`, partData);
  return response.data;
};

export const deletePart = async (partId) => {
  await axios.delete(`/api/parts/${partId}`);
};
