import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BarraNav = ({ toggleTheme, themeMode }) => {
  const theme = useTheme(); // Obtenemos el tema actual
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' });

  // Función para obtener el nombre y logo desde la API
  const fetchLogoNombre = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/logo-nombre/ver'); // API para obtener nombre y logo
      if (response.data.length > 0) {
        setLogoNombre(response.data[0]); // Asignar el primer registro
      }
    } catch (error) {
      console.error('Error al obtener el nombre y logo:', error);
    }
  };

  useEffect(() => {
    fetchLogoNombre();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Colores personalizados según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c'; 
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor, boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.5)' }}>
      <Toolbar sx={{ paddingY: 2 }}>
        {/* Logo y nombre de la empresa */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {logoNombre.logo && (
            <img 
            src={`/${logoNombre.logo}`} // Ruta para mostrar el logo en la carpeta 'public'
            alt="Logo Empresa" 
            style={{ width: '50px', marginRight: '15px' }} // Estilos para el logo
          />
          
          )}
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: textColor }}
          >
            {logoNombre.nombre || 'Consultorio Dental'}
          </Typography>
        </Box>
        
        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }}
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Inicio
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/login"
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }}
        >
          <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Login
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/registro" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }}
        >
          <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
          Registrarse
        </Button>

        {/* Botón para alternar el tema */}
        <IconButton
          color="inherit"
          aria-label="toggle theme"
          onClick={toggleTheme}
          sx={{ color: textColor, marginLeft: '1rem' }}
        >
          <Brightness4Icon sx={{ fontSize: '1.8rem' }} />
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
          <MenuItem onClick={handleMenuClose} component={Link} to="/">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Inicio
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/login">
            <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Login
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/registro">
            <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} />
            Registrarse
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNav;
