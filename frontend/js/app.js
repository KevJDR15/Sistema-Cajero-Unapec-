const API = 'http://localhost:3000/api';

// ===== NAVEGACIÓN =====
function navegar(pagina) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById('page-' + pagina)?.classList.add('active');
    document.querySelector(`[data-page="${pagina}"]`)?.classList.add('active');

    const titulos = {
        dashboard: 'Dashboard',
        clientes: 'Gestión de Clientes',
        empleados: 'Gestión de Empleados',
        servicios: 'Servicios Facturables',
        'formas-pago': 'Formas de Pago',
        'tipos-documentos': 'Tipos de Documentos',
        movimientos: 'Registro de Movimientos',
        consultas: 'Consultas'
    };
    document.getElementById('page-title').textContent = titulos[pagina] || pagina;

    // Cargar datos de la página
    if (pagina === 'clientes') cargarClientes();
    if (pagina === 'empleados') cargarCatalogo('empleados');
    if (pagina === 'servicios') cargarCatalogo('servicios');
    if (pagina === 'formas-pago') cargarCatalogo('formas-pago');
    if (pagina === 'tipos-documentos') cargarCatalogo('tipos-documentos');
    if (pagina === 'movimientos') iniciarMovimientos();
    if (pagina === 'dashboard') cargarDashboard();
    if (pagina === 'consultas') iniciarConsultas();
}

