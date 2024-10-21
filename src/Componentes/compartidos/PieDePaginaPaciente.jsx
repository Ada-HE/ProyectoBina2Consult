import React from 'react';
import { Container, Typography, useTheme } from '@mui/material';

const PieDePaginaPaciente = () => {
  const theme = useTheme(); // Hook para obtener el tema actual

  // Colores basados en el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : theme.palette.text.secondary;

  return (
    <footer style={{ backgroundColor: backgroundColor, padding: '20px 0', marginTop: '20px' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ color: textColor }}>
          <strong>Consultorio Dental - Paciente</strong>
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: textColor }}>
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
};

export default PieDePaginaPaciente;
