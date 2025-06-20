const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Simulación de base de datos en memoria
const usuarios = [];

// ✅ Registro
app.post('/registro', (req, res) => {
  const { email, password } = req.body;

  // Validaciones simples
  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
  }

  const yaExiste = usuarios.find(u => u.email === email);
  if (yaExiste) {
    return res.status(409).json({ mensaje: 'El email ya está registrado.' });
  }

  // Guardar usuario
  usuarios.push({ email, password }); // En producción, nunca guardar la contraseña así
  res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
});

// ✅ Inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
  }

  // Redirigir al panel (simulado con mensaje)
  res.json({ mensaje: `Bienvenido, ${email}. Redirigiendo al panel...` });
});

// 🟢 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
