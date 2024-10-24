import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Edit as EditIcon, CheckCircleOutline as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Importar CheckIcon para marcar como vigente
import axios from 'axios';
import dayjs from 'dayjs'; // Importar dayjs para manejar fechas

const FormularioTerminosCondiciones = () => {
  const theme = useTheme(); // Hook para obtener el tema actual
  const [file, setFile] = useState(null);
  const [versiones, setVersiones] = useState([]); // Estado para almacenar las versiones de políticas
  const [versionActual, setVersionActual] = useState(null); // Estado para manejar la política vigente
  const [csrfToken, setCsrfToken] = useState('');
  const [editando, setEditando] = useState(false); // Controla si estamos editando
  const [dialogoAbierto, setDialogoAbierto] = useState(false); // Controla si el diálogo de edición está abierto
  const [contenidoEditado, setContenidoEditado] = useState(''); // Almacenar el contenido editado

  // Obtener el token CSRF cuando se monta el componente
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener las versiones de la política y la política vigente
  const obtenerPoliticas = async () => {
    try {
      const responseVigente = await axios.get('https://backendproyectobina2.onrender.com/api/TyC/vigente');
      const responseHistorial = await axios.get('https://backendproyectobina2.onrender.com/api/TyC/todas');

      setVersionActual(responseVigente.data); // Política vigente
      setVersiones(responseHistorial.data.filter(politica => !politica.vigente)); // Filtrar solo las que no están vigentes
    } catch (error) {
      console.error('Error al obtener las políticas:', error);
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerPoliticas();
  }, []);

  // Manejar el cambio de archivo
  const handleFileChange = (event) => {
    const archivo = event.target.files[0];
    setFile(archivo);
  };

  // Enviar el archivo al backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      console.log("No se ha seleccionado ningún archivo");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://backendproyectobina2.onrender.com/api/TyC/crear', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      console.log("Respuesta del servidor:", response);
      obtenerPoliticas();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
    }
  };

  // Función para cambiar una política del historial a "vigente"
  const manejarCambioVigente = async (id) => {
    try {
      await axios.put('https://backendproyectobina2.onrender.com/api/TyC/activar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      obtenerPoliticas(); // Refrescar políticas después del cambio
    } catch (error) {
      console.error('Error al cambiar la política vigente:', error);
    }
  };

  // Abrir el diálogo de edición
  const abrirEdicion = () => {
    setContenidoEditado(versionActual.contenido); // Cargar el contenido actual para editar
    setDialogoAbierto(true);
  };

 // Función para manejar el guardado de la edición
const guardarEdicion = async () => {
    try {
      // Llamar al nuevo endpoint para editar la política
      await axios.post('https://backendproyectobina2.onrender.com/api/TyC/editar', {
        id: versionActual.id, // Enviar el ID de la política actual
        titulo: versionActual.titulo,
        contenido: contenidoEditado, // Nuevo contenido
      }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
  
      setDialogoAbierto(false); // Cerrar el diálogo
      obtenerPoliticas(); // Refrescar las políticas
    } catch (error) {
      console.error('Error al guardar la política editada:', error);
    }
  };
  
  // Función para formatear la fecha en DD/MM/YYYY
  const formatearFecha = (fecha) => {
    return dayjs(fecha).format('DD/MM/YYYY');
  };
  // Función para eliminar lógicamente una política
const eliminarPolitica = async (id) => {
    try {
      await axios.put('https://backendproyectobina2.onrender.com/api/TyC/eliminar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      obtenerPoliticas(); // Refrescar las políticas después de eliminar
    } catch (error) {
      console.error('Error al eliminar la política:', error);
    }
  };

  // Colores condicionales según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5'; // Fondo oscuro o claro
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000'; // Color de texto claro u oscuro
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ddd'; // Borde para las tablas

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        {editando ? 'Editar Términos y Condiciones' : 'Subir Nuevo Términos y Condiciones'}
      </Typography>

      {/* Campo para seleccionar el archivo */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<CloudUploadIcon />}
        sx={{ color: textColor, borderColor: borderColor, '&:hover': { borderColor: textColor } }}
      >
        {file ? file.name : 'Subir Documento (PDF, Word)'}
        <input type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={handleFileChange} />
      </Button>

      {/* Botón para enviar */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        disabled={!file}
        sx={{ backgroundColor: textColor === '#ffffff' ? '#1e88e5' : '#1976d2', color: '#fff' }} // Diferente color en oscuro
      >
        {editando ? 'Guardar Cambios' : 'Subir'}
      </Button>

      {/* Tabla para la Política Vigente */}
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
                <TableCell sx={{ color: textColor }}>{formatearFecha(versionActual.fecha_creacion)}</TableCell> {/* Mostrar la fecha formateada */}
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

     {/* Historial de Políticas */}
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

      {/* Diálogo de edición */}
      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle sx={{ color: textColor }}>Editar Política de Privacidad Vigente</DialogTitle>
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
    </Box>
  );
};

export default FormularioTerminosCondiciones;
