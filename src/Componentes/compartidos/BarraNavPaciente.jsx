import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useTheme, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BarraNavPaciente = ({ toggleTheme, themeMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const obtenerCsrfToken = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/get-csrf-token', {
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

    const fetchLogoNombre = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/logo/vigente');
        if (response.data) {
          setLogoNombre(response.data);
        }
      } catch (error) {
        console.error('Error al obtener el nombre y logo:', error);
      }
    };

    obtenerCsrfToken();
    fetchLogoNombre();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/logout', {
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

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';
  const drawerBackgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#fff';
  const drawerTextColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#000';

  const drawerMenuItems = (
    <Box
      sx={{ width: 250, backgroundColor: drawerBackgroundColor, height: '100%' }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem component={Link} to="/inicio" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <HomeIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem component={Link} to="/perfil" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <AccountCircleIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Perfil de Usuario" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem onClick={() => { toggleDrawer(false); handleLogout(); }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" sx={{ color: drawerTextColor }} />
        </ListItem>
        <ListItem button onClick={(e) => e.stopPropagation(toggleTheme())}>
          <ListItemIcon>
            <Brightness4Icon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Cambiar Tema" sx={{ color: drawerTextColor }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
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
              {logoNombre.nombre || 'Consultorio Dental'} - Paciente
            </Typography>
          </Box>

          <Button 
            color="inherit" 
            component={Link} 
            to="/inicio" 
            sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
          >
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
            Inicio
          </Button>

          <Button 
            color="inherit" 
            component={Link} 
            to="/perfil"
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

          <IconButton color="inherit" onClick={toggleTheme}>
            <Brightness4Icon sx={{ color: textColor }} />
          </IconButton>

          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem', color: textColor }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerMenuItems}
      </Drawer>
    </>
  );
};

export default BarraNavPaciente;
