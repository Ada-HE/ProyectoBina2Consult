import React, { useState, useEffect } from 'react';
import { Container, Typography, Link, IconButton, useTheme } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter'; // Ícono de Twitter sigue funcionando como X
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import axios from 'axios';

const PieDePagina = () => {
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === 'dark' ? '#0A0E27' : '#f5f5f5';
  const textColor = theme.palette.mode === 'dark' ? '#00BFFF' : theme.palette.text.secondary;

  const [socialMedia, setSocialMedia] = useState([]);
  const [contactInfo, setContactInfo] = useState(null); // Estado para los datos de contacto

  // Función para obtener redes sociales desde el backend
  const fetchSocialMedia = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/redSocial'); // Tu endpoint de redes sociales
      setSocialMedia(response.data);
    } catch (error) {
      console.error('Error al obtener redes sociales:', error);
    }
  };

  // Función para obtener los datos de contacto desde el backend
  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/contacto/ver'); // Tu endpoint de contacto
      if (response.data.length > 0) {
        setContactInfo(response.data[0]); // Asegurarse de acceder al primer registro
      }
    } catch (error) {
      console.error('Error al obtener los datos de contacto:', error);
    }
  };

  // useEffect para obtener redes sociales y datos de contacto al cargar el componente
  useEffect(() => {
    fetchSocialMedia();
    fetchContactInfo();
  }, []);

  return (
    <footer style={{ backgroundColor: backgroundColor, padding: '20px 0', marginTop: '20px' }}>
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" sx={{ color: textColor }}>
          <strong>Consultorio Dental</strong> - Cuidado de tu sonrisa.
        </Typography>
        
        {/* Enlaces de Políticas y otros documentos legales */}
        <Typography variant="body2" align="center" sx={{ color: textColor, marginTop: '10px' }}>
          <Link href="/politicaPrivacidad" underline="none" sx={{ color: theme.palette.primary.main }}>
            Políticas y Privacidad
          </Link>{' '}
          |{' '}
          <Link href="/deslindeLegal" underline="none" sx={{ color: theme.palette.primary.main }}>
            Deslinde Legal
          </Link>{' '}
          |{' '}
          <Link href="/terminosCondiciones" underline="none" sx={{ color: theme.palette.primary.main }}>
            Términos y Condiciones
          </Link>
        </Typography>

        {/* Sección de Redes Sociales con Iconos dinámicos */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          {socialMedia.map((social) => (
            <IconButton
              key={social.id}
              href={social.url}
              aria-label={social.nombre}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Mostrar íconos según la red social */}
              {social.nombre === 'Facebook' && <FacebookIcon sx={{ color: theme.palette.primary.main }} />}
              {social.nombre === 'Instagram' && <InstagramIcon sx={{ color: theme.palette.primary.main }} />}
              {(social.nombre === 'Twitter' || social.nombre.includes('X')) && (
                <TwitterIcon sx={{ color: theme.palette.primary.main }} />
              )}
              {social.nombre === 'Linkedin' && <LinkedInIcon sx={{ color: theme.palette.primary.main }} />}
            </IconButton>
          ))}
        </div>

        {/* Datos de contacto */}
        {contactInfo && (
          <Typography variant="body2" align="center" sx={{ color: textColor, marginTop: '20px' }}>
            <strong>Dirección:</strong> {contactInfo.direccion} |{' '}
            <strong>Correo:</strong> {contactInfo.correo} |{' '}
            <strong>Teléfono:</strong> {contactInfo.telefono}
          </Typography>
        )}

        <Typography variant="body2" align="center" sx={{ color: textColor }}>
          © {new Date().getFullYear()} Todos los derechos reservados.
        </Typography>
      </Container>
    </footer>
  );
};

export default PieDePagina;
