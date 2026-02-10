# API Node.js + SQL Server

Este proyecto es una API REST creada con Node.js y Express para conectarse a una base de datos SQL Server.

## Instalación

1. Instala las dependencias:
   ```
   npm install express mssql
   ```
2. Configura los datos de conexión en el archivo `index.js`:
   - user
   - password
   - server
   - database

## Uso

- Inicia el servidor:
  ```
  node index.js
  ```
- Endpoints disponibles:
  - `GET /api/usuarios`: Obtiene todos los usuarios
  - `POST /api/usuarios`: Agrega un usuario (requiere JSON `{ nombre, email }`)

## Notas
- Asegúrate de tener la tabla `Usuarios` en tu base de datos.
- Modifica la configuración según tu entorno.
