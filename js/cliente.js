/* ============================================================
   Pelícanos Bros · Aplicación del cliente
   ============================================================ */
(function () {
  'use strict';

  let usuario = null;
  let carrito = [];
  let filtroCategoria = 'Todos';
  let productoActual = null;
  let opcionesActuales = {};
  let cantidadActual = 1;
  let checkoutPendiente = false;

  const $ = UI.$;
  const $$ = UI.$$;
  const esc = UI.escapar;

  document.addEventListener('DOMContentLoaded', iniciar);

  function iniciar() {
    PB.iniciar();
    UI.initModales();
    usuario = PB.usuarioActual('cliente');
    carrito = normalizarCarrito(PB.leerCarrito());
    conectarEventos();
    renderTodo();
    const anio = $('#anioActual');
    if (anio) anio.textContent = new Date().getFullYear();
  }

  function renderTodo() {
    renderSesion();
    renderFiltros();
    renderProductos();
    renderCarrito();
    renderHistorial();
  }

  function normalizarCarrito(guardado) {
    return (Array.isArray(guardado) ? guardado : [])
      .map((linea) => {
        const producto = PB.getProducto(linea.productoId);
        if (!producto || !producto.disponible) return null;
        const opciones = linea.opciones ? { ...linea.opciones } : null;
        return {
          ...linea,
          nombre: producto.nombre,
          imagen: producto.imagen,
          precioBase: producto.precio,
          opciones,
          opcionesTexto: opciones ? PB.resumenOpciones(opciones) : '',
          precioUnitario: PB.calcularPrecio(producto, opciones)
        };
      })
      .filter(Boolean);
  }

  function guardarCarrito() {
    PB.guardarCarrito(carrito);
  }

  function primerNombre(nombre) {
    return String(nombre || '').trim().split(/\s+/)[0] || 'cliente';
  }

  function inicial(nombre) {
    return primerNombre(nombre).charAt(0).toUpperCase();
  }

  /* ---------------- Sesión ---------------- */

  function renderSesion() {
    const zona = $('#zonaSesion');
    if (!zona) return;
    if (usuario) {
      zona.innerHTML =
        '<span class="chip-usuario">' +
          '<span class="avatar" aria-hidden="true">' + esc(inicial(usuario.nombre)) + '</span>' +
          '<span class="chip-texto"><small>Hola,</small><strong>' + esc(primerNombre(usuario.nombre)) + '</strong></span>' +
        '</span>' +
        '<button type="button" class="btn btn-fantasma btn-chico" data-logout>Salir</button>';
    } else {
      zona.innerHTML =
        '<button type="button" class="btn btn-texto btn-chico" data-abrir-auth="login">Ingresar</button>' +
        '<button type="button" class="btn btn-primario btn-chico" data-abrir-auth="registro">Crear cuenta</button>';
    }
  }

  function abrirAuth(modo, pendiente) {
    modo = modo === 'registro' ? 'registro' : 'login';
    checkoutPendiente = Boolean(pendiente);
    const login = $('#formLogin');
    const registro = $('#formRegistro');
    login.hidden = modo !== 'login';
    registro.hidden = modo !== 'registro';
    $$('[data-tab-auth]').forEach((boton) => {
      const activo = boton.dataset.tabAuth === modo;
      boton.classList.toggle('activo', activo);
      boton.setAttribute('aria-selected', activo ? 'true' : 'false');
    });
    $('#tituloAuth').textContent = modo === 'login' ? 'Ingresa a Pelícanos Bros' : 'Crea tu cuenta';
    $('#subtituloAuth').textContent = modo === 'login'
      ? 'Guarda tus pedidos y revisa tu historial cuando quieras.'
      : 'Solo necesitas unos datos. Tu historial será privado.';
    $('#errorLogin').hidden = true;
    $('#errorRegistro').hidden = true;
    UI.abrirModal('modal-auth');
  }

  function iniciarSesionCliente(usuarioAutenticado) {
    usuario = usuarioAutenticado;
    PB.iniciarSesion('cliente', usuario.id);
    UI.cerrarModal('modal-auth');
    renderSesion();
    renderHistorial();
    UI.toast('Bienvenido, ' + primerNombre(usuario.nombre) + '.');
    if (checkoutPendiente && carrito.length) {
      checkoutPendiente = false;
      abrirCheckout();
    } else {
      checkoutPendiente = false;
    }
  }

  function cerrarSesionCliente() {
    PB.cerrarSesion('cliente');
    usuario = null;
    renderSesion();
    renderHistorial();
    UI.toast('Sesión cerrada. Tu carrito sigue guardado.', 'info');
  }

  /* ---------------- Menú ---------------- */

  function renderFiltros() {
    const contenedor = $('#filtros');
    if (!contenedor) return;
    const categorias = ['Todos', ...new Set(PB.getProductos().map((p) => p.categoria))];
    contenedor.innerHTML = categorias.map((categoria) => {
      const activo = categoria === filtroCategoria;
      return '<button type="button" role="tab" aria-selected="' + activo + '" class="' +
        (activo ? 'activo' : '') + '" data-categoria="' + esc(categoria) + '">' + esc(categoria) + '</button>';
    }).join('');
  }

  function renderProductos() {
    const contenedor = $('#productos');
    if (!contenedor) return;
    const productos = PB.getProductos().filter((p) => filtroCategoria === 'Todos' || p.categoria === filtroCategoria);
    contenedor.innerHTML = productos.map(tarjetaProducto).join('');
  }

  function tarjetaProducto(producto) {
    const agotado = !producto.disponible;
    return '<article class="producto' + (agotado ? ' producto-agotado-card' : '') + '">' +
      '<div class="producto-foto">' +
        '<img src="' + esc(producto.imagen) + '" alt="' + esc(producto.nombre) + '" loading="lazy">' +
        (producto.etiqueta ? '<span class="producto-etiqueta">' + esc(producto.etiqueta) + '</span>' : '') +
        (agotado ? '<span class="producto-agotado">Agotado hoy</span>' : '') +
      '</div>' +
      '<div class="producto-cuerpo">' +
        '<div class="producto-titulo">' +
          '<h3>' + esc(producto.nombre) + '</h3>' +
          '<span class="producto-precio">' + PB.formatearSoles(producto.precio) + '</span>' +
        '</div>' +
        '<p class="producto-desc">' + esc(producto.desc) + '</p>' +
        (producto.customizable
          ? '<div class="tags">' + PB.ACOMPANANTES.map((a) => '<span>' + a.icono + ' ' + esc(a.nombre) + '</span>').join('') + '</div>'
          : '') +
        '<div class="producto-pie">' +
          '<span class="producto-nota">' + (producto.customizable ? 'Personaliza tus acompañamientos' : 'Listo para agregar') + '</span>' +
          '<button type="button" class="btn ' + (producto.customizable ? 'btn-mango' : 'btn-primario') + ' btn-chico" data-agregar="' +
            esc(producto.id) + '"' + (agotado ? ' disabled' : '') + '>' +
            (agotado ? 'Agotado' : (producto.customizable ? 'Personalizar' : 'Agregar')) +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function abrirProducto(id) {
    const producto = PB.getProducto(id);
    if (!producto) return;
    if (!producto.disponible) {
      UI.toast('Ese producto no está disponible hoy.', 'error');
      return;
    }
    productoActual = producto;
    cantidadActual = 1;
    opcionesActuales = {};
    if (producto.customizable) {
      PB.ACOMPANANTES.forEach((a) => { opcionesActuales[a.id] = 'con'; });
    }
    renderModalProducto();
    UI.abrirModal('modal-producto');
  }

  function renderModalProducto() {
    const p = productoActual;
    const opciones = p.customizable
      ? '<div class="opciones">' +
          '<h4 class="subtitulo-form">Personaliza tu plato</h4>' +
          '<p class="ayuda">El precio base ya incluye los cuatro acompañamientos.</p>' +
          PB.ACOMPANANTES.map((a) => {
            return '<div class="opcion">' +
              '<div class="opcion-info">' +
                '<span class="opcion-icono" aria-hidden="true">' + a.icono + '</span>' +
                '<div><strong>' + esc(a.nombre) + '</strong><small>Incluido en el precio base</small></div>' +
              '</div>' +
              '<div class="segmento" data-opcion="' + a.id + '" role="group" aria-label="' + esc(a.nombre) + '">' +
                '<button type="button" data-valor="con" class="activo">Con</button>' +
                '<button type="button" data-valor="sin">Sin <em>− ' + PB.formatearSoles(Math.abs(a.quitar)) + '</em></button>' +
                '<button type="button" data-valor="extra">Extra <em>+ ' + PB.formatearSoles(a.extra) + '</em></button>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>'
      : '';

    $('#contenidoProducto').innerHTML =
      '<div class="producto-modal-foto"><img src="' + esc(p.imagen) + '" alt="' + esc(p.nombre) + '"></div>' +
      '<div class="modal-cuerpo">' +
        '<div class="producto-modal-cabecera">' +
          '<div>' +
            '<span class="sobre">' + esc(p.categoria) + '</span>' +
            '<h3 id="tituloProducto">' + esc(p.nombre) + '</h3>' +
            '<p>' + esc(p.desc) + '</p>' +
          '</div>' +
          '<div class="precio-grande" id="precioModal">' + PB.formatearSoles(p.precio) + '</div>' +
        '</div>' +
        opciones +
        '<div class="desglose" id="desgloseModal"></div>' +
        '<div class="campo">' +
          '<label for="notaProducto">Nota para este producto (opcional)</label>' +
          '<textarea id="notaProducto" rows="2" maxlength="160" placeholder="Ej. sin ají, bien cocido, etc."></textarea>' +
        '</div>' +
        '<div class="cantidad-fila">' +
          '<div class="cantidad" aria-label="Cantidad">' +
            '<button type="button" data-cantidad="-1" aria-label="Quitar una unidad">−</button>' +
            '<span id="cantidadValor">1</span>' +
            '<button type="button" data-cantidad="1" aria-label="Agregar una unidad">+</button>' +
          '</div>' +
          '<button type="button" class="btn btn-primario btn-crecer" id="btnAgregarCarrito">' +
            'Agregar · <span id="totalModal">' + PB.formatearSoles(p.precio) + '</span>' +
          '</button>' +
        '</div>' +
      '</div>';

    actualizarPrecioModal();
  }

  function actualizarPrecioModal() {
    if (!productoActual) return;
    const opciones = productoActual.customizable ? opcionesActuales : null;
    const unitario = PB.calcularPrecio(productoActual, opciones);
    const total = PB.redondear(unitario * cantidadActual);
    const precio = $('#precioModal');
    const cantidad = $('#cantidadValor');
    const totalModal = $('#totalModal');
    if (precio) precio.textContent = PB.formatearSoles(unitario);
    if (cantidad) cantidad.textContent = cantidadActual;
    if (totalModal) totalModal.textContent = PB.formatearSoles(total);

    const desglose = $('#desgloseModal');
    if (desglose) {
      if (!productoActual.customizable) {
        desglose.innerHTML = '';
      } else {
        const lineas = PB.desgloseOpciones(opcionesActuales);
        desglose.innerHTML =
          '<span class="desglose-base">Base ' + PB.formatearSoles(productoActual.precio) + '</span>' +
          lineas.map((linea) =>
            '<span class="' + (linea.monto < 0 ? 'resta' : 'suma') + '">' + esc(linea.texto) + ' ' +
            PB.formatearMonto(linea.monto) + '</span>'
          ).join('') +
          '<span class="desglose-total">Unitario ' + PB.formatearSoles(unitario) + '</span>';
      }
    }
  }

  function agregarAlCarrito() {
    if (!productoActual) return;
    const opciones = productoActual.customizable ? { ...opcionesActuales } : null;
    const precioUnitario = PB.calcularPrecio(productoActual, opciones);
    const nota = ($('#notaProducto') && $('#notaProducto').value.trim()) || '';
    const linea = {
      clave: 'c-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7),
      productoId: productoActual.id,
      nombre: productoActual.nombre,
      imagen: productoActual.imagen,
      precioBase: productoActual.precio,
      cantidad: cantidadActual,
      opciones,
      opcionesTexto: opciones ? PB.resumenOpciones(opciones) : '',
      nota,
      precioUnitario
    };

    const existente = carrito.find((item) =>
      item.productoId === linea.productoId &&
      JSON.stringify(item.opciones) === JSON.stringify(linea.opciones) &&
      item.nota === linea.nota
    );

    if (existente) {
      existente.cantidad = Math.min(20, existente.cantidad + linea.cantidad);
    } else {
      carrito.push(linea);
    }

    guardarCarrito();
    renderCarrito();
    UI.cerrarModal('modal-producto');
    UI.toast(productoActual.nombre + ' agregado a tu pedido.');
  }

  /* ---------------- Carrito ---------------- */

  function renderCarrito() {
    const contenedor = $('#carrito');
    if (!contenedor) return;

    const noDisponibles = carrito.filter((linea) => {
      const producto = PB.getProducto(linea.productoId);
      return !producto || !producto.disponible;
    });
    if (noDisponibles.length) {
      carrito = carrito.filter((linea) => !noDisponibles.some((n) => n.clave === linea.clave));
      guardarCarrito();
      UI.toast('Quitamos un producto que ya no está disponible.', 'info');
    }

    carrito.forEach((linea) => {
      const producto = PB.getProducto(linea.productoId);
      if (!producto) return;
      linea.nombre = producto.nombre;
      linea.imagen = producto.imagen;
      linea.precioBase = producto.precio;
      linea.precioUnitario = PB.calcularPrecio(producto, linea.opciones);
    });

    const unidades = carrito.reduce((total, linea) => total + linea.cantidad, 0);
    const total = PB.redondear(carrito.reduce((suma, linea) => suma + linea.precioUnitario * linea.cantidad, 0));

    if (!carrito.length) {
      contenedor.innerHTML =
        '<div class="carrito-cabecera">' +
          '<div><span class="sobre">Tu pedido</span><h3>Carrito</h3></div>' +
          '<span class="contador-carrito">0</span>' +
        '</div>' +
        '<div class="carrito-vacio">' +
          '<img src="img/logo.svg" alt="" width="72" height="72">' +
          '<p>Tu carrito está vacío.</p>' +
          '<small>Agrega un pelícano para empezar. El precio se calcula automáticamente.</small>' +
        '</div>';
      return;
    }

    contenedor.innerHTML =
      '<div class="carrito-cabecera">' +
        '<div><span class="sobre">Tu pedido</span><h3>Carrito</h3></div>' +
        '<span class="contador-carrito">' + unidades + '</span>' +
      '</div>' +
      '<div class="carrito-lista">' +
        carrito.map((linea) =>
          '<div class="carrito-item">' +
            '<img class="carrito-thumb" src="' + esc(linea.imagen) + '" alt="">' +
            '<div class="carrito-item-info">' +
              '<div class="carrito-item-top">' +
                '<strong>' + esc(linea.nombre) + '</strong>' +
                '<button type="button" class="quitar" data-quitar="' + esc(linea.clave) + '" aria-label="Quitar ' + esc(linea.nombre) + '">✕</button>' +
              '</div>' +
              '<small class="carrito-opciones">' + esc(linea.opcionesTexto || 'Sin personalización') + '</small>' +
              (linea.nota ? '<small class="nota-item">📝 ' + esc(linea.nota) + '</small>' : '') +
              '<div class="carrito-item-pie">' +
                '<div class="cantidad cantidad-chica" aria-label="Cantidad">' +
                  '<button type="button" data-cantidad-linea="-1" data-clave="' + esc(linea.clave) + '" aria-label="Quitar una unidad">−</button>' +
                  '<span>' + linea.cantidad + '</span>' +
                  '<button type="button" data-cantidad-linea="1" data-clave="' + esc(linea.clave) + '" aria-label="Agregar una unidad">+</button>' +
                '</div>' +
                '<span class="linea-total">' + PB.formatearSoles(linea.precioUnitario * linea.cantidad) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>'
        ).join('') +
      '</div>' +
      '<div class="carrito-totales">' +
        '<div class="total-linea"><span>Subtotal (' + unidades + (unidades === 1 ? ' ítem' : ' ítems') + ')</span><span>' + PB.formatearSoles(total) + '</span></div>' +
        '<div class="total-linea grande"><span>Total</span><span>' + PB.formatearSoles(total) + '</span></div>' +
      '</div>' +
      '<button type="button" class="btn btn-primario btn-bloque btn-grande" id="btnCheckout">Continuar pedido <span aria-hidden="true">→</span></button>' +
      '<p class="carrito-nota">🛍️ Solo recojo en tienda · Paga al recoger o por Yape/Plin.</p>';
  }

  function cambiarCantidad(clave, delta) {
    const linea = carrito.find((item) => item.clave === clave);
    if (!linea) return;
    linea.cantidad = Math.max(1, Math.min(20, linea.cantidad + delta));
    guardarCarrito();
    renderCarrito();
  }

  function quitarLinea(clave) {
    carrito = carrito.filter((item) => item.clave !== clave);
    guardarCarrito();
    renderCarrito();
    UI.toast('Producto quitado del carrito.', 'info');
  }

  /* ---------------- Checkout ---------------- */

  function abrirCheckout() {
    if (!carrito.length) {
      UI.toast('Agrega al menos un producto antes de continuar.', 'error');
      return;
    }
    if (!usuario) {
      abrirAuth('login', true);
      return;
    }
    renderCheckout();
    UI.abrirModal('modal-checkout');
  }

  function renderCheckout() {
    if (!usuario) return;
    const total = PB.redondear(carrito.reduce((suma, linea) => suma + linea.precioUnitario * linea.cantidad, 0));
    $('#checkoutNombre').value = usuario.nombre;
    $('#checkoutTelefono').value = usuario.telefono || '';
    const recojo = $('#checkoutRecojo');
    recojo.min = PB.fechaMinimaRecojo();
    if (!recojo.value || new Date(recojo.value) < new Date(Date.now() + 10 * 60000)) {
      recojo.value = PB.fechaMinimaRecojo();
    }
    $('#errorCheckout').hidden = true;

    $('#resumenCheckout').innerHTML =
      '<h4 class="subtitulo-form">Resumen</h4>' +
      '<div class="resumen-lista">' +
        carrito.map((linea) =>
          '<div class="resumen-item">' +
            '<img src="' + esc(linea.imagen) + '" alt="">' +
            '<div class="resumen-item-texto">' +
              '<strong>' + linea.cantidad + '× ' + esc(linea.nombre) + '</strong>' +
              '<small>' + esc(linea.opcionesTexto || 'Sin personalización') + '</small>' +
            '</div>' +
            '<span>' + PB.formatearSoles(linea.precioUnitario * linea.cantidad) + '</span>' +
          '</div>'
        ).join('') +
      '</div>' +
      '<div class="resumen-total"><span>Total</span><strong>' + PB.formatearSoles(total) + '</strong></div>' +
      '<p class="resumen-nota">📍 ' + esc(PB.CONFIG.direccion) + '<br>🕐 ' + esc(PB.CONFIG.horario) + '</p>';
  }

  function confirmarPedido(evento) {
    evento.preventDefault();
    if (!usuario) {
      abrirAuth('login', true);
      return;
    }

    const telefono = $('#checkoutTelefono').value.trim();
    const valorRecojo = $('#checkoutRecojo').value;
    const metodo = (document.querySelector('input[name="metodoPago"]:checked') || {}).value || 'efectivo';
    const nota = $('#checkoutNota').value.trim();
    const error = $('#errorCheckout');

    const mostrarError = (mensaje) => {
      error.textContent = mensaje;
      error.hidden = false;
      error.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    if (telefono.replace(/\D/g, '').length < 6) {
      mostrarError('Escribe un teléfono de contacto válido.');
      return;
    }
    if (!valorRecojo) {
      mostrarError('Elige la fecha y hora en que vas a recoger tu pedido.');
      return;
    }
    const fechaRecojo = new Date(valorRecojo);
    if (Number.isNaN(fechaRecojo.getTime())) {
      mostrarError('La fecha de recojo no es válida.');
      return;
    }
    if (fechaRecojo.getTime() < Date.now() + 10 * 60000) {
      mostrarError('Elige una hora de recojo con al menos 10 minutos de anticipación.');
      return;
    }
    if (!PB.METODOS_PAGO[metodo]) {
      mostrarError('Selecciona una forma de pago.');
      return;
    }

    usuario = PB.actualizarTelefono(usuario.id, telefono) || usuario;

    const pedido = PB.crearPedido({
      usuarioId: usuario.id,
      cliente: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono
      },
      items: carrito.map((linea) => ({
        productoId: linea.productoId,
        nombre: linea.nombre,
        imagen: linea.imagen,
        cantidad: linea.cantidad,
        precioBase: linea.precioBase,
        precioUnitario: linea.precioUnitario,
        opciones: linea.opciones,
        opcionesTexto: linea.opcionesTexto,
        nota: linea.nota
      })),
      metodoPago: metodo,
      fechaRecojo: fechaRecojo.toISOString(),
      nota
    });

    carrito = [];
    PB.limpiarCarrito();
    renderCarrito();
    renderHistorial();
    UI.cerrarModal('modal-checkout');
    mostrarExito(pedido);
    UI.toast('Pedido ' + pedido.codigo + ' registrado correctamente.');
  }

  function mostrarExito(pedido) {
    const metodo = PB.METODOS_PAGO[pedido.metodoPago] || PB.METODOS_PAGO.efectivo;
    $('#contenidoExito').innerHTML =
      '<div class="exito">' +
        '<div class="exito-icono" aria-hidden="true">✅</div>' +
        '<span class="sobre">Pedido confirmado</span>' +
        '<h3 id="tituloExito">¡Listo, ' + esc(primerNombre(usuario ? usuario.nombre : pedido.cliente.nombre)) + '!</h3>' +
        '<p>Tu pedido quedó registrado. Preséntate en tienda con este código a la hora de recojo.</p>' +
        '<div class="exito-codigo">' + esc(pedido.codigo) + '</div>' +
        '<div class="exito-datos">' +
          '<div><small>Recojo</small><strong>' + PB.formatearFechaHora(pedido.fechaRecojo) + '</strong></div>' +
          '<div><small>Total</small><strong>' + PB.formatearSoles(pedido.total) + '</strong></div>' +
          '<div><small>Pago</small><strong>' + metodo.icono + ' ' + esc(metodo.nombre) + '</strong></div>' +
          '<div><small>Estado</small><strong>Pedido recibido</strong></div>' +
        '</div>' +
        '<p class="exito-nota">El administrador verificará tu pago. Puedes seguir el estado en “Mis pedidos”.</p>' +
        '<div class="exito-acciones">' +
          '<button type="button" class="btn btn-primario" data-ver-historial>Ver mis pedidos</button>' +
          '<button type="button" class="btn btn-fantasma" data-seguir-comprando>Seguir comprando</button>' +
        '</div>' +
      '</div>';
    UI.abrirModal('modal-exito');
  }

  /* ---------------- Historial del cliente ---------------- */

  function renderHistorial() {
    const contenedor = $('#historialContenido');
    if (!contenedor) return;

    if (!usuario) {
      contenedor.innerHTML =
        '<div class="historial-vacio">' +
          '<div class="vacio-icono" aria-hidden="true">🔐</div>' +
          '<h3>Ingresa para ver tus pedidos</h3>' +
          '<p>Cada cliente tiene su propio historial. Crea una cuenta o inicia sesión para ver qué compraste, cuánto pagaste y a qué hora recoges.</p>' +
          '<div class="vacio-acciones">' +
            '<button type="button" class="btn btn-primario" data-abrir-auth="login">Ingresar</button>' +
            '<button type="button" class="btn btn-fantasma" data-abrir-auth="registro">Crear cuenta</button>' +
          '</div>' +
        '</div>';
      return;
    }

    const pedidos = PB.pedidosDe(usuario.id);
    if (!pedidos.length) {
      contenedor.innerHTML =
        '<div class="historial-vacio">' +
          '<div class="vacio-icono" aria-hidden="true">🍗</div>' +
          '<h3>Aún no tienes pedidos, ' + esc(primerNombre(usuario.nombre)) + '</h3>' +
          '<p>Cuando hagas tu primer pedido aparecerá aquí con su código, hora de recojo y estado de pago.</p>' +
          '<button type="button" class="btn btn-primario" data-ir-menu>Armar mi primer pedido</button>' +
        '</div>';
      return;
    }

    const totalGastado = pedidos
      .filter((p) => p.estado !== 'cancelado')
      .reduce((suma, p) => suma + p.total, 0);
    const activos = pedidos.filter((p) => p.estado !== 'entregado' && p.estado !== 'cancelado').length;

    contenedor.innerHTML =
      '<div class="historial-resumen">' +
        '<div><span>Pedidos</span><strong>' + pedidos.length + '</strong></div>' +
        '<div><span>Total histórico</span><strong>' + PB.formatearSoles(totalGastado) + '</strong></div>' +
        '<div><span>En curso</span><strong>' + activos + '</strong></div>' +
        '<div><span>Cliente desde</span><strong>' + PB.formatearDiaCorto(usuario.creadoEn) + '</strong></div>' +
      '</div>' +
      '<div class="pedidos-lista">' + pedidos.map(tarjetaPedido).join('') + '</div>';
  }

  function tarjetaPedido(pedido) {
    const estado = PB.ESTADOS[pedido.estado] || PB.ESTADOS.pendiente;
    const metodo = PB.METODOS_PAGO[pedido.metodoPago] || PB.METODOS_PAGO.efectivo;
    const pagado = pedido.estadoPago === 'pagado';
    const ultimoEvento = (pedido.eventos && pedido.eventos.length)
      ? pedido.eventos[pedido.eventos.length - 1]
      : null;

    return '<article class="pedido-card">' +
      '<header class="pedido-cabecera">' +
        '<div class="pedido-codigo">' +
          '<span class="codigo">' + esc(pedido.codigo) + '</span>' +
          '<span class="pill estado-' + estado.clase + '">' + estado.icono + ' ' + esc(estado.nombre) + '</span>' +
          '<span class="pill ' + (pagado ? 'pago-pagado' : 'pago-pendiente') + '">' + (pagado ? 'Pagado' : 'Pago pendiente') + '</span>' +
        '</div>' +
        '<strong class="pedido-total">' + PB.formatearSoles(pedido.total) + '</strong>' +
      '</header>' +
      '<div class="pedido-meta">' +
        '<span>🕐 Pedido: ' + PB.formatearFechaHora(pedido.fechaPedido) + '</span>' +
        '<span>🛍️ Recojo: <b>' + PB.formatearFechaHora(pedido.fechaRecojo) + '</b></span>' +
        '<span>' + metodo.icono + ' ' + esc(metodo.nombre) + '</span>' +
      '</div>' +
      '<ul class="pedido-items">' +
        pedido.items.map((item) =>
          '<li>' +
            '<img src="' + esc(item.imagen) + '" alt="">' +
            '<div>' +
              '<strong>' + item.cantidad + '× ' + esc(item.nombre) + '</strong>' +
              (item.opcionesTexto ? '<small>' + esc(item.opcionesTexto) + '</small>' : '') +
              (item.nota ? '<small class="nota-item">📝 ' + esc(item.nota) + '</small>' : '') +
            '</div>' +
            '<span>' + PB.formatearSoles(item.precioUnitario * item.cantidad) + '</span>' +
          '</li>'
        ).join('') +
      '</ul>' +
      (pedido.nota ? '<p class="pedido-nota">📝 ' + esc(pedido.nota) + '</p>' : '') +
      '<footer class="pedido-pie">' +
        '<span>' + (ultimoEvento ? esc(ultimoEvento.detalle) + ' · ' + PB.tiempoRelativo(ultimoEvento.fecha) : 'Pedido registrado') + '</span>' +
        '<span class="pedido-recoger">' + (pedido.estado === 'listo' ? '✅ ¡Ya puedes recogerlo!' : (pedido.estado === 'entregado' ? 'Entregado' : 'Te avisaremos cuando esté listo')) + '</span>' +
      '</footer>' +
    '</article>';
  }

  /* ---------------- Eventos ---------------- */

  function conectarEventos() {
    $('#zonaSesion').addEventListener('click', (evento) => {
      const auth = evento.target.closest('[data-abrir-auth]');
      if (auth) {
        abrirAuth(auth.dataset.abrirAuth, false);
        return;
      }
      if (evento.target.closest('[data-logout]')) cerrarSesionCliente();
    });

    $('#filtros').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-categoria]');
      if (!boton) return;
      filtroCategoria = boton.dataset.categoria;
      renderFiltros();
      renderProductos();
    });

    $('#productos').addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-agregar]');
      if (boton) abrirProducto(boton.dataset.agregar);
    });

    $('#contenidoProducto').addEventListener('click', (evento) => {
      const valor = evento.target.closest('[data-valor]');
      if (valor) {
        const grupo = valor.closest('[data-opcion]');
        if (grupo) {
          opcionesActuales[grupo.dataset.opcion] = valor.dataset.valor;
          grupo.querySelectorAll('button').forEach((boton) => {
            boton.classList.toggle('activo', boton === valor);
          });
          actualizarPrecioModal();
        }
        return;
      }

      const cantidad = evento.target.closest('[data-cantidad]');
      if (cantidad) {
        cantidadActual = Math.max(1, Math.min(20, cantidadActual + Number(cantidad.dataset.cantidad)));
        actualizarPrecioModal();
        return;
      }

      if (evento.target.closest('#btnAgregarCarrito')) agregarAlCarrito();
    });

    $('#carrito').addEventListener('click', (evento) => {
      const quitar = evento.target.closest('[data-quitar]');
      if (quitar) {
        quitarLinea(quitar.dataset.quitar);
        return;
      }
      const cantidad = evento.target.closest('[data-cantidad-linea]');
      if (cantidad) {
        cambiarCantidad(cantidad.dataset.clave, Number(cantidad.dataset.cantidadLinea));
        return;
      }
      if (evento.target.closest('#btnCheckout')) abrirCheckout();
    });

    $('#contenidoExito').addEventListener('click', (evento) => {
      if (evento.target.closest('[data-ver-historial]')) {
        UI.cerrarModal('modal-exito');
        irA('historial');
        return;
      }
      if (evento.target.closest('[data-seguir-comprando]')) {
        UI.cerrarModal('modal-exito');
        irA('menu');
      }
    });

    $('#historialContenido').addEventListener('click', (evento) => {
      const auth = evento.target.closest('[data-abrir-auth]');
      if (auth) {
        abrirAuth(auth.dataset.abrirAuth, false);
        return;
      }
      if (evento.target.closest('[data-ir-menu]')) irA('menu');
    });

    $$('[data-tab-auth]').forEach((boton) => {
      boton.addEventListener('click', () => {
        const modo = boton.dataset.tabAuth;
        $('#formLogin').hidden = modo !== 'login';
        $('#formRegistro').hidden = modo !== 'registro';
        $$('[data-tab-auth]').forEach((b) => {
          b.classList.toggle('activo', b === boton);
          b.setAttribute('aria-selected', b === boton ? 'true' : 'false');
        });
        $('#errorLogin').hidden = true;
        $('#errorRegistro').hidden = true;
      });
    });

    $('#formLogin').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const identificador = $('#loginIdentificador').value.trim();
      const password = $('#loginPassword').value;
      const error = $('#errorLogin');
      const resultado = PB.autenticar(identificador, password, 'cliente');
      if (!resultado.ok) {
        error.textContent = resultado.error;
        error.hidden = false;
        return;
      }
      $('#formLogin').reset();
      iniciarSesionCliente(resultado.usuario);
    });

    $('#formRegistro').addEventListener('submit', (evento) => {
      evento.preventDefault();
      const error = $('#errorRegistro');
      const password = $('#registroPassword').value;
      const password2 = $('#registroPassword2').value;
      if (password !== password2) {
        error.textContent = 'Las contraseñas no coinciden.';
        error.hidden = false;
        return;
      }
      const resultado = PB.registrar({
        nombre: $('#registroNombre').value,
        correo: $('#registroCorreo').value,
        telefono: $('#registroTelefono').value,
        password
      });
      if (!resultado.ok) {
        error.textContent = resultado.error;
        error.hidden = false;
        return;
      }
      $('#formRegistro').reset();
      iniciarSesionCliente(resultado.usuario);
    });

    $('#formCheckout').addEventListener('submit', confirmarPedido);

    $('#btnActualizarHistorial').addEventListener('click', () => {
      usuario = PB.usuarioActual('cliente');
      renderSesion();
      renderHistorial();
      UI.toast('Historial actualizado.', 'info');
    });

    window.addEventListener('storage', (evento) => {
      if (!evento.key || evento.key.indexOf('pb_') === 0) {
        usuario = PB.usuarioActual('cliente');
        renderSesion();
        renderFiltros();
        renderProductos();
        renderCarrito();
        renderHistorial();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        usuario = PB.usuarioActual('cliente');
        renderSesion();
        renderHistorial();
      }
    });
  }

  function irA(id) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();
