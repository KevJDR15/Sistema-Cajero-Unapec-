const db = require('../models/db');

const getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE estado = 1');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { nombre, tipo_cliente, carrera } = req.body;
        const [result] = await db.query(
            'INSERT INTO clientes (nombre, tipo_cliente, carrera) VALUES (?, ?, ?)',
            [nombre, tipo_cliente, carrera || null]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Cliente creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const { nombre, tipo_cliente, carrera, estado } = req.body;
        await db.query(
            'UPDATE clientes SET nombre=?, tipo_cliente=?, carrera=?, estado=? WHERE id=?',
            [nombre, tipo_cliente, carrera || null, estado, req.params.id]
        );
        res.json({ mensaje: 'Cliente actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        await db.query('UPDATE clientes SET estado = 0 WHERE id = ?', [req.params.id]);
        res.json({ mensaje: 'Cliente eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };
