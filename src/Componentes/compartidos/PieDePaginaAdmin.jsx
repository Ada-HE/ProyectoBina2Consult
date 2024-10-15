import React from 'react';
import { Container, Typography } from '@mui/material';

const PieDePaginaAdmin = () => {
  return (
    <footer style={{ backgroundColor: '#f5f5f5', padding: '20px 0', marginTop: '20px' }}> {/* Manteniendo el color y estilo */}
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" color="textSecondary">
          <strong>Consultorio Dental - Admin</strong>
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
};

export default PieDePaginaAdmin;
