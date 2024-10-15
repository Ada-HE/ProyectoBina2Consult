import React from 'react';
import BarraNavPaciente from '../compartidos/BarraNavAdmin';
import PieDePaginaPaciente from '../compartidos/PieDePaginaAdmin';
import { Container } from '@mui/material';

const LayoutAdmin = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BarraNavPaciente />
      <Container component="main" style={{ flex: 1, marginTop: '20px', backgroundColor: '#ffffff' }}> {/* Manteniendo el fondo blanco */}
        {children}
      </Container>
      <PieDePaginaPaciente />
    </div>
  );
};

export default LayoutAdmin;
