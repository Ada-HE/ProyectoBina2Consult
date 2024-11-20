import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, useTheme } from '@mui/material';
import axios from 'axios';

const Bienvenida = () => {
  const [logoNombre, setLogoNombre] = useState({});
  const [eslogan, setEslogan] = useState('');
  
  // Obtener el tema actual (claro u oscuro)
  const theme = useTheme();

  useEffect(() => {
    // Solicitud para obtener el logo y nombre usando el nuevo endpoint
    const fetchLogoNombre = async () => {
      try {
        const response = await axios.get('https://backendproyectobina2.onrender.com/api/logo/vigente');
        if (response.data) {
          setLogoNombre(response.data); // Asigna los datos obtenidos
        }
      } catch (error) {
        console.error('Error al obtener el logo y nombre:', error);
      }
    };

    // Solicitud para obtener el eslogan
    const fetchEslogan = async () => {
      try {
        const response = await axios.get('https://backendproyectobina2.onrender.com/api/eslogan');
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
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f0f4f8', // Color de fondo según el tema
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Box>
        {/* Muestra el logo si está disponible */}
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
        {/* Muestra el eslogan si está disponible */}
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
        {/* Mensaje adicional */}
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

export default Bienvenida;
