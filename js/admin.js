/* ============================================================
   Pelícanos Bros · Panel de administración
   ============================================================ */
(function () {
  'use strict';

  let admin = null;
  let panelActual = 'resumen';
  let filtros = { texto: '', estado: '', pago: '', fecha: '' };
  let filtroClientes = '';
  let pedidoAbierto = null;
  let clienteAbierto = null;
  let intervalo = null;

  const $ = UI.$;
  const $$ = UI.$$;
  const esc = UI.escapar;

  const TITULOS = {
    resumen: ['Panel', 'Resumen del día'],
    pedidos: ['Operación', 'Pedidos'],
    cocina: ['Producción', 'Cocina'],
    clientes: ['Comunidad', 'Clientes'],
    menu: ['Catálogo', 'Menú y precios']
  };

  document.addEventListener('DOMContentLoaded', iniciar);

  function iniciar() {
    PB.iniciar();
    UI.initModales();
    conectarEventos();
    admin = PB.usuarioActual('admin');
    if (admin) mostrarPanel();
    else mostrarLogin();
  }

  /* ---------------- Sesión ---------------- */

  function mostrarLogin() {
    $('#vistaPanel').hidden = true;
    $('#vistaLogin').hidden = false;
    $('#errorAdminLogin').hidden = true;
    $('#formAdminLogin').reset();
    if (intervalo) {
      clearInterval(intervalo);
      intervalo = null;
    }
  }

  function mostrarPanel() {
    $('#vistaLogin').hidden = true;
    $('#vistaPanel').hidden = false;
    $('#adminNombre').textContent = admin.nombre;
    $('#adminAvatar').textContent = String(admin.nombre || 'A').trim().charAt(0).toUpperCase();
    $('#adminFecha').textContent = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    }).format(new Date());
    irAPanel(panelActual);
    renderTodo();
    if (intervalo) clearInterval(intervalo);
    intervalo = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      if (panelActual === 'menu') return;
      renderTodo();
    }, 30000);
  }

  function login(evento) {
    evento.preventDefault();
    const usuario = $('#adminUsuario').value.trim();
    const password = $('#adminPassword').value;
    const error = $('#errorAdminLogin');
    const resultado = PB.autenticar(usuario, password, 'admin');
    if (!resultado.ok) {
      error.textContent = resultado.error;
      error.hidden = false;
      return;
    }
    admin = resultado.usuario;
    PB.iniciarSesion('admin', admin.id);
    $('#formAdminLogin').reset();
    mostrarPanel();
    UI.toast('Bienvenido al panel, ' + admin.nombre + '.');
  }

  function cerrarSesionAdmin() {
    PB.cerrarSesion('admin');
    admin = null;
    mostrarLogin();
    UI.toast('Sesión de administrador cerrada.', 'info');
  }

  /* ---------------- Navegación ---------------- */

  function irAPanel(panel) {
    if (!TITULOS[panel]) panel = 'resumen';
    panelActual = panel;
    $$('[data-panel]').forEach((boton) => {
      boton.classList.toggle('activo', boton.dataset.panel === panel);
    });
    $$('[data-panel-contenido]').forEach((seccion) => {
      seccion.hidden = seccion.dataset.panelContenido !== panel;
    });
    $('#adminSobre').textContent = TITULOS[panel][0];
    $('#adminTitulo').textContent = TITULOS[panel][1];
    renderPanel(panel);
  }

  function renderTodo() {
    actualizarBadge();
    renderPanel(panelActual);
  }

  function renderPanel(panel) {
    if (panel === 'resumen') renderResumen();
    if (panel === 'pedidos') renderTablaPedidos();
    if (panel === 'cocina') renderCocina();
    if (panel === 'clientes') renderClientes();
    if (panel === 'menu') renderMenu();
  }

  function actualizarBadge() {
    const activos = PB.getPedidos().filter((p) => p.estado === 'pendiente' || p.estado === 'en_preparacion');
    const badge = $('#badgePedidos');
    if (badge) {
      badge.textContent = activos.length;
      badge.hidden = activos.length === 0;
    }
  }

  /* ---------------- Resumen ---------------- */

  function renderResumen() {
    renderKPIs();
    renderProximos();
    renderUltimos();
  }

  function renderKPIs() {
    const pedidos = PB.getPedidos();
    const hoy = pedidos.filter((p) => PB.esHoy(p.fechaPedido));
    const activos = pedidos.filter((p) => ['pendiente', 'en_preparacion', 'listo'].includes(p.estado));
    const recojosHoy = activos.filter((p) => PB.esHoy(p.fechaRecojo));
    const ventasHoy = hoy
      .filter((p) => p.estadoPago === 'pagado' && p.estado !== 'cancelado')
      .reduce((suma, p) => suma + p.total, 0);
    const porCobrar = activos
      .filter((p) => p.estadoPago !== 'pagado')
      .reduce((suma, p) => suma + p.total, 0);
    const clientes = PB.getUsuarios().filter((u) => u.rol === 'cliente');
    const clientesConPedidos = new Set(pedidos.map((p) => p.usuarioId)).size;

    const tarjetas = [
      { icono: '🧾', titulo: 'Pedidos hoy', valor: String(hoy.length), pie: activos.length + ' activos en total', clase: 'kpi-verde' },
      { icono: '🛍️', titulo: 'Recojos de hoy', valor: String(recojosHoy.length), pie: 'Pendientes de entregar', clase: 'kpi-mango' },
      { icono: '💰', titulo: 'Ventas pagadas hoy', valor: PB.formatearSoles(ventasHoy), pie: 'Solo pagos verificados', clase: 'kpi-azul' },
      { icono: '⏳', titulo: 'Por cobrar', valor: PB.formatearSoles(porCobrar), pie: 'Pedidos activos sin pago', clase: 'kpi-rojo' },
      { icono: '👥', titulo: 'Clientes', valor: String(clientes.length), pie: clientesConPedidos + ' con pedidos', clase: 'kpi-crema' }
    ];

    $('#kpis').innerHTML = tarjetas.map((kpi) =>
      '<article class="kpi ' + kpi.clase + '">' +
        '<span class="kpi-icono" aria-hidden="true">' + kpi.icono + '</span>' +
        '<div><span class="kpi-titulo">' + esc(kpi.titulo) + '</span>' +
        '<strong class="kpi-valor">' + esc(kpi.valor) + '</strong>' +
        '<small class="kpi-pie">' + esc(kpi.pie) + '</small></div>' +
      '</article>'
    ).join('');
  }

  function resumenItems(pedido, maximo) {
    const items = pedido.items.map((item) => item.cantidad + '× ' + item.nombre);
    if (items.length <= (maximo || 2)) return items.join(' + ');
    return items.slice(0, maximo || 2).join(' + ') + ' +' + (items.length - (maximo || 2)) + ' más';
  }

  function renderProximos() {
    const contenedor = $('#proximosRecojos');
    const ahora = Date.now();
    const proximos = PB.getPedidos()
      .filter((p) => ['pendiente', 'en_preparacion', 'listo'].includes(p.estado))
      .filter((p) => new Date(p.fechaRecojo).getTime() > ahora - 60 * 60000)
      .sort((a, b) => new Date(a.fechaRecojo) - new Date(b.fechaRecojo))
      .slice(0, 6);

    if (!proximos.length) {
      contenedor.innerHTML = '<div class="mini-vacio">No hay recojos próximos. ¡Todo al día!</div>';
      return;
    }

    contenedor.innerHTML = proximos.map((p) => {
      const estado = PB.ESTADOS[p.estado];
      return '<button type="button" class="recojo-item" data-ver-pedido="' + esc(p.id) + '">' +
        '<span class="recojo-hora">' + PB.formatearHora(p.fechaRecojo) + '</span>' +
        '<span class="recojo-info"><strong>' + esc(p.cliente.nombre) + '</strong><small>' + esc(p.codigo) + ' · ' + esc(resumenItems(p)) + '</small></span>' +
        '<span class="pill estado-' + estado.clase + '">' + estado.icono + ' ' + esc(estado.nombre) + '</span>' +
      '</button>';
    }).join('');
  }

  function renderUltimos() {
    const contenedor = $('#ultimosPedidos');
    const pedidos = PB.getPedidos()
      .slice()
      .sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido))
      .slice(0, 6);

    if (!pedidos.length) {
      contenedor.innerHTML = '<div class="mini-vacio">Todavía no hay pedidos registrados.</div>';
      return;
    }

    contenedor.innerHTML = pedidos.map((p) => {
      const estado = PB.ESTADOS[p.estado];
      const pagado = p.estadoPago === 'pagado';
      return '<button type="button" class="ultimo-item" data-ver-pedido="' + esc(p.id) + '">' +
        '<span class="ultimo-codigo">' + esc(p.codigo) + '</span>' +
        '<span class="ultimo-info"><strong>' + esc(p.cliente.nombre) + '</strong><small>' + PB.tiempoRelativo(p.fechaPedido) + ' · ' + esc(resumenItems(p, 1)) + '</small></span>' +
        '<span class="ultimo-total">' + PB.formatearSoles(p.total) + '</span>' +
        '<span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Pendiente') + '</span>' +
        '<span class="pill estado-' + estado.clase + '">' + esc(estado.nombre) + '</span>' +
      '</button>';
    }).join('');
  }

  /* ---------------- Pedidos ---------------- */

  function pedidosFiltrados() {
    const texto = filtros.texto.trim().toLowerCase();
    return PB.getPedidos().filter((p) => {
      const contenido = [p.codigo, p.cliente.nombre, p.cliente.correo, p.cliente.telefono].join(' ').toLowerCase();
      const coincideTexto = !texto || contenido.includes(texto);
      const coincideEstado = !filtros.estado || p.estado === filtros.estado;
      const coincidePago = !filtros.pago || p.estadoPago === filtros.pago;
      const coincideFecha = !filtros.fecha || PB.valorFechaLocal(new Date(p.fechaRecojo)) === filtros.fecha;
      return coincideTexto && coincideEstado && coincidePago && coincideFecha;
    }).sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
  }

  function renderTablaPedidos() {
    const pedidos = pedidosFiltrados();
    const cuerpo = $('#tablaPedidos');

    if (!pedidos.length) {
      cuerpo.innerHTML = '<tr><td colspan="7"><div class="tabla-vacia">No se encontraron pedidos con esos filtros.</div></td></tr>';
    } else {
      cuerpo.innerHTML = pedidos.map((p) => {
        const estado = PB.ESTADOS[p.estado];
        const metodo = PB.METODOS_PAGO[p.metodoPago] || PB.METODOS_PAGO.efectivo;
        const pagado = p.estadoPago === 'pagado';
        return '<tr class="' + (p.estado === 'cancelado' ? 'fila-cancelada' : '') + '">' +
          '<td><button type="button" class="enlace-tabla" data-ver-pedido="' + esc(p.id) + '">' + esc(p.codigo) + '</button>' +
            '<small class="celda-sub">' + PB.formatearHora(p.fechaPedido) + ' · ' + PB.tiempoRelativo(p.fechaPedido) + '</small></td>' +
          '<td><strong>' + esc(p.cliente.nombre) + '</strong><small class="celda-sub">' + esc(p.cliente.correo) + '</small></td>' +
          '<td><strong>' + PB.formatearDiaCorto(p.fechaRecojo) + '</strong><small class="celda-sub">' + PB.formatearHora(p.fechaRecojo) + '</small></td>' +
          '<td><strong>' + PB.formatearSoles(p.total) + '</strong></td>' +
          '<td><span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Pendiente') + '</span>' +
            '<small class="celda-sub">' + metodo.icono + ' ' + esc(metodo.nombre) + '</small></td>' +
          '<td><span class="pill estado-' + estado.clase + '">' + estado.icono + ' ' + esc(estado.nombre) + '</span></td>' +
          '<td class="acciones-tabla">' +
            '<button type="button" class="btn btn-fantasma btn-mini" data-ver-pedido="' + esc(p.id) + '">Ver</button>' +
            '<button type="button" class="btn ' + (pagado ? 'btn-texto' : 'btn-mango') + ' btn-mini" data-toggle-pago="' + esc(p.id) + '">' +
              (pagado ? '↺ Pago' : 'Cobrar') +
            '</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    $('#contadorPedidos').textContent = 'Mostrando ' + pedidos.length + ' de ' + PB.getPedidos().length + ' pedidos.';
  }

  /* ---------------- Cocina ---------------- */

  function renderCocina() {
    const contenedor = $('#tableroCocina');
    const activos = PB.getPedidos().filter((p) => ['pendiente', 'en_preparacion', 'listo'].includes(p.estado));
    const grupos = [
      { estado: 'pendiente', titulo: 'Por preparar', icono: '🕐', clase: 'col-mango' },
      { estado: 'en_preparacion', titulo: 'En preparación', icono: '🔥', clase: 'col-azul' },
      { estado: 'listo', titulo: 'Listos para recoger', icono: '✅', clase: 'col-verde' }
    ];

    if (!activos.length) {
      contenedor.innerHTML = '<div class="cocina-vacia"><div aria-hidden="true">🍽️</div><h3>No hay comandas activas</h3><p>Cuando un cliente confirme un pedido aparecerá aquí, ordenado por hora de recojo.</p></div>';
      return;
    }

    contenedor.innerHTML = grupos.map((grupo) => {
      const pedidos = activos
        .filter((p) => p.estado === grupo.estado)
        .sort((a, b) => new Date(a.fechaRecojo) - new Date(b.fechaRecojo));

      return '<div class="cocina-columna ' + grupo.clase + '">' +
        '<header class="cocina-columna-cabecera"><h2>' + grupo.icono + ' ' + esc(grupo.titulo) + '</h2><span class="contador-carrito">' + pedidos.length + '</span></header>' +
        '<div class="cocina-columna-lista">' +
          (pedidos.length ? pedidos.map(tarjetaComanda).join('') : '<p class="columna-vacia">Sin pedidos en esta etapa.</p>') +
        '</div>' +
      '</div>';
    }).join('');
  }

  function tarjetaComanda(p) {
    const estado = PB.ESTADOS[p.estado];
    const siguiente = estado.siguiente;
    const siguienteNombre = siguiente ? PB.ESTADOS[siguiente].nombre : '';
    const pagado = p.estadoPago === 'pagado';

    return '<article class="comanda">' +
      '<header class="comanda-cabecera">' +
        '<span class="comanda-hora">' + PB.formatearHora(p.fechaRecojo) + '</span>' +
        '<span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Por cobrar') + '</span>' +
      '</header>' +
      '<div class="comanda-cliente"><strong>' + esc(p.cliente.nombre) + '</strong><small>' + esc(p.codigo) + ' · ' + PB.tiempoRelativo(p.fechaPedido) + '</small></div>' +
      '<ul class="comanda-items">' +
        p.items.map((item) =>
          '<li><span class="comanda-cant">' + item.cantidad + '×</span><div><strong>' + esc(item.nombre) + '</strong>' +
          (item.opcionesTexto ? '<small>' + esc(item.opcionesTexto) + '</small>' : '') +
          (item.nota ? '<small class="nota-item">📝 ' + esc(item.nota) + '</small>' : '') +
          '</div></li>'
        ).join('') +
      '</ul>' +
      (p.nota ? '<p class="comanda-nota">📝 ' + esc(p.nota) + '</p>' : '') +
      '<footer class="comanda-pie">' +
        '<strong>' + PB.formatearSoles(p.total) + '</strong>' +
        '<div class="comanda-acciones">' +
          '<button type="button" class="btn btn-texto btn-mini" data-ver-pedido="' + esc(p.id) + '">Detalle</button>' +
          (siguiente
            ? '<button type="button" class="btn btn-primario btn-mini" data-avanzar="' + esc(p.id) + '" data-siguiente="' + siguiente + '">' +
                (siguiente === 'en_preparacion' ? 'Iniciar' : (siguiente === 'listo' ? 'Marcar listo' : 'Entregar')) +
              '</button>'
            : '') +
        '</div>' +
      '</footer>' +
    '</article>';
  }

  /* ---------------- Clientes ---------------- */

  function renderClientes() {
    const texto = filtroClientes.trim().toLowerCase();
    const pedidos = PB.getPedidos();
    const filas = PB.getUsuarios()
      .filter((u) => u.rol === 'cliente')
      .map((cliente) => {
        const suyos = pedidos.filter((p) => p.usuarioId === cliente.id);
        const pagados = suyos.filter((p) => p.estadoPago === 'pagado' && p.estado !== 'cancelado');
        const ultimo = suyos.slice().sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido))[0] || null;
        return {
          cliente,
          pedidos: suyos,
          totalPagado: pagados.reduce((suma, p) => suma + p.total, 0),
          ultimo
        };
      })
      .filter((fila) => {
        if (!texto) return true;
        return [fila.cliente.nombre, fila.cliente.correo, fila.cliente.telefono, fila.cliente.usuario].join(' ').toLowerCase().includes(texto);
      })
      .sort((a, b) => b.totalPagado - a.totalPagado);

    const cuerpo = $('#tablaClientes');
    if (!filas.length) {
      cuerpo.innerHTML = '<tr><td colspan="7"><div class="tabla-vacia">No se encontraron clientes.</div></td></tr>';
    } else {
      cuerpo.innerHTML = filas.map((fila) =>
        '<tr>' +
          '<td><strong>' + esc(fila.cliente.nombre) + '</strong><small class="celda-sub">Desde ' + PB.formatearDiaCorto(fila.cliente.creadoEn) + '</small></td>' +
          '<td>' + esc(fila.cliente.correo) + '<small class="celda-sub">' + esc(fila.cliente.telefono) + '</small></td>' +
          '<td><code class="codigo-usuario">' + esc(fila.cliente.usuario) + '</code></td>' +
          '<td><strong>' + fila.pedidos.length + '</strong></td>' +
          '<td><strong>' + PB.formatearSoles(fila.totalPagado) + '</strong></td>' +
          '<td>' + (fila.ultimo ? PB.formatearFechaHora(fila.ultimo.fechaPedido) : '—') + '</td>' +
          '<td class="acciones-tabla"><button type="button" class="btn btn-fantasma btn-mini" data-ver-cliente="' + esc(fila.cliente.id) + '">Historial</button></td>' +
        '</tr>'
      ).join('');
    }

    $('#contadorClientes').textContent = 'Mostrando ' + filas.length + ' clientes registrados.';
  }

  /* ---------------- Menú ---------------- */

  function renderMenu() {
    const productos = PB.getProductos();
    $('#menuAdmin').innerHTML = productos.map((p) =>
      '<article class="menu-admin-card' + (p.disponible ? '' : ' menu-admin-agotado') + '">' +
        '<img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '" loading="lazy">' +
        '<div class="menu-admin-info">' +
          '<div class="menu-admin-titulo"><div><strong>' + esc(p.nombre) + '</strong><small>' + esc(p.categoria) + '</small></div>' +
            '<span class="pill ' + (p.disponible ? 'pago-pagado' : 'pago-pendiente') + '">' + (p.disponible ? 'Disponible' : 'Agotado') + '</span>' +
          '</div>' +
          '<div class="menu-admin-controles">' +
            '<label class="campo-precio">Precio base' +
              '<span class="input-soles"><span>S/</span><input type="number" min="0" step="0.5" value="' + Number(p.precio).toFixed(2) + '" data-precio="' + esc(p.id) + '" aria-label="Precio de ' + esc(p.nombre) + '"></span>' +
            '</label>' +
            '<label class="switch">' +
              '<input type="checkbox" data-disponible="' + esc(p.id) + '"' + (p.disponible ? ' checked' : '') + '>' +
              '<span class="switch-pista" aria-hidden="true"></span>' +
              '<span>Disponible hoy</span>' +
            '</label>' +
          '</div>' +
        '</div>' +
      '</article>'
    ).join('');
  }

  /* ---------------- Modal pedido ---------------- */

  function abrirPedido(id) {
    const pedido = PB.pedidoPorId(id);
    if (!pedido) return;
    pedidoAbierto = id;
    renderModalPedido(pedido);
    UI.abrirModal('modalPedido');
  }

  function renderModalPedido(pedido) {
    const estado = PB.ESTADOS[pedido.estado] || PB.ESTADOS.pendiente;
    const metodo = PB.METODOS_PAGO[pedido.metodoPago] || PB.METODOS_PAGO.efectivo;
    const pagado = pedido.estadoPago === 'pagado';
    const eventos = pedido.eventos || [];
    const puedeCancelar = pedido.estado !== 'cancelado' && pedido.estado !== 'entregado';

    $('#contenidoPedido').innerHTML =
      '<div class="modal-cabecera">' +
        '<span class="sobre">Pedido ' + esc(pedido.codigo) + '</span>' +
        '<div class="modal-titulo-fila">' +
          '<h3 id="tituloPedido">' + esc(pedido.cliente.nombre) + '</h3>' +
          '<span class="pill estado-' + estado.clase + '">' + estado.icono + ' ' + esc(estado.nombre) + '</span>' +
        '</div>' +
        '<p>Registrado el ' + PB.formatearFechaHora(pedido.fechaPedido) + ' · ' + PB.tiempoRelativo(pedido.fechaPedido) + '</p>' +
      '</div>' +
      '<div class="modal-cuerpo">' +
        '<div class="pedido-modal-grid">' +
          '<div class="pedido-modal-bloque">' +
            '<h4>Cliente</h4>' +
            '<p><strong>' + esc(pedido.cliente.nombre) + '</strong><br>' + esc(pedido.cliente.correo) + '<br>' + esc(pedido.cliente.telefono) + '</p>' +
          '</div>' +
          '<div class="pedido-modal-bloque destacado">' +
            '<h4>Hora de recojo</h4>' +
            '<strong class="hora-grande">' + PB.formatearHora(pedido.fechaRecojo) + '</strong>' +
            '<p>' + PB.formatearDiaCorto(pedido.fechaRecojo) + '</p>' +
          '</div>' +
          '<div class="pedido-modal-bloque">' +
            '<h4>Pago</h4>' +
            '<p>' + metodo.icono + ' ' + esc(metodo.nombre) + '<br><span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Pago pendiente') + '</span></p>' +
            '<button type="button" class="btn ' + (pagado ? 'btn-fantasma' : 'btn-mango') + ' btn-mini" data-toggle-pago="' + esc(pedido.id) + '">' +
              (pagado ? 'Marcar como pendiente' : 'Marcar como pagado') +
            '</button>' +
          '</div>' +
          '<div class="pedido-modal-bloque">' +
            '<h4>Estado del pedido</h4>' +
            '<select id="selectEstadoPedido" class="select-estado" aria-label="Cambiar estado del pedido">' +
              Object.keys(PB.ESTADOS).map((clave) =>
                '<option value="' + clave + '"' + (clave === pedido.estado ? ' selected' : '') + '>' + esc(PB.ESTADOS[clave].nombre) + '</option>'
              ).join('') +
            '</select>' +
            '<p class="ayuda">El cliente ve el cambio en su historial.</p>' +
          '</div>' +
        '</div>' +

        '<h4 class="subtitulo-form">Detalle del pedido</h4>' +
        '<ul class="pedido-modal-items">' +
          pedido.items.map((item) =>
            '<li>' +
              '<img src="' + esc(item.imagen) + '" alt="">' +
              '<div><strong>' + item.cantidad + '× ' + esc(item.nombre) + '</strong>' +
                (item.opcionesTexto ? '<small>' + esc(item.opcionesTexto) + '</small>' : '') +
                (item.nota ? '<small class="nota-item">📝 ' + esc(item.nota) + '</small>' : '') +
              '</div>' +
              '<span>' + PB.formatearSoles(item.precioUnitario * item.cantidad) + '</span>' +
            '</li>'
          ).join('') +
        '</ul>' +
        (pedido.nota ? '<div class="pedido-modal-nota"><strong>Nota del cliente</strong><p>📝 ' + esc(pedido.nota) + '</p></div>' : '') +
        '<div class="pedido-modal-total"><span>Total</span><strong>' + PB.formatearSoles(pedido.total) + '</strong></div>' +

        '<div class="pedido-modal-acciones">' +
          '<button type="button" class="btn btn-fantasma btn-chico" id="btnImprimirComanda">🖨️ Imprimir comanda</button>' +
          (puedeCancelar ? '<button type="button" class="btn btn-peligro btn-chico" id="btnCancelarPedido">Cancelar pedido</button>' : '') +
        '</div>' +

        '<h4 class="subtitulo-form">Trazabilidad</h4>' +
        '<ul class="timeline">' +
          eventos.map((evento) =>
            '<li><span class="timeline-punto" aria-hidden="true"></span><div><strong>' + esc(evento.detalle) + '</strong><small>' + PB.formatearFechaHora(evento.fecha) + ' · ' + PB.tiempoRelativo(evento.fecha) + '</small></div></li>'
          ).join('') +
        '</ul>' +
      '</div>';
  }

  /* ---------------- Modal cliente ---------------- */

  function abrirCliente(id) {
    const cliente = PB.getUsuarioPorId(id);
    if (!cliente) return;
    clienteAbierto = id;
    const pedidos = PB.pedidosDe(id);
    const pagados = pedidos.filter((p) => p.estadoPago === 'pagado' && p.estado !== 'cancelado');
    const pendientes = pedidos.filter((p) => p.estadoPago !== 'pagado' && p.estado !== 'cancelado');
    const totalPagado = pagados.reduce((suma, p) => suma + p.total, 0);
    const porCobrar = pendientes.reduce((suma, p) => suma + p.total, 0);

    $('#contenidoCliente').innerHTML =
      '<div class="modal-cabecera">' +
        '<span class="sobre">Cliente</span>' +
        '<div class="modal-titulo-fila"><h3 id="tituloCliente">' + esc(cliente.nombre) + '</h3><span class="pill pago-pagado">' + esc(cliente.usuario) + '</span></div>' +
        '<p>' + esc(cliente.correo) + ' · ' + esc(cliente.telefono) + ' · Cliente desde ' + PB.formatearDiaCorto(cliente.creadoEn) + '</p>' +
      '</div>' +
      '<div class="modal-cuerpo">' +
        '<div class="cliente-stats">' +
          '<div><span>Pedidos</span><strong>' + pedidos.length + '</strong></div>' +
          '<div><span>Total pagado</span><strong>' + PB.formatearSoles(totalPagado) + '</strong></div>' +
          '<div><span>Por cobrar</span><strong>' + PB.formatearSoles(porCobrar) + '</strong></div>' +
        '</div>' +
        '<h4 class="subtitulo-form">Historial de pedidos</h4>' +
        (pedidos.length
          ? '<div class="cliente-pedidos">' + pedidos.map((p) => {
              const estado = PB.ESTADOS[p.estado];
              const pagado = p.estadoPago === 'pagado';
              return '<div class="cliente-pedido">' +
                '<div class="cliente-pedido-info"><strong>' + esc(p.codigo) + '</strong><small>' + PB.formatearFechaHora(p.fechaPedido) + ' · recojo ' + PB.formatearHora(p.fechaRecojo) + '</small></div>' +
                '<span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Pendiente') + '</span>' +
                '<span class="pill estado-' + estado.clase + '">' + esc(estado.nombre) + '</span>' +
                '<strong>' + PB.formatearSoles(p.total) + '</strong>' +
                '<button type="button" class="btn btn-fantasma btn-mini" data-ver-pedido="' + esc(p.id) + '">Ver</button>' +
              '</div>';
            }).join('') + '</div>'
          : '<p class="tabla-vacia">Este cliente todavía no ha realizado pedidos.</p>') +
      '</div>';
    UI.abrirModal('modalCliente');
  }

  /* ---------------- Acciones ---------------- */

  function alternarPago(id) {
    const pedido = PB.pedidoPorId(id);
    if (!pedido) return;
    const pagado = pedido.estadoPago !== 'pagado';
    if (!pagado && !UI.confirmar('¿Marcar este pedido como pago pendiente?')) return;
    PB.marcarPago(id, pagado);
    UI.toast(pagado ? 'Pago verificado. El cliente ya lo verá.' : 'Pago marcado como pendiente.', pagado ? 'ok' : 'info');
    renderTodo();
    if (pedidoAbierto === id) {
      const actualizado = PB.pedidoPorId(id);
      if (actualizado) renderModalPedido(actualizado);
    }
  }

  function avanzarPedido(id, siguiente) {
    const pedido = PB.pedidoPorId(id);
    if (!pedido) return;
    const destino = siguiente || (PB.ESTADOS[pedido.estado] && PB.ESTADOS[pedido.estado].siguiente);
    if (!destino) return;
    if (destino === 'entregado' && !UI.confirmar('¿Confirmas que el cliente ya recogió el pedido?')) return;
    PB.cambiarEstado(id, destino);
    UI.toast('Pedido actualizado a: ' + PB.ESTADOS[destino].nombre + '.');
    renderTodo();
    if (pedidoAbierto === id) {
      const actualizado = PB.pedidoPorId(id);
      if (actualizado) renderModalPedido(actualizado);
    }
  }

  function cancelarPedido(id) {
    if (!UI.confirmar('¿Cancelar este pedido? Esta acción queda registrada en la trazabilidad.')) return;
    PB.cambiarEstado(id, 'cancelado');
    UI.toast('Pedido cancelado.', 'info');
    renderTodo();
    const actualizado = PB.pedidoPorId(id);
    if (actualizado && pedidoAbierto === id) renderModalPedido(actualizado);
  }

  function exportarCSV() {
    const pedidos = pedidosFiltrados();
    if (!pedidos.length) {
      UI.toast('No hay pedidos para exportar con esos filtros.', 'info');
      return;
    }
    const encabezados = ['Código', 'Cliente', 'Correo', 'Teléfono', 'Fecha del pedido', 'Hora de recojo', 'Total', 'Método de pago', 'Estado del pago', 'Estado del pedido', 'Nota', 'Detalle'];
    const filas = pedidos.map((p) => [
      p.codigo,
      p.cliente.nombre,
      p.cliente.correo,
      p.cliente.telefono,
      PB.formatearFechaHora(p.fechaPedido),
      PB.formatearFechaHora(p.fechaRecojo),
      p.total.toFixed(2),
      (PB.METODOS_PAGO[p.metodoPago] || {}).nombre || p.metodoPago,
      p.estadoPago,
      (PB.ESTADOS[p.estado] || {}).nombre || p.estado,
      p.nota || '',
      p.items.map((i) => i.cantidad + 'x ' + i.nombre + (i.opcionesTexto ? ' (' + i.opcionesTexto + ')' : '') + (i.nota ? ' [' + i.nota + ']' : '')).join(' | ')
    ]);
    const contenido = '\uFEFF' + [encabezados, ...filas]
      .map((fila) => fila.map(celdaCSV).join(';'))
      .join('\r\n');
    UI.descargarArchivo('pedidos-pelicanos-bros.csv', contenido, 'text/csv;charset=utf-8');
    UI.toast('CSV generado con ' + pedidos.length + ' pedidos.');
  }

  function celdaCSV(valor) {
    return '"' + String(valor == null ? '' : valor).replace(/"/g, '""') + '"';
  }

  function imprimirComanda(pedido) {
    const ventana = window.open('', '_blank', 'width=430,height=680');
    if (!ventana) {
      UI.toast('Permite las ventanas emergentes para imprimir la comanda.', 'error');
      return;
    }
    const metodo = PB.METODOS_PAGO[pedido.metodoPago] || PB.METODOS_PAGO.efectivo;
    const items = pedido.items.map((item) =>
      '<tr><td class="cant">' + item.cantidad + 'x</td><td>' + esc(item.nombre) +
      (item.opcionesTexto ? '<br><small>' + esc(item.opcionesTexto) + '</small>' : '') +
      (item.nota ? '<br><small>Nota: ' + esc(item.nota) + '</small>' : '') +
      '</td><td class="precio">' + PB.formatearSoles(item.precioUnitario * item.cantidad) + '</td></tr>'
    ).join('');

    ventana.document.write(
      '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><title>Comanda ' + esc(pedido.codigo) + '</title>' +
      '<style>' +
      '@page{size:80mm auto;margin:6mm}body{font-family:"Courier New",monospace;font-size:12px;color:#111;margin:0}' +
      'h1{font-size:17px;text-align:center;margin:0 0 2px;letter-spacing:1px}h2{font-size:12px;text-align:center;font-weight:normal;margin:0 0 10px}' +
      '.linea{border-top:1px dashed #555;margin:8px 0}.fila{display:flex;justify-content:space-between;gap:8px;margin:3px 0}' +
      '.codigo{font-size:20px;font-weight:bold;text-align:center;margin:8px 0}.hora{font-size:16px;font-weight:bold}' +
      'table{width:100%;border-collapse:collapse;margin:6px 0}td{padding:3px 0;vertical-align:top}.cant{width:24px;font-weight:bold}.precio{text-align:right;white-space:nowrap}' +
      'small{font-size:10px;color:#333}.total{font-size:16px;font-weight:bold;display:flex;justify-content:space-between;margin-top:6px}' +
      '.nota{border:1px dashed #555;padding:5px;margin:6px 0;font-size:11px}.pie{text-align:center;font-size:10px;margin-top:10px}' +
      '</style></head><body>' +
      '<h1>PELÍCANOS BROS</h1><h2>' + esc(PB.CONFIG.direccion) + '<br>' + esc(PB.CONFIG.telefono) + '</h2>' +
      '<div class="linea"></div>' +
      '<div class="codigo">' + esc(pedido.codigo) + '</div>' +
      '<div class="fila"><span>Pedido:</span><strong>' + PB.formatearFechaHora(pedido.fechaPedido) + '</strong></div>' +
      '<div class="fila"><span>RECOJO:</span><strong class="hora">' + PB.formatearHora(pedido.fechaRecojo) + '</strong></div>' +
      '<div class="fila"><span>Cliente:</span><strong>' + esc(pedido.cliente.nombre) + '</strong></div>' +
      '<div class="fila"><span>Teléfono:</span><strong>' + esc(pedido.cliente.telefono) + '</strong></div>' +
      '<div class="linea"></div>' +
      '<table>' + items + '</table>' +
      '<div class="total"><span>TOTAL</span><span>' + PB.formatearSoles(pedido.total) + '</span></div>' +
      '<div class="fila"><span>Pago:</span><strong>' + esc(metodo.nombre) + ' · ' + (pedido.estadoPago === 'pagado' ? 'PAGADO' : 'PENDIENTE') + '</strong></div>' +
      (pedido.nota ? '<div class="nota"><strong>Nota:</strong> ' + esc(pedido.nota) + '</div>' : '') +
      '<div class="linea"></div>' +
      '<div class="pie">Gracias por tu pedido · Pelícanos Bros<br>Hecho al carbón, hecho al momento</div>' +
      '<script>window.onload=function(){window.print();};<\/script>' +
      '</body></html>'
    );
    ventana.document.close();
    ventana.focus();
  }

  /* ---------------- Eventos ---------------- */

  function conectarEventos() {
    $('#formAdminLogin').addEventListener('submit', login);

    $('#btnRellenarDemo').addEventListener('click', () => {
      $('#adminUsuario').value = 'admin';
      $('#adminPassword').value = 'Admin2026*';
      $('#adminPassword').focus();
    });

    document.addEventListener('click', (evento) => {
      if (evento.target.closest('[data-admin-logout]')) {
        cerrarSesionAdmin();
        return;
      }
      const panel = evento.target.closest('[data-panel]');
      if (panel) {
        irAPanel(panel.dataset.panel);
        return;
      }
      const ir = evento.target.closest('[data-ir-panel]');
      if (ir) {
        irAPanel(ir.dataset.irPanel);
        return;
      }
      if (evento.target.closest('#btnRefrescar')) {
        renderTodo();
        UI.toast('Panel actualizado.', 'info');
      }
    });

    $('#proximosRecojos').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-ver-pedido]');
      if (boton) abrirPedido(boton.dataset.verPedido);
    });

    $('#ultimosPedidos').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-ver-pedido]');
      if (boton) abrirPedido(boton.dataset.verPedido);
    });

    $('#tablaPedidos').addEventListener('click', (evento) => {
      const ver = evento.target.closest('[data-ver-pedido]');
      if (ver) {
        abrirPedido(ver.dataset.verPedido);
        return;
      }
      const pagar = evento.target.closest('[data-toggle-pago]');
      if (pagar) alternarPago(pagar.dataset.togglePago);
    });

    $('#tableroCocina').addEventListener('click', (evento) => {
      const ver = evento.target.closest('[data-ver-pedido]');
      if (ver) {
        abrirPedido(ver.dataset.verPedido);
        return;
      }
      const avanzar = evento.target.closest('[data-avanzar]');
      if (avanzar) avanzarPedido(avanzar.dataset.avanzar, avanzar.dataset.siguiente);
    });

    $('#tablaClientes').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-ver-cliente]');
      if (boton) abrirCliente(boton.dataset.verCliente);
    });

    $('#contenidoPedido').addEventListener('click', (evento) => {
      const pago = evento.target.closest('[data-toggle-pago]');
      if (pago) {
        alternarPago(pago.dataset.togglePago);
        return;
      }
      if (evento.target.closest('#btnImprimirComanda')) {
        const pedido = PB.pedidoPorId(pedidoAbierto);
        if (pedido) imprimirComanda(pedido);
        return;
      }
      if (evento.target.closest('#btnCancelarPedido')) {
        cancelarPedido(pedidoAbierto);
      }
    });

    $('#contenidoPedido').addEventListener('change', (evento) => {
      if (evento.target.id !== 'selectEstadoPedido') return;
      const destino = evento.target.value;
      const pedido = PB.pedidoPorId(pedidoAbierto);
      if (!pedido) return;
      if (destino === 'cancelado') {
        if (!UI.confirmar('¿Cancelar este pedido? Quedará registrado en la trazabilidad.')) {
          renderModalPedido(pedido);
          return;
        }
      }
      PB.cambiarEstado(pedido.id, destino);
      UI.toast('Estado actualizado a: ' + PB.ESTADOS[destino].nombre + '.');
      renderTodo();
      const actualizado = PB.pedidoPorId(pedido.id);
      if (actualizado) renderModalPedido(actualizado);
    });

    $('#contenidoCliente').addEventListener('click', (evento) => {
      const ver = evento.target.closest('[data-ver-pedido]');
      if (!ver) return;
      UI.cerrarModal('modalCliente');
      abrirPedido(ver.dataset.verPedido);
    });

    $('#filtroTexto').addEventListener('input', (evento) => {
      filtros.texto = evento.target.value;
      renderTablaPedidos();
    });
    $('#filtroEstado').addEventListener('change', (evento) => {
      filtros.estado = evento.target.value;
      renderTablaPedidos();
    });
    $('#filtroPago').addEventListener('change', (evento) => {
      filtros.pago = evento.target.value;
      renderTablaPedidos();
    });
    $('#filtroFecha').addEventListener('change', (evento) => {
      filtros.fecha = evento.target.value;
      renderTablaPedidos();
    });
    $('#btnLimpiarFiltros').addEventListener('click', () => {
      filtros = { texto: '', estado: '', pago: '', fecha: '' };
      $('#filtroTexto').value = '';
      $('#filtroEstado').value = '';
      $('#filtroPago').value = '';
      $('#filtroFecha').value = '';
      renderTablaPedidos();
    });
    $('#btnExportar').addEventListener('click', exportarCSV);

    $('#filtroClientes').addEventListener('input', (evento) => {
      filtroClientes = evento.target.value;
      renderClientes();
    });

    $('#menuAdmin').addEventListener('change', (evento) => {
      const precio = evento.target.closest('[data-precio]');
      if (precio) {
        const valor = Number(precio.value);
        if (!Number.isFinite(valor) || valor < 0) {
          UI.toast('El precio debe ser un número mayor o igual a cero.', 'error');
          renderMenu();
          return;
        }
        PB.actualizarProducto(precio.dataset.precio, { precio: PB.redondear(valor) });
        UI.toast('Precio actualizado a ' + PB.formatearSoles(valor) + '.');
        return;
      }
      const disponible = evento.target.closest('[data-disponible]');
      if (disponible) {
        const producto = PB.actualizarProducto(disponible.dataset.disponible, { disponible: disponible.checked });
        UI.toast((producto ? producto.nombre : 'Producto') + (disponible.checked ? ' disponible.' : ' marcado como agotado.'), disponible.checked ? 'ok' : 'info');
        renderMenu();
      }
    });

    $('#btnRestaurarMenu').addEventListener('click', () => {
      if (!UI.confirmar('¿Restaurar precios y disponibilidad originales del menú?')) return;
      PB.restaurarProductos();
      renderMenu();
      UI.toast('Menú base restaurado.', 'ok');
    });

    window.addEventListener('storage', (evento) => {
      if (!evento.key || evento.key.indexOf('pb_') === 0) {
        admin = PB.usuarioActual('admin');
        if (!admin) {
          mostrarLogin();
          return;
        }
        if (!$('#vistaPanel').hidden) renderTodo();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && admin && !$('#vistaPanel').hidden) {
        renderTodo();
      }
    });
  }
})();
