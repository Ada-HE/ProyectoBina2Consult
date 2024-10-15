import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; // Icono de inicio
import LoginIcon from '@mui/icons-material/Login'; // Icono de login
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Icono de registro
import { Link } from 'react-router-dom';

const BarraNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#01349c' }}>
      <Toolbar sx={{ paddingY: 2 }}> {/* Aumentando padding vertical para incrementar el tamaño */}
        <Typography 
          variant="h5" // Cambiado a h5 para hacerlo más grande
          sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem' }} // Aumentado el tamaño de fuente
        >
          Consultorio Dental
        </Typography>
        
        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem' }} // Aumentado fontSize de los botones
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem' }} /> {/* Aumentado tamaño del ícono */}
          Inicio
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/login"
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem' }} // Aumentado fontSize de los botones
        >
          <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem' }} /> {/* Aumentado tamaño del ícono */}
          Login
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/registro" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem' }} // Aumentado fontSize de los botones
        >
          <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem' }} /> {/* Aumentado tamaño del ícono */}
          Registrarse
        </Button>

        {/* Menú de hamburguesa para pantallas pequeñas */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem' }} // Aumentado tamaño del menú hamburguesa
          onClick={handleMenuOpen}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} /> {/* Aumentado tamaño del ícono del menú */}
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }} // Menú solo visible en pantallas pequeñas
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem' }} /> {/* Aumentado tamaño del ícono */}
            Inicio
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/login">
            <LoginIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem' }} /> {/* Aumentado tamaño del ícono */}
            Login
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to="/registro">
            <PersonAddIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem' }} /> {/* Aumentado tamaño del ícono */}
            Registrarse
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNav;
