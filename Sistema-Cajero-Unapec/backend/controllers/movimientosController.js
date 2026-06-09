const db = require('../models/db');

const getAll = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.id, m.fecha_movimiento, m.monto, m.estado,
                e.nombre AS empleado, c.nombre AS cliente,
                s.descripcion AS servicio, td.descripcion AS tipo_documento,
                fp.descripcion AS forma_pago, mp.descripcion AS modalidad_pago
            FROM movimientos m
            JOIN empleados e ON m.empleado_id = e.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN servicios s ON m.servicio_id = s.id
            JOIN tipos_documentos td ON m.tipo_documento_id = td.id
            JOIN formas_pago fp ON m.forma_pago_id = fp.id
            LEFT JOIN modalidades_pago mp ON m.modalidad_pago_id = mp.id
            WHERE m.estado = 1
            ORDER BY m.fecha_movimiento DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const buscar = async (req, res) => {
    try {
        const { cliente_id, fecha_inicio, fecha_fin, servicio_id, forma_pago_id } = req.query;
        let query = `
            SELECT m.id, m.fecha_movimiento, m.monto,
                e.nombre AS empleado, c.nombre AS cliente,
                s.descripcion AS servicio, td.descripcion AS tipo_documento,
                fp.descripcion AS forma_pago
            FROM movimientos m
            JOIN empleados e ON m.empleado_id = e.id
            JOIN clientes c ON m.cliente_id = c.id
            JOIN servicios s ON m.servicio_id = s.id
            JOIN tipos_documentos td ON m.tipo_documento_id = td.id
            JOIN formas_pago fp ON m.forma_pago_id = fp.id
            WHERE m.estado = 1
        `;
        const params = [];

        if (cliente_id) { query += ' AND m.cliente_id = ?'; params.push(cliente_id); }
        if (fecha_inicio) { query += ' AND DATE(m.fecha_movimiento) >= ?'; params.push(fecha_inicio); }
        if (fecha_fin) { query += ' AND DATE(m.fecha_movimiento) <= ?'; params.push(fecha_fin); }
        if (servicio_id) { query += ' AND m.servicio_id = ?'; params.push(servicio_id); }
        if (forma_pago_id) { query += ' AND m.forma_pago_id = ?'; params.push(forma_pago_id); }

        query += ' ORDER BY m.fecha_movimiento DESC';
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const { empleado_id, cliente_id, servicio_id, tipo_documento_id, forma_pago_id, modalidad_pago_id, monto } = req.body;
        const [result] = await db.query(
            `INSERT INTO movimientos (empleado_id, cliente_id, servicio_id, tipo_documento_id, forma_pago_id, modalidad_pago_id, monto)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [empleado_id, cliente_id, servicio_id, tipo_documento_id, forma_pago_id, modalidad_pago_id || null, monto]
        );
        res.status(201).json({ id: result.insertId, mensaje: 'Movimiento registrado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, buscar, create };
