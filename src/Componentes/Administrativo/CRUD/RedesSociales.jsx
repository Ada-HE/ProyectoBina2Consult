import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, Snackbar, Alert, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioRedesSociales = () => {
  const theme = useTheme();
  const [redesSociales, setRedesSociales] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [redSocialEditada, setRedSocialEditada] = useState({ id: '', nombre: '', url: '' });
  const [nuevaRedSocial, setNuevaRedSocial] = useState({ nombre: '', url: '' });
  const [errors, setErrors] = useState({});
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      mostrarAlerta('Error al obtener el token CSRF', 'error');
    }
  };

  const obtenerRedesSociales = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/redSocial', { withCredentials: true });
      setRedesSociales(response.data);
    } catch (error) {
      mostrarAlerta('Error al obtener las redes sociales', 'error');
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerRedesSociales();
  }, []);

  const esUrlValida = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+
      '((([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+:)?([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+@)?' +
      '(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)*' +
      '([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]|[a-zA-Z0-9])\\.?([a-zA-Z]{2,6})(:[0-9]{1,5})?' +
      '(\\/[^\\s]*)?$');
    return pattern.test(url);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevaRedSocial({ ...nuevaRedSocial, [name]: value });
  };

  const validarFormulario = () => {
    const newErrors = {};
    if (!nuevaRedSocial.nombre) {
      newErrors.nombre = 'El nombre no puede estar vacío.';
    }
    if (!nuevaRedSocial.url) {
      newErrors.url = 'La URL no puede estar vacía.';
    } else if (!esUrlValida(nuevaRedSocial.url)) {
      newErrors.url = 'La URL no es válida.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    try {
      await axios.post('https://backendproyectobina2.onrender.com/api/redSocial/crear', nuevaRedSocial, {
        headers: {
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      mostrarAlerta('Red social agregada con éxito', 'success');
      obtenerRedesSociales();
      setNuevaRedSocial({ nombre: '', url: '' });
    } catch (error) {
      mostrarAlerta('Error al agregar la red social', 'error');
    }
  };

  const abrirEdicion = (redSocial) => {
    setRedSocialEditada(redSocial);
    setDialogoAbierto(true);
  };

  const validarFormularioEdicion = () => {
    const newErrors = {};
    if (!redSocialEditada.nombre) {
      newErrors.nombre = 'El nombre no puede estar vacío.';
    }
    if (!redSocialEditada.url) {
      newErrors.url = 'La URL no puede estar vacía.';
    } else if (!esUrlValida(redSocialEditada.url)) {
      newErrors.url = 'La URL no es válida.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const guardarEdicion = async () => {
    if (!validarFormularioEdicion()) return;
    try {
      await axios.put(`https://backendproyectobina2.onrender.com/api/redSocial/editar/${redSocialEditada.id}`, redSocialEditada, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      mostrarAlerta('Red social editada con éxito', 'success');
      setDialogoAbierto(false);
      obtenerRedesSociales();
    } catch (error) {
      mostrarAlerta('Error al guardar los cambios', 'error');
    }
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setRedSocialEditada({ ...redSocialEditada, [name]: value });
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ open: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, open: false });
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        Gestión de Redes Sociales
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Nombre de la Red Social"
          name="nombre"
          value={nuevaRedSocial.nombre}
          onChange={handleInputChange}
          variant="outlined"
          error={!!errors.nombre}
          helperText={errors.nombre}
          sx={{ color: textColor, input: { color: textColor }, label: { color: textColor } }}
        />
        <TextField
          label="URL"
          name="url"
          value={nuevaRedSocial.url}
          onChange={handleInputChange}
          variant="outlined"
          error={!!errors.url}
          helperText={errors.url}
          sx={{ color: textColor, input: { color: textColor }, label: { color: textColor } }}
        />
        <Button type="submit" variant="contained" color="primary">
          Agregar Red Social
        </Button>
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Redes Sociales</Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor }}>Nombre</TableCell>
              <TableCell sx={{ color: textColor }}>URL</TableCell>
              <TableCell sx={{ color: textColor }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {redesSociales.map((redSocial) => (
              <TableRow key={redSocial.id}>
                <TableCell sx={{ color: textColor }}>{redSocial.nombre}</TableCell>
                <TableCell sx={{ color: textColor }}>{redSocial.url}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton color="primary" onClick={() => abrirEdicion(redSocial)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle sx={{ color: textColor }}>Editar Red Social</DialogTitle>
        <DialogContent sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <TextField
            fullWidth
            label="Nombre de la Red Social"
            name="nombre"
            value={redSocialEditada.nombre}
            onChange={handleEditChange}
            error={!!errors.nombre}
            helperText={errors.nombre}
            variant="outlined"
            sx={{ color: textColor, input: { color: textColor }, label: { color: textColor } }}
          />
          <TextField
            fullWidth
            label="URL"
            name="url"
            value={redSocialEditada.url}
            onChange={handleEditChange}
            error={!!errors.url}
            helperText={errors.url}
            variant="outlined"
            sx={{ color: textColor, input: { color: textColor }, label: { color: textColor } }}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)} sx={{ color: textColor }}>Cancelar</Button>
          <Button onClick={guardarEdicion} variant="contained" color="primary">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={alerta.open} autoHideDuration={3000} onClose={cerrarAlerta}>
        <Alert onClose={cerrarAlerta} severity={alerta.tipo} sx={{ width: '100%' }}>
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioRedesSociales;
