# Documentación del Proyecto: Sistema de Gestión de Restaurantes

## 1. Descripción de la temática y funcionalidades de la aplicación
El Sistema de Gestión de Restaurantes es una aplicación web diseñada para facilitar la administración de restaurantes, ofreciendo funcionalidades para la gestión de clientes, reservas y platos.

### Funcionalidades principales:
Gestión de Clientes: Registro, autenticación y mantenimiento de perfiles de clientes.

Gestión de Reservas: Creación, modificación y cancelación de reservas.

Gestión de Platos: Administración del menú, incluyendo la adición, modificación y eliminación de platos.

Sistema de Autenticación: Registro e inicio de sesión seguros para clientes y personal del restaurante.

## 2. Detalles de las pruebas realizadas
Pruebas Unitarias
Pruebas de Carga
Pruebas Manuales
[Ver documento adjunto con la evidencia de las pruebas]

## 3. Medidas de seguridad implementadas
Validación de entradas: Implementación de express-validator para prevenir inyecciones SQL y ataques XSS.

HTTPS: Configuración de un servidor HTTPS y redirección de HTTP a HTTPS para todas las comunicaciones.

Protección contra CSRF: Uso del middleware CSRF para prevenir ataques de falsificación de solicitudes entre sitios.

Autenticación segura:

Utilización de JSON Web Tokens (JWT) para la gestión de sesiones.

Hash de contraseñas con bcrypt.

Rate Limiting: Implementación de límites de tasa para prevenir ataques de fuerza bruta.

Helmet: Uso del middleware Helmet para establecer cabeceras HTTP relacionadas con la seguridad.

## 4. Vulnerabilidades identificadas
Necesidad de implementar una protección más robusta contra ataques de fuerza bruta en los endpoints de login.

Posible exposición de información sensible en los mensajes de error.

## 5. Conclusiones y posibles mejoras
### Conclusiones
La aplicación proporciona una base sólida para la gestión de restaurantes con funcionalidades esenciales implementadas.

Las medidas de seguridad básicas están en su lugar, pero hay margen de mejora.

El rendimiento bajo carga es aceptable, pero podría optimizarse.

### Posibles mejoras
Actualizar bcryptjs a bcrypt: Se recomienda actualizar de bcryptjs a bcrypt para mejorar el rendimiento en el hashing de contraseñas.

Optimizar consultas a la base de datos: Revisar y optimizar las consultas SQL para mejorar el rendimiento bajo carga.

Implementar logging: Añadir un sistema de logging robusto para facilitar el debugging y monitoreo.

Ampliar cobertura de pruebas: Aumentar la cobertura de pruebas unitarias y de integración.

Implementar autenticación de dos factores: Para mejorar la seguridad de las cuentas de usuario.

Revisar y actualizar dependencias: Mantener todas las dependencias actualizadas para evitar vulnerabilidades conocidas.

Implementar una estrategia de caché: Para mejorar los tiempos de respuesta en operaciones frecuentes.

Terminar las vistas: Para poder hacer un mejor uso del proyecto, se recomienda terminar las vistas o añadir otro tipo de frontend

## 6.onfiguración de la base de datos
### Instalación de MySQL
Si no tienes MySQL instalado, sigue estos pasos:

#### Para Debian/Ubuntu:

sudo apt update
sudo apt install mysql-server


#### Para macOS (usando Homebrew):

brew install mysql


#### Para Windows:

Descarga el instalador de MySQL desde el sitio oficial de MySQL.

Ejecuta el instalador y sigue las instrucciones.

### Creación de la base de datos
Accede a MySQL:

mysql -u root -p

Crea la base de datos RESTAURANTE:

CREATE DATABASE RESTAURANTE;
USE RESTAURANTE;

Las tablas se crearán automáticamente al iniciar la aplicación.

Crea al usuario camarero:
CREATE USER 'camarero'@'localhost' IDENTIFIED BY 'cam12';
GRANT ALL PRIVILEGES ON RESTAURANTE.* TO 'camarero'@'localhost';
FLUSH PRIVILEGES;

Entra como camarero:
mysql -u camarero -p -h localhost
password: cam12

USE RESTAURANTE;

Datos iniciales
Ejecuta las siguientes consultas para insertar datos iniciales:

INSERT INTO Clientes (dni, nombre, email, password_hash, tipo_cliente, createdAt, updatedAt) VALUES
('12345678A', 'Admin User', 'admin@test.com', '$2b$10$X/hG4xHBzWe.riUOa.z7m.d7i2TBvhP.F9CYhzWNvZgGG6.MQSKlO', 'admin', NOW(), NOW()),
('87654321B', 'Cliente Normal', 'cliente1@test.com', '$2b$10$X/hG4xHBzWe.riUOa.z7m.d7i2TBvhP.F9CYhzWNvZgGG6.MQSKlO', 'cliente', NOW(), NOW()),
('11223344C', 'Cliente VIP', 'cliente2@test.com', '$2b$10$X/hG4xHBzWe.riUOa.z7m.d7i2TBvhP.F9CYhzWNvZgGG6.MQSKlO', 'cliente', NOW(), NOW()),
('55667788D', 'Cliente Nuevo', 'cliente3@test.com', '$2b$10$X/hG4xHBzWe.riUOa.z7m.d7i2TBvhP.F9CYhzWNvZgGG6.MQSKlO', 'cliente', NOW(), NOW());

INSERT INTO Platos (nombre, precio, descripcion, categoria, createdAt, updatedAt) VALUES
('Paella Valenciana', 15.99, 'Auténtica paella con pollo y conejo', 'Plato principal', NOW(), NOW()),
('Gazpacho Andaluz', 7.50, 'Sopa fría de tomate y verduras', 'Entrante', NOW(), NOW()),
('Tortilla Española', 9.75, 'Tortilla de patatas tradicional', 'Tapa', NOW(), NOW()),
('Pulpo a la Gallega', 18.50, 'Pulpo cocido con pimentón y aceite de oliva', 'Plato principal', NOW(), NOW()),
('Crema Catalana', 6.99, 'Postre tradicional catalán', 'Postre', NOW(), NOW());

INSERT INTO Reservas (mesa, fecha, estado, dni, createdAt, updatedAt) VALUES
(1, '2025-03-10 19:00:00', 'confirmada', '87654321B', NOW(), NOW()),
(2, '2025-03-11 20:30:00', 'pendiente', '11223344C', NOW(), NOW()),
(3, '2025-03-12 18:00:00', 'confirmada', '55667788D', NOW(), NOW()),
(4, '2025-03-13 21:00:00', 'pendiente', '87654321B', NOW(), NOW());

