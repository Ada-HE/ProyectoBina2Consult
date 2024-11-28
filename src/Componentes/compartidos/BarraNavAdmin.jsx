import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem,
  Collapse, useTheme, Box, Divider
} from '@mui/material';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openCrudSubmenu, setOpenCrudSubmenu] = useState(false);
  const [openEmpresaSubmenu, setOpenEmpresaSubmenu] = useState(false);
  const [crudAnchorEl, setCrudAnchorEl] = useState(null);
  const [empresaAnchorEl, setEmpresaAnchorEl] = useState(null);
  const [reportesAnchorEl, setReportesAnchorEl] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [logoNombre, setLogoNombre] = useState({ nombre: '', logo: '' });
  const navigate = useNavigate();

  // Obtener el nombre y logo desde la API
  const fetchLogoNombre = async () => {
    try {
      const [logoResponse, nombreResponse] = await Promise.all([
        fetch('https://localhost:4000/api/logo/vigente'),
        fetch('https://localhost:4000/api/nombre/vigente')
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
    obtenerCsrfToken();
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

  const obtenerCsrfToken = async () => {
    try {
      const response = await fetch('https://localhost:4000/api/get-csrf-token', {
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
      const response = await fetch('https://localhost:4000/api/logout', {
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

  // Funciones para los menús en pantallas grandes
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
    setOpenCrudSubmenu(!openCrudSubmenu);
  };

  const handleEmpresaClick = () => {
    setOpenEmpresaSubmenu(!openEmpresaSubmenu);
  };

  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#01349c';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#ffffff';
  const drawerBackgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#ffffff';
  const drawerTextColor = theme.palette.mode === 'dark' ? '#00BFFF' : '#000000';

  const drawerMenuItems = (
    <Box
      sx={{
        width: 250,
        backgroundColor: drawerBackgroundColor,
        color: drawerTextColor,
        height: '100%',
      }}
      role="presentation"
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/inicio-admin" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <HomeIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Inicio" sx={{ color: drawerTextColor }} />
        </ListItem>

        {/* Submenú Crud */}
        <ListItem button onClick={handleCrudClick}>
          <ListItemIcon>
            <SettingsIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Crud" sx={{ color: drawerTextColor }} />
          {openCrudSubmenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openCrudSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/politicas-privacidad" onClick={toggleDrawer(false)}>
              <ListItemText primary="Políticas y Privacidad" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/deslinde-legal" onClick={toggleDrawer(false)}>
              <ListItemText primary="Deslinde Legal" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/terminos-condiciones" onClick={toggleDrawer(false)}>
              <ListItemText primary="Términos y Condiciones" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/redes-sociales" onClick={toggleDrawer(false)}>
              <ListItemText primary="Redes Sociales" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/intento-bloqueo" onClick={toggleDrawer(false)}>
              <ListItemText primary="Bloqueo Intento" sx={{ color: drawerTextColor }} />
            </ListItem>
          </List>
        </Collapse>

        {/* Submenú Empresa */}
        <ListItem button onClick={handleEmpresaClick}>
          <ListItemIcon>
            <BusinessIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Empresa" sx={{ color: drawerTextColor }} />
          {openEmpresaSubmenu ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openEmpresaSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/registro-slogan" onClick={toggleDrawer(false)}>
              <ListItemText primary="Actualización Eslogan" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/subida-logo" onClick={toggleDrawer(false)}>
              <ListItemText primary="Actualización Logo" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/subida-empresa" onClick={toggleDrawer(false)}>
              <ListItemText primary="Actualización Nombre Empresa" sx={{ color: drawerTextColor }} />
            </ListItem>
            <ListItem button sx={{ pl: 4 }} component={Link} to="/registro-contacto" onClick={toggleDrawer(false)}>
              <ListItemText primary="Actualización de Datos de Contacto" sx={{ color: drawerTextColor }} />
            </ListItem>
          </List>
        </Collapse>

        <ListItem button component={Link} to="/reporte-incidencias" onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <AssessmentIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Reporte de Incidencias" sx={{ color: drawerTextColor }} />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" sx={{ color: drawerTextColor }} />
        </ListItem>

        <Divider />
        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            <Brightness4Icon sx={{ color: drawerTextColor }} />
          </ListItemIcon>
          <ListItemText primary={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`} sx={{ color: drawerTextColor }} />
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
              Actualización Eslogan
            </MenuItem>
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/subida-logo">
              Actualización Logo
            </MenuItem>
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/subida-empresa">
              Actualización Nombre Empresa
            </MenuItem>
            <MenuItem onClick={handleEmpresaMenuClose} component={Link} to="/registro-contacto">
              Actualización de Datos de Contacto
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
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ fontSize: '2rem', color: textColor }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer para el menú en pantallas pequeñas */}
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

export default BarraNavAdm;
