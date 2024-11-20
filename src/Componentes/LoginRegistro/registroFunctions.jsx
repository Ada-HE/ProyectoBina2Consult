export const validarPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

export const validarStep1 = (nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, mostrarAlerta) => {
    // Validación del nombre
    if (!nombre || nombre.trim() === '.' || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(nombre)) {
        mostrarAlerta('El nombre solo puede contener letras y espacios, y no puede ser un punto.');
        return false;
    }

    // Validación del apellido paterno
    if (!apellidoPaterno || apellidoPaterno.trim() === '.' || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(apellidoPaterno)) {
        mostrarAlerta('El apellido paterno solo puede contener letras y espacios, y no puede ser un punto.');
        return false;
    }

    // Validación del apellido materno
    if (!apellidoMaterno || apellidoMaterno.trim() === '.' || !/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(apellidoMaterno)) {
        mostrarAlerta('El apellido materno solo puede contener letras y espacios, y no puede ser un punto.');
        return false;
    }

    // Validación del teléfono
    if (!telefono || !/^\d{10}$/.test(telefono)) {
        mostrarAlerta('El teléfono debe ser numérico y contener exactamente 10 dígitos.');
        return false;
    }

    // Validación de la edad
    const numericEdad = parseInt(edad, 10);
    if (!edad || isNaN(numericEdad) || numericEdad < 18 || numericEdad > 100) {
        mostrarAlerta('La edad debe ser un número entre 18 y 100.');
        return false;
    }

    // Validación del sexo
    if (!sexo) {
        mostrarAlerta('Selecciona un género válido.');
        return false;
    }

    // Si todas las validaciones pasan
    return true;
};


// Función para manejar el registro
export const handleSubmit = async (
  e,
  password,
  confirmPassword,
  recaptchaValue,
  validarPassword,
  mostrarAlerta,
  setError,
  mostrarExito,
  nombre,
  apellidoPaterno,
  apellidoMaterno,
  telefono,
  edad,
  sexo,
  correo,
  csrfToken, // Token CSRF incluido
  setStep,
  
) => {
  e.preventDefault();

  if (password !== confirmPassword) {
      mostrarAlerta('Las contraseñas no coinciden');
      return;
  }

  if (!validarPassword(password)) {
      mostrarAlerta('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial');
      return;
  }

  if (!recaptchaValue) {
      mostrarAlerta('Por favor, completa el reCAPTCHA');
      return;
  }

  setError('');

  try {
      const controller = new AbortController(); // Controlador para manejar timeout
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

      const response = await fetch('https://backendproyectobina2.onrender.com/api/registro', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken, // Incluimos el token CSRF en el header
          },
          credentials: 'include',  // Asegurar que las cookies también se envíen

          body: JSON.stringify({
              nombre,
              apellidoPaterno,
              apellidoMaterno,
              telefono,
              edad,
              sexo,
              correo,
              password,
              recaptchaValue,
          }),
          signal: controller.signal,
      });

      clearTimeout(timeoutId); // Limpiar el timeout si la respuesta llega a tiempo

      if (response.ok) {
          mostrarExito('Código de verificación enviado. Revisa tu correo.');
          setStep(3); // Avanza al paso de verificación de código
      } else {
          const data = await response.json();
          mostrarAlerta(data.message || 'Error en el registro');
      }
  } catch (error) {
      if (error.name === 'AbortError') {
          mostrarAlerta('Tiempo de espera agotado, intenta de nuevo.');
      } else {
          mostrarAlerta('Error en el servidor');
      }
  }
};

// Función para manejar la verificación del código
export const handleSubmitVerification = async (
  e,
  correo,
  codigoVerificacion,
  mostrarAlerta,
  mostrarExito,
  csrfToken, // Token CSRF incluido
  setStep
) => {
  e.preventDefault();

  try {
      const controller = new AbortController(); // Controlador para manejar timeout
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

      const response = await fetch('https://backendproyectobina2.onrender.com/api/verificar-codigo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken, // Incluimos el token CSRF en el header
          },
          credentials: 'include',  // Asegurar que las cookies también se envíen

          body: JSON.stringify({
              correo,
              codigo: codigoVerificacion,
          }),
          signal: controller.signal,
      });

      clearTimeout(timeoutId); // Limpiar el timeout si la respuesta llega a tiempo

      if (response.ok) {
          mostrarExito('Código verificado correctamente');
          setStep(4); // Avanza al siguiente paso o finaliza el proceso
      } else {
          const data = await response.json();
          mostrarAlerta(data.message || 'Error al verificar el código');
      }
  } catch (error) {
      if (error.name === 'AbortError') {
          mostrarAlerta('Tiempo de espera agotado, intenta de nuevo.');
      } else {
          mostrarAlerta('Error en el servidor');
      }
  }
};
