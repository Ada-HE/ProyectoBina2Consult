import React, { useEffect, useState } from 'react';

const EmpresaInfo = () => {
  const [empresa, setEmpresa] = useState({ nombre: '', logo: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Realiza la petición al backend para obtener el nombre y logo vigentes
    const obtenerDatosEmpresa = async () => {
      try {
        const [logoResponse, nombreResponse] = await Promise.all([
          fetch('https://localhost:4000/api/logo/vigente'),
          fetch('https://localhost:4000/api/nombre/vigente')
        ]);
        
        const logoData = await logoResponse.json();
        const nombreData = await nombreResponse.json();
        
        // Se asume que ambas respuestas contienen solo los datos vigentes
        setEmpresa({ nombre: nombreData.nombre, logo: logoData.logo });
        setIsLoading(false); // Datos cargados correctamente
      } catch (error) {
        console.error('Error al obtener los datos de la empresa:', error);
        setIsLoading(false); // Error pero la carga terminó
      }
    };

    obtenerDatosEmpresa();
  }, []);

  // Este useEffect maneja el cambio del favicon con la URL del logo vigente
  useEffect(() => {
    if (empresa.logo) {
      const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = `${empresa.logo}?v=${new Date().getTime()}`;
      document.head.appendChild(favicon);
    }
  }, [empresa.logo]);

  // Este useEffect maneja el cambio del título de la pestaña al nombre vigente
  useEffect(() => {
    if (!isLoading && empresa.nombre) {
      document.title = empresa.nombre;
    }
  }, [empresa.nombre, isLoading]);

  return null; // No renderiza nada en la pantalla
};

export default EmpresaInfo;
