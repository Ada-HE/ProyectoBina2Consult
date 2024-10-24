import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Grid, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioLogoNombre = () => {
  const [nombre, setNombre] = useState('');
  const [logo, setLogo] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [datos, setDatos] = useState([]);
  const [idRegistro, setIdRegistro] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [editMode, setEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el diálogo de edición

  useEffect(() => {
    obtenerCsrfToken();
    obtenerDatos();
  }, []);

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  const obtenerDatos = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/logo-nombre/ver', { withCredentials: true });
      setDatos(response.data);
      if (response.data.length > 0) {
        setNombre(response.data[0].nombre);
        setIdRegistro(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  const handleFileChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nombre', nombre);
    if (logo) formData.append('logo', logo);

    try {
      if (editMode) {
        await axios.put(`https://backendproyectobina2.onrender.com/api/logo-nombre/actualizar/${idRegistro}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Actualización exitosa', severity: 'success' });
      } else {
        await axios.post('https://backendproyectobina2.onrender.com/api/logo-nombre/registrar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Registro exitoso', severity: 'success' });
      }
      obtenerDatos();
      setNombre('');
      setLogo(null);
      setEditMode(false);
      setOpenDialog(false); // Cerrar el diálogo tras la actualización
    } catch (error) {
      console.error('Error al subir el logo y el nombre:', error);
      setSnackbar({ open: true, message: 'Error al subir el logo y el nombre', severity: 'error' });
    }
  };

  const handleEdit = (registro) => {
    setNombre(registro.nombre);
    setIdRegistro(registro.id);
    setEditMode(true);
    setOpenDialog(true); // Abrir el diálogo de edición
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
    setNombre('');
    setLogo(null);
  };

  return (
    <Box>
      <Typography variant="h5">
        {datos.length === 0 ? 'Registrar Nombre y Logo' : 'Actualizar Nombre y Logo'}
      </Typography>

      {/* Mostrar el formulario de registro solo si no hay un registro */}
      {datos.length === 0 && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre de la Empresa"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                {logo ? logo.name : 'Subir Logo (JPEG o PNG)'}
                <input type="file" accept="image/jpeg, image/png" hidden onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {/* Mostrar la tabla con el nombre y el logo si hay datos */}
      {datos.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre de la Empresa</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((dato) => (
                <TableRow key={dato.id}>
                  <TableCell>{dato.nombre}</TableCell>
                  <TableCell>
                    <img
                      src={dato.logo}
                      alt="Logo de la Empresa"
                      style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(dato)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Diálogo para editar nombre y logo */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Editar Nombre y Logo</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre de la Empresa"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button variant="contained" component="label" fullWidth>
            {logo ? logo.name : 'Subir Nuevo Logo (JPEG o PNG)'}
            <input type="file" accept="image/jpeg, image/png" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioLogoNombre;
