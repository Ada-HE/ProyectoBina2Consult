import validator from 'validator';

export const validarNombre = (nombre) => {
  return validator.isAlpha(nombre, 'es-ES', { ignore: ' ' });
};

export const validarTelefono = (telefono) => {
  return validator.isMobilePhone(telefono, 'es-MX');
};

export const validarEdad = (edad) => {
  return validator.isInt(edad, { min: 1 });
};

export const validarEmail = (correo) => {
  return validator.isEmail(correo);
};

export const validarPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

export const validarStep1 = (nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, mostrarAlerta) => {
  const validSexOptions = ['Hombre', 'Mujer', 'No especificado'];

  if (!nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !edad || !sexo) {
    mostrarAlerta('Por favor, completa todos los campos del paso actual');
    return false;
  }

  if (!validarNombre(nombre) || !validarNombre(apellidoPaterno) || !validarNombre(apellidoMaterno)) {
    mostrarAlerta('El nombre y los apellidos solo deben contener letras.');
    return false;
  }

  if (!validarTelefono(telefono)) {
    mostrarAlerta('El teléfono no es válido. Asegúrate de que tenga 10 dígitos y sea un número válido en México.');
    return false;
  }

  if (!validarEdad(edad)) {
    mostrarAlerta('La edad debe ser un número mayor a 0.');
    return false;
  }

  // Validación del campo sexo
  if (!validSexOptions.includes(sexo)) {
    mostrarAlerta('El valor proporcionado para el campo Sexo no es válido.');
    return false;
  }

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
  setStep
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

    const response = await fetch('http://localhost:4000/api/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  setStep
) => {
  e.preventDefault();

  try {
    const controller = new AbortController(); // Controlador para manejar timeout
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

    const response = await fetch('http://localhost:4000/api/verificar-codigo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
