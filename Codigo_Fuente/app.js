const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Simulamos base de datos en memoria
const usuarios = [];
const gastos = [];

// ✅ Registro
app.post('/registro', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
  }

  const yaExiste = usuarios.find(u => u.email === email);
  if (yaExiste) {
    return res.status(409).json({ mensaje: 'El email ya está registrado.' });
  }

  usuarios.push({ email, password });
  res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
});

// ✅ Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
  }

  res.json({ mensaje: `Bienvenido, ${email}. Redirigiendo al panel...` });
});

// ✅ Cargar gasto manual
app.post('/gasto', (req, res) => {
  const { email, monto, categoria } = req.body;

  if (!email || !monto || !categoria) {
    return res.status(400).json({ mensaje: 'Email, monto y categoría son obligatorios.' });
  }

  if (typeof monto !== 'number' || monto <= 0) {
    return res.status(400).json({ mensaje: 'El monto debe ser un número positivo.' });
  }

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) {
    return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
  }

  const nuevoGasto = {
    id: gastos.length + 1,
    email,
    monto,
    categoria,
    fecha: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  gastos.push(nuevoGasto);
  res.status(201).json({ mensaje: 'Gasto registrado correctamente.', gasto: nuevoGasto });
});

// ✅ Ver todos los gastos de un usuario
// ✅ Ver todos los gastos de un usuario ordenados por fecha (más reciente primero)
app.get('/gastos/:email', (req, res) => {
  const email = req.params.email;

  const lista = gastos
    .filter(g => g.email === email)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // orden descendente

  if (lista.length === 0) {
    return res.status(404).json({ mensaje: 'No se encontraron gastos para este usuario.' });
  }

  res.json({ gastos: lista });
});


// 🟢 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
