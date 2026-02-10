const express = require('express');
const sql = require('mssql');
const path = require('path');


const app = express();
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));


// Configuración de la conexión a SQL Server
const dbConfig = {
    server: 'localhost', // Reemplaza con tu servidor
    database: 'LoginDB', // Reemplaza con tu base de datos
    user: 'pruebas', // Reemplaza con tu usuario
    password: '1234', // Reemplaza con tu contraseña
    
    
    options: {
        encrypt: true, // Para Azure
        trustServerCertificate: true // Para desarrollo local
    }
};

// Endpoint de ejemplo para obtener datos
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Usuarios');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Endpoint para validar usuario y contraseña
app.post('/api/usuarios', async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        const result = await sql.query`SELECT * FROM Usuarios WHERE Usuario = ${usuario} AND Contrasena = ${contrasena}`;
        if (result.recordset.length > 0) {
            res.json({ validado: true });
        } else {
            res.json({ validado: false });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint para registrar nuevos usuarios
app.post('/api/registro', async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existe = await sql.query`SELECT * FROM Usuarios WHERE Usuario = ${usuario}`;
        if (existe.recordset.length > 0) {
            return res.status(400).json({ registrado: false, error: 'El usuario ya existe.' });
        }
        // Insertar nuevo usuario
        await sql.query`INSERT INTO Usuarios (Usuario, Contrasena) VALUES (${usuario}, ${contrasena})`;
        res.json({ registrado: true });
    } catch (err) {
        res.status(500).json({ registrado: false, error: err.message });
    }
});


const PORT = process.env.PORT || 3000;

// Conectar a SQL Server una sola vez al iniciar el servidor
sql.connect(dbConfig)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Error al conectar a SQL Server:', err);
    });

// Manejo global de errores no capturados
process.on('uncaughtException', (err) => {
    console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rechazo no manejado en promesa:', reason);
});
