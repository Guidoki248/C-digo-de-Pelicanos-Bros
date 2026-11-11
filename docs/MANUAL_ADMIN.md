# Manual del administrador · Pelícanos Bros

Este manual explica cómo usar el panel de administración para gestionar pedidos, pagos, cocina, clientes y menú.

---

## 1. Acceder al panel

1. Abre `admin.html`.
2. Ingresa:
   - **Usuario:** `admin`
   - **Contraseña:** `Admin2026*`
3. Haz clic en **Entrar al panel**.

También puedes usar el botón **Rellenar automáticamente** para completar las credenciales demo.

> Las cuentas de cliente no tienen acceso al panel. Si intentas entrar con una, el sistema mostrará un error de permisos.

---

## 2. Conocer el panel

El panel tiene cinco secciones en la barra lateral:

| Sección | Para qué sirve |
|---|---|
| 📊 Resumen | Ver el estado general del día. |
| 🧾 Pedidos | Buscar, filtrar, ver detalle y cobrar. |
| 🔥 Cocina | Organizar las comandas por etapa. |
| 👥 Clientes | Consultar el historial de cada cliente. |
| 🍗 Menú | Editar precios y disponibilidad. |

La cabecera muestra la fecha actual y el botón **↻ Actualizar**. El panel también se refresca automáticamente cada 30 segundos mientras está visible.

---

## 3. Resumen

La pantalla inicial muestra:

- **Pedidos hoy:** pedidos registrados en el día.
- **Recojos de hoy:** pedidos activos con recojo programado para hoy.
- **Ventas pagadas hoy:** suma de pedidos pagados y no cancelados.
- **Por cobrar:** suma de pedidos activos con pago pendiente.
- **Clientes:** total de clientes registrados y cuántos tienen pedidos.

Debajo verás:

- **Próximos recojos:** ordenados por hora, con cliente, código, detalle y estado.
- **Últimos pedidos:** los más recientes, con total y estado de pago.

Haz clic en cualquier pedido para abrir su detalle.

---

## 4. Pedidos

### 4.1 Buscar y filtrar

Puedes combinar:

- **Texto:** código, nombre, correo o teléfono.
- **Estado:** recibido, en preparación, listo, entregado o cancelado.
- **Pago:** pendiente o pagado.
- **Fecha:** fecha de recojo.
- **Limpiar:** restablece todos los filtros.

La tabla muestra: código y hora del pedido, cliente, recojo, total, pago, estado y acciones.

### 4.2 Ver el detalle

Haz clic en el código o en **Ver** para abrir el modal del pedido. Ahí puedes:

- Ver datos del cliente y hora de recojo.
- Ver el detalle de productos, acompañamientos y notas.
- Ver el total y el método de pago.
- **Marcar como pagado** o volver a pendiente.
- Cambiar el estado desde el selector.
- **Imprimir comanda.**
- **Cancelar pedido** (si aún no está entregado).
- Ver la trazabilidad completa con fechas.

### 4.3 Verificar un pago

1. Abre el pedido o ubica la fila en la tabla.
2. Haz clic en **Cobrar** (si está pendiente) o en **Marcar como pagado** dentro del modal.
3. Confirma la acción si el sistema la solicita.
4. El cliente verá el cambio al actualizar su historial.

Si marcas por error un pago como pagado, puedes volver a **Pago pendiente** desde el mismo modal.

### 4.4 Exportar CSV

1. Aplica los filtros que necesites.
2. Haz clic en **⬇ Exportar CSV**.
3. Se descargará `pedidos-pelicanos-bros.csv`.

El archivo incluye código, cliente, correo, teléfono, fechas, total, método de pago, estado del pago, estado del pedido, nota y detalle. Se abre correctamente en Excel (incluye BOM UTF-8).

---

## 5. Cocina

El tablero muestra tres columnas:

| Columna | Significado |
|---|---|
| 🕐 Por preparar | Pedido recibido, aún no iniciado. |
| 🔥 En preparación | La cocina está trabajando en él. |
| ✅ Listos para recoger | Ya puede entregarse al cliente. |

Cada comanda muestra:

- Hora de recojo.
- Estado de pago.
- Cliente y código.
- Productos, acompañamientos y notas.
- Total.
- Botones **Detalle** y **Iniciar / Marcar listo / Entregar**.

