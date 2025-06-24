import axios from "axios";

export const saveReport = async (clientId, reportData) => {
  try {
    const response = await axios.post(
      `/api/clients/${clientId}/reports`,
      reportData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to save report");
  }
};

export const completeJob = async (reportId) => {
  try {
    const response = await axios.put(`/api/reports/${reportId}/complete`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to complete job");
  }
};

export const generateInvoice = (report) => {
  const invoiceWindow = window.open("", "_blank");
  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Invoice #${report.invoiceNumber || "TEMP"}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2em; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { font-weight: bold; font-size: 1.2em; margin-top: 10px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Service Invoice #${report.invoiceNumber || "TEMP"}</h1>
          <p>Date: ${new Date(
            report.completedAt || Date.now()
          ).toLocaleDateString()}</p>
        </div>
        
        <h2>Services</h2>
        <table>
          ${
            report.services
              ?.map(
                (s) => `
            <tr>
              <td>${s.name}</td>
              <td>$${s.price?.toFixed(2) || "0.00"}</td>
            </tr>
          `
              )
              .join("") || "<tr><td>No services</td></tr>"
          }
        </table>
        
        <h2>Parts</h2>
        <table>
          ${
            report.parts
              ?.map(
                (p) => `
            <tr>
              <td>${p.name} (${p.quantity})</td>
              <td>$${(p.price * p.quantity)?.toFixed(2) || "0.00"}</td>
            </tr>
          `
              )
              .join("") || "<tr><td>No parts</td></tr>"
          }
        </table>
        
        <div class="total">
          Total: $${(
            (report.services?.reduce((sum, s) => sum + (s.price || 0), 0) ||
              0) +
            (report.parts?.reduce(
              (sum, p) => sum + (p.price * p.quantity || 0),
              0
            ) || 0)
          ).toFixed(2)}
        </div>
      </body>
    </html>
  `);
  invoiceWindow.document.close();
};
