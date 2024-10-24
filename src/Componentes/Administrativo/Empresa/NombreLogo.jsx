import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, useTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert } from '@mui/material';
import { Edit } from '@mui/icons-material';
import axios from 'axios';

const FormularioLogoNombre = () => {
  const theme = useTheme();
  const [nombre, setNombre] = useState('');
  const [logo, setLogo] = useState(null);
  const [errors, setErrors] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [logoName, setLogoName] = useState('');
  const [datos, setDatos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [idRegistro, setIdRegistro] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  // Obtener el token CSRF cuando el componente se monta
  useEffect(() => {
    obtenerCsrfToken();
    obtenerDatos();
  }, []);

  // Obtener el token CSRF
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener los datos de nombre y logo
  const obtenerDatos = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/logo-nombre/ver');
      setDatos(response.data);
      if (response.data.length > 0) {
        setNombre(response.data[0].nombre);
        setLogoName(response.data[0].logo);
        setIdRegistro(response.data[0].id);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Validar el formulario antes de enviar
  const validarFormulario = () => {
    if (!nombre.trim()) {
      setErrors('El nombre de la empresa es obligatorio.');
      return false;
    }
    if (nombre.length > 20) {
      setErrors('El nombre no debe tener más de 20 caracteres.');
      return false;
    }
    if (!logo && !editMode) {
      setErrors('El logo es obligatorio.');
      return false;
    }
    if (logo && !['image/jpeg', 'image/png'].includes(logo.type)) {
      setErrors('El logo debe ser en formato JPEG o PNG.');
      return false;
    }
    if (logo && logo.size > 2 * 1024 * 1024) {
      setErrors('El logo no puede pesar más de 2MB.');
      return false;
    }
    setErrors('');
    return true;
  };

  // Manejar el cambio de archivo
  const handleFileChange = (event) => {
    setLogo(event.target.files[0]);
  };

  // Manejar el envío del formulario para crear o actualizar
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) {
      setSnackbar({ open: true, message: errors, severity: 'error' }); // Mostrar error en snackbar
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    if (logo) formData.append('logo', logo);

    try {
      if (editMode) {
        await axios.put(`https://backendproyectobina2.onrender.com/api/logo-nombre/actualizar/${idRegistro}`, formData, {
          headers: {
            'CSRF-Token': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Nombre y logo actualizados con éxito', severity: 'success' });
      } else {
        await axios.post('https://backendproyectobina2.onrender.com/api/logo-nombre/registrar', formData, {
          headers: {
            'CSRF-Token': csrfToken,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Nombre y logo registrados con éxito', severity: 'success' });
      }

      setNombre('');
      setLogo(null);
      setErrors('');
      setEditMode(false);
      obtenerDatos();
      setOpen(false);
    } catch (error) {
      console.error('Error al subir el logo y el nombre:', error);
      setSnackbar({ open: true, message: 'Error al subir el logo y el nombre', severity: 'error' });
    }
  };

  const handleEdit = (registro) => {
    setNombre(registro.nombre);
    setLogoName(registro.logo);
    setIdRegistro(registro.id);
    setEditMode(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';

  return (
    <Box sx={{ padding: '2rem', backgroundColor: backgroundColor, color: textColor, borderRadius: '8px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor, marginBottom: '1rem' }}>
        {datos.length === 0 ? 'Registrar Nombre y Logo de la Empresa' : 'Actualizar Nombre y Logo'}
      </Typography>

      {/* Snackbar para las notificaciones */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

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
                sx={{ input: { color: textColor }, label: { color: textColor } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                {logo ? logo.name : 'Subir Logo (JPEG o PNG)'}
                <input type="file" accept="image/jpeg, image/png" hidden onChange={handleFileChange} />
              </Button>
            </Grid>

            {errors && (
              <Grid item xs={12}>
                <Typography variant="caption" color="error" sx={{ marginTop: '0.5rem' }}>
                  {errors}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Registrar
              </Button>
            </Grid>
          </Grid>
        </form>
      )}

      {datos.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Nombre de la Empresa</Typography></TableCell>
                <TableCell><Typography variant="h6">Logo</Typography></TableCell>
                <TableCell><Typography variant="h6">Acciones</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((dato) => (
                <TableRow key={dato.id}>
                  <TableCell>{dato.nombre}</TableCell>
                  <TableCell>
                    <img
                      src={`${process.env.PUBLIC_URL}/${dato.logo}`}
                      alt="Logo de la Empresa"
                      style={{ width: '100%', maxWidth: '150px', height: 'auto', objectFit: 'contain' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(dato)}>
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Nombre y Logo</DialogTitle>
        <DialogContent>
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
                  {logo ? logo.name : 'Subir Nuevo Logo (JPEG o PNG)'}
                  <input type="file" accept="image/jpeg, image/png" hidden onChange={handleFileChange} />
                </Button>
              </Grid>

              {errors && (
                <Grid item xs={12}>
                  <Typography variant="caption" color="error" sx={{ marginTop: '0.5rem' }}>
                    {errors}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Actualizar
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioLogoNombre;
