import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, useTheme } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Edit as EditIcon, CheckCircleOutline as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

const FormularioTerminosCondiciones = () => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [versiones, setVersiones] = useState([]);
  const [versionActual, setVersionActual] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [editando, setEditando] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [contenidoEditado, setContenidoEditado] = useState('');
  const [alerta, setAlerta] = useState({ open: false, mensaje: '', tipo: 'success' });

  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      mostrarAlerta('Error al obtener el token CSRF', 'error');
    }
  };

  const obtenerPoliticas = async () => {
    try {
      const responseVigente = await axios.get('http://localhost:4000/api/TyC/vigente');
      const responseHistorial = await axios.get('http://localhost:4000/api/TyC/todas');

      setVersionActual(responseVigente.data);
      setVersiones(responseHistorial.data.filter(politica => !politica.vigente));
    } catch (error) {
      mostrarAlerta('Error al obtener las políticas', 'error');
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerPoliticas();
  }, []);

  const handleFileChange = (event) => {
    const archivo = event.target.files[0];
    setFile(archivo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      mostrarAlerta("No se ha seleccionado ningún archivo", 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:4000/api/TyC/crear', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      mostrarAlerta('Archivo subido con éxito', 'success');
      obtenerPoliticas();
    } catch (error) {
      mostrarAlerta('Error al subir el archivo', 'error');
    }
  };

  const manejarCambioVigente = async (id) => {
    try {
      await axios.put('http://localhost:4000/api/TyC/activar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });

      mostrarAlerta('Política establecida como vigente', 'success');
      obtenerPoliticas();
    } catch (error) {
      mostrarAlerta('Error al cambiar la política vigente', 'error');
    }
  };

  const abrirEdicion = () => {
    setContenidoEditado(versionActual.contenido);
    setDialogoAbierto(true);
  };

  const guardarEdicion = async () => {
    try {
      await axios.post('http://localhost:4000/api/TyC/editar', {
        id: versionActual.id,
        titulo: versionActual.titulo,
        contenido: contenidoEditado,
      }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });

      mostrarAlerta('Edición guardada como nueva versión', 'success');
      setDialogoAbierto(false);
      obtenerPoliticas();
    } catch (error) {
      mostrarAlerta('Error al guardar la política editada', 'error');
    }
  };

  const eliminarPolitica = async (id) => {
    try {
      await axios.put('http://localhost:4000/api/TyC/eliminar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });

      mostrarAlerta('Política eliminada con éxito', 'success');
      obtenerPoliticas();
    } catch (error) {
      mostrarAlerta('Error al eliminar la política', 'error');
    }
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setAlerta({ open: true, mensaje, tipo });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, open: false });
  };

  const formatearFecha = (fecha) => {
    return dayjs(fecha).format('DD/MM/YYYY');
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ddd';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        {editando ? 'Editar Términos y Condiciones' : 'Subir Nuevo Términos y Condiciones'}
      </Typography>

      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ color: textColor, borderColor: borderColor, '&:hover': { borderColor: textColor } }}
      >
        {file ? file.name : 'Subir Documento (PDF, Word)'}
        <input type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={handleFileChange} />
      </Button>

      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        disabled={!file}
        sx={{ backgroundColor: textColor === '#ffffff' ? '#1e88e5' : '#1976d2', color: '#fff' }}
      >
        {editando ? 'Guardar Cambios' : 'Subir'}
      </Button>

      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Términos y Condiciones Vigente</Typography>
      {versionActual ? (
        <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor }}>Versión</TableCell>
                <TableCell sx={{ color: textColor }}>Título</TableCell>
                <TableCell sx={{ color: textColor }}>Fecha de Creación</TableCell>
                <TableCell sx={{ color: textColor }}>Vigente</TableCell>
                <TableCell sx={{ color: textColor }}>Contenido</TableCell>
                <TableCell sx={{ color: textColor }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ color: textColor }}>{versionActual.version}</TableCell>
                <TableCell sx={{ color: textColor }}>{versionActual.titulo}</TableCell>
                <TableCell sx={{ color: textColor }}>{formatearFecha(versionActual.fecha_creacion)}</TableCell>
                <TableCell>
                  <Switch checked={versionActual.vigente} disabled />
                </TableCell>
                <TableCell sx={{ color: textColor }}>
                  {versionActual.contenido.length > 100
                    ? `${versionActual.contenido.substring(0, 100)}...`
                    : versionActual.contenido}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={abrirEdicion}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ color: textColor }}>No hay Términos y Condiciones vigente.</Typography>
      )}

      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Historial de Términos y Condiciones</Typography>
      {versiones.length > 0 ? (
        <TableContainer component={Paper} sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: textColor }}>Versión</TableCell>
                <TableCell sx={{ color: textColor }}>Título</TableCell>
                <TableCell sx={{ color: textColor }}>Fecha de Creación</TableCell>
                <TableCell sx={{ color: textColor }}>Vigente</TableCell>
                <TableCell sx={{ color: textColor }}>Contenido</TableCell>
                <TableCell sx={{ color: textColor }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {versiones.map((version, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: textColor }}>{version.version}</TableCell>
                  <TableCell sx={{ color: textColor }}>{version.titulo}</TableCell>
                  <TableCell sx={{ color: textColor }}>{formatearFecha(version.fecha_creacion)}</TableCell>
                  <TableCell>
                    <Switch checked={version.vigente} disabled />
                  </TableCell>
                  <TableCell sx={{ color: textColor }}>
                    {version.contenido.length > 100
                      ? `${version.contenido.substring(0, 100)}...`
                      : version.contenido}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Establecer como Vigente">
                      <IconButton
                        color="primary"
                        onClick={() => manejarCambioVigente(version.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="secondary"
                        onClick={() => eliminarPolitica(version.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ color: textColor }}>No hay Términos y Condiciones anteriores.</Typography>
      )}

      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle sx={{ color: textColor }}>Editar Términos y Condiciones Vigente</DialogTitle>
        <DialogContent sx={{ backgroundColor: backgroundColor, color: textColor }}>
          <TextField
            fullWidth
            label="Contenido"
            multiline
            rows={6}
            value={contenidoEditado}
            onChange={(e) => setContenidoEditado(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ color: textColor }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)} sx={{ color: textColor }}>Cancelar</Button>
          <Button onClick={guardarEdicion} variant="contained" color="primary">Guardar como Nueva Versión</Button>
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

export default FormularioTerminosCondiciones;
