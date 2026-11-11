/* ============================================================
   Pelícanos Bros · Navegación de la presentación
   ============================================================ */
(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('[data-slide]'));
  const puntos = document.getElementById('puntos');
  const contador = document.getElementById('contador');
  const progreso = document.getElementById('progreso');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnSiguiente = document.getElementById('btnSiguiente');
  const btnImprimir = document.getElementById('btnImprimir');
  let actual = 0;

  function leerHash() {
    const coincide = /^#slide-(\d+)$/.exec(window.location.hash || '');
    if (!coincide) return 0;
    const indice = Number(coincide[1]) - 1;
    return Number.isInteger(indice) && indice >= 0 && indice < slides.length ? indice : 0;
  }

  function crearPuntos() {
    puntos.innerHTML = slides.map((slide, indice) =>
      '<button type="button" data-punto="' + indice + '" aria-label="Ir a la diapositiva ' + (indice + 1) + '"></button>'
    ).join('');
  }

  function mostrar(indice, actualizarHash) {
    actual = Math.max(0, Math.min(slides.length - 1, indice));
    slides.forEach((slide, posicion) => {
      slide.classList.toggle('activa', posicion === actual);
      slide.setAttribute('aria-hidden', posicion === actual ? 'false' : 'true');
    });
    Array.from(puntos.children).forEach((punto, posicion) => {
      punto.classList.toggle('activo', posicion === actual);
      punto.setAttribute('aria-current', posicion === actual ? 'true' : 'false');
    });
    contador.textContent = (actual + 1) + ' / ' + slides.length;
    progreso.style.width = (((actual + 1) / slides.length) * 100) + '%';
    btnAnterior.disabled = actual === 0;
    btnSiguiente.disabled = actual === slides.length - 1;
    if (actualizarHash !== false) {
      const destino = '#slide-' + (actual + 1);
      if (window.location.hash !== destino) {
        window.history.replaceState(null, '', destino);
      }
    }
    const activa = slides[actual];
    if (activa && activa.scrollHeight > activa.clientHeight) activa.scrollTop = 0;
  }

  function siguiente() {
    if (actual < slides.length - 1) mostrar(actual + 1);
  }

  function anterior() {
    if (actual > 0) mostrar(actual - 1);
  }

  document.addEventListener('DOMContentLoaded', () => {
    crearPuntos();
    mostrar(leerHash(), false);

    puntos.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-punto]');
      if (boton) mostrar(Number(boton.dataset.punto));
    });

    btnAnterior.addEventListener('click', anterior);
    btnSiguiente.addEventListener('click', siguiente);

    if (btnImprimir) {
      btnImprimir.addEventListener('click', () => window.print());
    }

    document.addEventListener('keydown', (evento) => {
      if (evento.target && /^(INPUT|TEXTAREA|SELECT)$/.test(evento.target.tagName)) return;
      if (evento.key === 'ArrowRight' || evento.key === 'PageDown' || evento.key === ' ') {
        evento.preventDefault();
        siguiente();
      }
      if (evento.key === 'ArrowLeft' || evento.key === 'PageUp') {
        evento.preventDefault();
        anterior();
      }
      if (evento.key === 'Home') {
        evento.preventDefault();
        mostrar(0);
      }
      if (evento.key === 'End') {
        evento.preventDefault();
        mostrar(slides.length - 1);
      }
    });

    let toqueX = null;
    let toqueY = null;
    document.addEventListener('touchstart', (evento) => {
      if (!evento.changedTouches || !evento.changedTouches.length) return;
      toqueX = evento.changedTouches[0].clientX;
      toqueY = evento.changedTouches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (evento) => {
      if (toqueX === null || !evento.changedTouches || !evento.changedTouches.length) return;
      const dx = evento.changedTouches[0].clientX - toqueX;
      const dy = evento.changedTouches[0].clientY - toqueY;
      toqueX = null;
      toqueY = null;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) siguiente();
      else anterior();
    }, { passive: true });

    window.addEventListener('hashchange', () => mostrar(leerHash(), false));
  });
})();
