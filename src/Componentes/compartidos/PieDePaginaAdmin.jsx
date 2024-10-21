import React from 'react';
import { Container, Typography, useTheme } from '@mui/material';

const PieDePaginaAdmin = () => {
  const theme = useTheme(); // Obtener el tema actual

  // Colores personalizados según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#f5f5f5'; // Fondo oscuro o claro
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : theme.palette.text.secondary; // Texto azul brillante en modo oscuro

  return (
    <footer style={{ backgroundColor: backgroundColor, padding: '20px 0', marginTop: '20px' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ color: textColor }}>
          <strong>Consultorio Dental - Admin</strong>
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: textColor }}>
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
};

export default PieDePaginaAdmin;
