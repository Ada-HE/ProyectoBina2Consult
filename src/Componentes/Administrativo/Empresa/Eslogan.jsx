import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, useTheme } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const FormularioEslogan = () => {
  const theme = useTheme();
  const [eslogan, setEslogan] = useState('');
  const [nuevoEslogan, setNuevoEslogan] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [errors, setErrors] = useState('');
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });
  const maxCaracteres = 100;

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      mostrarAlerta('Error al obtener el token CSRF', 'error');
    }
  };

  const obtenerEslogan = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/eslogan', { withCredentials: true });
      setEslogan(response.data.eslogan);
    } catch (error) {
      mostrarAlerta('Error al obtener el eslogan', 'error');
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerEslogan();
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarFormulario()) return;

    try {
      await axios.post('https://backendproyectobina2.onrender.com/api/eslogan/actualizar', { eslogan: nuevoEslogan }, {
        headers: {
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      obtenerEslogan();
      mostrarAlerta('Eslogan actualizado con éxito', 'success');
      setNuevoEslogan('');
      setDialogoAbierto(false);
    } catch (error) {
      mostrarAlerta('Error al actualizar el eslogan', 'error');
    }
  };

  const abrirDialogo = () => {
    setNuevoEslogan(eslogan || '');
    setDialogoAbierto(true);
  };

  const cerrarDialogo = () => {
    setDialogoAbierto(false);
    setNuevoEslogan('');
    setErrors('');
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
        {eslogan ? 'Eslogan de la Empresa' : 'Registrar Eslogan'}
      </Typography>

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
                <IconButton color="primary" onClick={abrirDialogo}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

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
            inputProps={{ maxLength: maxCaracteres }}
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

      <Snackbar open={alerta.open} autoHideDuration={3000} onClose={cerrarAlerta}>
        <Alert onClose={cerrarAlerta} severity={alerta.tipo} sx={{ width: '100%' }}>
          {alerta.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormularioEslogan;
