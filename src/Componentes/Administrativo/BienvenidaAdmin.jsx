import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const BienvenidaAdmin = () => {
  return (
    <Container maxWidth="lg" style={{ textAlign: 'center', marginTop: '50px' }}>
      <Box>
        <Typography variant="h2" color="primary" gutterBottom>
          ¡Bienvenido a nuestro Consultorio Dental BienvenidaAdmin!
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          En nuestro consultorio ofrecemos atención odontológica de alta calidad para toda la familia.
        </Typography>

        <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
          Nos preocupamos por tu salud bucal y brindamos un ambiente cómodo y profesional.
          Agenda tu cita con nosotros y déjanos cuidar de tu sonrisa.
        </Typography>

        
          
      </Box>
    </Container>
  );
};

export default BienvenidaAdmin;
