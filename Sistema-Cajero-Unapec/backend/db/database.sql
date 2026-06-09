-- ============================================
-- SISTEMA DE CAJA - UNAPEC
-- Base de Datos
-- ============================================

CREATE DATABASE IF NOT EXISTS caja_unapec;
USE caja_unapec;

-- Tipos de Documentos
CREATE TABLE tipos_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

-- Servicios Facturables
CREATE TABLE servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

-- Formas de Pago
CREATE TABLE formas_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

-- Modalidades de Pago
CREATE TABLE modalidades_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

-- Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    tipo_cliente TINYINT NOT NULL COMMENT '1=Estudiante, 2=Empleado, 3=Profesor',
    carrera VARCHAR(100),
    f_registro DATE DEFAULT (CURRENT_DATE),
    estado TINYINT(1) DEFAULT 1
);

-- Empleados de Caja
CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    tanda_labor VARCHAR(50),
    fecha_ingreso DATE NOT NULL,
    estado TINYINT(1) DEFAULT 1
);

-- Movimientos de Caja
CREATE TABLE movimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empleado_id INT NOT NULL,
    cliente_id INT NOT NULL,
    servicio_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    forma_pago_id INT NOT NULL,
    modalidad_pago_id INT,
    fecha_movimiento DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(10,2) NOT NULL,
    estado TINYINT(1) DEFAULT 1,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (servicio_id) REFERENCES servicios(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipos_documentos(id),
    FOREIGN KEY (forma_pago_id) REFERENCES formas_pago(id),
    FOREIGN KEY (modalidad_pago_id) REFERENCES modalidades_pago(id)
);

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO tipos_documentos (descripcion) VALUES
('Recibo de Ingreso'), ('Nota Crédito'), ('Nota Débito'), ('Factura');

INSERT INTO servicios (descripcion) VALUES
('Colegiatura'), ('Reingreso'), ('Inglés'), ('Laboratorio'), ('Biblioteca');

INSERT INTO formas_pago (descripcion) VALUES
('Al Contado'), ('A Crédito'), ('T-Pago'), ('Página Web'), ('Transferencia');

INSERT INTO modalidades_pago (descripcion) VALUES
('Pago Total'), ('2 Cuotas'), ('4 Cuotas'), ('6 Cuotas');

INSERT INTO empleados (nombre, cedula, tanda_labor, fecha_ingreso) VALUES
('Ana Martínez', '001-1234567-8', 'Matutina', '2022-01-15'),
('Carlos Pérez', '001-9876543-2', 'Vespertina', '2021-06-01');

INSERT INTO clientes (nombre, tipo_cliente, carrera) VALUES
('María García', 1, 'Ingeniería en Sistemas'),
('Juan Rodríguez', 1, 'Administración de Empresas'),
('Luis Fernández', 2, NULL),
('Pedro Sánchez', 3, NULL);
