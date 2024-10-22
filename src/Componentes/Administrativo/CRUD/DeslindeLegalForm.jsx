import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Switch, IconButton, Tooltip, TextField, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import { CloudUpload as CloudUploadIcon, Edit as EditIcon, CheckCircleOutline as CheckIcon, Delete as DeleteIcon } from '@mui/icons-material'; // Importar íconos
import axios from 'axios';
import dayjs from 'dayjs'; // Importar dayjs para manejar fechas

const DeslindeLegalForm = () => {
  const theme = useTheme(); // Hook para obtener el tema actual
  const [file, setFile] = useState(null); // Estado para almacenar el archivo seleccionado
  const [versiones, setVersiones] = useState([]); // Estado para almacenar las versiones de deslinde
  const [versionActual, setVersionActual] = useState(null); // Estado para manejar el deslinde vigente
  const [csrfToken, setCsrfToken] = useState('');
  const [editando, setEditando] = useState(false); // Estado para controlar si estamos en modo edición
  const [dialogoAbierto, setDialogoAbierto] = useState(false); // Controla si el diálogo de edición está abierto
  const [contenidoEditado, setContenidoEditado] = useState(''); // Almacenar el contenido editado

  // Obtener el token CSRF cuando se monta el componente
  const obtenerCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Obtener las versiones del deslinde y el deslinde vigente
  const obtenerDeslindes = async () => {
    try {
      const responseVigente = await axios.get('http://localhost:4000/api/deslinde/vigente');
      const responseHistorial = await axios.get('http://localhost:4000/api/deslinde/todas');

      setVersionActual(responseVigente.data); // Deslinde vigente
      setVersiones(responseHistorial.data.filter(deslinde => !deslinde.vigente)); // Filtrar solo los que no están vigentes
    } catch (error) {
      console.error('Error al obtener los deslindes:', error);
    }
  };

  useEffect(() => {
    obtenerCsrfToken();
    obtenerDeslindes();
  }, []);

  // Manejar el cambio de archivo
  const handleFileChange = (event) => {
    const archivo = event.target.files[0];
    setFile(archivo); // Guardar el archivo seleccionado en el estado
  };

  // Enviar el archivo al backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file && !editando) {
      console.log("No se ha seleccionado ningún archivo");
      return;
    }

    if (editando) {
      // Guardar la edición como nueva versión
      await guardarEdicion();
    } else {
      const formData = new FormData();
      formData.append('file', file); // Asegurarse de que el archivo se incluya en los datos del formulario

      try {
        const response = await axios.post('http://localhost:4000/api/deslinde/crear', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'CSRF-Token': csrfToken,
          },
          withCredentials: true,
        });

        console.log("Respuesta del servidor:", response);
        obtenerDeslindes(); // Refrescar los deslindes después de subir el archivo
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      }
    }

    setEditando(false); // Finalizar el modo edición
  };

  // Función para cambiar un deslinde del historial a "vigente"
  const manejarCambioVigente = async (id) => {
    try {
      await axios.put('http://localhost:4000/api/deslinde/activar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      obtenerDeslindes(); // Refrescar deslindes después del cambio
    } catch (error) {
      console.error('Error al cambiar el deslinde vigente:', error);
    }
  };

  // Abrir el diálogo de edición
const abrirEdicion = () => {
  setContenidoEditado(versionActual.contenido); // Cargar el contenido actual para editar
  setDialogoAbierto(true);
  setEditando(true); // Cambiar a modo edición
};

 // Función para manejar el guardado de la edición
const guardarEdicion = async () => {
  try {
    await axios.post('http://localhost:4000/api/deslinde/editar', {
      id: versionActual.id,
      titulo: versionActual.titulo, // Mantener el título original
      contenido: contenidoEditado,  // El contenido editado será el nuevo
    }, {
      headers: { 'CSRF-Token': csrfToken },
      withCredentials: true,
    });

    setDialogoAbierto(false); // Cerrar el diálogo
    obtenerDeslindes(); // Refrescar los deslindes
  } catch (error) {
    console.error('Error al guardar el deslinde editado:', error);
  }
};

  // Función para eliminar lógicamente un deslinde
  const eliminarDeslinde = async (id) => {
    try {
      await axios.put('http://localhost:4000/api/deslinde/eliminar', { id }, {
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });
      obtenerDeslindes(); // Refrescar los deslindes después de eliminar
    } catch (error) {
      console.error('Error al eliminar el deslinde:', error);
    }
  };

  // Colores condicionales según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#333' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#ffffff' : '#000000';
  const borderColor = theme.palette.mode === 'dark' ? '#555' : '#ddd';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '2rem', borderRadius: '8px', backgroundColor: backgroundColor, color: textColor }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: textColor }}>
        {editando ? 'Editar Deslinde Legal' : 'Subir Nuevo Deslinde Legal'}
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
        disabled={!file && !editando}
        sx={{ backgroundColor: textColor === '#ffffff' ? '#1e88e5' : '#1976d2', color: '#fff' }}
      >
        {editando ? 'Guardar Cambios' : 'Subir'}
      </Button>

      {/* Tabla para el Deslinde Vigente */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Deslinde Legal Vigente</Typography>
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
                <TableCell sx={{ color: textColor }}>{dayjs(versionActual.fecha_creacion).format('DD/MM/YYYY')}</TableCell> {/* Mostrar la fecha formateada */}
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
        <Typography sx={{ color: textColor }}>No hay deslinde vigente.</Typography>
      )}

     {/* Historial de Deslindes */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '2rem', color: textColor }}>Historial de Deslindes Legales</Typography>
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
                  <TableCell sx={{ color: textColor }}>{dayjs(version.fecha_creacion).format('DD/MM/YYYY')}</TableCell>
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
                        onClick={() => eliminarDeslinde(version.id)}
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
        <Typography sx={{ color: textColor }}>No hay deslindes anteriores.</Typography>
      )}

      {/* Diálogo de edición */}
      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle sx={{ color: textColor }}>Editar Deslinde Legal Vigente</DialogTitle>
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

export default DeslindeLegalForm;
