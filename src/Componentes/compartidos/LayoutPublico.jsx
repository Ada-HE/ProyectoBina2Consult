import React from 'react';
import BarraNav from '../compartidos/BarraNav';
import PieDePagina from '../compartidos/PieDePagina';
import { Container } from '@mui/material';

const LayoutPublico = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BarraNav />
      <Container component="main" style={{ flex: 1, marginTop: '20px' }}>
        {children}
      </Container>
      <PieDePagina />
    </div>
  );
};

export default LayoutPublico;
