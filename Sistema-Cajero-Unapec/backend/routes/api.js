const express = require('express');
const router = express.Router();
const clientes = require('../controllers/clientesController');
const movimientos = require('../controllers/movimientosController');
const catalogos = require('../controllers/catalogosController');

// Clientes
router.get('/clientes', clientes.getAll);
router.get('/clientes/:id', clientes.getById);
router.post('/clientes', clientes.create);
router.put('/clientes/:id', clientes.update);
router.delete('/clientes/:id', clientes.remove);

// Movimientos
router.get('/movimientos', movimientos.getAll);
router.get('/movimientos/buscar', movimientos.buscar);
router.post('/movimientos', movimientos.create);

// Catálogos
router.get('/tipos-documentos', catalogos.tiposDocumentos.getAll);
router.post('/tipos-documentos', catalogos.tiposDocumentos.create);
router.put('/tipos-documentos/:id', catalogos.tiposDocumentos.update);
router.delete('/tipos-documentos/:id', catalogos.tiposDocumentos.remove);

router.get('/servicios', catalogos.servicios.getAll);
router.post('/servicios', catalogos.servicios.create);
router.put('/servicios/:id', catalogos.servicios.update);
router.delete('/servicios/:id', catalogos.servicios.remove);

router.get('/formas-pago', catalogos.formasPago.getAll);
router.post('/formas-pago', catalogos.formasPago.create);
router.put('/formas-pago/:id', catalogos.formasPago.update);
router.delete('/formas-pago/:id', catalogos.formasPago.remove);

router.get('/modalidades-pago', catalogos.modalidadesPago.getAll);
router.post('/modalidades-pago', catalogos.modalidadesPago.create);
router.put('/modalidades-pago/:id', catalogos.modalidadesPago.update);
router.delete('/modalidades-pago/:id', catalogos.modalidadesPago.remove);

router.get('/empleados', catalogos.empleados.getAll);
router.post('/empleados', catalogos.empleados.create);
router.put('/empleados/:id', catalogos.empleados.update);
router.delete('/empleados/:id', catalogos.empleados.remove);

module.exports = router;
