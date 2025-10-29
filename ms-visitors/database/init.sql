-- Script de inicialización de la base de datos para ms-visitors
-- Sistema de Estacionamiento - CIBERTEC

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS db_visitors;

-- Usar la base de datos
USE db_visitors;

-- La tabla 'visitors' será creada automáticamente por JPA/Hibernate
-- con la configuración: spring.jpa.hibernate.ddl-auto=update

-- Sin embargo, aquí está la estructura de la tabla para referencia:
/*
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(8) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    paternal_last_name VARCHAR(100) NOT NULL,
    maternal_last_name VARCHAR(100) NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/

-- Datos de ejemplo (opcional)
-- Descomentar si deseas insertar datos de prueba
/*
INSERT INTO visitors (dni, first_name, paternal_last_name, maternal_last_name) VALUES
('12345678', 'Juan', 'Pérez', 'García'),
('87654321', 'María', 'López', 'Martínez'),
('11223344', 'Carlos', 'Rodríguez', 'Sánchez'),
('44332211', 'Ana', 'Fernández', 'Torres');
*/

-- Verificar la creación
SHOW TABLES;