// ===== API HELPER =====
async function apiFetch(endpoint, options = {}) {
    try {
        const res = await fetch(API + endpoint, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        return await res.json();
    } catch {
        return null;
    }
}

// ===== TOAST =====
function toast(msg, tipo = 'exito') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${tipo} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== DASHBOARD =====
async function cargarDashboard() {
    const [clientes, movimientos, servicios, empleados] = await Promise.all([
        apiFetch('/clientes'),
        apiFetch('/movimientos'),
        apiFetch('/servicios'),
        apiFetch('/empleados')
    ]);

    document.getElementById('stat-clientes').textContent = clientes?.length || 0;
    document.getElementById('stat-movimientos').textContent = movimientos?.length || 0;
    document.getElementById('stat-servicios').textContent = servicios?.length || 0;
    document.getElementById('stat-empleados').textContent = empleados?.length || 0;

    // Últimos movimientos
    const tbody = document.getElementById('ultimos-movimientos');
    if (movimientos?.length) {
        tbody.innerHTML = movimientos.slice(0, 5).map(m => `
            <tr>
                <td>#${m.id}</td>
                <td>${m.cliente}</td>
                <td>${m.servicio}</td>
                <td>${m.forma_pago}</td>
                <td><strong>RD$ ${parseFloat(m.monto).toLocaleString()}</strong></td>
                <td>${new Date(m.fecha_movimiento).toLocaleDateString('es-DO')}</td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#999;padding:20px">Sin movimientos registrados</td></tr>';
    }
}

// ===== CLIENTES =====
async function cargarClientes() {
    const data = await apiFetch('/clientes');
    const tbody = document.getElementById('tabla-clientes');
    const tipos = { 1: 'Estudiante', 2: 'Empleado', 3: 'Profesor' };
    const badgeMap = { 1: 'badge-estudiante', 2: 'badge-empleado', 3: 'badge-profesor' };

    tbody.innerHTML = data?.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td><span class="badge ${badgeMap[c.tipo_cliente]}">${tipos[c.tipo_cliente]}</span></td>
            <td>${c.carrera || '—'}</td>
            <td>${new Date(c.f_registro).toLocaleDateString('es-DO')}</td>
            <td><span class="badge ${c.estado ? 'badge-activo' : 'badge-inactivo'}">${c.estado ? 'Activo' : 'Inactivo'}</span></td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarCliente(${c.id})">Eliminar</button></td>
        </tr>
    `).join('') || '<tr><td colspan="7" style="text-align:center;padding:20px;color:#999">Sin clientes registrados</td></tr>';
}

async function guardarCliente() {
    const body = {
        nombre: document.getElementById('cli-nombre').value,
        tipo_cliente: document.getElementById('cli-tipo').value,
        carrera: document.getElementById('cli-carrera').value
    };
    if (!body.nombre || !body.tipo_cliente) return toast('Completa los campos requeridos', 'error');
    const res = await apiFetch('/clientes', { method: 'POST', body: JSON.stringify(body) });
    if (res?.id) {
        toast('Cliente guardado exitosamente');
        document.getElementById('form-cliente').reset();
        cargarClientes();
    } else {
        toast('Error al guardar el cliente', 'error');
    }
}

async function eliminarCliente(id) {
    if (!confirm('¿Eliminar este cliente?')) return;
    await apiFetch(`/clientes/${id}`, { method: 'DELETE' });
    toast('Cliente eliminado');
    cargarClientes();
}

// ===== CATÁLOGOS GENÉRICOS =====
async function cargarCatalogo(nombre) {
    const data = await apiFetch(`/${nombre}`);
    const tbody = document.getElementById(`tabla-${nombre}`);
    tbody.innerHTML = data?.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.descripcion || r.nombre || ''}</td>
            <td><span class="badge ${r.estado ? 'badge-activo' : 'badge-inactivo'}">${r.estado ? 'Activo' : 'Inactivo'}</span></td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarCatalogo('${nombre}', ${r.id})">Eliminar</button></td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center;padding:20px;color:#999">Sin registros</td></tr>';
}

async function guardarCatalogo(nombre) {
    const input = document.getElementById(`input-${nombre}`);
    const descripcion = input.value.trim();
    if (!descripcion) return toast('Ingresa una descripción', 'error');
    const res = await apiFetch(`/${nombre}`, { method: 'POST', body: JSON.stringify({ descripcion }) });
    if (res?.id) {
        toast('Registro guardado');
        input.value = '';
        cargarCatalogo(nombre);
    } else {
        toast('Error al guardar', 'error');
    }
}

async function eliminarCatalogo(nombre, id) {
    if (!confirm('¿Eliminar este registro?')) return;
    await apiFetch(`/${nombre}/${id}`, { method: 'DELETE' });
    toast('Registro eliminado');
    cargarCatalogo(nombre);
}

// ===== MOVIMIENTOS =====
async function iniciarMovimientos() {
    const [clientes, empleados, servicios, tiposDoc, formasPago, modalidades] = await Promise.all([
        apiFetch('/clientes'), apiFetch('/empleados'), apiFetch('/servicios'),
        apiFetch('/tipos-documentos'), apiFetch('/formas-pago'), apiFetch('/modalidades-pago')
    ]);

    llenarSelect('mov-cliente', clientes, 'nombre');
    llenarSelect('mov-empleado', empleados, 'nombre');
    llenarSelect('mov-servicio', servicios, 'descripcion');
    llenarSelect('mov-tipo-doc', tiposDoc, 'descripcion');
    llenarSelect('mov-forma-pago', formasPago, 'descripcion');
    llenarSelect('mov-modalidad', modalidades, 'descripcion');

    cargarMovimientos();
}

function llenarSelect(id, data, campo) {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">Seleccionar...</option>' +
        (data?.map(r => `<option value="${r.id}">${r[campo]}</option>`).join('') || '');
}

async function cargarMovimientos() {
    const data = await apiFetch('/movimientos');
    const tbody = document.getElementById('tabla-movimientos');
    tbody.innerHTML = data?.map(m => `
        <tr>
            <td>#${m.id}</td>
            <td>${m.empleado}</td>
            <td>${m.cliente}</td>
            <td>${m.servicio}</td>
            <td>${m.tipo_documento}</td>
            <td>${m.forma_pago}</td>
            <td><strong>RD$ ${parseFloat(m.monto).toLocaleString()}</strong></td>
            <td>${new Date(m.fecha_movimiento).toLocaleDateString('es-DO')}</td>
        </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#999">Sin movimientos</td></tr>';
}

async function guardarMovimiento() {
    const body = {
        empleado_id: document.getElementById('mov-empleado').value,
        cliente_id: document.getElementById('mov-cliente').value,
        servicio_id: document.getElementById('mov-servicio').value,
        tipo_documento_id: document.getElementById('mov-tipo-doc').value,
        forma_pago_id: document.getElementById('mov-forma-pago').value,
        modalidad_pago_id: document.getElementById('mov-modalidad').value || null,
        monto: document.getElementById('mov-monto').value
    };
    if (!body.empleado_id || !body.cliente_id || !body.servicio_id || !body.monto)
        return toast('Completa todos los campos requeridos', 'error');

    const res = await apiFetch('/movimientos', { method: 'POST', body: JSON.stringify(body) });
    if (res?.id) {
        toast('Movimiento registrado exitosamente');
        document.getElementById('form-movimiento').reset();
        cargarMovimientos();
    } else {
        toast('Error al registrar el movimiento', 'error');
    }
}

// ===== CONSULTAS =====
async function iniciarConsultas() {
    const [clientes, servicios, formasPago] = await Promise.all([
        apiFetch('/clientes'), apiFetch('/servicios'), apiFetch('/formas-pago')
    ]);
    llenarSelect('con-cliente', clientes, 'nombre');
    llenarSelect('con-servicio', servicios, 'descripcion');
    llenarSelect('con-forma-pago', formasPago, 'descripcion');
}

async function buscarMovimientos() {
    const params = new URLSearchParams();
    const cliente = document.getElementById('con-cliente').value;
    const fechaI = document.getElementById('con-fecha-inicio').value;
    const fechaF = document.getElementById('con-fecha-fin').value;
    const servicio = document.getElementById('con-servicio').value;
    const forma = document.getElementById('con-forma-pago').value;

    if (cliente) params.append('cliente_id', cliente);
    if (fechaI) params.append('fecha_inicio', fechaI);
    if (fechaF) params.append('fecha_fin', fechaF);
    if (servicio) params.append('servicio_id', servicio);
    if (forma) params.append('forma_pago_id', forma);

    const data = await apiFetch(`/movimientos/buscar?${params}`);
    const tbody = document.getElementById('tabla-consulta');
    let total = 0;
    tbody.innerHTML = data?.map(m => {
        total += parseFloat(m.monto);
        return `
            <tr>
                <td>#${m.id}</td>
                <td>${m.cliente}</td>
                <td>${m.servicio}</td>
                <td>${m.forma_pago}</td>
                <td><strong>RD$ ${parseFloat(m.monto).toLocaleString()}</strong></td>
                <td>${new Date(m.fecha_movimiento).toLocaleDateString('es-DO')}</td>
            </tr>
        `;
    }).join('') || '<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">Sin resultados</td></tr>';

    document.getElementById('consulta-total').textContent = `Total: RD$ ${total.toLocaleString()}`;
}

// ===== INICIO =====
document.addEventListener('DOMContentLoaded', () => {
    navegar('dashboard');
});
