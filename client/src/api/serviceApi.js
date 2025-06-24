import axios from "axios";

export const getClientServices = async (clientId) => {
  const response = await axios.get(`/api/clients/${clientId}/services`);
  return response.data;
};

export const createService = async (clientId, serviceData) => {
  const response = await axios.post(
    `/api/clients/${clientId}/services`,
    serviceData
  );
  return response.data;
};

export const updateService = async (serviceId, updates) => {
  const response = await axios.put(`/api/services/${serviceId}`, updates);
  return response.data;
};

export const deleteService = async (serviceId) => {
  await axios.delete(`/api/services/${serviceId}`);
};
