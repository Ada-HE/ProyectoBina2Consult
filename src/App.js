import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CookieConsent from './Componentes/LoginRegistro/CookieConsent';

import LayoutPublico from './Componentes/compartidos/LayoutPublico';
import Registro from './Componentes/LoginRegistro/Registro';
import Login from './Componentes/LoginRegistro/Login';
import Bienvenida from './Componentes/Publico/Bienvenida';

import LayoutPaciente from './Componentes/compartidos/LayoutPaciente';
import BienvenidaPaciente from './Componentes/Paciente/BienvenidaPaciente';

import BienvenidaAdmin from './Componentes/Administrativo/BienvenidaAdmin';
import LayoutAdmin from './Componentes/compartidos/LayoutAdmin';
import FormularioPoliticasPrivacidad from './Componentes/Administrativo/CRUD/PoliticasDePrivacidad';

import ForgotPassword from './Componentes/LoginRegistro/ForgotPassword';
import ResetPassword from './Componentes/LoginRegistro/ResetPassword';

// Define temas claro y oscuro
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

function App() {
  const navigate = useNavigate();
  const [tipoUsuario, setTipoUsuario] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [themeMode, setThemeMode] = useState('light'); // Estado del tema

  // Detectar el tema preferido del navegador
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setThemeMode(savedTheme); // Restaurar tema del localStorage
    } else {
      const preferedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeMode(preferedTheme);
    }

    const verificarAutenticacion = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/verificar-autenticacion', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setTipoUsuario(data.tipoUsuario);
        } else {
          setTipoUsuario(null);
        }
      } catch (error) {
        console.error('Error en la verificación de autenticación:', error);
        setTipoUsuario(null);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacion();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const toggleTheme = () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    localStorage.setItem('theme', newTheme); // Guardar tema en localStorage
  };

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <CookieConsent />
      
      <Routes>
        <Route path="/" element={<LayoutPublico toggleTheme={toggleTheme} themeMode={themeMode}><Bienvenida /></LayoutPublico>} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {tipoUsuario === null && (
          <>
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
          </>
        )}

        {tipoUsuario === 'paciente' && (
          
          <Route path="/inicio" element={
            <LayoutPaciente toggleTheme={toggleTheme} themeMode={themeMode}>
              <BienvenidaPaciente />
            </LayoutPaciente>
          } />
        )}

        {tipoUsuario === 'administrador' && (
          <>
          <Route path="/inicio-admin" element={
            <LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}>
              <BienvenidaAdmin />
            </LayoutAdmin>
          } />
          <Route path="/politicas-privacidad" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioPoliticasPrivacidad /></LayoutAdmin>}/>

          </>
        )}

        <Route path="*" element={<Navigate to={tipoUsuario ? "/inicio" : "/login"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
