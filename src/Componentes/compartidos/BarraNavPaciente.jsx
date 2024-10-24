import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icono para "Perfil de Usuario"
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BarraNavPaciente = ({ toggleTheme, themeMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' }); // Estado para nombre y logo
  const navigate = useNavigate();
  const theme = useTheme();

  // Obtener el token CSRF
  useEffect(() => {
    const obtenerCsrfToken = async () => {
      try {
        const response = await fetch('https://backendproyectobina2.onrender.com/api/get-csrf-token', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCsrfToken(data.csrfToken);
        }
      } catch (error) {
        console.error('Error al obtener el token CSRF:', error);
      }
    };

    obtenerCsrfToken();
    fetchLogoNombre(); // Llamar a la función para obtener el logo y nombre
  }, []);

  // Obtener nombre y logo desde la API
  const fetchLogoNombre = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/logo-nombre/ver'); // API para obtener nombre y logo
      if (response.data.length > 0) {
        setLogoNombre(response.data[0]); // Asignar el primer registro
      }
    } catch (error) {
      console.error('Error al obtener el nombre y logo:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://backendproyectobina2.onrender.com/api/logout', {
        method: 'POST',
        headers: {
          'CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de conexión', error);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor, boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.5)' }}>
      <Toolbar sx={{ paddingY: 2 }}>
        {/* Logo y nombre de la empresa */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {logoNombre.logo && (
            <img 
              src={`/${logoNombre.logo}`} // Ruta para mostrar el logo desde la carpeta 'public' de React
              alt="Logo Empresa" 
              style={{ width: '50px', height: 'auto', marginRight: '15px' }} // Estilos para el logo
            />
          )}
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: textColor }}
          >
            {logoNombre.nombre || 'Consultorio Dental'} - Paciente
          </Typography>
        </Box>

        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/inicio" 
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Inicio
        </Button>

        {/* Botón de Perfil de Usuario */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/perfil" // Ruta para el perfil del usuario
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
        >
          <AccountCircleIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Perfil de Usuario
        </Button>

        <Button 
          color="inherit"
          onClick={handleLogout}
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
        >
          <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Cerrar Sesión
        </Button>

        {/* Botón para alternar el tema */}
        <IconButton color="inherit" onClick={toggleTheme}>
          <Brightness4Icon sx={{ color: textColor }} />
        </IconButton>

        {/* Menú de hamburguesa para pantallas pequeñas */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem', color: textColor }}
          onClick={handleMenuOpen}
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/inicio">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Inicio
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/perfil">
            <AccountCircleIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Perfil de Usuario
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
            <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Cerrar Sesión
          </MenuItem>
          <MenuItem onClick={toggleTheme}>
            <Brightness4Icon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Cambiar Tema
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNavPaciente;
