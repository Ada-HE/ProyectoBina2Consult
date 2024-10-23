import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, TextField, Grid, Alert, useTheme } from '@mui/material';
import axios from 'axios';

const UserProfile = () => {
  const theme = useTheme(); // Usamos el tema actual para los estilos
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdatePasswordForm, setShowUpdatePasswordForm] = useState(false); // Mostrar/Ocultar el formulario de contraseña

  // Estado para el formulario de actualización de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState(''); // Token CSRF
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Función para obtener los datos del perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/perfil', { withCredentials: true });
      setUserProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      setError('Error al obtener el perfil del usuario');
      setLoading(false);
    }
  };

  // Obtener el token CSRF al cargar el componente
  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-csrf-token', { withCredentials: true });
      setCsrfToken(response.data.csrfToken); // Guardamos el token CSRF
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Función para manejar la actualización de la contraseña
  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);
  
    if (newPassword !== confirmPassword) {
      setUpdateError('Las nuevas contraseñas no coinciden.');
      return;
    }
  
    // Validar la nueva contraseña (al menos una mayúscula, un número, un signo y mínimo 8 caracteres)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setUpdateError('La nueva contraseña debe contener al menos una letra mayúscula, un número, un signo especial y ser de mínimo 8 caracteres.');
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:4000/api/modificar-contrasena',
        {
          id: userProfile.id,  // Usar el id del usuario del perfil
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
          headers: {
            'CSRF-Token': csrfToken, // Enviamos el token CSRF
          },
        }
      );
  
      if (response.status === 200) {
        setUpdateSuccess(response.data.message);
        setUpdateError(null);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      // Manejar el error de forma segura verificando que response esté definido
      if (error.response && error.response.data && error.response.data.message) {
        setUpdateError(error.response.data.message);
      } else {
        setUpdateError('Error al actualizar la contraseña. Por favor, intenta de nuevo.');
      }
      setUpdateSuccess(null);
    }
  };
  

  useEffect(() => {
    fetchUserProfile();
    fetchCsrfToken(); // Llamamos a la función para obtener el token CSRF
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', paddingBottom: '2rem' }}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)', // Sombra más pronunciada
          padding: '2.5rem',
          borderRadius: '15px', // Bordes más redondeados
          maxWidth: '100%',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Perfil de Usuario
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              <strong>Nombre:</strong> {userProfile.nombre} {userProfile.apellidoPaterno} {userProfile.apellidoMaterno}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              <strong>Correo Electrónico:</strong> {userProfile.correo}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              <strong>Teléfono:</strong> {userProfile.telefono}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              <strong>Edad:</strong> {userProfile.edad}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              <strong>Sexo:</strong> {userProfile.sexo}
            </Typography>
          </Grid>
        </Grid>

        {/* Botón para mostrar/ocultar el formulario de actualización de contraseña */}
        <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowUpdatePasswordForm(!showUpdatePasswordForm)}
            sx={{
              fontWeight: 'bold',
              paddingX: '2rem',
              paddingY: '0.8rem',
              boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.3)', // Sombra al botón
            }}
          >
            {showUpdatePasswordForm ? 'Ocultar' : 'Actualizar Contraseña'}
          </Button>
        </Box>

        {/* Mostrar el formulario solo si showUpdatePasswordForm es true */}
        {showUpdatePasswordForm && (
          <Box sx={{ marginTop: '2rem' }}>
            {updateError && <Alert severity="error">{updateError}</Alert>}
            {updateSuccess && <Alert severity="success">{updateSuccess}</Alert>}

            <form onSubmit={handleUpdatePassword}>
              <TextField
                label="Contraseña Actual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: '1.5rem' }}
              />
              <TextField
                label="Nueva Contraseña"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: '1.5rem' }}
              />
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: '1.5rem' }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ paddingX: '2rem', paddingY: '0.8rem', fontWeight: 'bold' }}
                >
                  Guardar Contraseña
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default UserProfile;
