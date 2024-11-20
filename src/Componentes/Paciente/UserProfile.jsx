import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, TextField, Grid, Alert, useTheme, IconButton, LinearProgress, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import zxcvbn from 'zxcvbn';

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
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [passwordStrength, setPasswordStrength] = useState(0); // Estado para la fuerza de la contraseña
  const [openSnackbar, setOpenSnackbar] = useState(false); // Control para mostrar el Snackbar

  // Función para obtener los datos del perfil del usuario
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/perfil', { withCredentials: true });
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
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/get-csrf-token', { withCredentials: true });
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
    setOpenSnackbar(true);

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
        'https://backendproyectobina2.onrender.com/api/modificar-contrasena',
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
      if (error.response && error.response.data && error.response.data.message) {
        setUpdateError(error.response.data.message);
      } else {
        setUpdateError('Error al actualizar la contraseña. Por favor, intenta de nuevo.');
      }
      setUpdateSuccess(null);
    }
  };

  // Función para manejar el cambio de la contraseña y calcular su fortaleza
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    const strength = zxcvbn(pwd).score;
    setPasswordStrength(strength);
  };

  // Alternar visibilidad de la contraseña
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Obtener el mensaje de fortaleza de la contraseña basado en el puntaje
  const getPasswordStrengthMessage = (score) => {
    switch (score) {
      case 0: return "Muy débil";
      case 1: return "Débil";
      case 2: return "Aceptable";
      case 3: return "Fuerte";
      case 4: return "Muy fuerte";
      default: return "";
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
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={handlePasswordChange}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: '1.5rem' }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
              <TextField
                label="Confirmar Nueva Contraseña"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                sx={{ marginBottom: '1.5rem' }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />

              {/* Barra de fortaleza de la contraseña */}
              <Box display="flex" alignItems="center" mt={2}>
                <Typography variant="body2" color="textSecondary" style={{ marginLeft: '10px' }}>
                  Fortaleza de la contraseña: {getPasswordStrengthMessage(passwordStrength)}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(passwordStrength + 1) * 20}  // La barra de progreso según la fortaleza
                sx={{ marginTop: '10px', marginBottom: '10px' }}
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

      {/* Snackbar para mostrar éxito o error en la esquina inferior izquierda */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert severity={updateSuccess ? "success" : "error"} onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
          {updateSuccess || updateError}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
