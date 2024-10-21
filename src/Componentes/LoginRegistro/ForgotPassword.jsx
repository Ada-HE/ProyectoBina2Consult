import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Container } from '@mui/material';

function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Función para obtener el token CSRF
  const obtenerCsrfToken = async () => {
    try {
      const response = await fetch('https://backendproyectobina2.onrender.com/api/get-csrf-token', {
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

  // Obtener el CSRF token cuando se monta el componente
  useEffect(() => {
    obtenerCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backendproyectobina2.onrender.com/api/solicitar-recuperacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ correo }),
      });

      const data = await response.json();

      // Manejar la respuesta
      if (response.ok) {
        setSuccessMessage(data.message);
        setError('');
        setOpenSnackbar(true);
      } else if (response.status === 429) {
        // Manejar el error de Rate Limit (código 429)
        setError('Demasiadas solicitudes. Intenta de nuevo más tarde.');
        setSuccessMessage('');
        setOpenSnackbar(true);
      } else {
        setError(data.message);
        setSuccessMessage('');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('Error al solicitar la recuperación de contraseña.');
      setSuccessMessage('');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recuperación de Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth>
            Solicitar recuperación
          </Button>
        </form>

        {/* Mostrar el mensaje en Snackbar */}
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity={successMessage ? 'success' : 'error'}>
            {successMessage || error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