### 5.1 Avanzar una comanda

1. Ubica la comanda en la columna correcta.
2. Haz clic en **Iniciar** para pasarla a preparación.
3. Cuando esté lista, haz clic en **Marcar listo**.
4. Cuando el cliente la recoja, haz clic en **Entregar** y confirma.

El cliente ve el nuevo estado en **Mis pedidos**.

### 5.2 Imprimir una comanda

1. Abre el detalle del pedido.
2. Haz clic en **🖨️ Imprimir comanda**.
3. Se abrirá una ventana con un ticket de 80 mm.
4. Imprime o guarda como PDF.

Si el navegador bloquea la ventana, permite las ventanas emergentes para el sitio.

---

## 6. Clientes

La tabla muestra:

- Nombre y fecha de registro.
- Correo y teléfono.
- Usuario.
- Cantidad de pedidos.
- Total pagado.
- Último pedido.

Usa el buscador para filtrar por nombre, correo, teléfono o usuario.

Haz clic en **Historial** para abrir el detalle del cliente:

- Pedidos totales.
- Total pagado.
- Por cobrar.
- Lista de pedidos con código, fecha, hora de recojo, pago, estado y total.
- Botón **Ver** para abrir cada pedido.

> El administrador sí puede ver el historial de todos los clientes. El cliente solo ve el suyo.

---

## 7. Menú

La sección **Menú** muestra todos los productos con:

- Foto, nombre y categoría.
- Estado: Disponible o Agotado.
- Campo de **precio base**.
- Interruptor **Disponible hoy**.

### 7.1 Cambiar un precio

1. Escribe el nuevo precio en el campo.
2. Presiona `Tab` o haz clic fuera del campo para guardar.
3. El cambio se refleja en la tienda al instante.
4. Los pedidos ya registrados conservan su total original.

### 7.2 Marcar un producto como agotado

1. Desactiva el interruptor **Disponible hoy**.
2. La tienda mostrará el producto como **Agotado hoy** y no permitirá agregarlo.
3. Vuelve a activarlo cuando haya stock.

### 7.3 Restaurar el menú base

Haz clic en **Restaurar menú base** y confirma. Se recuperan los precios y la disponibilidad originales.

> Esta acción no modifica pedidos existentes.

---

## 8. Cerrar sesión

Haz clic en **Salir** en la barra lateral. Volverás al login del panel.

También puedes usar **← Ver tienda** para abrir la tienda del cliente.

---

## 9. Buenas prácticas

- Verifica el pago antes de marcar un pedido como pagado.
- Revisa la hora de recojo al organizar la cocina.
- Usa las notas del cliente: pueden cambiar la preparación.
- No canceles pedidos entregados; si hay un problema, registra la incidencia aparte.
- Exporta el CSV al cierre del día como respaldo.
- Mantén el menú actualizado: un producto agotado debe reflejarse en la tienda.

---

## 10. Preguntas frecuentes

### ¿Puedo crear usuarios administradores?

En esta demo no hay una pantalla para crear administradores. La cuenta `admin` es la única con ese rol. Para producción se recomienda un módulo de usuarios y permisos.

### ¿Puedo cambiar la contraseña del administrador?

No desde la interfaz. En la demo, la contraseña está definida en `js/datos.js`. Para producción debe existir un flujo seguro de cambio de contraseña.

### ¿Los cambios de precio afectan pedidos anteriores?

No. Cada pedido guarda el precio unitario y el total al momento de confirmarse.

### ¿Dónde se guardan los pedidos?

En el `localStorage` del navegador. No hay sincronización entre dispositivos.

### ¿Puedo recuperar un pedido cancelado?

No desde la interfaz. El pedido queda en el historial con estado **Cancelado** y no suma en ventas.

### ¿Qué pasa si borro los datos del navegador?

Se pierden usuarios, pedidos y cambios de menú. Las cuentas semilla se vuelven a crear al abrir la app.

---

## 11. Credenciales demo

| Campo | Valor |
|---|---|
| Usuario | `admin` |
| Contraseña | `Admin2026*` |
| Acceso | `admin.html` |

---

Volver a la [documentación](DOCUMENTACION.md) · [README](../README.md) · [Panel](../admin.html)
