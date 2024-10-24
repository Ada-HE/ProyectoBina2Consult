import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioRedesSociales = () => {
  const theme = useTheme(); // Hook para obtener el tema actual
  const [redesSociales, setRedesSociales] = useState([]); // Estado para almacenar las redes sociales
  const [csrfToken, setCsrfToken] = useState(''); // Estado para almacenar el token CSRF
  const [dialogoAbierto, setDialogoAbierto] = useState(false); // Controla si el diálogo de edición está abierto
  const [redSocialEditada, setRedSocialEditada] = useState({ id: '', nombre: '', url: '' }); // Estado para manejar la red social a editar
  const [nuevaRedSocial, setNuevaRedSocial] = useState({ nombre: '', url: '' }); // Estado para manejar nuevas redes sociales
  const [errors, setErrors] = useState({}); // Estado para almacenar errores de validación

  // Obtener el token CSRF cuando se monta el componente
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener las redes sociales existentes
  const obtenerRedesSociales = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/redSocial', { withCredentials: true });
      setRedesSociales(response.data);
    } catch (error) {
      console.error('Error al obtener las redes sociales:', error);
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerRedesSociales();
  }, []);

  // Validar URL
  const esUrlValida = (url) => {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocolo
      '((([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+:)?([a-zA-Z0-9$_.+!*\'(),;?&=-]|%[0-9a-fA-F]{2})+@)?' + // nombre usuario:contraseña@
      '(([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)*' + // subdominios
      '([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]|[a-zA-Z0-9])\\.?([a-zA-Z]{2,6})(:[0-9]{1,5})?' + // dominio y puerto
      '(\\/[^\\s]*)?$');
    return pattern.test(url);
  };

  // Manejar el cambio en los campos de texto
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevaRedSocial({ ...nuevaRedSocial, [name]: value });
  };

  // Validar los campos del formulario
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

  // Enviar una nueva red social al backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return; // Validar antes de enviar
    try {
      await axios.post('https://backendproyectobina2.onrender.com/api/redSocial/crear', nuevaRedSocial, {
        headers: {
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      obtenerRedesSociales(); // Refrescar las redes sociales
      setNuevaRedSocial({ nombre: '', url: '' }); // Limpiar el formulario
    } catch (error) {
      console.error('Error al agregar la red social:', error);
    }
  };

  // Abrir el diálogo de edición
  const abrirEdicion = (redSocial) => {
    setRedSocialEditada(redSocial); // Cargar los datos de la red social a editar
    setDialogoAbierto(true);
  };

  // Validar los campos de edición
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

  // Guardar los cambios de la red social editada
  const guardarEdicion = async () => {
    if (!validarFormularioEdicion()) return; // Validar antes de guardar
    try {
      await axios.put(`https://backendproyectobina2.onrender.com/api/redSocial/editar/${redSocialEditada.id}`, redSocialEditada, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      setDialogoAbierto(false); // Cerrar el diálogo
      obtenerRedesSociales(); // Refrescar las redes sociales
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  // Manejar el cambio en los campos del formulario de edición
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setRedSocialEditada({ ...redSocialEditada, [name]: value });
  };

  // Colores condicionales según el tema (modo claro/oscuro)
  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'; // Fondo oscuro o claro
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000'; // Color de texto claro u oscuro

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        Gestión de Redes Sociales
      </Typography>

      {/* Formulario para agregar una nueva red social */}
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

      {/* Tabla para mostrar las redes sociales */}
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

      {/* Diálogo de edición */}
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
    </Box>
  );
};

export default FormularioRedesSociales;
