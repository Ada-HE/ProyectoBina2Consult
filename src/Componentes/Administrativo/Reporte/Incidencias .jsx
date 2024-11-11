import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, TableContainer, Paper } from '@mui/material';

const ReporteIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);

  // Función para obtener las incidencias
  const fetchIncidencias = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/incidencias');
      setIncidencias(response.data);
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
    }
  };

  useEffect(() => {
    fetchIncidencias(); // Llamar a la función para obtener incidencias al cargar el componente
  }, []);

  return (
    <Box sx={{ padding: '2rem', width: '100%', maxWidth: '100vw', boxSizing: 'border-box' }}>
      <Typography variant="h4" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
        Reporte de Incidencias
      </Typography>



      <TableContainer component={Paper} sx={{ maxHeight: '400px', overflow: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="Tabla de incidencias">
          <TableHead>
            <TableRow>
              <TableCell>Correo</TableCell>
              <TableCell>Tipo de Incidencia</TableCell>
              <TableCell>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidencias.map((incidencia) => (
              <TableRow key={incidencia.id}>
                <TableCell>{incidencia.correo}</TableCell>
                <TableCell>{incidencia.tipo_incidente}</TableCell>
                <TableCell>{new Date(incidencia.fecha).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReporteIncidencias;
