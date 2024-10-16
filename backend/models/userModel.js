const db = require('../db');

// Función para crear un nuevo usuario con el campo mfa_secret utilizando transacciones
const createUser = async (nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, correo, password, tipo, codigoVerificacion, expirationTime, mfaSecret) => {
  const connection = await db.getConnection(); // Obtener conexión para la transacción
  await connection.beginTransaction(); // Iniciar transacción

  try {
    const query = `
      INSERT INTO usuarios 
      (nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, correo, password, tipo, codigo_verificacion, codigo_verificacion_expiracion, mfa_secret, intentos_fallidos, cuenta_bloqueada) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, FALSE)
    `;
    await connection.query(query, [nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, correo, password, tipo, codigoVerificacion, expirationTime, mfaSecret]);

    await connection.commit(); // Confirmar transacción
    connection.release(); // Liberar la conexión
    return true;
  } catch (err) {
    await connection.rollback(); // Revertir si ocurre un error
    connection.release(); // Liberar la conexión
    throw err; // Lanzar el error para que sea manejado en la función que llama
  }
};

// Función para buscar un usuario por correo
const findUserByEmail = async (correo) => {
  try {
    const query = 'SELECT * FROM usuarios WHERE correo = ?';
    const [rows] = await db.query(query, [correo]);
    return rows;
  } catch (err) {
    throw err; // Manejo de errores
  }
};

// Función para actualizar todos los datos del usuario si no ha sido verificado, utilizando transacciones
const updateUserData = async (correo, nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, password, nuevoCodigo, nuevaExpiracion, mfaSecret) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const query = `
      UPDATE usuarios 
      SET nombre = ?, apellidoPaterno = ?, apellidoMaterno = ?, telefono = ?, edad = ?, sexo = ?, password = ?, codigo_verificacion = ?, codigo_verificacion_expiracion = ?, mfa_secret = ?
      WHERE correo = ? AND verificado = 0
    `;
    await connection.query(query, [nombre, apellidoPaterno, apellidoMaterno, telefono, edad, sexo, password, nuevoCodigo, nuevaExpiracion, mfaSecret, correo]);

    await connection.commit();
    connection.release();
    return true;
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
};

// Función para actualizar el estado de verificación del usuario
const updateUserVerified = async (correo) => {
  try {
    const query = 'UPDATE usuarios SET verificado = TRUE WHERE correo = ?';
    await db.query(query, [correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para eliminar un usuario no verificado si el código ha expirado
const deleteUserByEmail = async (correo) => {
  try {
    const query = 'DELETE FROM usuarios WHERE correo = ? AND verificado = 0';
    await db.query(query, [correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para actualizar el código de verificación y el tiempo de expiración
const updateVerificationCodeAndExpiration = async (correo, nuevoCodigo, nuevaExpiracion) => {
  try {
    const query = 'UPDATE usuarios SET codigo_verificacion = ?, codigo_verificacion_expiracion = ? WHERE correo = ? AND verificado = 0';
    await db.query(query, [nuevoCodigo, nuevaExpiracion, correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para incrementar los intentos fallidos
const incrementarIntentosFallidos = async (correo) => {
  try {
    const query = 'UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE correo = ?';
    await db.query(query, [correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para bloquear la cuenta después de demasiados intentos fallidos
const bloquearCuenta = async (correo) => {
  try {
    const query = 'UPDATE usuarios SET cuenta_bloqueada = TRUE WHERE correo = ?';
    await db.query(query, [correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para reiniciar los intentos fallidos después de un inicio de sesión exitoso
const reiniciarIntentosFallidos = async (correo) => {
  try {
    const query = 'UPDATE usuarios SET intentos_fallidos = 0 WHERE correo = ?';
    await db.query(query, [correo]);
    return true;
  } catch (err) {
    throw err;
  }
};

// Función para buscar un usuario por correo o teléfono
const findUserByEmailOrPhone = async (correo, telefono) => {
  try {
    const query = 'SELECT * FROM usuarios WHERE correo = ? OR telefono = ?';
    const [rows] = await db.query(query, [correo, telefono]);
    return rows;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  updateUserData,
  updateUserVerified,
  deleteUserByEmail,
  updateVerificationCodeAndExpiration,
  incrementarIntentosFallidos,
  bloquearCuenta,
  reiniciarIntentosFallidos,
  findUserByEmailOrPhone,
};
