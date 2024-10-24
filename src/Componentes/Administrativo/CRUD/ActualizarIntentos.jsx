import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box, Alert, CircularProgress } from '@mui/material';

const ActualizarIntentos = () => {
  const [maxIntentos, setMaxIntentos] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [maxIntentosActual, setMaxIntentosActual] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener el token CSRF al cargar el componente
  useEffect(() => {
    const obtenerCsrfToken = async () => {
      try {
        const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Error al obtener el token CSRF:', err);
        setError('No se pudo obtener el token CSRF');
      }
    };

    const obtenerMaxIntentosActual = async () => {
      try {
        const response = await axios.get('https://backendproyectobina2.onrender.com/api/obtener-max-intentos');
        setMaxIntentosActual(response.data.maxIntentos);
        setLoading(false);  // Cuando ya tenemos los datos, dejamos de mostrar el spinner
      } catch (err) {
        console.error('Error al obtener el máximo de intentos actual:', err);
        setError('No se pudo obtener el valor actual de los intentos fallidos');
        setLoading(false);
      }
    };

    obtenerCsrfToken();
    obtenerMaxIntentosActual();
  }, []);

  // Función para manejar el cambio del input
  const handleChange = (e) => {
    setMaxIntentos(e.target.value);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      // Hacer la solicitud al backend para actualizar los intentos fallidos
      const response = await axios.post(
        'https://backendproyectobina2.onrender.com/api/cambiar-max-intentos',
        { maxIntentos },
        {
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,  // Incluir el token CSRF en la solicitud
          },
          withCredentials: true, // Esto permite enviar y recibir cookies
        }
      );

      // Mostrar mensaje de éxito y limpiar el campo
      setMensaje(response.data.message);
      setMaxIntentos('');

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setMensaje('');
      }, 3000);

      // Volver a obtener el valor actualizado de los intentos
      const maxIntentosActualizado = await axios.get('https://backendproyectobina2.onrender.com/api/obtener-max-intentos');
      setMaxIntentosActual(maxIntentosActualizado.data.maxIntentos);

    } catch (err) {
      console.error('Error al actualizar los intentos fallidos:', err);
      setError('No se pudo actualizar el valor de los intentos fallidos');
      
      // Ocultar el error después de 3 segundos
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Actualizar Máximo de Intentos Fallidos
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1" align="center" gutterBottom>
            <strong>Máximo de Intentos Actual: {maxIntentosActual}</strong>
          </Typography>
        )}

        <TextField
          label="Nuevo Máximo de Intentos"
          type="number"
          variant="outlined"
          fullWidth
          value={maxIntentos}
          onChange={handleChange}
          required
          inputProps={{ min: 1 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Actualizar
        </Button>

        {mensaje && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {mensaje}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ActualizarIntentos;
