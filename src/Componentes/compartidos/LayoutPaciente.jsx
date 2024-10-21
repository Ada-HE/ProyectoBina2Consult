import React from 'react';
import BarraNavPaciente from '../compartidos/BarraNavPaciente';
import PieDePaginaPaciente from '../compartidos/PieDePaginaPaciente';
import { Container } from '@mui/material';

const LayoutPaciente = ({ children, toggleTheme, themeMode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BarraNavPaciente toggleTheme={toggleTheme} themeMode={themeMode} />
      <Container component="main" style={{ flex: 1, marginTop: '20px' }}>
        {children}
      </Container>
      <PieDePaginaPaciente />
    </div>
  );
};

export default LayoutPaciente;
