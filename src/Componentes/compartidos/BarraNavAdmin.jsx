import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; // Icono de inicio
import LogoutIcon from '@mui/icons-material/Logout'; // Icono de cerrar sesión
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icono para cambiar de tema
import SettingsIcon from '@mui/icons-material/Settings'; // Icono para el menú Crud
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate para redireccionar

const BarraNavAdm = ({ toggleTheme, themeMode }) => {
  const theme = useTheme(); // Hook para obtener el tema actual
  const [anchorEl, setAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF
  const [crudAnchorEl, setCrudAnchorEl] = useState(null); // Estado para el anclaje del menú "Crud"
  const navigate = useNavigate(); // Hook para redireccionar
  
  // Obtener el token CSRF al montar el componente
  const obtenerCsrfToken = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/get-csrf-token', {
        method: 'GET',
        credentials: 'include', // Incluir cookies para obtener el token CSRF
      });

      if (response.ok) {
        const data = await response.json();
        setCsrfToken(data.csrfToken); // Almacenar el token CSRF
      }
    } catch (error) {
      console.error('Error al obtener el token CSRF:', error);
    }
  };

  useEffect(() => {
    obtenerCsrfToken(); // Llamar a la función para obtener el token CSRF
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include', // Para incluir las cookies en la solicitud
        headers: {
          'CSRF-Token': csrfToken, // Incluir el token CSRF en la cabecera
        },
      });
  
      if (response.ok) {
        // Redirigir al inicio de sesión después de cerrar sesión
        navigate('/login');
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

  const handleCrudMenuOpen = (event) => {
    setCrudAnchorEl(event.currentTarget); // Abrir el menú "Crud"
  };

  const handleCrudMenuClose = () => {
    setCrudAnchorEl(null); // Cerrar el menú "Crud"
  };

  // Colores personalizados según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c'; // Fondo oscuro azul en modo oscuro
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff'; // Azul brillante en modo oscuro

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor, boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.5)' }}>
      <Toolbar sx={{ paddingY: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem', color: textColor }}
        >
          Consultorio Dental - Admin
        </Typography>
        
        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/inicio-admin" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }}
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} /> 
          Inicio
        </Button>

        {/* Botón del menú Crud con ícono de configuración */}
        <Button
          color="inherit"
          aria-controls="crud-menu"
          aria-haspopup="true"
          onClick={handleCrudMenuOpen}
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor, marginLeft: '1rem' }}
        >
          <SettingsIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Crud
        </Button>
        <Menu
          id="crud-menu"
          anchorEl={crudAnchorEl}
          open={Boolean(crudAnchorEl)}
          onClose={handleCrudMenuClose}
        >
          <MenuItem onClick={handleCrudMenuClose} component={Link} to="/politicas-privacidad">
            Políticas y Privacidad
          </MenuItem>
          {/* Puedes agregar más submenús aquí */}
        </Menu>

        <Button 
          color="inherit"
          onClick={handleLogout}
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor, marginLeft: '1rem' }}
        >
          <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Cerrar Sesión
        </Button>

        {/* Botón para alternar el tema */}
        <IconButton
          color="inherit"
          aria-label="toggle theme"
          onClick={toggleTheme}
          sx={{ color: textColor, marginLeft: '1rem' }}
        >
          <Brightness4Icon sx={{ fontSize: '1.8rem' }} /> {/* Ícono para alternar entre oscuro y claro */}
        </IconButton>

        {/* Menú de hamburguesa para pantallas pequeñas */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem', color: textColor }}
          onClick={handleMenuOpen}
        >
          <MenuIcon sx={{ fontSize: '2rem', color: textColor }} />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/inicio-admin">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Inicio
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
            <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNavAdm;
