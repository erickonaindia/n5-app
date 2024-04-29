import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';
import { fetchRows, updateRow, addPermission, fetchPermissionTypes } from '../services/api';

const DataGridComponent = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [newPermissionData, setNewPermissionData] = useState({
    employeeName: '',
    employeeLastName: '',
    permissionType: '',
    permissionDate: '',
  });
  const [forceUpdate, setForceUpdate] = useState(false);
  const [permissionTypes, setPermissionTypes] = useState([]);

  useEffect(() => {
    fetchRows().then((response) => {
      const formattedRows = response.data.map((row) => ({
        ...row,
        permissionDate: new Date(row.permissionDate).toLocaleDateString(),
      }));
      setRows(formattedRows);
    });
  }, [forceUpdate]);

  useEffect(() => {
     fetchPermissionTypes().then((response) => {
       setPermissionTypes(response.data);
     });
   }, []);

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setNewPermissionData({
      employeeName: row.employeeName || '',
      employeeLastName: row.employeeLastName || '',
      permissionType: row.permissionType || '',
      permissionDate: row.permissionDate ? new Date(row.permissionDate).toISOString().substr(0, 10) : '',
    });
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleSave = () => {
    const formattedDate = new Date(selectedRow.permissionDate).toISOString().substr(0, 10);
    const updatedRow = { ...selectedRow, permissionDate: formattedDate };
  
    updateRow(updatedRow).then(() => {
      setForceUpdate(!forceUpdate);
      handleCloseModal();
    }).catch((error) => {
      console.error('Error updating row:', error);
    });
  };
  

  const handleAddPermission = () => {
    setOpen(true);
    setNewPermissionData({
      employeeName: '',
      employeeLastName: '',
      permissionType: '',
      permissionDate: '',
    });
  };
  
  const handleAddPermissionSave = () => {
    addPermission(newPermissionData).then(() => {
      setForceUpdate(!forceUpdate);
      handleCloseModal();
      setNewPermissionData({
        employeeName: '',
        employeeLastName: '',
        permissionType: '',
        permissionDate: '',
      });
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'employeeName', headerName: 'Nombre', width: 150 },
    { field: 'employeeLastName', headerName: 'Apellido', width: 150 },
    { field: 'permissionType', headerName: 'Tipo Permiso', width: 150 },
    { field: 'permissionDate', headerName: 'Fecha', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      renderCell: (params) => (
        <div>
          <Button variant="contained" size="small" onClick={() => handleOpenModal(params.row)}>
            Modificar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <h1>Permisos</h1>
      <div className='buttonLeft'>
        <Button onClick={handleAddPermission}>Agregar Permiso</Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        key={forceUpdate}
      />
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>{selectedRow ? 'Modificar Detalles' : 'Agregar Permiso'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre"
            type="text"
            fullWidth
            value={newPermissionData.employeeName}
            onChange={(e) => setNewPermissionData({ ...newPermissionData, employeeName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Apellido"
            type="text"
            fullWidth
            value={newPermissionData.employeeLastName}
            onChange={(e) => setNewPermissionData({ ...newPermissionData, employeeLastName: e.target.value })}
          />
           <Select
            fullWidth
            value={selectedRow?.permissionType || newPermissionData.permissionType}
            onChange={(e) => setNewPermissionData({ ...newPermissionData, permissionType: e.target.value })}
            label="Tipo Permiso"
          >
            {permissionTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.description}
              </MenuItem>
            ))}
          </Select>
          <TextField
            margin="dense"
            label="Fecha"
            type="date"
            fullWidth
            value={newPermissionData.permissionDate}
            onChange={(e) => setNewPermissionData({ ...newPermissionData, permissionDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          {selectedRow ? (
            <Button onClick={handleSave}>Guardar</Button>
          ) : (
            <Button onClick={handleAddPermissionSave}>Guardar</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataGridComponent;