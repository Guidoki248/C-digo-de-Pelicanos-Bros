/* ============================================================
   Pelícanos Bros · Capa de datos (demo con localStorage)
   Proyecto: Del caos manual a la claridad digital
   ============================================================ */
(function (global) {
  'use strict';

  const VERSION = '1.0.0';

  const CLAVES = {
    usuarios: 'pb_usuarios_v1',
    pedidos: 'pb_pedidos_v1',
    productos: 'pb_productos_v1',
    sesionCliente: 'pb_sesion_cliente_v1',
    sesionAdmin: 'pb_sesion_admin_v1',
    contador: 'pb_contador_v1',
    carrito: 'pb_carrito_v1'
  };

  const CONFIG = {
    negocio: 'Pelícanos Bros',
    lema: 'Pollo al carbón · Moquegua, Perú',
    direccion: 'Av. Balta 245, Moquegua',
    telefono: '+51 953 123 456',
    whatsapp: '51953123456',
    correo: 'hola@pelicanosbros.pe',
    horario: 'Lun a Sáb · 11:00 a 22:00',
    moneda: 'PEN'
  };

  /* Cada acompañante viene incluido en el precio base.
     "sin" descuenta y "extra" suma. */
  const ACOMPANANTES = [
    { id: 'arroz', nombre: 'Arroz', icono: '🍚', quitar: -2, extra: 2 },
    { id: 'papa', nombre: 'Papa frita', icono: '🍟', quitar: -2, extra: 2 },
    { id: 'ensalada', nombre: 'Ensalada', icono: '🥗', quitar: -2, extra: 2 },
    { id: 'cremas', nombre: 'Cremas de la casa', icono: '🥣', quitar: -1, extra: 1 }
  ];

  const PRODUCTOS_BASE = [
    {
      id: 'pollo',
      nombre: 'Pelícano de Pollo',
      categoria: 'Pelicanos',
      precio: 14,
      imagen: 'img/platos/pollo.jpg',
      desc: 'Cuarto de pollo dorado al carbón con arroz, papa frita, ensalada fresca y cremas de la casa.',
      customizable: true,
      disponible: true,
      etiqueta: 'El clásico'
    },
    {
      id: 'carne',
      nombre: 'Pelícano de Carne',
      categoria: 'Pelicanos',
      precio: 16,
      imagen: 'img/platos/carne.jpg',
      desc: 'Carne de res salteada al wok, acompañada de arroz, papa frita, ensalada y cremas.',
      customizable: true,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'mixto',
      nombre: 'Pelícano Mixto',
      categoria: 'Pelicanos',
      precio: 18,
      imagen: 'img/platos/mixto.jpg',
      desc: 'Lo mejor de dos mundos: pollo dorado y carne de res con todos los acompañamientos.',
      customizable: true,
      disponible: true,
      etiqueta: 'Más pedido'
    },
    {
      id: 'chicha',
      nombre: 'Chicha Morada 1 L',
      categoria: 'Bebidas',
      precio: 6,
      imagen: 'img/platos/chicha.jpg',
      desc: 'Chicha morada artesanal preparada con maíz morado, piña y especias.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'incakola',
      nombre: 'Inca Kola 500 ml',
      categoria: 'Bebidas',
      precio: 4,
      imagen: 'img/platos/incakola.jpg',
      desc: 'La bebida de sabor nacional, bien helada.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'agua',
      nombre: 'Agua Mineral 625 ml',
      categoria: 'Bebidas',
      precio: 2.5,
      imagen: 'img/platos/agua.jpg',
      desc: 'Agua mineral sin gas para acompañar tu pedido.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'extra-papa',
      nombre: 'Porción extra de papa',
      categoria: 'Extras',
      precio: 3,
      imagen: 'img/platos/papas.jpg',
      desc: 'Papas fritas caseras, doradas y crocantes.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'extra-crema',
      nombre: 'Crema extra',
      categoria: 'Extras',
      precio: 1,
      imagen: 'img/platos/cremas.jpg',
      desc: 'Porción adicional de las cremas de la casa.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    },
    {
      id: 'extra-ensalada',
      nombre: 'Ensalada extra',
      categoria: 'Extras',
      precio: 2,
      imagen: 'img/platos/ensalada.jpg',
      desc: 'Ensalada fresca de lechuga, tomate y pepino.',
      customizable: false,
      disponible: true,
      etiqueta: ''
    }
  ];

  const ESTADOS = {
    pendiente: { nombre: 'Pedido recibido', clase: 'pendiente', icono: '🕐', siguiente: 'en_preparacion' },
    en_preparacion: { nombre: 'En preparación', clase: 'preparando', icono: '🔥', siguiente: 'listo' },
    listo: { nombre: 'Listo para recoger', clase: 'listo', icono: '✅', siguiente: 'entregado' },
    entregado: { nombre: 'Entregado', clase: 'entregado', icono: '🎉', siguiente: null },
    cancelado: { nombre: 'Cancelado', clase: 'cancelado', icono: '✖', siguiente: null }
  };

  const METODOS_PAGO = {
    efectivo: { nombre: 'Efectivo al recoger', icono: '💵', detalle: 'Pagas cuando recojas tu pedido.' },
    yape: { nombre: 'Yape', icono: '📱', detalle: 'El administrador verifica tu pago.' },
    plin: { nombre: 'Plin', icono: '📲', detalle: 'El administrador verifica tu pago.' },
    transferencia: { nombre: 'Transferencia', icono: '🏦', detalle: 'El administrador verifica tu pago.' }
  };

  const SALT = 'pelicanos-bros-2026::';

  /* Hash demostrativo. No reemplaza a bcrypt/Argon2 en producción. */
  function hashPassword(texto) {
    let h1 = 0x811c9dc5;
    let h2 = 0x1000193;
    const cadena = SALT + String(texto);
    for (let vuelta = 0; vuelta < 600; vuelta++) {
      for (let i = 0; i < cadena.length; i++) {
        const c = cadena.charCodeAt(i) + vuelta;
        h1 ^= c;
        h1 = Math.imul(h1, 0x01000193) >>> 0;
        h2 = (h2 + Math.imul(c, 0x85ebca6b)) >>> 0;
        h2 ^= h2 >>> 13;
      }
    }
    return (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).toUpperCase();
  }

  function leer(clave, defecto) {
    try {
      const crudo = localStorage.getItem(clave);
      return crudo ? JSON.parse(crudo) : defecto;
    } catch (error) {
      console.warn('No se pudo leer', clave, error);
      return defecto;
    }
  }

  function escribir(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('No se pudo guardar', clave, error);
      return false;
    }
  }

  function idAleatorio(prefijo) {
    return prefijo + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  }

  function redondear(n) {
    return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  }

  /* ---------------- Semillas ---------------- */

  function sembrarUsuarios() {
    if (localStorage.getItem(CLAVES.usuarios)) return;
    const ahora = new Date().toISOString();
    const usuarios = [
      {
        id: 'u-admin',
        nombre: 'Administrador Pelícanos',
        usuario: 'admin',
        correo: 'admin@pelicanosbros.pe',
        telefono: '953 123 456',
        passwordHash: hashPassword('Admin2026*'),
        rol: 'admin',
        creadoEn: ahora
      },
      {
        id: 'u-maria',
        nombre: 'María Quispe',
        usuario: 'maria',
        correo: 'maria@demo.pe',
        telefono: '987 654 321',
        passwordHash: hashPassword('Cliente2026*'),
        rol: 'cliente',
        creadoEn: ahora
      },
      {
        id: 'u-juan',
        nombre: 'Juan Mamani',
        usuario: 'juan',
        correo: 'juan@demo.pe',
        telefono: '912 345 678',
        passwordHash: hashPassword('Cliente2026*'),
        rol: 'cliente',
        creadoEn: ahora
      }
    ];
    escribir(CLAVES.usuarios, usuarios);
  }

  function sembrarProductos() {
    if (!localStorage.getItem(CLAVES.productos)) {
      escribir(CLAVES.productos, PRODUCTOS_BASE);
      return;
    }
    // Migración suave: conserva precios/disponibilidad editados y agrega campos nuevos.
    const guardados = leer(CLAVES.productos, []);
    const mapa = new Map(guardados.map((p) => [p.id, p]));
    const fusionados = PRODUCTOS_BASE.map((base) => ({ ...base, ...(mapa.get(base.id) || {}) }));
    escribir(CLAVES.productos, fusionados);
  }

  function itemSemilla(productoId, cantidad, opciones, nota) {
    const producto = PRODUCTOS_BASE.find((p) => p.id === productoId);
    const precioUnitario = calcularPrecio(producto, opciones);
    return {
      productoId,
      nombre: producto.nombre,
      imagen: producto.imagen,
      cantidad,
      precioBase: producto.precio,
      precioUnitario,
      opciones: opciones ? { ...opciones } : null,
      opcionesTexto: opciones ? resumenOpciones(opciones) : '',
      nota: nota || ''
    };
  }

  function totalItems(items) {
    return redondear(items.reduce((total, item) => total + item.precioUnitario * item.cantidad, 0));
  }

  function sembrarPedidos() {
    if (localStorage.getItem(CLAVES.pedidos)) return;

    const ahora = new Date();
    const haceMinutos = (m) => new Date(ahora.getTime() - m * 60000).toISOString();
    const enMinutos = (m) => new Date(ahora.getTime() + m * 60000).toISOString();
    const ayer = (h, min) => {
      const d = new Date(ahora);
      d.setDate(d.getDate() - 1);
      d.setHours(h, min, 0, 0);
      return d.toISOString();
    };

    const pedidos = [];

    const pedido4 = {
      id: 'p-semilla-4',
      codigo: 'PB-0004',
      usuarioId: 'u-maria',
      cliente: { nombre: 'María Quispe', correo: 'maria@demo.pe', telefono: '987 654 321' },
      items: [
        itemSemilla('pollo', 2, { arroz: 'sin', papa: 'con', ensalada: 'con', cremas: 'con' }),
        itemSemilla('chicha', 1, null)
      ],
      metodoPago: 'yape',
      estadoPago: 'pendiente',
      estado: 'pendiente',
      fechaPedido: haceMinutos(15),
      fechaRecojo: enMinutos(55),
      nota: 'Llegaré a las 12:30, por favor tener listo.',
      creadoEn: haceMinutos(15),
      actualizadoEn: haceMinutos(15),
      eventos: [{ fecha: haceMinutos(15), tipo: 'creado', detalle: 'Pedido registrado por la clienta.' }]
    };
    pedido4.total = totalItems(pedido4.items);

    const pedido3 = {
      id: 'p-semilla-3',
      codigo: 'PB-0003',
      usuarioId: 'u-juan',
      cliente: { nombre: 'Juan Mamani', correo: 'juan@demo.pe', telefono: '912 345 678' },
      items: [
        itemSemilla('mixto', 1, { arroz: 'con', papa: 'extra', ensalada: 'con', cremas: 'con' }),
        itemSemilla('incakola', 1, null)
      ],
      metodoPago: 'efectivo',
      estadoPago: 'pendiente',
      estado: 'en_preparacion',
      fechaPedido: haceMinutos(40),
      fechaRecojo: enMinutos(35),
      nota: '',
      creadoEn: haceMinutos(40),
      actualizadoEn: haceMinutos(10),
      eventos: [
        { fecha: haceMinutos(40), tipo: 'creado', detalle: 'Pedido registrado por el cliente.' },
        { fecha: haceMinutos(10), tipo: 'estado', detalle: 'Cocina inició la preparación.' }
      ]
    };
    pedido3.total = totalItems(pedido3.items);

    const pedido2 = {
      id: 'p-semilla-2',
      codigo: 'PB-0002',
      usuarioId: 'u-juan',
      cliente: { nombre: 'Juan Mamani', correo: 'juan@demo.pe', telefono: '912 345 678' },
      items: [
        itemSemilla('pollo', 2, { arroz: 'con', papa: 'con', ensalada: 'sin', cremas: 'con' }),
        itemSemilla('chicha', 1, null)
      ],
      metodoPago: 'yape',
      estadoPago: 'pagado',
      estado: 'entregado',
      fechaPedido: ayer(19, 20),
      fechaRecojo: ayer(19, 50),
      nota: 'Sin ensalada por favor.',
      creadoEn: ayer(19, 20),
      actualizadoEn: ayer(19, 52),
      pagadoEn: ayer(19, 25),
      eventos: [
        { fecha: ayer(19, 20), tipo: 'creado', detalle: 'Pedido registrado por el cliente.' },
        { fecha: ayer(19, 25), tipo: 'pago', detalle: 'Pago por Yape verificado.' },
        { fecha: ayer(19, 30), tipo: 'estado', detalle: 'Pedido listo para recoger.' },
        { fecha: ayer(19, 52), tipo: 'estado', detalle: 'Pedido entregado al cliente.' }
      ]
    };
    pedido2.total = totalItems(pedido2.items);

    const pedido1 = {
      id: 'p-semilla-1',
      codigo: 'PB-0001',
      usuarioId: 'u-maria',
      cliente: { nombre: 'María Quispe', correo: 'maria@demo.pe', telefono: '987 654 321' },
      items: [
        itemSemilla('pollo', 1, { arroz: 'con', papa: 'con', ensalada: 'con', cremas: 'con' }),
        itemSemilla('agua', 1, null)
      ],
      metodoPago: 'efectivo',
      estadoPago: 'pagado',
      estado: 'entregado',
      fechaPedido: ayer(13, 10),
      fechaRecojo: ayer(13, 40),
      nota: '',
      creadoEn: ayer(13, 10),
      actualizadoEn: ayer(13, 42),
      pagadoEn: ayer(13, 40),
      eventos: [
        { fecha: ayer(13, 10), tipo: 'creado', detalle: 'Pedido registrado por la clienta.' },
        { fecha: ayer(13, 40), tipo: 'pago', detalle: 'Pago en efectivo recibido.' },
        { fecha: ayer(13, 42), tipo: 'estado', detalle: 'Pedido entregado al cliente.' }
      ]
    };
    pedido1.total = totalItems(pedido1.items);

    pedidos.push(pedido4, pedido3, pedido2, pedido1);
    escribir(CLAVES.pedidos, pedidos);
    localStorage.setItem(CLAVES.contador, '4');
  }

  function iniciar() {
    sembrarUsuarios();
    sembrarProductos();
    sembrarPedidos();
    if (!localStorage.getItem(CLAVES.contador)) {
      const maximo = getPedidos().reduce((max, p) => {
        const n = parseInt(String(p.codigo || '').replace(/\D/g, ''), 10) || 0;
        return Math.max(max, n);
      }, 0);
      localStorage.setItem(CLAVES.contador, String(maximo));
    }
  }

  /* ---------------- Usuarios ---------------- */

  function getUsuarios() {
    return leer(CLAVES.usuarios, []);
  }

  function guardarUsuarios(usuarios) {
    escribir(CLAVES.usuarios, usuarios);
  }

  function normalizar(texto) {
    return String(texto || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function generarUsuario(correo) {
    const base = normalizar(String(correo).split('@')[0]).replace(/[^a-z0-9]/g, '') || 'cliente';
    const usuarios = getUsuarios();
    let candidato = base;
    let n = 2;
    while (usuarios.some((u) => normalizar(u.usuario) === candidato)) {
      candidato = base + n;
      n++;
    }
    return candidato;
  }

  function registrar(datos) {
    const nombre = String(datos.nombre || '').trim();
    const correo = String(datos.correo || '').trim().toLowerCase();
    const telefono = String(datos.telefono || '').trim();
    const password = String(datos.password || '');

    if (nombre.length < 3) return { ok: false, error: 'Escribe tu nombre completo.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return { ok: false, error: 'El correo no tiene un formato válido.' };
    if (telefono.replace(/\D/g, '').length < 6) return { ok: false, error: 'Escribe un teléfono de contacto válido.' };
    if (password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };

    const usuarios = getUsuarios();
    if (usuarios.some((u) => normalizar(u.correo) === normalizar(correo))) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }

    const usuario = {
      id: idAleatorio('u-'),
      nombre,
      usuario: generarUsuario(correo),
      correo,
      telefono,
      passwordHash: hashPassword(password),
      rol: 'cliente',
      creadoEn: new Date().toISOString()
    };
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    return { ok: true, usuario };
  }

  function autenticar(identificador, password, rolRequerido) {
    const texto = normalizar(identificador);
    const usuarios = getUsuarios();
    const usuario = usuarios.find((u) => normalizar(u.correo) === texto || normalizar(u.usuario) === texto);
    if (!usuario || usuario.passwordHash !== hashPassword(password)) {
      return { ok: false, error: 'Correo/usuario o contraseña incorrectos.' };
    }
    if (rolRequerido && usuario.rol !== rolRequerido) {
      return {
        ok: false,
        error: rolRequerido === 'admin'
          ? 'Esta cuenta no tiene permisos de administrador.'
          : 'Esta cuenta es de administrador. Ingresa desde el panel de administración.'
      };
    }
    return { ok: true, usuario };
  }

  function iniciarSesion(tipo, usuarioId) {
    localStorage.setItem(tipo === 'admin' ? CLAVES.sesionAdmin : CLAVES.sesionCliente, usuarioId);
  }

  function cerrarSesion(tipo) {
    localStorage.removeItem(tipo === 'admin' ? CLAVES.sesionAdmin : CLAVES.sesionCliente);
  }

  function usuarioActual(tipo) {
    const clave = tipo === 'admin' ? CLAVES.sesionAdmin : CLAVES.sesionCliente;
    const id = localStorage.getItem(clave);
    if (!id) return null;
    const usuario = getUsuarios().find((u) => u.id === id);
    if (!usuario) return null;
    if (tipo === 'admin' && usuario.rol !== 'admin') return null;
    return usuario;
  }

  function actualizarTelefono(usuarioId, telefono) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find((u) => u.id === usuarioId);
    if (!usuario) return null;
    usuario.telefono = telefono;
    guardarUsuarios(usuarios);
    return usuario;
  }

  function getUsuarioPorId(usuarioId) {
    return getUsuarios().find((u) => u.id === usuarioId) || null;
  }

  /* ---------------- Productos ---------------- */

  function getProductos() {
    const guardados = leer(CLAVES.productos, null);
    if (!guardados) return PRODUCTOS_BASE.map((p) => ({ ...p }));
    const mapa = new Map(guardados.map((p) => [p.id, p]));
    return PRODUCTOS_BASE.map((base) => ({ ...base, ...(mapa.get(base.id) || {}) }));
  }

  function guardarProductos(productos) {
    escribir(CLAVES.productos, productos);
  }

  function getProducto(id) {
    return getProductos().find((p) => p.id === id) || null;
  }

  function actualizarProducto(id, cambios) {
    const productos = getProductos();
    const indice = productos.findIndex((p) => p.id === id);
    if (indice < 0) return null;
    productos[indice] = { ...productos[indice], ...cambios };
    guardarProductos(productos);
    return productos[indice];
  }

  function restaurarProductos() {
    guardarProductos(PRODUCTOS_BASE);
    return PRODUCTOS_BASE.map((p) => ({ ...p }));
  }

  function calcularPrecio(producto, opciones) {
    if (!producto) return 0;
    let precio = Number(producto.precio) || 0;
    if (opciones) {
      ACOMPANANTES.forEach((acompanante) => {
        const valor = opciones[acompanante.id];
        if (valor === 'sin') precio += acompanante.quitar;
        if (valor === 'extra') precio += acompanante.extra;
      });
    }
    return Math.max(0, redondear(precio));
  }

  function resumenOpciones(opciones) {
    if (!opciones) return '';
    const partes = [];
    ACOMPANANTES.forEach((acompanante) => {
      const valor = opciones[acompanante.id];
      if (valor === 'sin') partes.push('Sin ' + acompanante.nombre.toLowerCase());
      if (valor === 'extra') partes.push('Extra ' + acompanante.nombre.toLowerCase());
    });
    return partes.length ? partes.join(' · ') : 'Con todos los acompañamientos';
  }

  function desgloseOpciones(opciones) {
    if (!opciones) return [];
    const lineas = [];
    ACOMPANANTES.forEach((acompanante) => {
      const valor = opciones[acompanante.id];
      if (valor === 'sin') lineas.push({ texto: 'Sin ' + acompanante.nombre.toLowerCase(), monto: acompanante.quitar });
      if (valor === 'extra') lineas.push({ texto: 'Extra ' + acompanante.nombre.toLowerCase(), monto: acompanante.extra });
    });
    return lineas;
  }

  /* ---------------- Pedidos ---------------- */

  function getPedidos() {
    return leer(CLAVES.pedidos, []);
  }

  function guardarPedidos(pedidos) {
    escribir(CLAVES.pedidos, pedidos);
  }

  function siguienteCodigo() {
    const actual = parseInt(localStorage.getItem(CLAVES.contador) || '0', 10) || 0;
    const siguiente = actual + 1;
    localStorage.setItem(CLAVES.contador, String(siguiente));
    return 'PB-' + String(siguiente).padStart(4, '0');
  }

  function crearPedido(datos) {
    const pedidos = getPedidos();
    const ahora = new Date().toISOString();
    const items = datos.items.map((item) => ({
      productoId: item.productoId,
      nombre: item.nombre,
      imagen: item.imagen,
      cantidad: Number(item.cantidad) || 1,
      precioBase: redondear(item.precioBase),
      precioUnitario: redondear(item.precioUnitario),
      opciones: item.opciones ? { ...item.opciones } : null,
      opcionesTexto: item.opcionesTexto || (item.opciones ? resumenOpciones(item.opciones) : ''),
      nota: item.nota || ''
    }));

    const pedido = {
      id: idAleatorio('p-'),
      codigo: siguienteCodigo(),
      usuarioId: datos.usuarioId,
      cliente: {
        nombre: datos.cliente.nombre,
        correo: datos.cliente.correo,
        telefono: datos.cliente.telefono
      },
      items,
      total: totalItems(items),
      metodoPago: datos.metodoPago,
      estadoPago: 'pendiente',
      estado: 'pendiente',
      fechaPedido: ahora,
      fechaRecojo: new Date(datos.fechaRecojo).toISOString(),
      nota: datos.nota || '',
      creadoEn: ahora,
      actualizadoEn: ahora,
      eventos: [{ fecha: ahora, tipo: 'creado', detalle: 'Pedido registrado por el cliente.' }]
    };

    pedidos.unshift(pedido);
    guardarPedidos(pedidos);
    return pedido;
  }

  function actualizarPedido(id, cambios, evento) {
    const pedidos = getPedidos();
    const indice = pedidos.findIndex((p) => p.id === id);
    if (indice < 0) return null;
    const anterior = pedidos[indice];
    const actualizado = {
      ...anterior,
      ...cambios,
      actualizadoEn: new Date().toISOString()
    };
    if (evento) {
      actualizado.eventos = [
        ...(anterior.eventos || []),
        { fecha: new Date().toISOString(), tipo: evento.tipo, detalle: evento.detalle }
      ];
    }
    pedidos[indice] = actualizado;
    guardarPedidos(pedidos);
    return actualizado;
  }

  function marcarPago(id, pagado) {
    return actualizarPedido(
      id,
      {
        estadoPago: pagado ? 'pagado' : 'pendiente',
        pagadoEn: pagado ? new Date().toISOString() : null
      },
      {
        tipo: 'pago',
        detalle: pagado ? 'Pago verificado por el administrador.' : 'Pago marcado como pendiente.'
      }
    );
  }

  function cambiarEstado(id, estado) {
    const info = ESTADOS[estado];
    if (!info) return null;
    return actualizarPedido(
      id,
      { estado },
      { tipo: 'estado', detalle: 'Estado actualizado a: ' + info.nombre + '.' }
    );
  }

  function pedidosDe(usuarioId) {
    return getPedidos()
      .filter((p) => p.usuarioId === usuarioId)
      .sort((a, b) => new Date(b.fechaPedido) - new Date(a.fechaPedido));
  }

  function pedidoPorId(id) {
    return getPedidos().find((p) => p.id === id) || null;
  }

  /* ---------------- Fechas y formato ---------------- */

  function formatearSoles(monto) {
    const valor = Number(monto) || 0;
    return 'S/ ' + valor.toFixed(2);
  }

  function formatearMonto(monto) {
    const valor = Number(monto) || 0;
    const signo = valor < 0 ? '−' : '+';
    return signo + ' S/ ' + Math.abs(valor).toFixed(2);
  }

  function aFecha(valor) {
    if (valor instanceof Date) return valor;
    const fecha = new Date(valor);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
  }

  function formatearFechaHora(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(fecha);
  }

  function formatearFecha(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(fecha);
  }

  function formatearHora(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(fecha);
  }

  function formatearDiaCorto(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    }).format(fecha);
  }

  function fechaHoraLocalValor(valor) {
    const fecha = aFecha(valor) || new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return (
      fecha.getFullYear() + '-' + pad(fecha.getMonth() + 1) + '-' + pad(fecha.getDate()) +
      'T' + pad(fecha.getHours()) + ':' + pad(fecha.getMinutes())
    );
  }

  function valorFechaLocal(fecha) {
    const pad = (n) => String(n).padStart(2, '0');
    return fecha.getFullYear() + '-' + pad(fecha.getMonth() + 1) + '-' + pad(fecha.getDate());
  }

  function fechaMinimaRecojo() {
    const fecha = new Date(Date.now() + 15 * 60000);
    fecha.setSeconds(0, 0);
    fecha.setMinutes(Math.ceil(fecha.getMinutes() / 5) * 5);
    return fechaHoraLocalValor(fecha);
  }

  function esHoy(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return false;
    const hoy = new Date();
    return fecha.getFullYear() === hoy.getFullYear() && fecha.getMonth() === hoy.getMonth() && fecha.getDate() === hoy.getDate();
  }

  function tiempoRelativo(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    const minutos = Math.round((Date.now() - fecha.getTime()) / 60000);
    if (minutos < 1) return 'ahora';
    if (minutos < 60) return 'hace ' + minutos + ' min';
    const horas = Math.round(minutos / 60);
    if (horas < 24) return 'hace ' + horas + ' h';
    const dias = Math.round(horas / 24);
    if (dias === 1) return 'ayer';
    if (dias < 7) return 'hace ' + dias + ' días';
    return formatearDiaCorto(fecha);
  }

  function nombreDia(valor) {
    const fecha = aFecha(valor);
    if (!fecha) return '—';
    return new Intl.DateTimeFormat('es-PE', { weekday: 'long' }).format(fecha);
  }

  /* ---------------- Carrito (persistencia) ---------------- */

  function guardarCarrito(carrito) {
    escribir(CLAVES.carrito, carrito);
  }

  function leerCarrito() {
    const carrito = leer(CLAVES.carrito, []);
    return Array.isArray(carrito) ? carrito : [];
  }

  function limpiarCarrito() {
    localStorage.removeItem(CLAVES.carrito);
  }

  /* ---------------- API pública ---------------- */
  global.PB = {
    VERSION,
    CLAVES,
    CONFIG,
    ACOMPANANTES,
    PRODUCTOS_BASE,
    ESTADOS,
    METODOS_PAGO,
    iniciar,
    hashPassword,
    getUsuarios,
    guardarUsuarios,
    registrar,
    autenticar,
    iniciarSesion,
    cerrarSesion,
    usuarioActual,
    actualizarTelefono,
    getUsuarioPorId,
    getProductos,
    getProducto,
    guardarProductos,
    actualizarProducto,
    restaurarProductos,
    calcularPrecio,
    resumenOpciones,
    desgloseOpciones,
    getPedidos,
    crearPedido,
    actualizarPedido,
    marcarPago,
    cambiarEstado,
    pedidosDe,
    pedidoPorId,
    formatearSoles,
    formatearMonto,
    formatearFechaHora,
    formatearFecha,
    formatearHora,
    formatearDiaCorto,
    fechaHoraLocalValor,
    valorFechaLocal,
    fechaMinimaRecojo,
    esHoy,
    tiempoRelativo,
    nombreDia,
    guardarCarrito,
    leerCarrito,
    limpiarCarrito,
    redondear
  };
})(window);

