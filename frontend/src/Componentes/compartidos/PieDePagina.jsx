import React from 'react';
import { Container, Typography, Link } from '@mui/material';

const PieDePagina = () => {
  return (
    <footer style={{ backgroundColor: '#f5f5f5', padding: '20px 0', marginTop: '20px' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" color="textSecondary">
          <strong>Consultorio Dental</strong> - Cuidado de tu sonrisa.
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          <Link href="/" underline="none" color="primary">
            Inicio
          </Link>{' '}
          |{' '}
          <Link href="/login" underline="none" color="primary">
            Login
          </Link>{' '}
          |{' '}
          <Link href="/" underline="none" color="primary">
            Registrarse
          </Link>
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
};

export default PieDePagina;
