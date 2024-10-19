import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import LayoutPublico from './Componentes/compartidos/LayoutPublico';
import Registro from './Componentes/LoginRegistro/Registro';
import Login from './Componentes/LoginRegistro/Login';
import Bienvenida from './Componentes/Publico/Bienvenida';

import LayoutPaciente from './Componentes/compartidos/LayoutPaciente';
import BienvenidaPaciente from './Componentes/Paciente/BienvenidaPaciente';

import BienvenidaAdmin from './Componentes/Administrativo/BienvenidaAdmin';
import LayoutAdmin from './Componentes/compartidos/LayoutAdmin';

function App() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para guardar el tipo de usuario
  const [loading, setLoading] = useState(true); // Estado de carga mientras verificamos autenticación

  useEffect(() => {
    const verificarAutenticacion = async () => {
      try {
        console.log('Verificando autenticación...');

        // Hacer una solicitud GET para verificar la autenticación
        const response = await fetch('http://localhost:4000/api/verificar-autenticacion', {
          method: 'GET',
          credentials: 'include', // Incluir las cookies en la solicitud
        });

        // Log para ver la respuesta del servidor
        console.log('Respuesta del servidor:', response);

        // Si la respuesta es exitosa
        if (response.ok) {
          const data = await response.json();
          console.log('Datos recibidos:', data); // Mostrar los datos que recibimos del servidor

          setTipoUsuario(data.tipoUsuario); // Establecemos el tipo de usuario si está autenticado
        } else {
          console.log('No autenticado. Permitir acceso solo a rutas públicas.');
          setTipoUsuario(null); // No autenticado, establecer null
        }
      } catch (error) {
        console.error('Error en la verificación de autenticación:', error);
        setTipoUsuario(null); // Error en la verificación, usuario no autenticado
      } finally {
        setLoading(false); // Terminamos de cargar la verificación
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  if (loading) {
    // Muestra un mensaje de carga o spinner mientras verificas la autenticación
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LayoutPublico><Bienvenida /></LayoutPublico>} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />

      {/* Si no está autenticado, puede acceder solo a rutas públicas */}
      {tipoUsuario === null && (
        <>
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
        </>
      )}

      {/* Rutas privadas para pacientes */}
      {tipoUsuario === 'paciente' && (
        <>
          <Route path="/inicio" element={<LayoutPaciente><BienvenidaPaciente /></LayoutPaciente>} />
        </>
      )}

      {/* Rutas privadas para administradores */}
      {tipoUsuario === 'administrador' && (
        <>
          <Route path="/inicio-admin" element={<LayoutAdmin><BienvenidaAdmin /></LayoutAdmin>} />
        </>
      )}

      {/* Redirigir cualquier ruta desconocida a la página de login si no está autenticado */}
      <Route path="*" element={<Navigate to={tipoUsuario ? "/inicio" : "/login"} />} />
    </Routes>
  );
}

export default App;
