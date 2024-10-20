import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Grid, CssBaseline, Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importación correcta de jwtDecode
import validator from 'validator';

const theme = createTheme({
  palette: {
    primary: { main: '#3498db' },
    secondary: { main: '#2c3e50' },
  },
});

function Login() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState('');
  const [showMfa, setShowMfa] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF

  const navigate = useNavigate();

  // Obtener CSRF Token
  const obtenerCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/get-csrf-token', {
        method: 'GET',
        credentials: 'include', // Incluir cookies para obtener el token CSRF
      });

      if (response.ok) {
        const data = await response.json();
        console.log('CSRF token obtenido:', data.csrfToken);
        setCsrfToken(data.csrfToken); // Almacenar el token CSRF
      }
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        await obtenerCsrfToken(); // Obtener el token CSRF al montar el componente

        const response = await fetch('http://localhost:4000/api/verificar-autenticacion', {
          method: 'GET',
          credentials: 'include', // Enviar cookies con la solicitud
        });

        if (response.ok) {
          const data = await response.json();
          if (data.tipoUsuario === 'paciente') {
            navigate('/inicio');
          } else if (data.tipoUsuario === 'administrador') {
            navigate('/inicio-admin');
          }
        } else {
          console.log('No autenticado, mostrar formulario de login.');
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (!validator.isEmail(correo)) {
      setError('Por favor, ingresa un correo válido');
      setOpenSnackbar(true);
      return;
    }

    if (!correo || !password) {
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
        const response = await fetch('http://localhost:4000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // Incluye el token CSRF en la cabecera
          },
          credentials: 'include', // Incluir cookies
          body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (response.ok && data.requireMfa) {
          const qrResponse = await fetch(`http://localhost:4000/api/mfa/setup/${correo}`, {
            method: 'GET',
          });
          const qrData = await qrResponse.json();
          setQrCodeUrl(qrData.qrCodeUrl);
          setShowMfa(true);
          setSuccessMessage('Por favor, escanea el código QR e ingresa el código MFA.');
          setOpenSnackbar(true);
        } else if (response.ok) {
          // Guardar el token de sesión
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`; // 15 días
          
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          const decodedToken = jwtDecode(data.token);
          if (decodedToken.tipo === 'paciente') {
            navigate('/inicio');
          } else if (decodedToken.tipo === 'administrador') {
            navigate('/inicio-admin');
          }
        } else {
          setError(data.message || 'Error en el inicio de sesión');
          setOpenSnackbar(true);
        }
      } else {
        const response = await fetch('http://localhost:4000/api/mfa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken, // Incluye el token CSRF en la cabecera
          },
          credentials: 'include',
          body: JSON.stringify({ correo, token: mfaToken }),
        });

        const data = await response.json();

        if (response.ok) {
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`; // 15 días
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          const decodedToken = jwtDecode(data.token);
          if (decodedToken.tipo === 'paciente') {
            navigate('/inicio');
          } else if (decodedToken.tipo === 'administrador') {
            navigate('/inicio-admin');
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

  if (loading) {
    return <div>Loading...</div>;
  }

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
                      error={!validator.isEmail(correo) && correo !== ''}
                      helperText={!validator.isEmail(correo) && correo !== '' ? 'Correo no válido' : ''}
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
                      label="Código MFA"
                      type="text"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={mfaToken}
                      onChange={(e) => setMfaToken(e.target.value)}
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
                <Typography variant="body2" color="textSecondary" align="center" mt={3}>
                  <Link to="/forgot-password" style={{ color: '#3498db', textDecoration: 'none' }}>
                    ¿Olvidaste tu contraseña?
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
        <Alert onClose={handleCloseSnackbar} severity={successMessage ? 'success' : 'error'} sx={{ width: '100%' }}>
          {successMessage || error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Login;
