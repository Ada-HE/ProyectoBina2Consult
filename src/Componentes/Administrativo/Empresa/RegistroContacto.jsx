import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, useTheme, Grid, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const FormularioContacto = () => {
  const theme = useTheme();
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [idRegistro, setIdRegistro] = useState(null); // Para saber si estamos en modo actualización
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar el modo de edición

  // Obtener el token CSRF cuando el componente se monta
  useEffect(() => {
    obtenerCsrfToken();
    obtenerDatosContacto();
  }, []);

  // Obtener el token CSRF
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener los datos de contacto
  const obtenerDatosContacto = async () => {
    try {
      const response = await axios.get('https://localhost:4000/api/contacto/ver');
      if (response.data.length > 0) {
        const registro = response.data[0];
        setDireccion(registro.direccion);
        setCorreo(registro.correo);
        setTelefono(registro.telefono);
        setIdRegistro(registro.id); // Si ya existe, habilita el modo actualización
        setIsEditing(false); // Al cargar los datos, los campos estarán bloqueados por defecto
      }
    } catch (error) {
      console.error('Error al obtener los datos de contacto:', error);
    }
  };

  // Validar el formulario antes de enviar
  const validarFormulario = () => {
    if (!direccion.trim() || !correo.trim() || !telefono.trim()) {
      setErrors('Todos los campos son obligatorios.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setErrors('El formato del correo es inválido.');
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(telefono)) {
      setErrors('El formato del teléfono es inválido. Debe contener 10 dígitos.');
      return false;
    }
    setErrors('');
    return true;
  };

  // Manejar el envío del formulario para crear o actualizar
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    if (!validarFormulario()) {
      setSnackbar({ open: true, message: errors, severity: 'error' });
      return;
    }

    const datos = { direccion, correo, telefono };

    try {
      if (idRegistro) {
        // Actualizar
        await axios.put(`https://localhost:4000/api/contacto/actualizar/${idRegistro}`, datos, {
          headers: {
            'CSRF-Token': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Datos de contacto actualizados con éxito', severity: 'success' });
        setIsEditing(false); // Bloquear los campos después de actualizar
      } else {
        // Registrar
        await axios.post('https://localhost:4000/api/contacto/registrar', datos, {
          headers: {
            'CSRF-Token': csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        setSnackbar({ open: true, message: 'Datos de contacto registrados con éxito', severity: 'success' });
      }

      obtenerDatosContacto();
    } catch (error) {
      console.error('Error al registrar/actualizar los datos de contacto:', error);
      setSnackbar({ open: true, message: 'Error al registrar/actualizar los datos de contacto', severity: 'error' });
    }
  };

  // Habilitar modo de edición
  const handleEdit = (event) => {
    event.preventDefault(); // Prevenir el envío del formulario al hacer clic en "Editar"
    setIsEditing(true); // Habilita los campos para que se puedan editar
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';

  return (
    <Box sx={{ padding: '2rem', backgroundColor: backgroundColor, color: textColor, borderRadius: '8px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor, marginBottom: '1rem' }}>
        {idRegistro ? 'Actualizar Datos de Contacto' : 'Registrar Datos de Contacto'}
      </Typography>

      {/* Snackbar para las notificaciones */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Formulario para registrar o actualizar datos de contacto */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={!isEditing} // Bloquear el campo si no estamos en modo edición
              sx={{ input: { color: textColor }, label: { color: textColor } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Correo Electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={!isEditing} // Bloquear el campo si no estamos en modo edición
              sx={{ input: { color: textColor }, label: { color: textColor } }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              variant="outlined"
              fullWidth
              disabled={!isEditing} // Bloquear el campo si no estamos en modo edición
              sx={{ input: { color: textColor }, label: { color: textColor } }}
            />
          </Grid>

          {errors && (
            <Grid item xs={12}>
              <Typography variant="caption" color="error" sx={{ marginTop: '0.5rem' }}>
                {errors}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            {!isEditing ? (
              <Button variant="contained" color="primary" fullWidth onClick={handleEdit}>
                Editar
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" fullWidth>
                {idRegistro ? 'Actualizar' : 'Registrar'}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default FormularioContacto;
