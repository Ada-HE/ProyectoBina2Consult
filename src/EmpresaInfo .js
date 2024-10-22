import React, { useEffect, useState } from 'react';

const EmpresaInfo = () => {
  const [empresa, setEmpresa] = useState({ nombre: '', logo: '' });
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar si los datos están cargando

  useEffect(() => {
    // Realiza la petición al backend para obtener el nombre y logo de la empresa
    fetch('http://localhost:4000/api/logo-nombre/ver')
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const { nombre, logo } = data[0]; // Asume que tomas el primer registro
          setEmpresa({ nombre, logo });
          setIsLoading(false); // Datos cargados correctamente
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos de la empresa:', error);
        setIsLoading(false); // Error pero la carga terminó
      });
  }, []);

  // Este useEffect maneja el cambio del favicon
  useEffect(() => {
    if (empresa.logo) {
      const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = `/${empresa.logo}?v=${new Date().getTime()}`; // Forzar al navegador a recargar el favicon
      document.head.appendChild(favicon); // Asegúrate de agregarlo al <head> si no existe
    }
  }, [empresa.logo]); // Solo se ejecuta cuando el logo cambia

  // Este useEffect maneja el cambio del título de la pestaña
  useEffect(() => {
    if (!isLoading && empresa.nombre) {
      document.title = empresa.nombre || ''; // Actualiza el título solo cuando los datos están listos
    }
  }, [empresa.nombre, isLoading]); // Solo se ejecuta cuando el nombre cambia y no está cargando

  return (
    <>
      {/* No necesitas "Helmet" aquí si solo quieres actualizar el título y favicon */}
    </>
  );
};

export default EmpresaInfo;
