import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Container, Grid, CssBaseline, Snackbar, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, Link } from 'react-router-dom';
import validator from 'validator';
import {jwtDecode} from 'jwt-decode'; // Corregí la importación de jwt-decode


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
  const [csrfToken, setCsrfToken] = useState('');
  const [themeMode, setThemeMode] = useState('light');
  const [tiempoRestante, setTiempoRestante] = useState(0); // Tiempo restante en segundos
  const [bloqueada, setBloqueada] = useState(false); // Estado de cuenta bloqueada

  const navigate = useNavigate();

  // Obtener CSRF Token
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

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        await obtenerCsrfToken();

        const response = await fetch('http://localhost:4000/api/verificar-autenticacion', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.tipoUsuario === 'paciente') {
            navigate('/inicio');
          } else if (data.tipoUsuario === 'administrador') {
            navigate('/inicio-admin');
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  // Detectar el tema guardado en el localStorage y aplicarlo
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      const preferedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeMode(preferedTheme);
    }
  }, []);

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
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ correo, password }),
        });

        const data = await response.json();

        if (response.status === 403 && data.tiempoRestante) {
          setBloqueada(true); // Cuenta bloqueada
          setTiempoRestante(data.tiempoRestante); // Guardar tiempo restante en segundos

          const interval = setInterval(() => {
            setTiempoRestante((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                setBloqueada(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000); // Contador de un segundo
          return;
        }

        if (response.status === 429) {
          setError('Has excedido el número de intentos de inicio de sesión. Por favor, intenta de nuevo más tarde.');
          setOpenSnackbar(true);
          return;
        }

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
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`;
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          const decodedToken = jwtDecode(data.token);
          setTimeout(() => {
            if (decodedToken.tipo === 'paciente') {
              navigate('/inicio');
            } else if (decodedToken.tipo === 'administrador') {
              navigate('/inicio-admin');
            }
          }, 2000);
        } else {
          setError(data.message || 'Error en el inicio de sesión');
          setOpenSnackbar(true);
        }
      } else {
        const response = await fetch('http://localhost:4000/api/mfa/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({ correo, token: mfaToken }),
        });

        const data = await response.json();

        if (response.status === 429) {
          setError('Has excedido el número de intentos para verificar el código MFA. Por favor, intenta de nuevo más tarde.');
          setOpenSnackbar(true);
          return;
        }

        if (response.ok) {
          document.cookie = `sessionToken=${data.token}; SameSite=Strict; path=/; max-age=1296000`;
          setSuccessMessage('¡Inicio de sesión exitoso!');
          setOpenSnackbar(true);

          const decodedToken = jwtDecode(data.token);
          setTimeout(() => {
            if (decodedToken.tipo === 'paciente') {
              navigate('/inicio');
            } else if (decodedToken.tipo === 'administrador') {
              navigate('/inicio-admin');
            }
          }, 2000);
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

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: { main: '#3498db' },
      secondary: { main: '#2c3e50' },
      background: {
        default: themeMode === 'dark' ? '#121212' : '#f5f5f5',
        paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
        secondary: themeMode === 'dark' ? '#b0b0b0' : '#2c3e50',
      },
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2} sx={{ height: '100vh', backgroundColor: theme.palette.background.default }}>
          <Grid item xs={12} md={6} sx={{ backgroundColor: theme.palette.background.paper, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box>
              <Typography variant="h4" color="primary" gutterBottom>
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
                      InputProps={{
                        style: {
                          backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                          color: themeMode === 'dark' ? '#ffffff' : '#000000',
                        },
                      }}
                    />
                    <TextField
                      label="Contraseña"
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      InputProps={{
                        style: {
                          backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                          color: themeMode === 'dark' ? '#ffffff' : '#000000',
                        },
                      }}
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
                      error={!!error}
                      helperText={error}
                      InputProps={{
                        style: {
                          backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                          color: themeMode === 'dark' ? '#ffffff' : '#000000',
                        },
                      }}
                    />
                  </>
                )}

                {bloqueada && (
                  <Box mt={2}>
                    <Typography variant="h6" color="error">
                      Cuenta bloqueada. Tiempo restante para desbloquear: {Math.floor(tiempoRestante / 60)}:{('0' + (tiempoRestante % 60)).slice(-2)} minutos
                    </Typography>
                  </Box>
                )}

                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                  {showMfa ? 'Verificar MFA' : 'Iniciar Sesión'}
                </Button>
              </form>
              <Typography variant="body2" color="textSecondary" align="center" mt={3}>
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  Regístrate aquí
                </Link>
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center" mt={2}>
                <Link to="/forgot-password" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ backgroundColor: theme.palette.background.default, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Box>
              <Typography variant="h3" color="secondary" sx={{ fontWeight: 'bold' }}>
                Bienvenido de nuevo
              </Typography>
              <Typography variant="h6" color="textSecondary" mt={2} sx={{ maxWidth: '80%', lineHeight: 1.5 }}>
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
