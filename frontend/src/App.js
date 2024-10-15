import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // jwtDecode no va entre llaves

import LayoutPublico from './Componentes/compartidos/LayoutPublico';
import Registro from './Componentes/LoginRegistro/Registro';
import Login from './Componentes/LoginRegistro/Login';
import Bienvenida from './Componentes/Publico/Bienvenida';

import LayoutPaciente from './Componentes/compartidos/LayoutPaciente';
import BienvenidaPaciente from './Componentes/Paciente/BienvenidaPaciente';

import BienvenidaAdmin from './Componentes/Administrativo/BienvenidaAdmin';
import LayoutAdmin from './Componentes/compartidos/LayoutAdmin';


// Función para verificar el token y obtener el tipo de usuario
const obtenerTipoUsuario = () => {
  const tokenCookie = document.cookie.split('; ').find(row => row.startsWith('sessionToken='));

  if (!tokenCookie) {
    return null; // No hay token
  }

  const token = tokenCookie.split('=')[1];

  if (token.split('.').length !== 3) {
    return null; // Token JWT malformado
  }

  try {
    const decodedToken = jwtDecode(token); // Decodificar el token
    return decodedToken.tipo; // Retornar el tipo de usuario (paciente o administrador)
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

function App() {
  const navigate = useNavigate();
  const tipoUsuario = obtenerTipoUsuario(); // Obtener el tipo de usuario desde el token

  useEffect(() => {
    // Si intentamos acceder a una ruta privada sin token, redirigimos al login
    if (!tipoUsuario && window.location.pathname.startsWith('/inicio')) {
      navigate('/login');
    }
  }, [tipoUsuario, navigate]);

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LayoutPublico><Bienvenida /></LayoutPublico>} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas para pacientes */}
      {tipoUsuario === 'paciente' && (
        <>
          <Route path="/inicio" element={<LayoutPaciente><BienvenidaPaciente /></LayoutPaciente>} />
          {/* Otras rutas para pacientes */}
        </>
      )}

      {/* Rutas para administradores */}
      {tipoUsuario === 'administrador' && (
        <>
          <Route path="/inicio-admin" element={<LayoutAdmin><BienvenidaAdmin /></LayoutAdmin>} />
          {/* Otras rutas para administradores */}
        </>
      )}

      {/* Redirigir cualquier ruta desconocida a login si no está autenticado */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
