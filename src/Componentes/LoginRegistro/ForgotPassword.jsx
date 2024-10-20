import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Container } from '@mui/material';

function ForgotPassword() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/solicitar-recuperacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setOpenSnackbar(true);
      } else {
        setError(data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('Error al solicitar la recuperación de contraseña.');
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
