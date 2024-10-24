import React, { useEffect, useState } from 'react';

const EmpresaInfo = () => {
  const [empresa, setEmpresa] = useState({ nombre: '', logo: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Realiza la petición al backend para obtener el nombre y logo de la empresa
    fetch('https://backendproyectobina2.onrender.com/api/logo-nombre/ver')
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

  // Este useEffect maneja el cambio del favicon con la URL de Cloudinary
  useEffect(() => {
    if (empresa.logo) {
      const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = `${empresa.logo}?v=${new Date().getTime()}`; // Usamos la URL de Cloudinary
      document.head.appendChild(favicon); // Asegúrate de agregarlo al <head> si no existe
    }
  }, [empresa.logo]);

  // Este useEffect maneja el cambio del título de la pestaña
  useEffect(() => {
    if (!isLoading && empresa.nombre) {
      document.title = empresa.nombre || ''; // Actualiza el título solo cuando los datos están listos
    }
  }, [empresa.nombre, isLoading]);

  return null; // No renderiza nada en la pantalla
};

export default EmpresaInfo;
