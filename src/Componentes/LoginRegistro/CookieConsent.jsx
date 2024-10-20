import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';

function CookieConsent() {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    // Verificar si el consentimiento ya fue almacenado en localStorage o cookies
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(consent === 'true');
    } else {
      // Mostrar la barra si no hay consentimiento
      setOpenSnackbar(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    // Guardar el consentimiento en localStorage
    localStorage.setItem('cookieConsent', 'true');
    setCookieConsent(true);
    setOpenSnackbar(false);

    // Habilitar scripts de terceros (como Google Analytics)
    enableThirdPartyCookies();
  };

  const handleDeclineCookies = () => {
    // Guardar la negación en localStorage
    localStorage.setItem('cookieConsent', 'false');
    setCookieConsent(false);
    setOpenSnackbar(false);
  };

  const enableThirdPartyCookies = () => {
    // Aquí puedes inicializar servicios que requieran cookies de terceros, como Google Analytics, Facebook Pixel, etc.
    // Ejemplo para Google Analytics:
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });

    // Activar scripts que han sido bloqueados por el consentimiento
    document.querySelectorAll('script[type="text/plain"][data-cookieconsent="tracking"]').forEach((script) => {
      const newScript = document.createElement('script');
      newScript.src = script.src;
      document.head.appendChild(newScript);
    });
  };

  if (cookieConsent !== null) {
    // No mostrar la barra si ya hay consentimiento
    return null;
  }

  return (
    <Snackbar open={openSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Box p={2} bgcolor="white" boxShadow={3} borderRadius={3} display="flex" alignItems="center">
        <Typography variant="body1">
          Usamos cookies propias y de terceros para mejorar la experiencia de usuario. ¿Aceptas el uso de cookies, incluidas las de terceros?
        </Typography>
        <Button color="primary" onClick={handleAcceptCookies} style={{ marginLeft: '20px' }}>
          Aceptar
        </Button>
        <Button color="secondary" onClick={handleDeclineCookies} style={{ marginLeft: '10px' }}>
          Rechazar
        </Button>
      </Box>
    </Snackbar>
  );
}

export default CookieConsent;
