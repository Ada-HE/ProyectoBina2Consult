import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Grid, CssBaseline, MenuItem, Snackbar, Alert, LinearProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReCAPTCHA from 'react-google-recaptcha';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import zxcvbn from 'zxcvbn';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import DOMPurify from 'dompurify'; // Importa DOMPurify para sanitizar las salidas


// Importa las funciones desde el archivo separado
import { validarPassword, validarStep1, handleSubmit, handleSubmitVerification } from './registroFunctions';

const theme = createTheme({
  palette: {
    primary: { main: '#3498db' },
    secondary: { main: '#2c3e50' },
  },
});

function Registro() {
  const [step, setStep] = useState(1);  // Controlar el paso del registro
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [codigoVerificacion, setCodigoVerificacion] = useState('');  // Código de verificación
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);  // Fortaleza de contraseña
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');  // Mensaje de éxito o error

  const navigate = useNavigate();  // Declarar el hook useNavigate

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
      setStep(step + 1);  // Avanzar al siguiente paso
    }
  };
  

  const handlePrevious = () => setStep(step - 1);

  const handleSubmitRegistro = (e) => {
    e.preventDefault();
    if (passwordStrength < 2) {
      mostrarAlerta('La contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.');
      return;
    }
  
    handleSubmit(
      e,
      password,
      confirmPassword,
      recaptchaValue,
      validarPassword,
      mostrarAlerta,
      setError,
      (mensajeExito) => {
        mostrarExito(mensajeExito);
        setStep(3);  // Avanza al paso 3 para ingresar el código de verificación
      },
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      edad,
      sexo,
      correo
    );
  };
  

  const handleSubmitVerificationCode = (e) => {
    e.preventDefault();
    handleSubmitVerification(
      e,
      correo,
      codigoVerificacion,
      mostrarAlerta,
      (mensajeExito) => {
        mostrarExito("¡Registro exitoso! Serás redirigido al inicio de sesión.");  // Mostrar mensaje de éxito personalizado
        setStep(3);  // Mantén el paso para que el mensaje sea visible
  
        // Esperar 3 segundos antes de redirigir al componente Login
        setTimeout(() => {
          navigate("/login");
        }, 3000);  // Retraso de 3 segundos para mostrar el mensaje de éxito
      },
      setStep
    );
  };
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2} style={{ height: '100vh' }}>
          <Grid item xs={12} md={6} style={{ backgroundColor: '#f5f9ff', padding: '40px' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
              <Typography variant="h3" color="secondary">
                {DOMPurify.sanitize('Bienvenido al Consultorio Dental')}  {/* Sanitizar */}
              </Typography>
              <Typography variant="h6" color="textSecondary" mt={2}>
                {DOMPurify.sanitize('Ofrecemos atención odontológica personalizada y de alta calidad. Regístrate para acceder a nuestros servicios y gestionar tus citas.')}
              </Typography>
            </Box>
          </Grid>
  
          <Grid item xs={12} md={6} style={{ backgroundColor: '#ffffff', padding: '40px' }}>
            <Box display="flex" flexDirection="column" justifyContent="center" height="100%">
              {step === 1 && (
                <>
                  <Typography variant="h4" color="primary" mb={3}>
                    {DOMPurify.sanitize('Información Personal')}  
                  </Typography>
                  <form>
                    <TextField
                      label={DOMPurify.sanitize("Nombre")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Apellido Paterno")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={apellidoPaterno}
                      onChange={(e) => setApellidoPaterno(e.target.value)}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Apellido Materno")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={apellidoMaterno}
                      onChange={(e) => setApellidoMaterno(e.target.value)}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Teléfono")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Edad")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={edad}
                      onChange={(e) => setEdad(e.target.value)}
                    />
  
                    <TextField
                      select
                      label={DOMPurify.sanitize("Sexo")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
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
                    {DOMPurify.sanitize('Información de Cuenta')}  {/* Sanitizar */}
                  </Typography>
                  <form onSubmit={handleSubmitRegistro}>
                    <TextField
                      label={DOMPurify.sanitize("Correo electrónico")}  
                      type="email"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={correo}
                      onChange={(e) => setCorreo(e.target.value)}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Contraseña")} 
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <TextField
                      label={DOMPurify.sanitize("Confirmar Contraseña")}  
                      type="password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
  
                    {/* Medidor de fortaleza de contraseña */}
                    <Box display="flex" alignItems="center" mt={2}>
                      {getPasswordStrengthIcon(passwordStrength)}  {/* Ícono de candado */}
                      <Typography variant="body2" color={getPasswordStrengthColor(passwordStrength)} style={{ marginLeft: '10px' }}>
                        {DOMPurify.sanitize(`Fortaleza de la contraseña: ${getPasswordStrengthMessage(passwordStrength)}`)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(passwordStrength + 1) * 20}  // Muestra el progreso en 5 niveles
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
                    {DOMPurify.sanitize('Verificación de Correo')}  
                  </Typography>
                  <form onSubmit={handleSubmitVerificationCode}>
                    <TextField
                      label={DOMPurify.sanitize("Código de Verificación")}  
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      value={codigoVerificacion}
                      onChange={(e) => setCodigoVerificacion(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary">
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
          {DOMPurify.sanitize(successMessage || error)}  {/* Sanitizar el mensaje de éxito o error */}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
  
}

export default Registro;
