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

// 🛠️ CORRECCIÓN DE MENÚ: Ahora SÍ descarga la columna "disponible" para que el celular sepa si está Agotado
app.get('/api/menu', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, precio, tiempopreparacion, imagenurl, disponible FROM menu ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) { 
        console.error("Error al obtener menú:", err.message);
        res.status(500).send(err.message); 
    }
});

// 🛠️ CORRECCIÓN DE PEDIDOS: Cambiado de "contenido" a "contenidopedido" para que enlace con el HTML
app.post('/api/pedidos', async (req, res) => {
    const { mesa, contenidopedido } = req.body;
    
    if (!mesa || !contenidopedido) {
        return res.status(400).send("Faltan datos requeridos (mesa o contenidopedido)");
    }

    try {
        const queryText = 'INSERT INTO pedidos (mesa, contenidopedido) VALUES ($1, $2)';
        await pool.query(queryText, [parseInt(mesa), contenidopedido]);
        
        console.log(`🚀 ¡Pedido recibido! Mesa: ${mesa}, Orden: ${contenidopedido}`);
        res.sendStatus(200);
    } catch (err) { 
        console.error("❌ Error al insertar pedido en Render:", err.message);
        res.status(500).send(err.message); 
    }
});

// Asegura que la raíz busque el archivo index.html dentro de public y no deje la pantalla beige
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor externo corriendo y escuchando en el puerto ${PORT}`));
