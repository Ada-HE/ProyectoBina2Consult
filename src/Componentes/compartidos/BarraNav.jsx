import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; // Icono de inicio
import LoginIcon from '@mui/icons-material/Login'; // Icono de login
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icono de registro
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Icono para cambiar de tema
import { Link } from 'react-router-dom';

const BarraNav = ({ toggleTheme, themeMode }) => {
  const theme = useTheme(); // Obtenemos el tema actual
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Colores personalizados según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c'; // Fondo oscuro azul en modo oscuro
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff'; // Azul brillante en modo oscuro

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor, boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.5)' }}> {/* Añadimos sombra azul */}
      <Toolbar sx={{ paddingY: 2 }}>
        <Typography 
          variant="h5"
          sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem', color: textColor }} // Azul brillante para el texto en modo oscuro
        >
          Consultorio Dental
        </Typography>
        
        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }} // Color azul para el texto
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} /> {/* Azul brillante para los íconos */}
          Inicio
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/login"
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }} // Azul brillante para el texto
        >
          <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} /> {/* Azul brillante para los íconos */}
          Login
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/registro" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }} // Azul brillante para el texto
        >
          <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} /> {/* Azul brillante para los íconos */}
          Registrarse
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
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem', color: textColor }} // Color del menú hamburguesa
          onClick={handleMenuOpen}
        >
          <MenuIcon sx={{ fontSize: '2rem', color: textColor }} /> {/* Azul brillante para el ícono del menú */}
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} /> {/* Azul brillante */}
            Inicio
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/login">
            <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} /> {/* Azul brillante */}
            Login
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/registro">
            <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem', color: textColor }} /> {/* Azul brillante */}
            Registrarse
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNav;
