import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CookieConsent from './Componentes/LoginRegistro/CookieConsent';

import LayoutPublico from './Componentes/compartidos/LayoutPublico';
import Registro from './Componentes/LoginRegistro/Registro';
import Login from './Componentes/LoginRegistro/Login';
import Bienvenida from './Componentes/Publico/Bienvenida';
import PoliticasPrivacidad from './Componentes/Publico/PoliticaPrivacidad';
import DeslindeLegal from './Componentes/Publico/DeslindeLegal';
import TerminosCondiciones from './Componentes/Publico/TerminosCondiciones';

import LayoutPaciente from './Componentes/compartidos/LayoutPaciente';
import BienvenidaPaciente from './Componentes/Paciente/BienvenidaPaciente';
import UserProfile from './Componentes/Paciente/UserProfile';

import BienvenidaAdmin from './Componentes/Administrativo/BienvenidaAdmin';
import LayoutAdmin from './Componentes/compartidos/LayoutAdmin';
import FormularioPoliticasPrivacidad from './Componentes/Administrativo/CRUD/PoliticasDePrivacidad';
import DeslindeLegalForm from './Componentes/Administrativo/CRUD/DeslindeLegalForm';
import FormularioTerminosCondiciones from './Componentes/Administrativo/CRUD/TerminosCondiciones';
import FormularioRedesSociales from './Componentes/Administrativo/CRUD/RedesSociales';
import FormularioEslogan from './Componentes/Administrativo/Empresa/Eslogan';
import FormularioLogoNombre from './Componentes/Administrativo/Empresa/NombreLogo';
import FormularioContacto from './Componentes/Administrativo/Empresa/RegistroContacto';
import ReporteIncidencias from './Componentes/Administrativo/Reporte/Incidencias ';
import ActualizarIntentos from './Componentes/Administrativo/CRUD/ActualizarIntentos';
import ConsultarUsuariosBloqueados from './Componentes/Administrativo/CRUD/UsuarioBloqueado';
import FormularioNombreEmpresa from './Componentes/Administrativo/Empresa/EmpresaNombre';

import ForgotPassword from './Componentes/LoginRegistro/ForgotPassword';
import ResetPassword from './Componentes/LoginRegistro/ResetPassword';

import EmpresaInfo from './EmpresaInfo ';

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
      <EmpresaInfo />
      <Routes>
        <Route path="/" element={<LayoutPublico toggleTheme={toggleTheme} themeMode={themeMode}><Bienvenida /></LayoutPublico>} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/politicaPrivacidad" element={<LayoutPublico toggleTheme={toggleTheme} themeMode={themeMode}><PoliticasPrivacidad /></LayoutPublico>} />
        <Route path="/deslindeLegal" element={<LayoutPublico toggleTheme={toggleTheme} themeMode={themeMode}><DeslindeLegal /></LayoutPublico>} />
        <Route path="/terminosCondiciones" element={<LayoutPublico toggleTheme={toggleTheme} themeMode={themeMode}><TerminosCondiciones /></LayoutPublico>} />


        {tipoUsuario === null && (
          <>
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
          </>
        )}

        {tipoUsuario === 'paciente' && (
          <><Route path="/inicio" element={
            <LayoutPaciente toggleTheme={toggleTheme} themeMode={themeMode}>
              <BienvenidaPaciente />
            </LayoutPaciente>
          } />
          <Route path="/perfil" element={
            <LayoutPaciente toggleTheme={toggleTheme} themeMode={themeMode}>
              <UserProfile />
            </LayoutPaciente>
          } />
          </>
          
        )}

        {tipoUsuario === 'administrador' && (
          <>
          <Route path="/inicio-admin" element={
            <LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}>
              <BienvenidaAdmin />
            </LayoutAdmin>
          } />
          <Route path="/politicas-privacidad" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioPoliticasPrivacidad /></LayoutAdmin>}/>
          <Route path="/deslinde-legal" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><DeslindeLegalForm /></LayoutAdmin>}/>
          <Route path="/terminos-condiciones" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioTerminosCondiciones /></LayoutAdmin>}/>
          <Route path="/redes-sociales" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioRedesSociales /></LayoutAdmin>}/>
          <Route path="/registro-slogan" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioEslogan /></LayoutAdmin>}/>
          <Route path="/subida-logo" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioLogoNombre /></LayoutAdmin>}/>
          <Route path="/subida-empresa" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioNombreEmpresa /></LayoutAdmin>}/>
          <Route path="/registro-contacto" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><FormularioContacto /></LayoutAdmin>}/>
          <Route path="/reporte-incidencias" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><ReporteIncidencias /></LayoutAdmin>}/>
          <Route path="/intento-bloqueo" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><ActualizarIntentos /></LayoutAdmin>}/>
          <Route path="/usuarios-bloqueo" element={<LayoutAdmin toggleTheme={toggleTheme} themeMode={themeMode}><ConsultarUsuariosBloqueados /></LayoutAdmin>}/>

          </>
        )}

        <Route path="*" element={<Navigate to={tipoUsuario ? "/inicio" : "/login"} />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
