import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home'; // Icono de inicio
import LogoutIcon from '@mui/icons-material/Logout'; // Icono de cerrar sesión
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate para redireccionar

const BarraNavAdm = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // Estado para el token CSRF
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
      const response = await fetch('http://localhost:4000/api/logout', { // Asegúrate de apuntar al backend correcto
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

  return (
    <AppBar position="static" sx={{ backgroundColor: '#01349c' }}>
      <Toolbar sx={{ paddingY: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: '1.5rem' }}
        >
          Consultorio Dental - Admin
        </Typography>
        
        {/* Botones de navegación para pantallas grandes */}
        <Button 
          color="inherit" 
          component={Link} 
          to="/inicio" 
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem' }}
        >
          <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem' }} />
          Inicio
        </Button>
        <Button 
          color="inherit"
          onClick={handleLogout} // Vinculamos el botón de cerrar sesión con la función
          sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem' }}
        >
          <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem' }} />
          Cerrar Sesión
        </Button>

        {/* Menú de hamburguesa para pantallas pequeñas */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ display: { xs: 'block', sm: 'none' }, fontSize: '2rem' }}
          onClick={handleMenuOpen}
        >
          <MenuIcon sx={{ fontSize: '2rem' }} />
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/inicio">
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem' }} />
            Inicio
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>
            <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.5rem' }} />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default BarraNavAdm;
