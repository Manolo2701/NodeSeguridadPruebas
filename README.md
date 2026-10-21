# Sistema de gestión de restaurantes

Proyecto académico de backend desarrollado con Node.js y Express para practicar autenticación, gestión de datos y pruebas automatizadas en una aplicación de reservas de restaurante.

> **Aviso:** proyecto educativo para ejecución local. No está auditado ni preparado para producción. Los usuarios y datos de ejemplo son ficticios. No reutilices contraseñas ni secretos de este repositorio en otros sistemas.

## Funcionalidades

- Gestión de clientes, reservas y platos.
- Autenticación con JWT y hash de contraseñas con bcrypt.
- Sesiones, cookies y protección CSRF.
- Cabeceras de seguridad con Helmet y limitación de peticiones.
- Validación de entradas y manejo centralizado de errores.
- Pruebas con Jest y Supertest.

## Tecnologías

- Node.js, Express y EJS
- MySQL y Sequelize
- JWT, bcryptjs, express-session, csurf y Helmet
- Jest y Supertest

## Requisitos

- Node.js y npm
- MySQL

## Instalación local

1. Clona el repositorio y entra en su carpeta:

   ```bash
   git clone https://github.com/Manolo2701/NodeSeguridadPruebas.git
   cd NodeSeguridadPruebas
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia `.env.example` como `.env` y configura los datos de MySQL y los secretos locales. Usa valores aleatorios distintos para `JWT_SECRET`, `JWT_REFRESH_SECRET` y `SESSION_SECRET`. No publiques `.env`.

4. Crea la base de datos indicada por `DB_NAME` en MySQL y configura un usuario con los permisos necesarios. Sequelize sincroniza los modelos al iniciar la aplicación fuera del entorno de pruebas.

5. Inicia la aplicación:

   ```bash
   npm start
   ```

   Si no hay certificados TLS, se usa HTTP para desarrollo local en `http://localhost:3000`. No expongas este modo a Internet. Para HTTPS, configura `TLS_KEY_PATH` y `TLS_CERT_PATH` con certificados locales; nunca guardes claves privadas en Git. En modo producción ambos certificados son obligatorios.

## Pruebas

```bash
npm test
```

Las pruebas necesitan una base de datos MySQL configurada para testing. Utiliza una base de datos separada: algunos tests sincronizan los modelos con `force: true`, lo que elimina y recrea tablas.

## Configuración

Variables principales de `.env.example`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_DIALECT`
- `PORT`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
- `COOKIE_DOMAIN`, `NODE_ENV`
- `TLS_KEY_PATH`, `TLS_CERT_PATH` (opcionales en desarrollo; necesarios en producción)

El archivo `.env.example` contiene valores ilustrativos. Sustitúyelos en tu copia local. Los archivos `.env`, `.env.test` y los certificados locales se han retirado de la versión actual, pero los commits antiguos pueden conservar sus contenidos. El historial no se ha reescrito; si alguno de esos valores se usó fuera de este ejercicio, revócalo o rótalo.

## Aprendizajes y alcance

Este repositorio recoge prácticas académicas sobre autenticación, seguridad básica y testing. Las medidas incluidas son ejercicios de aprendizaje y no sustituyen una revisión de seguridad profesional.

## Autor

**Manuel Barbado**  
[GitHub](https://github.com/Manolo2701) · [LinkedIn](https://www.linkedin.com/in/manuel-ramiro-barbado-s%C3%A1nchez-7404b5345/)
