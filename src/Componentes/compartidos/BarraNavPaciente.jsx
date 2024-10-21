import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link, useNavigate } from 'react-router-dom';

const BarraNavPaciente = ({ toggleTheme, themeMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
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

    obtenerCsrfToken();
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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';

  return (
    <AppBar position="static" sx={{ backgroundColor: backgroundColor }}>
      <Toolbar>
        <Typography variant="h5" sx={{ flexGrow: 1, color: textColor }}>
          Consultorio Dental - Paciente
        </Typography>

        <Button 
          color="inherit" 
          component={Link} 
          to="/inicio" 
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
        >
          <HomeIcon sx={{ marginRight: '0.5rem', color: textColor }} />
          Inicio
        </Button>

        <Button 
          color="inherit"
          onClick={handleLogout}
          sx={{ display: { xs: 'none', sm: 'flex' }, color: textColor }}
        >
          <LogoutIcon sx={{ marginRight: '0.5rem', color: textColor }} />
          Cerrar Sesión
        </Button>

        {/* Botón para alternar el tema */}
        <IconButton color="inherit" onClick={toggleTheme}>
          <Brightness4Icon sx={{ color: textColor }} />
        </IconButton>

        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, color: textColor }}
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
            <HomeIcon sx={{ marginRight: '0.5rem', color: textColor }} />
            Inicio
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
            <LogoutIcon sx={{ marginRight: '0.5rem', color: textColor }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNavPaciente;
