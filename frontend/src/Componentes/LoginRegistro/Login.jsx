import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Grid, CssBaseline, Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const theme = createTheme({
  palette: {
    primary: { main: '#3498db' },
    secondary: { main: '#2c3e50' },
  },
});

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState(''); // Estado para el código MFA
  const [error, setError] = useState('');
  const [showMfa, setShowMfa] = useState(false); // Mostrar campo MFA
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // Estado para almacenar la URL del código QR
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si ya existe una cookie de sesión y redirigir
    const token = document.cookie.split('; ').find(row => row.startsWith('sessionToken='));
    if (token) {
      const decodedToken = jwtDecode(token.split('=')[1]);

      // Verificar si el MFA ya fue validado o si la sesión sigue activa
      if (decodedToken.mfaVerificado) {
        // Redirigir al dashboard o módulo adecuado
        if (decodedToken.tipo === 'paciente') {
          navigate('/inicio'); // Redirigir al módulo de paciente
        } else if (decodedToken.tipo === 'administrador') {
          navigate('/inicio-admin'); // Redirigir al módulo de administrador
        }
      }
    }
  }, [navigate]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (!showMfa && (correo === '' || password === '')) {
      setError('Por favor, llena todos los campos');
      setOpenSnackbar(true);
      return;
    }

    if (showMfa && mfaToken === '') {
      setError('Por favor, ingresa el código MFA');
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!showMfa) {
        // Intento de login
        const response = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (response.ok && data.requireMfa) {
          // Si se requiere MFA, solicitamos el código QR
          const qrResponse = await fetch(`http://localhost:4000/api/mfa/setup/${correo}`, {
            method: 'GET',
          });
          const qrData = await qrResponse.json();
          setQrCodeUrl(qrData.qrCodeUrl); // Guardamos la URL del código QR

          // Mostramos el campo para MFA
          setShowMfa(true);
          setSuccessMessage('Por favor, escanea el código QR y luego ingresa el código MFA.');
          setOpenSnackbar(true);
        } else if (response.ok) {
          // Si no requiere MFA, login exitoso
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`; // Cookie válida por 15 días
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          // Redirigir según el tipo de usuario
          const decodedToken = jwtDecode(data.token);
          if (decodedToken.tipo === 'paciente') {
            navigate('/inicio'); // Redirigir al módulo de paciente
          } else if (decodedToken.tipo === 'administrador') {
            navigate('/inicio-admin'); // Redirigir al módulo de administrador
          }
        } else {
          setError(data.message || 'Error en el inicio de sesión');
          setOpenSnackbar(true);
        }
      } else {
        // Verificar el código MFA
        const response = await fetch('http://localhost:4000/api/mfa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ correo, token: mfaToken }), // Incluimos el código MFA
        });

        const data = await response.json();

        if (response.ok) {
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`; // Cookie válida por 15 días
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          // Redirigir según el tipo de usuario
          const decodedToken = jwtDecode(data.token);
          if (decodedToken.tipo === 'paciente') {
            navigate('/inicio'); // Redirigir al módulo de paciente
          } else if (decodedToken.tipo === 'administrador') {
            navigate('/inicio-admin'); // Redirigir al módulo de administrador
          }
        } else {
          setError('Código MFA incorrecto. Inténtalo de nuevo.');
          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2} style={{ height: '100vh' }}>
          <Grid item xs={12} md={6} style={{ backgroundColor: '#ffffff', padding: '40px' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
              <Typography variant="h4" color="primary" mb={3}>
                Iniciar Sesión
              </Typography>
              <form onSubmit={handleSubmitLogin}>
                {!showMfa && (
                  <>
                    <TextField
                      label="Correo electrónico"
                      type="email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                    <TextField
                      label="Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </>
                )}

                {showMfa && (
                  <>
                    {qrCodeUrl && (
                      <Box mb={2} textAlign="center">
                        <Typography variant="h6" color="primary">
                          Escanea este código QR con Google Authenticator:
                        </Typography>
                        <img src={qrCodeUrl} alt="Código QR MFA" />
                      </Box>
                    )}
                    <TextField
                      label="Código MFA" // Campo para el código MFA
                      type="text"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value)} // Actualización del código MFA
                    />
                  </>
                )}

                <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
                  {showMfa ? 'Verificar MFA' : 'Iniciar Sesión'}
                </Button>

                <Typography variant="body2" color="textSecondary" align="center" mt={3}>
                  ¿No tienes una cuenta?{' '}
                  <Link to="/registro" style={{ color: '#3498db', textDecoration: 'none' }}>
                    Regístrate aquí
                  </Link>
                </Typography>
              </form>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} style={{ backgroundColor: '#f5f9ff', padding: '40px' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
              <Typography variant="h3" color="secondary">
                Bienvenido de nuevo
              </Typography>
              <Typography variant="h6" color="textSecondary" mt={2}>
                Ingresa tus credenciales para acceder a tu cuenta y gestionar tus citas.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"} sx={{ width: '100%' }}>
          {successMessage || error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Login;
