import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material'; // Icono para editar
import axios from 'axios';

const FormularioEslogan = () => {
  const theme = useTheme(); // Hook para obtener el tema actual
  const [eslogan, setEslogan] = useState(''); // Estado para almacenar el eslogan actual
  const [nuevoEslogan, setNuevoEslogan] = useState(''); // Estado para manejar el nuevo eslogan
  const [csrfToken, setCsrfToken] = useState(''); // Estado para almacenar el token CSRF
  const [dialogoAbierto, setDialogoAbierto] = useState(false); // Estado para abrir/cerrar el diálogo de edición
  const [errors, setErrors] = useState(''); // Estado para manejar errores
  const maxCaracteres = 100; // Límite de caracteres para el eslogan

  // Obtener el token CSRF cuando se monta el componente
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener el eslogan actual
  const obtenerEslogan = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/eslogan', { withCredentials: true });
      setEslogan(response.data.eslogan);
    } catch (error) {
      console.error('Error al obtener el eslogan:', error);
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerEslogan();
  }, []);

  // Validar el formulario
  const validarFormulario = () => {
    if (!nuevoEslogan.trim()) {
      setErrors('El eslogan no puede estar vacío.');
      return false;
    }
    if (nuevoEslogan.length > maxCaracteres) {
      setErrors(`El eslogan no puede tener más de ${maxCaracteres} caracteres.`);
      return false;
    }
    setErrors('');
    return true;
  };

  // Manejar la creación o actualización del eslogan
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;
    
    try {
      await axios.post('http://localhost:4000/api/eslogan/actualizar', { eslogan: nuevoEslogan }, {
        headers: {
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      obtenerEslogan(); // Refrescar el eslogan después de actualizar/crear
      setNuevoEslogan(''); // Limpiar el campo de texto
      setDialogoAbierto(false); // Cerrar el diálogo
    } catch (error) {
      console.error('Error al actualizar el eslogan:', error);
    }
  };

  // Abrir el diálogo de edición o creación
  const abrirDialogo = () => {
    setNuevoEslogan(eslogan || ''); // Si hay un eslogan, lo pre-carga, si no, queda vacío
    setDialogoAbierto(true); // Abrir el diálogo
  };

  // Cerrar el diálogo
  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setNuevoEslogan('');
    setErrors('');
  };

  // Colores condicionales según el tema (modo claro/oscuro)
  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'; // Fondo oscuro o claro
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000'; // Color de texto claro u oscuro

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        {eslogan ? 'Eslogan de la Empresa' : 'Registrar Eslogan'}
      </Typography>

      {/* Tabla para mostrar el eslogan actual */}
      <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: textColor }}>Eslogan</TableCell>
              <TableCell sx={{ color: textColor }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ color: textColor }}>
                {eslogan || 'No hay eslogan registrado'}
              </TableCell>
              <TableCell>
                {/* Mostrar botón de "Registrar" si no hay eslogan, o "Editar" si ya existe */}
                <IconButton color="primary" onClick={abrirDialogo}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para registrar o actualizar el eslogan */}
      <Dialog open={dialogoAbierto} onClose={cerrarDialogo}>
        <DialogTitle sx={{ color: textColor }}>
          {eslogan ? 'Actualizar Eslogan' : 'Registrar Eslogan'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <TextField
            fullWidth
            label="Eslogan"
            name="eslogan"
            value={nuevoEslogan}
            onChange={(e) => setNuevoEslogan(e.target.value)}
            variant="outlined"
            error={!!errors}
            helperText={errors}
            inputProps={{ maxLength: maxCaracteres }} // Límite de caracteres
            sx={{ color: textColor, input: { color: textColor }, label: { color: textColor } }}
          />
          <Typography variant="caption" sx={{ color: textColor }}>
            {`${nuevoEslogan.length}/${maxCaracteres} caracteres`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogo} sx={{ color: textColor }}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {eslogan ? 'Guardar Cambios' : 'Registrar Eslogan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FormularioEslogan;
