const db = require('../models/db');

const makeController = (tabla) => ({
    getAll: async (req, res) => {
        try {
            const [rows] = await db.query(`SELECT * FROM ${tabla} WHERE estado = 1`);
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { descripcion } = req.body;
            const [result] = await db.query(`INSERT INTO ${tabla} (descripcion) VALUES (?)`, [descripcion]);
            res.status(201).json({ id: result.insertId, mensaje: 'Registro creado exitosamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const { descripcion, estado } = req.body;
            await db.query(`UPDATE ${tabla} SET descripcion=?, estado=? WHERE id=?`, [descripcion, estado, req.params.id]);
            res.json({ mensaje: 'Registro actualizado exitosamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    remove: async (req, res) => {
        try {
            await db.query(`UPDATE ${tabla} SET estado = 0 WHERE id = ?`, [req.params.id]);
            res.json({ mensaje: 'Registro eliminado exitosamente' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
});

module.exports = {
    tiposDocumentos: makeController('tipos_documentos'),
    servicios: makeController('servicios'),
    formasPago: makeController('formas_pago'),
    modalidadesPago: makeController('modalidades_pago'),
    empleados: makeController('empleados')
};
