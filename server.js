const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Sirve la carpeta public de manera estándar
app.use(express.static(path.join(__dirname, 'public')));

// Cadena de conexión directa a tu base de datos externa de Render
const pool = new Pool({
    connectionString: "postgres://admin_sabor:XEWIuMcIFpQzVvRfxijZ9Nf5oDEgZUY9@dpg-d93ldna8qa3s73auvihg-a.virginia-postgres.render.com/sabor_db?ssl=true"
});

// Probar la conexión a la base de datos en cuanto encienda el servidor externo
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error crítico al conectar a PostgreSQL en Render:', err.stack);
    }
    console.log('✅ Conexión exitosa a la base de datos en Render');
    release();
});

// Obtener el menú (Corregido a minúsculas puras idéntico a tu C#)
app.get('/api/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, precio, tiempopreparacion, imagenurl FROM menu ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { 
        console.error("Error al obtener menú:", err.message);
        res.status(500).send(err.message); 
    }
});

// Registrar un pedido (Corregido a minúsculas puras idéntico a tu C#)
app.post('/api/pedidos', async (req, res) => {
    const { mesa, contenido } = req.body;
    
    if (!mesa || !contenido) {
        return res.status(400).send("Faltan datos requeridos (mesa o contenido)");
    }

    try {
        const queryText = 'INSERT INTO pedidos (mesa, contenidopedido) VALUES ($1, $2)';
        await pool.query(queryText, [parseInt(mesa), contenido]);
        
        console.log(`🚀 ¡Pedido recibido! Mesa: ${mesa}, Orden: ${contenido}`);
        res.sendStatus(200);
    } catch (err) { 
        console.error("❌ Error al insertar pedido en Render:", err.message);
        res.status(500).send(err.message); 
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor externo corriendo y escuchando en el puerto ${PORT}`));