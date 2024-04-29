import axios from 'axios';

const API_BASE_URL = 'https://localhost:7297/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchRows = () => {
  return api.get('/Permissions');
};

export const updateRow = (row) => {
  return api.put(`/Permissions/${row.id}`, row);
};

export const addPermission = (rowData) => {
  const row = {
    employeeName: rowData.employeeName,
    employeeLastName: rowData.employeeLastName,
    permissionType: rowData.permissionType,
    permissionDate: rowData.permissionDate,
  };
  return api.post(`/Permissions`, row);
};

export const fetchPermissionTypes = () => {
  return api.get('/PermissionTypes');
};
 