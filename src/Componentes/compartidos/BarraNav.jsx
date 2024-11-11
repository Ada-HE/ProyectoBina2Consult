import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BarraNav = ({ toggleTheme, themeMode }) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' });

  // Función para obtener el nombre y logo desde la API
  const fetchLogoNombre = async () => {
    try {
      const [logoResponse, nombreResponse] = await Promise.all([
        fetch('http://localhost:4000/api/logo/vigente'),
        fetch('http://localhost:4000/api/nombre/vigente')
      ]);
      const logoData = await logoResponse.json();
      const nombreData = await nombreResponse.json();
      setLogoNombre({ nombre: nombreData.nombre, logo: logoData.logo });
    } catch (error) {
      console.error('Error al obtener el nombre y logo:', error);
    }
  };

  useEffect(() => {
    fetchLogoNombre();
  }, []);

  useEffect(() => {
    if (logoNombre.logo) {
      const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = `${logoNombre.logo}?v=${new Date().getTime()}`;
      document.head.appendChild(favicon);
    }
  }, [logoNombre.logo]);

  useEffect(() => {
    if (logoNombre.nombre) {
      document.title = logoNombre.nombre;
    }
  }, [logoNombre.nombre]);

  // Abrir y cerrar el Drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Colores personalizados según el tema
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';
  const drawerBackgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#fff';
  const drawerTextColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#000';

  const drawerMenuItems = (
    <Box
      sx={{ width: 250, backgroundColor: drawerBackgroundColor, height: '100%' }}
      role="presentation"
      onClick={(event) => event.stopPropagation()} // Evitar que el cambio de tema cierre el Drawer
      onKeyDown={(event) => event.stopPropagation()}
    >
      <List>
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <HomeIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem component={Link} to="/login">
          <ListItemIcon>
            <LoginIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Login" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem component={Link} to="/registro">
          <ListItemIcon>
            <PersonAddIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Registrarse" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem button onClick={(event) => { event.stopPropagation(); toggleTheme(); }}>
          <ListItemIcon>
            <Brightness4Icon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Cambiar Tema" sx={{ color: drawerTextColor }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor, boxShadow: '0px 4px 10px rgba(0, 191, 255, 0.5)' }}>
      <Toolbar sx={{ paddingY: 2 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {logoNombre.logo && (
            <img
              src={logoNombre.logo}
              alt="Logo Empresa"
              style={{ width: '50px', marginRight: '15px' }}
            />
          )}
          <Typography 
            variant="h5" 
            sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: textColor }}
          >
            {logoNombre.nombre || 'Consultorio Dental'}
          </Typography>
        </Box>

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

        <IconButton
          color="inherit"
          aria-label="toggle theme"
          onClick={(event) => { event.stopPropagation(); toggleTheme(); }}
          sx={{ color: textColor, marginLeft: '1rem' }}
        >
          <Brightness4Icon sx={{ fontSize: '1.8rem' }} />
        </IconButton>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem', color: textColor }}
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ fontSize: '2rem', color: textColor }} />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerMenuItems}
      </Drawer>
    </AppBar>
  );
};

export default BarraNav;
