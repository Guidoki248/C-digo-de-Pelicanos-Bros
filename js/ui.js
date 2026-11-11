/* ============================================================
   Pelícanos Bros · Utilidades de interfaz compartidas
   ============================================================ */
(function (global) {
  'use strict';

  const $ = (selector, contexto) => (contexto || document).querySelector(selector);
  const $$ = (selector, contexto) => Array.from((contexto || document).querySelectorAll(selector));

  function escapar(valor) {
    return String(valor == null ? '' : valor).replace(/[&<>"']/g, (caracter) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[caracter]));
  }

  function abrirModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('abierto');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sin-scroll');
    const enfocable = modal.querySelector('input:not([type="hidden"]), select, textarea, button');
    if (enfocable) {
      window.setTimeout(() => enfocable.focus({ preventScroll: true }), 120);
    }
  }

  function cerrarModal(id) {
    const modal = typeof id === 'string' ? document.getElementById(id) : id;
    if (!modal) return;
    modal.classList.remove('abierto');
    modal.setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal.abierto')) {
      document.body.classList.remove('sin-scroll');
    }
  }

  function cerrarTodos() {
    $$('.modal.abierto').forEach((modal) => cerrarModal(modal));
  }

  function toast(mensaje, tipo) {
    const contenedor = document.getElementById('toasts');
    if (!contenedor) return;
    const clases = { ok: 'toast-ok', error: 'toast-error', info: 'toast-info' };
    const iconos = { ok: '✅', error: '⚠️', info: 'ℹ️' };
    const clase = clases[tipo] || clases.ok;
    const icono = iconos[tipo] || iconos.ok;
    const elemento = document.createElement('div');
    elemento.className = 'toast ' + clase;
    elemento.innerHTML = '<span class="toast-icono">' + icono + '</span><p>' + escapar(mensaje) + '</p>';
    contenedor.appendChild(elemento);
    window.setTimeout(() => {
      elemento.classList.add('saliendo');
      window.setTimeout(() => elemento.remove(), 260);
    }, 3600);
  }

  function initModales() {
    document.addEventListener('click', (evento) => {
      const cerrar = evento.target.closest('[data-cerrar]');
      if (cerrar) {
        const modal = cerrar.closest('.modal');
        if (modal) cerrarModal(modal);
        return;
      }
      if (evento.target.classList && evento.target.classList.contains('modal')) {
        cerrarModal(evento.target);
      }
    });

    document.addEventListener('keydown', (evento) => {
      if (evento.key !== 'Escape') return;
      const abiertos = $$('.modal.abierto');
      if (abiertos.length) cerrarModal(abiertos[abiertos.length - 1]);
    });
  }

  function confirmar(mensaje) {
    return window.confirm(mensaje);
  }

  function fechaInput(valor) {
    return valor ? valor.slice(0, 16) : '';
  }

  function descargarArchivo(nombre, contenido, tipo) {
    const blob = new Blob([contenido], { type: tipo || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  global.UI = {
    $,
    $$,
    escapar,
    abrirModal,
    cerrarModal,
    cerrarTodos,
    toast,
    initModales,
    confirmar,
    fechaInput,
    descargarArchivo
  };
})(window);
