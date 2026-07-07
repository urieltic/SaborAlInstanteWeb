const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
    connectionString: "postgres://admin_sabor:XEWIuMcIFpQzVvRfxijZ9Nf5oDEgZUY9@dpg-d93ldna8qa3s73auvihg-a.virginia-postgres.render.com/sabor_db?ssl=true"
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error en base de datos:', err.stack);
    }
    console.log('Conexión exitosa a PostgreSQL');
    release();
});

app.get('/api/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, precio, tiempopreparacion, imagenurl, disponible FROM menu ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { 
        res.status(500).send(err.message); 
    }
});

app.post('/api/pedidos', async (req, res) => {
    const { mesa, contenidopedido } = req.body;
    if (!mesa || !contenidopedido) {
        return res.status(400).send("Faltan datos");
    }
    try {
        await pool.query('INSERT INTO pedidos (mesa, contenidopedido) VALUES ($1, $2)', [parseInt(mesa), contenidopedido]);
        res.sendStatus(200);
    } catch (err) { 
        res.status(500).send(err.message); 
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
