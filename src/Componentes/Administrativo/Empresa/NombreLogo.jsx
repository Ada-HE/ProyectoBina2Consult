import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Tooltip, Snackbar, Alert, useTheme } from '@mui/material';
import { CloudUpload as CloudUploadIcon, CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioLogo = () => {
  const theme = useTheme();
  const [logo, setLogo] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [logoVigente, setLogoVigente] = useState(null);
  const [historialLogos, setHistorialLogos] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    obtenerCsrfToken();
    obtenerLogos();
  }, []);

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      mostrarAlerta('Error al obtener el token CSRF', 'error');
    }
  };

  const obtenerLogos = async () => {
    try {
      const responseVigente = await axios.get('https://localhost:4000/api/logo/vigente');
      const responseHistorial = await axios.get('https://localhost:4000/api/logo/no-vigente');
      setLogoVigente(responseVigente.data);
      setHistorialLogos(responseHistorial.data);
    } catch (error) {
      mostrarAlerta('Error al obtener los logos', 'error');
    }
  };

  const handleFileChange = (event) => {
    setLogo(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!logo) {
      mostrarAlerta('No se ha seleccionado ningún logo', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logo);

    try {
      await axios.post('https://localhost:4000/api/logo/registrar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      mostrarAlerta('Logo registrado con éxito', 'success');
      obtenerLogos();
      setLogo(null);
    } catch (error) {
      mostrarAlerta('Error al subir el logo', 'error');
    }
  };

  const manejarCambioVigente = async (id) => {
    try {
      await axios.put('https://localhost:4000/api/logo/activar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });

      mostrarAlerta('Logo establecido como vigente', 'success');
      obtenerLogos();
    } catch (error) {
      mostrarAlerta('Error al cambiar el logo vigente', 'error');
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
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ddd';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        Subir Nuevo Logo
      </Typography>

      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ color: textColor, borderColor: borderColor, '&:hover': { borderColor: textColor } }}
      >
        {logo ? logo.name : 'Subir Logo (JPEG o PNG)'}
        <input type="file" accept="image/jpeg, image/png" hidden onChange={handleFileChange} />
      </Button>

      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        disabled={!logo}
        sx={{ backgroundColor: textColor === '#ffffff' ? '#1e88e5' : '#1976d2', color: '#fff' }}
      >
        Registrar
      </Button>

      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Logo Vigente</Typography>
      {logoVigente ? (
        <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor }}>Versión</TableCell>
                <TableCell sx={{ color: textColor }}>Logo</TableCell>
                <TableCell sx={{ color: textColor }}>Fecha de Creación</TableCell>
                <TableCell sx={{ color: textColor }}>Vigente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: textColor }}>{logoVigente.version}</TableCell>
                <TableCell>
                  <img src={logoVigente.logo} alt="Logo Vigente" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
                </TableCell>
                <TableCell sx={{ color: textColor }}>{new Date(logoVigente.fecha_creacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Switch checked={logoVigente.vigente} disabled />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ color: textColor }}>No hay logo vigente.</Typography>
      )}

      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Historial de Logos</Typography>
      {historialLogos.length > 0 ? (
        <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor }}>Versión</TableCell>
                <TableCell sx={{ color: textColor }}>Logo</TableCell>
                <TableCell sx={{ color: textColor }}>Fecha de Creación</TableCell>
                <TableCell sx={{ color: textColor }}>Vigente</TableCell>
                <TableCell sx={{ color: textColor }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historialLogos.map((logo, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: textColor }}>{logo.version}</TableCell>
                  <TableCell>
                    <img src={logo.logo} alt="Logo Anterior" style={{ width: '150px', height: 'auto', objectFit: 'contain' }} />
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>{new Date(logo.fecha_creacion).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch checked={logo.vigente} disabled />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Establecer como Vigente">
                      <IconButton color="primary" onClick={() => manejarCambioVigente(logo.id)}>
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
        <Typography sx={{ color: textColor }}>No hay logos anteriores.</Typography>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={cerrarAlerta}>
        <Alert onClose={cerrarAlerta} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioLogo;
