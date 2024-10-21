import React from 'react';
import BarraNavAdm from '../compartidos/BarraNavAdmin'
import PieDePaginaAdmin from '../compartidos/PieDePaginaAdmin';
import { Container } from '@mui/material';

const LayoutAdmin = ({ children, toggleTheme, themeMode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Pasamos los props toggleTheme y themeMode a BarraNavAdm */}
      <BarraNavAdm toggleTheme={toggleTheme} themeMode={themeMode} />
      <Container component="main" style={{ flex: 1, marginTop: '20px' }}>
        {children}
      </Container>
      <PieDePaginaAdmin />
    </div>
  );
};

export default LayoutAdmin;
