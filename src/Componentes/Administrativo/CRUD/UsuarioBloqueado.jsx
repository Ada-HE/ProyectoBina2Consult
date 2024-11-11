import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, Typography, Container, Box, Alert, CircularProgress, MenuItem, Select, FormControl, InputLabel, TextField, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Collapse, Divider, Snackbar
} from '@mui/material';
import { ExpandMore, ExpandLess, Block, Lock } from '@mui/icons-material';

const ConsultarUsuariosBloqueados = () => {
  const [rango, setRango] = useState('');
  const [minBloqueos, setMinBloqueos] = useState(1);
  const [usuariosBloqueados, setUsuariosBloqueados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandido, setExpandido] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const obtenerCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/get-csrf-token', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };
    obtenerCsrfToken();
  }, []);

  const handleChangeRango = (e) => setRango(e.target.value);
  const handleChangeMinBloqueos = (e) => setMinBloqueos(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setUsuariosBloqueados([]);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:4000/api/usuarios-bloqueados`, {
        params: { rango, minBloqueos },
        headers: { 'CSRF-Token': csrfToken },
        withCredentials: true,
      });

      const agrupado = response.data.reduce((acc, usuario) => {
        if (!acc[usuario.correo]) {
          acc[usuario.correo] = { ...usuario, vecesBloqueado: 0, fechas: [] };
        }
        acc[usuario.correo].vecesBloqueado += 1;
        acc[usuario.correo].fechas.push(usuario.fecha_bloqueo);
        return acc;
      }, {});

      const filtrado = Object.values(agrupado).filter(usuario => usuario.vecesBloqueado >= minBloqueos);
      setUsuariosBloqueados(filtrado);
      setMensaje('Consulta realizada con éxito');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Error al obtener los usuarios bloqueados:', err);
      setError('No se pudo obtener los usuarios bloqueados');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBloquearUsuario = async (id, cuenta_bloqueada) => {
    try {
      const nuevoEstadoBloqueo = cuenta_bloqueada ? 0 : 1; // Alternar entre bloqueado (1) y desbloqueado (0)
      await axios.put(`http://localhost:4000/api/actualizar-bloqueo/${id}`, 
        { bloqueo: nuevoEstadoBloqueo }, 
        {
          headers: { 'CSRF-Token': csrfToken },
          withCredentials: true,
        }
      );

      // Actualizar estado en la lista
      setUsuariosBloqueados(prevUsuarios =>
        prevUsuarios.map(usuario => 
          usuario.id === id ? { ...usuario, cuenta_bloqueada: nuevoEstadoBloqueo } : usuario
        )
      );

      setMensaje(`Usuario ${nuevoEstadoBloqueo ? 'bloqueado' : 'desbloqueado'} exitosamente`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al bloquear/desbloquear usuario:', error);
      setError('No se pudo cambiar el estado de bloqueo del usuario');
      setSnackbarOpen(true);
    }
  };

  const toggleExpand = (correo) => setExpandido((prev) => ({ ...prev, [correo]: !prev[correo] }));
  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'background.paper' }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Consultar Usuarios Bloqueados
        </Typography>

        <FormControl fullWidth required>
          <InputLabel>Rango de Tiempo</InputLabel>
          <Select value={rango} onChange={handleChangeRango} label="Rango de Tiempo">
            <MenuItem value="dia">Último Día</MenuItem>
            <MenuItem value="semana">Última Semana</MenuItem>
            <MenuItem value="mes">Último Mes</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Mínimo de Veces Bloqueado"
          type="number"
          value={minBloqueos}
          onChange={handleChangeMinBloqueos}
          fullWidth
          required
          inputProps={{ min: 1 }}
          sx={{ mt: 2 }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Consultar
        </Button>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {usuariosBloqueados.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3, boxShadow: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Veces Bloqueado</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosBloqueados.map((usuario) => (
                  <React.Fragment key={usuario.correo}>
                    <TableRow hover>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.correo}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{usuario.vecesBloqueado}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <IconButton 
                          onClick={() => handleBloquearUsuario(usuario.id, usuario.cuenta_bloqueada)} 
                          size="small" 
                          color="secondary"
                        >
                          {usuario.cuenta_bloqueada === 1 ? <Lock /> : <Block />}
                        </IconButton>
                        <IconButton onClick={() => toggleExpand(usuario.correo)} size="small">
                          {expandido[usuario.correo] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                        <Collapse in={expandido[usuario.correo]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              Fechas de Bloqueo
                            </Typography>
                            <Divider sx={{ mb: 1 }} />
                            {usuario.fechas.map((fecha, index) => (
                              <Typography variant="body2" key={index} sx={{ ml: 2 }}>
                                {new Date(fecha).toLocaleString()}
                              </Typography>
                            ))}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || mensaje}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ConsultarUsuariosBloqueados;
