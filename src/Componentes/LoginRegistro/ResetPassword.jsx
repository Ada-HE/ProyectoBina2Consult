import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Container, LinearProgress, IconButton, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF

  const { token } = useParams(); // Obtener el token de la URL
  const navigate = useNavigate();

  // Función para obtener el token CSRF
  const obtenerCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/get-csrf-token', {
        method: 'GET',
        credentials: 'include', // Incluir cookies para obtener el token CSRF
      });

      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Almacenar el token CSRF
      }
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  // Llamar a obtenerCsrfToken al montar el componente
  useEffect(() => {
    obtenerCsrfToken();
  }, []);

  // Validación de la contraseña
  const validarPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  // Validar y medir la fortaleza de la contraseña
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    const strength = zxcvbn(pwd).score;
    setPasswordStrength(strength);

    if (!validarPassword(pwd)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
    } else {
      setPasswordError('');
    }
  };

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

  const getPasswordStrengthColor = (score) => {
    switch (score) {
      case 0:
      case 1: return "error";
      case 2: return "warning";
      case 3:
      case 4: return "success";
      default: return "error";
    }
  };

  const getPasswordStrengthIcon = (score) => {
    switch (score) {
      case 0:
      case 1:
        return <LockOpenIcon style={{ color: 'red', fontSize: '40px' }} />;
      case 2:
        return <LockIcon style={{ color: 'yellow', fontSize: '40px' }} />;
      case 3:
      case 4:
        return <LockIcon style={{ color: 'green', fontSize: '40px' }} />;
      default:
        return <LockOpenIcon style={{ color: 'red', fontSize: '40px' }} />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setOpenSnackbar(true);
      return;
    }

    // Validar que la contraseña sea fuerte
    if (passwordStrength < 2) {
      setError('La contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cambiar-contrasena', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken, // Incluir el token CSRF en la cabecera
        },
        credentials: 'include',  // Asegurar que las cookies también se envíen

        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setOpenSnackbar(true);
        setTimeout(() => navigate('/login'), 2000); // Redirigir al login tras 2 segundos
      } else {
        setError(data.message);
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('Error al cambiar la contraseña.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Cambiar Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nueva contraseña"
            type={showPassword ? 'text' : 'password'}  // Mostrar contraseña según el estado
            variant="outlined"
            fullWidth
            value={newPassword}
            onChange={handlePasswordChange}
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}  // Mostrar confirmación según el estado
            variant="outlined"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {/* Medidor de fortaleza de contraseña */}
          <Box display="flex" alignItems="center" mt={2}>
            {getPasswordStrengthIcon(passwordStrength)}
            <Typography variant="body2" color={getPasswordStrengthColor(passwordStrength)} style={{ marginLeft: '10px' }}>
              Fortaleza de la contraseña: {getPasswordStrengthMessage(passwordStrength)}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(passwordStrength + 1) * 20}  
            color={getPasswordStrengthColor(passwordStrength)}
            style={{ marginTop: '10px', marginBottom: '10px' }}
          />
          <Button type="submit" variant="contained" fullWidth>
            Cambiar contraseña
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

export default ResetPassword;
