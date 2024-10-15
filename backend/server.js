const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');  // Importar las rutas de autenticación

const app = express();

// Middleware
app.use(express.json());

// Configurar CORS para permitir solicitudes desde localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000', // Especificar el origen de tu frontend
  credentials: true, // Permitir cookies
};
app.use(cors(corsOptions));

// Usar las rutas de autenticación
app.use('/api', authRoutes);

// Iniciar servidor
app.listen(4000, () => {
  console.log('Servidor corriendo en el puerto 4000');
});
