import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, CircularProgress, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Importar el hook de tema
import axios from 'axios';

const PoliticasPrivacidad = () => {
  const theme = useTheme(); // Obtener el tema actual (claro u oscuro)
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevPolicyRef = useRef(null);

  // Función para obtener la política vigente
  const fetchActivePolicy = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/vigente');
      const newPolicy = response.data;

      if (!prevPolicyRef.current || JSON.stringify(prevPolicyRef.current) !== JSON.stringify(newPolicy)) {
        setPolicy(newPolicy);
        prevPolicyRef.current = newPolicy;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener la política de privacidad vigente:', error);
      setError('No se pudo cargar la política de privacidad.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePolicy();
  }, []);

  // Función para estructurar el contenido de la política
  const renderContent = (content) => {
    const paragraphs = content.split('\n').filter(paragraph => paragraph.trim() !== '');

    return paragraphs.map((paragraph, index) => (
      <Typography key={index} variant="body1" align="justify" paragraph sx={{ marginBottom: '16px' }}>
        {paragraph}
      </Typography>
    ));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '40px', marginBottom: '40px' }}>
      <Paper
        elevation={3}
        sx={{
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#ddd'}`, // Cambiar el color del borde en modo oscuro
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f9f9f9', // Fondo distinto para modo oscuro
          color: theme.palette.text.primary, // Color del texto basado en el tema
          position: 'relative',
        }}
      >
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
            {policy ? policy.titulo : 'Política de Privacidad'}
          </Typography>
        </Box>

        <Box sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {policy && policy.contenido
            ? renderContent(policy.contenido)
            : 'No hay una política de privacidad vigente en este momento.'}
        </Box>
      </Paper>
    </Container>
  );
};

export default PoliticasPrivacidad;
