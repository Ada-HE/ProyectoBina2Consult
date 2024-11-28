import React, { useState, useEffect } from 'react'; 
import { Box, Button, TextField, Typography, Container, Grid, CssBaseline, MenuItem, Snackbar, Alert, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReCAPTCHA from 'react-google-recaptcha';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import zxcvbn from 'zxcvbn';
import { useNavigate } from 'react-router-dom';

// Importa las funciones desde el archivo separado
import { validarPassword, validarStep1, handleSubmit, handleSubmitVerification } from './registroFunctions';

function Registro() {
    const [step, setStep] = useState(1); 
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [telefono, setTelefono] = useState('');
    const [edad, setEdad] = useState('');
    const [sexo, setSexo] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codigoVerificacion, setCodigoVerificacion] = useState('');  
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);  
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [themeMode, setThemeMode] = useState('light'); // Estado para el modo de tema (claro/oscuro)

    const [nombreError, setNombreError] = useState('');
    const [apellidoPaternoError, setApellidoPaternoError] = useState('');
    const [apellidoMaternoError, setApellidoMaternoError] = useState('');
    const [telefonoError, setTelefonoError] = useState('');
    const [edadError, setEdadError] = useState('');
    const [correoError, setCorreoError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF

    const navigate = useNavigate();  

    // Obtener el token CSRF cuando el componente se monta
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('https://localhost:4000/api/get-csrf-token', {
                    credentials: 'include',
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken); 
            } catch (error) {
                console.error('Error al obtener el token CSRF:', error);
            }
        };
        fetchCsrfToken();
    }, []); 

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

    const handleRecaptchaChange = (value) => setRecaptchaValue(value);

    const mostrarAlerta = (mensaje) => {
        setError(mensaje);
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const mostrarExito = (mensaje) => {
        setSuccessMessage(mensaje);
        setOpenSnackbar(true);
    };

    const handlePasswordChange = (e) => {
        const pwd = e.target.value;
        setPassword(pwd);
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

    const handleNext = () => {
        if (step === 1 && validarStep1(nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, mostrarAlerta)) {
            setError('');
            setStep(step + 1);  
        }
    };

    const handlePrevious = () => setStep(step - 1);

    const handleSubmitRegistro = async (e) => {
        e.preventDefault();
        if (passwordStrength < 2) {
          mostrarAlerta('La contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.');
          return;
        }
    
        try {
          await handleSubmit(
            e,
            password,
            confirmPassword,
            recaptchaValue,
            validarPassword,
            mostrarAlerta,
            setError,
            (mensajeExito) => {
              mostrarExito(mensajeExito);
              setStep(3);
            },
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            telefono,
            edad,
            sexo,
            correo,
            csrfToken
          );
        } catch (error) {
          if (error.response && error.response.status === 429) {
            mostrarAlerta('Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.');
          }
        }
    };

    const handleSubmitVerificationCode = async (e) => {
    e.preventDefault();
    try {
      await handleSubmitVerification(
        e,
        correo,
        codigoVerificacion,
        mostrarAlerta,
        (mensajeExito) => {
          mostrarExito("¡Registro exitoso! Serás redirigido al inicio de sesión.");  
          setTimeout(() => {
            navigate("/login");
          }, 3000);  
        },
        csrfToken
      );
    } catch (error) {
      if (error.response && error.response.status === 429) {
        mostrarAlerta('Demasiadas solicitudes de verificación desde esta IP, por favor intenta de nuevo más tarde.');
      }
    }
  };

    // Validaciones en tiempo real
    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
    
        // Permitir solo letras, acentos y espacios
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
            setNombreError('El nombre solo puede contener letras y espacios');
        } else if (value.trim() === '') {
            setNombreError('El nombre es requerido');
        } else {
            setNombreError('');
        }
    };
    
    const handleApellidoPaternoChange = (e) => {
        const value = e.target.value;
        setApellidoPaterno(value);
    
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
            setApellidoPaternoError('El apellido paterno solo puede contener letras y espacios');
        } else if (value.trim() === '') {
            setApellidoPaternoError('El apellido paterno es requerido');
        } else {
            setApellidoPaternoError('');
        }
    };
    
    const handleApellidoMaternoChange = (e) => {
        const value = e.target.value;
        setApellidoMaterno(value);
    
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
            setApellidoMaternoError('El apellido materno solo puede contener letras y espacios');
        } else if (value.trim() === '') {
            setApellidoMaternoError('El apellido materno es requerido');
        } else {
            setApellidoMaternoError('');
        }
    };
    
    

    const handleTelefonoChange = (e) => {
        const value = e.target.value;
        setTelefono(value);
        setTelefonoError(/^\d{10}$/.test(value) ? '' : 'El teléfono debe contener 10 dígitos');
    };

    const handleEdadChange = (e) => {
        const value = e.target.value;
    
        // Permite que el campo esté vacío mientras el usuario escribe
        setEdad(value);
    
        // Solo aplica validaciones si hay un valor
        if (value === '') {
            setEdadError('');
            return;
        }
    
        // Convierte el valor a un número solo después de comprobar que no está vacío
        const numericValue = parseInt(value, 10);
    
        if (isNaN(numericValue)) {
            setEdadError('La edad debe ser un número válido');
        } else if (numericValue < 18) {
            setEdadError('Debes ser mayor de edad (18 años o más)');
        } else if (numericValue > 100) {
            setEdadError('La edad debe ser menor o igual a 100');
        } else {
            setEdadError('');
        }
    };
    
    

    // Crear el tema basado en el estado themeMode
    const theme = createTheme({
        palette: {
            mode: themeMode,
            primary: { main: '#3498db' },
            secondary: { main: '#2c3e50' },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Grid container spacing={2} style={{ height: '100vh' }}>
                    <Grid item xs={12} md={6} style={{ backgroundColor: theme.palette.background.paper, padding: '40px' }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                            <Typography variant="h3" color="secondary">
                                Bienvenido al Consultorio Dental
                            </Typography>
                            <Typography variant="h6" color="textSecondary" mt={2}>
                                Ofrecemos atención odontológica personalizada y de alta calidad.
                                Regístrate para acceder a nuestros servicios y gestionar tus citas.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6} style={{ backgroundColor: theme.palette.background.paper, padding: '40px' }}>
                        <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
                            {step === 1 && (
                                <>
                                    <Typography variant="h4" color="primary" mb={3}>
                                        Información Personal
                                    </Typography>
                                    <form>
                                        <TextField
                                            label="Nombre"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={nombre}
                                            onChange={handleNombreChange}
                                            error={!!nombreError}
                                            helperText={nombreError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Apellido Paterno"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={apellidoPaterno}
                                            onChange={handleApellidoPaternoChange}
                                            error={!!apellidoPaternoError}
                                            helperText={apellidoPaternoError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Apellido Materno"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={apellidoMaterno}
                                            onChange={handleApellidoMaternoChange}
                                            error={!!apellidoMaternoError}
                                            helperText={apellidoMaternoError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Teléfono"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={telefono}
                                            onChange={handleTelefonoChange}
                                            error={!!telefonoError}
                                            helperText={telefonoError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Edad"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={edad}
                                            onChange={handleEdadChange}
                                            error={!!edadError}
                                            helperText={edadError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />

                                        <TextField
                                            select
                                            label="Sexo"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={sexo}
                                            onChange={(e) => setSexo(e.target.value)}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        >
                                            <MenuItem value="Hombre">Hombre</MenuItem>
                                            <MenuItem value="Mujer">Mujer</MenuItem>
                                        </TextField>

                                        <Button type="button" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleNext}>
                                            Siguiente
                                        </Button>
                                    </form>
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Typography variant="h4" color="primary" mb={3}>
                                        Información de Cuenta
                                    </Typography>
                                    <form onSubmit={handleSubmitRegistro}>
                                        <TextField
                                            label="Correo electrónico"
                                            type="email"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                            error={!!correoError}
                                            helperText={correoError}
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
                                            onChange={handlePasswordChange}
                                            error={!!passwordError}
                                            helperText={passwordError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Confirmar Contraseña"
                                            type="password"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            error={!!confirmPasswordError}
                                            helperText={confirmPasswordError}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
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

                                        <ReCAPTCHA
                                            sitekey="6LdvPV0qAAAAALN8D83yD7YMB-a0skkSauIOAcOC"
                                            onChange={handleRecaptchaChange}
                                        />

                                        <Box display="flex" justifyContent="space-between" mt={3}>
                                            <Button variant="contained" color="secondary" onClick={handlePrevious}>
                                                Anterior
                                            </Button>
                                            <Button type="submit" variant="contained" color="primary">
                                                Registrar
                                            </Button>
                                        </Box>
                                    </form>
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <Typography variant="h4" color="primary" mb={3}>
                                        Verificación de Correo
                                    </Typography>
                                    <form onSubmit={handleSubmitVerificationCode}>
                                        <TextField
                                            label="Código de Verificación"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={codigoVerificacion}
                                            onChange={(e) => setCodigoVerificacion(e.target.value)}
                                            InputProps={{
                                                style: {
                                                    backgroundColor: themeMode === 'dark' ? '#333333' : '#ffffff',
                                                    color: themeMode === 'dark' ? '#ffffff' : '#000000',
                                                },
                                            }}
                                        />
                                        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
                                            Verificar Código
                                        </Button>
                                    </form>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Mostrar Snackbar para éxito o error */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={successMessage ? "success" : "error"} sx={{ width: '100%' }}>
                    {successMessage || error}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

export default Registro;
