import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, CircularProgress, Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Importar el hook de tema
import axios from 'axios';

const TerminosCondiciones = () => {
  const theme = useTheme(); // Obtener el tema actual (claro u oscuro)
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevTermsRef = useRef(null);

  // Función para obtener los términos y condiciones vigentes
  const fetchActiveTerms = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/TyC/vigente');
      const newTerms = response.data;

      if (!prevTermsRef.current || JSON.stringify(prevTermsRef.current) !== JSON.stringify(newTerms)) {
        setTerms(newTerms);
        prevTermsRef.current = newTerms;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los términos y condiciones vigentes:', error);
      setError('No se pudieron cargar los términos y condiciones.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTerms();
  }, []);

  // Función para estructurar el contenido de los términos
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
            {terms ? terms.titulo : 'Términos y Condiciones'}
          </Typography>
        </Box>

        <Box sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
          {terms && terms.contenido
            ? renderContent(terms.contenido)
            : 'No hay términos y condiciones vigentes en este momento.'}
        </Box>
      </Paper>
    </Container>
  );
};

export default TerminosCondiciones;
