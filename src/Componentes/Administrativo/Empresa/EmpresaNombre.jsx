import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Tooltip, Snackbar, Alert, useTheme } from '@mui/material';
import { CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioNombreEmpresa = () => {
  const theme = useTheme();
  const [nombre, setNombre] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [nombreVigente, setNombreVigente] = useState(null);
  const [historialNombres, setHistorialNombres] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    obtenerCsrfToken();
    obtenerNombres();
  }, []);

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      mostrarAlerta('Error al obtener el token CSRF', 'error');
    }
  };

  const obtenerNombres = async () => {
    try {
      const responseVigente = await axios.get('https://backendproyectobina2.onrender.com/api/nombre/vigente');
      const responseHistorial = await axios.get('https://backendproyectobina2.onrender.com/api/nombre/no-vigente');
      setNombreVigente(responseVigente.data);
      setHistorialNombres(responseHistorial.data);
    } catch (error) {
      mostrarAlerta('Error al obtener los nombres', 'error');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nombre || nombre.length > 20) {
      mostrarAlerta('El nombre de la empresa es requerido y debe tener máximo 20 caracteres', 'error');
      return;
    }

    try {
      await axios.post(
        'https://backendproyectobina2.onrender.com/api/nombre/registrar',
        { nombre },
        {
          headers: { 'CSRF-Token': csrfToken },
          withCredentials: true,
        }
      );

      mostrarAlerta('Nombre registrado con éxito', 'success');
      obtenerNombres();
      setNombre('');
    } catch (error) {
      mostrarAlerta('Error al registrar el nombre', 'error');
    }
  };

  const manejarCambioVigente = async (id) => {
    try {
      await axios.put(
        'https://backendproyectobina2.onrender.com/api/nombre/activar',
        { id },
        {
          headers: { 'CSRF-Token': csrfToken },
          withCredentials: true,
        }
      );

      mostrarAlerta('Nombre establecido como vigente', 'success');
      obtenerNombres();
    } catch (error) {
      mostrarAlerta('Error al cambiar el nombre vigente', 'error');
    }
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setSnackbar({ open: true, message: mensaje, severity: tipo });
  };

  const cerrarAlerta = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';

  return (
    <Box sx={{ padding: '2rem', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5">Registrar Nuevo Nombre de Empresa</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre de la Empresa"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          required
          inputProps={{ maxLength: 20 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'right', marginBottom: '1rem' }}>
          {nombre.length} / 20 caracteres
        </Typography>
        <Button type="submit" variant="contained" color="primary" disabled={!nombre}>
          Registrar
        </Button>
      </form>

      <Typography variant="h6" sx={{ marginTop: '2rem' }}>Nombre Vigente</Typography>
      {nombreVigente ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Versión</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Vigente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{nombreVigente.version}</TableCell>
                <TableCell>{nombreVigente.nombre}</TableCell>
                <TableCell>{new Date(nombreVigente.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell><Switch checked={nombreVigente.vigente} disabled /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No hay nombre vigente.</Typography>
      )}

      <Typography variant="h6" sx={{ marginTop: '2rem' }}>Historial de Nombres</Typography>
      {historialNombres.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Versión</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Vigente</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historialNombres.map((nombre) => (
                <TableRow key={nombre.id}>
                  <TableCell>{nombre.version}</TableCell>
                  <TableCell>{nombre.nombre}</TableCell>
                  <TableCell>{new Date(nombre.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell><Switch checked={nombre.vigente} disabled /></TableCell>
                  <TableCell>
                    <Tooltip title="Establecer como Vigente">
                      <IconButton color="primary" onClick={() => manejarCambioVigente(nombre.id)}>
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No hay nombres anteriores.</Typography>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={cerrarAlerta}>
        <Alert onClose={cerrarAlerta} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioNombreEmpresa;
