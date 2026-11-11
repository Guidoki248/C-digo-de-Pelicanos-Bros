# 🍗 Pelícanos Bros · Sistema web de pedidos

**Del caos manual a la claridad digital.** Prototipo funcional de una tienda de pollo al carbón con pedidos en línea, recojo en tienda y panel de administración.

> Proyecto académico de **Ingeniería de Software** · Universidad Nacional de Moquegua (UNAM) · 2026  
> Estudiante: **Guido David Panca Escarcena**  
> Docente: **Dr. Alexander Morales Gonzales**

---

## ✨ Qué incluye

- **Tienda para el cliente** (`index.html`)
  - Menú con fotos, categorías, precios y disponibilidad.
  - Personalización de acompañamientos: arroz, papa, ensalada y cremas.
  - Cálculo automático del precio: quitar descuenta, extra suma.
  - Carrito persistente, checkout con hora de recojo y método de pago.
  - Registro e inicio de sesión.
  - Historial privado: cada cliente ve solo sus propios pedidos.
  - Seguimiento del estado: recibido, en preparación, listo, entregado.

- **Panel de administración** (`admin.html`)
  - Login separado con rol de administrador.
  - Resumen con KPIs: pedidos del día, recojos, ventas pagadas y por cobrar.
  - Tabla de pedidos con búsqueda, filtros y exportación CSV.
  - Verificación manual de pagos (efectivo, Yape, Plin, transferencia).
  - Tablero de cocina por etapas, ordenado por hora de recojo.
  - Historial completo por cliente.
  - Edición de precios y disponibilidad del menú.
  - Comanda imprimible en formato ticket de 80 mm.

- **Documentación y presentación**
  - `documentacion.html`: documento del proyecto listo para imprimir o guardar como PDF.
  - `presentacion.html`: presentación navegable con teclado, botones e impresión.
  - `docs/`: versiones Markdown, credenciales, manuales, guía de GitHub y créditos.

---

## 🔑 Credenciales demo

| Rol | Usuario | Correo | Contraseña | Acceso |
|---|---|---|---|---|
| Administrador | `admin` | `admin@pelicanosbros.pe` | `Admin2026*` | `admin.html` |
| Cliente | `maria` | `maria@demo.pe` | `Cliente2026*` | `index.html` |
| Cliente | `juan` | `juan@demo.pe` | `Cliente2026*` | `index.html` |

También puedes crear una cuenta nueva desde **Crear cuenta**. El historial de cada cliente es independiente.

> ⚠️ **Demo académica:** los datos se guardan en `localStorage`. No uses contraseñas ni datos reales.

---

## 🚀 Cómo ejecutar

### Opción 1 · GitHub Pages (recomendado)

1. Sube el contenido de esta carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, elige **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda y espera la URL publicada.

La app quedará en:

```text
https://TU-USUARIO.github.io/TU-REPOSITORIO/
```

### Opción 2 · Servidor local

Desde esta carpeta:

```bash
python -m http.server 8000
```

Luego abre:

```text
http://localhost:8000/
```

También funciona con Live Server de VS Code.

### Opción 3 · Abrir el archivo directamente

Puedes abrir `index.html` con doble clic, pero algunos navegadores aíslan `localStorage` entre archivos `file://`. Para probar sesiones, pedidos y panel, usa GitHub Pages o un servidor local.

---

## 🧮 Reglas de precios

| Concepto | Precio |
|---|---|
| Pelícano de pollo completo | S/ 14.00 |
| Pelícano de carne completo | S/ 16.00 |
| Pelícano mixto completo | S/ 18.00 |
| Sin arroz / papa / ensalada | − S/ 2.00 cada uno |
| Sin cremas | − S/ 1.00 |
| Extra de arroz / papa / ensalada | + S/ 2.00 cada uno |
| Extra de cremas | + S/ 1.00 |
| Chicha morada 1 L | S/ 6.00 |
| Inca Kola 500 ml | S/ 4.00 |
| Agua mineral 625 ml | S/ 2.50 |
| Porción extra de papa | S/ 3.00 |
| Crema extra | S/ 1.00 |
| Ensalada extra | S/ 2.00 |

