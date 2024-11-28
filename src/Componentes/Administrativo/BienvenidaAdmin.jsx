import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import axios from 'axios';

const BienvenidaAdmin = () => {
  const [logoNombre, setLogoNombre] = useState({});
  const [eslogan, setEslogan] = useState('');
  const theme = useTheme();

  useEffect(() => {
    // Función para obtener el logo y nombre de la empresa
    const fetchLogoNombre = async () => {
      try {
        const response = await axios.get('https://localhost:4000/api/logo/vigente'); // Nuevo endpoint
        if (response.data) {
          setLogoNombre(response.data); // Asignar datos obtenidos
        }
      } catch (error) {
        console.error('Error al obtener el logo vigente:', error);
      }
    };

    // Función para obtener el eslogan
    const fetchEslogan = async () => {
      try {
        const response = await axios.get('https://localhost:4000/api/eslogan');
        setEslogan(response.data.eslogan);
      } catch (error) {
        console.error('Error al obtener el eslogan:', error);
      }
    };

    fetchLogoNombre();
    fetchEslogan();
  }, []);

  return (
    <Container
      maxWidth="lg"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f4f8',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Box>
        {logoNombre.logo && (
          <img
            src={logoNombre.logo}
            alt="Logo Empresa"
            style={{
              width: '200px',
              marginBottom: '20px',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
          />
        )}
        {eslogan && (
          <Typography
            variant="h5"
            color={theme.palette.mode === 'dark' ? 'textPrimary' : 'textSecondary'}
            gutterBottom
            style={{
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            {eslogan}
          </Typography>
        )}
        <Typography
          variant="h6"
          color={theme.palette.mode === 'dark' ? 'textSecondary' : 'textPrimary'}
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: '1.5',
          }}
        >
          Nos comprometemos a ofrecerte el mejor servicio odontológico. Tu salud bucal es nuestra prioridad, y estamos aquí para cuidar de tu sonrisa.
        </Typography>
      </Box>
    </Container>
  );
};

export default BienvenidaAdmin;
