const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a tu base de datos externa de Render
const pool = new Pool({
    connectionString: "postgres://admin_sabor:XEWIuMcIFpQzVvRfxijZ9Nf5oDEgZUY9@dpg-d93ldna8qa3s73auvihg-a.virginia-postgres.render.com/sabor_db?ssl=true"
});

// Ruta para obtener el menú (incluyendo la columna disponible)
app.get('/api/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, precio, tiempopreparacion, imagenurl, disponible FROM menu ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { 
        console.error("Error menú:", err.message);
        res.status(500).send(err.message); 
    }
});

// Ruta para registrar pedidos
app.post('/api/pedidos', async (req, res) => {
    const { mesa, contenidopedido } = req.body;
    if (!mesa || !contenidopedido) {
        return res.status(400).send("Faltan datos");
    }
    try {
        await pool.query('INSERT INTO pedidos (mesa, contenidopedido) VALUES ($1, $2)', [parseInt(mesa), contenidopedido]);
        res.sendStatus(200);
    } catch (err) { 
        console.error("Error pedido:", err.message);
        res.status(500).send(err.message); 
    }
});

// Cargar el index.html si entran a cualquier otra ruta de la web
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