Ejemplo: **2 × Pelícano de pollo sin arroz = 2 × S/ 12.00 = S/ 24.00**.

---

## 🗂️ Estructura

```text
pelicanos-bros/
├── index.html              # Tienda del cliente
├── admin.html              # Login + panel de administración
├── presentacion.html       # Presentación del proyecto
├── documentacion.html      # Documento del proyecto
├── 404.html                # Página no encontrada
├── .nojekyll               # Evita el procesamiento de Jekyll en GitHub Pages
├── LICENSE                 # MIT para el código
├── README.md
├── css/
│   ├── estilos.css
│   ├── presentacion.css
│   └── documentacion.css
├── js/
│   ├── datos.js            # Datos, autenticación, precios y pedidos
│   ├── ui.js               # Modales, toasts y descargas
│   ├── cliente.js          # Lógica de la tienda
│   ├── admin.js            # Lógica del panel
│   └── presentacion.js     # Navegación de diapositivas
├── img/
│   ├── logo.svg
│   └── platos/             # Fotos de productos
└── docs/
    ├── DOCUMENTACION.md
    ├── CREDENCIALES.md
    ├── GUIA_GITHUB.md
    ├── MANUAL_CLIENTE.md
    ├── MANUAL_ADMIN.md
    └── CREDITOS.md
```

---

## 🛠️ Tecnologías

- HTML5 semántico.
- CSS3: Grid, Flexbox, variables, responsive y estilos de impresión.
- JavaScript vanilla (ES6+), sin frameworks ni build.
- `localStorage` como base de datos de demostración.
- Google Fonts: **Fraunces** y **Outfit**.
- GitHub Pages para publicación.

---

## 🔒 Alcance y limitaciones

Este proyecto es un **prototipo académico**. No es un sistema listo para producción.

- No hay backend ni base de datos centralizada: los datos viven en el navegador.
- El hash de contraseñas es demostrativo; no reemplaza bcrypt/Argon2.
- Los pagos no se procesan: el cliente declara el método y el administrador verifica.
- La disponibilidad del menú es manual; no descuenta inventario por insumos.
- Dos dispositivos no comparten pedidos.

Para producción se recomienda: API con autenticación robusta, base de datos relacional, pasarela de pagos, inventario real, respaldos y auditoría.

---

## 📸 Créditos de imágenes

Las fotografías de los platos provienen de **Wikimedia Commons** y se usan con fines académicos bajo licencias **Creative Commons (CC BY y CC BY-SA)**. La atribución completa está en [`docs/CREDITOS.md`](docs/CREDITOS.md) y en la sección de créditos de `documentacion.html`.

El logo es una ilustración vectorial propia del proyecto.

---

## 📄 Documentos del proyecto

- [Documento completo](documentacion.html)
- [Documento en Markdown](docs/DOCUMENTACION.md)
- [Credenciales demo](docs/CREDENCIALES.md)
- [Guía de GitHub Pages](docs/GUIA_GITHUB.md)
- [Manual del cliente](docs/MANUAL_CLIENTE.md)
- [Manual del administrador](docs/MANUAL_ADMIN.md)
- [Créditos](docs/CREDITOS.md)

---

## ✅ Estado del proyecto

| Módulo | Estado |
|---|---|
| Menú y personalización | ✅ Implementado |
| Carrito y checkout | ✅ Implementado |
| Registro / login de clientes | ✅ Implementado |
| Historial privado | ✅ Implementado |
| Login de administrador | ✅ Implementado |
| Pedidos, pagos y estados | ✅ Implementado |
| Cocina y comandas | ✅ Implementado |
| Clientes e historial | ✅ Implementado |
| Menú editable | ✅ Implementado |
| CSV y comanda imprimible | ✅ Implementado |
| Documentación y presentación | ✅ Implementado |
| Backend / pagos reales | ⏳ Fuera del alcance de la demo |

---

Hecho con 🍗 y foco en el proceso, no solo en la tecnología.  
**Pelícanos Bros · Moquegua, Perú · 2026**
