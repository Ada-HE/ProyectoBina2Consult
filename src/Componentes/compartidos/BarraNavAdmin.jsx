import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Collapse, useTheme, Box, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BarraNavAdm = ({ toggleTheme, themeMode }) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar el Drawer
  const [openCrudSubmenu, setOpenCrudSubmenu] = useState(false); // Estado para abrir/cerrar submenú Crud
  const [openEmpresaSubmenu, setOpenEmpresaSubmenu] = useState(false); // Estado para abrir/cerrar submenú Empresa
  const [crudAnchorEl, setCrudAnchorEl] = useState(null);
  const [empresaAnchorEl, setEmpresaAnchorEl] = useState(null);
  const [reportesAnchorEl, setReportesAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' });
  const navigate = useNavigate();

  // Obtener el nombre y logo desde la API
  const fetchLogoNombre = async () => {
    try {
      const response = await axios.get('https://backendproyectobina2.onrender.com/api/logo-nombre/ver');
      if (response.data.length > 0) {
        setLogoNombre(response.data[0]);
      }
    } catch (error) {
      console.error('Error al obtener el nombre y logo:', error);
    }
  };

  useEffect(() => {
    fetchLogoNombre();
    obtenerCsrfToken();
  }, []);

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

  const handleLogout = async () => {
    try {
      const response = await fetch('https://backendproyectobina2.onrender.com/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'CSRF-Token': csrfToken,
        },
      });

      if (response.ok) {
        navigate('/login');
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

  // Funciones para los menús y submenús en pantallas grandes
  const handleCrudMenuOpen = (event) => {
    setCrudAnchorEl(event.currentTarget);
  };

  const handleCrudMenuClose = () => {
    setCrudAnchorEl(null);
  };

  const handleEmpresaMenuOpen = (event) => {
    setEmpresaAnchorEl(event.currentTarget);
  };

  const handleEmpresaMenuClose = () => {
    setEmpresaAnchorEl(null);
  };

  const handleReportesMenuOpen = (event) => {
    setReportesAnchorEl(event.currentTarget);
  };

  const handleReportesMenuClose = () => {
    setReportesAnchorEl(null);
  };

  // Funciones para los submenús en el Drawer
  const handleCrudClick = () => {
    setOpenCrudSubmenu(!openCrudSubmenu); // Alterna el submenú Crud
  };

  const handleEmpresaClick = () => {
    setOpenEmpresaSubmenu(!openEmpresaSubmenu); // Alterna el submenú Empresa
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';

  const drawerMenuItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/inicio-admin">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItem>

        {/* Submenú Crud */}
        <ListItem button onClick={handleCrudClick}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Crud" />
          {openCrudSubmenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openCrudSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/politicas-privacidad">
              <ListItemText primary="Políticas y Privacidad" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/deslinde-legal">
              <ListItemText primary="Deslinde Legal" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/terminos-condiciones">
              <ListItemText primary="Términos y Condiciones" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/redes-sociales">
              <ListItemText primary="Redes Sociales" />
            </ListItem>
          </List>
        </Collapse>

        {/* Submenú Empresa */}
        <ListItem button onClick={handleEmpresaClick}>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Empresa" />
          {openEmpresaSubmenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openEmpresaSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/registro-slogan">
              <ListItemText primary="Registro y Actualización de Slogan" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/subida-logo">
              <ListItemText primary="Título de la Página y Logo" />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/registro-contacto">
              <ListItemText primary="Registro y Actualización de Datos de Contacto" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button component={Link} to="/reporte-incidencias">
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary="Reporte de Incidencias" />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>

        {/* Botón para alternar el tema */}
        <Divider />
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            <Brightness4Icon />
          </ListItemIcon>
          <ListItemText primary={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`} />
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
    src={logoNombre.logo}  // Usa la URL completa de Cloudinary
    alt="Logo Empresa"
    style={{ width: '50px', marginRight: '15px' }}
  />
)}
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: textColor }}
            >
              {logoNombre.nombre || 'Consultorio Dental'} - Admin
            </Typography>
          </Box>

          {/* Menús para pantallas grandes */}
          <Button
            color="inherit"
            component={Link}
            to="/inicio-admin"
            sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor }}
          >
            <HomeIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
            Inicio
          </Button>

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
            <MenuItem onClick={handleCrudMenuClose} component={Link} to="/deslinde-legal">
              Deslinde Legal
            </MenuItem>
            <MenuItem onClick={handleCrudMenuClose} component={Link} to="/terminos-condiciones">
              Términos y Condiciones
            </MenuItem>
            <MenuItem onClick={handleCrudMenuClose} component={Link} to="/redes-sociales">
              Redes Sociales
            </MenuItem>
            <MenuItem onClick={handleCrudMenuClose} component={Link} to="/intento-bloqueo">
              Intentos Bloqueo
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            aria-controls="empresa-menu"
            aria-haspopup="true"
            onClick={handleEmpresaMenuOpen}
            sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor, marginLeft: '1rem' }}
          >
            <BusinessIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
            Empresa
          </Button>
          <Menu
            id="empresa-menu"
            anchorEl={empresaAnchorEl}
            open={Boolean(empresaAnchorEl)}
            onClose={handleEmpresaMenuClose}
          >
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/registro-slogan">
              Registro y Actualización de Slogan
            </MenuItem>
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/subida-logo">
              Título de la Página y Logo
            </MenuItem>
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/registro-contacto">
              Registro y Actualización de Datos de Contacto
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            aria-controls="reportes-menu"
            aria-haspopup="true"
            onClick={handleReportesMenuOpen}
            sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor, marginLeft: '1rem' }}
          >
            <AssessmentIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
            Reportes
          </Button>
          <Menu
            id="reportes-menu"
            anchorEl={reportesAnchorEl}
            open={Boolean(reportesAnchorEl)}
            onClose={handleReportesMenuClose}
          >
            <MenuItem onClick={handleReportesMenuClose} component={Link} to="/reporte-incidencias">
              Reporte de Incidencias
            </MenuItem>
          </Menu>

          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ display: { xs: 'none', sm: 'flex' }, fontSize: '1.1rem', color: textColor, marginLeft: '1rem' }}
          >
            <LogoutIcon sx={{ marginRight: '0.5rem', fontSize: '1.8rem', color: textColor }} />
            Cerrar Sesión
          </Button>

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
            onClick={toggleDrawer(true)} // Abre el Drawer al hacer clic
          >
            <MenuIcon sx={{ fontSize: '2rem', color: textColor }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer que se desliza desde la derecha */}
      <Drawer
        anchor="right" // Desliza desde la derecha
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerMenuItems}
      </Drawer>
    </>
  );
};

export default BarraNavAdm;
