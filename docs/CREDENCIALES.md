# Credenciales de la demo · Pelícanos Bros

> **Demo académica:** los datos se guardan en el navegador (`localStorage`). No uses contraseñas ni datos personales reales.

---

## 1. Administrador

| Campo | Valor |
|---|---|
| Nombre | Administrador Pelícanos |
| Usuario | `admin` |
| Correo | `admin@pelicanosbros.pe` |
| Contraseña | `Admin2026*` |
| Acceso | `admin.html` |
| Rol | `admin` |

**Puede:**

- Ver todos los pedidos de todos los clientes.
- Ver qué pidió cada cliente, cuánto pagó y a qué hora.
- Verificar pagos y marcarlos como pagados o pendientes.
- Cambiar el estado del pedido: recibido, en preparación, listo, entregado o cancelado.
- Organizar la cocina por hora de recojo.
- Consultar el historial completo por cliente.
- Editar precios y disponibilidad del menú.
- Exportar pedidos a CSV.
- Imprimir comandas.

---

## 2. Clientes de prueba

### 2.1 María Quispe

| Campo | Valor |
|---|---|
| Nombre | María Quispe |
| Usuario | `maria` |
| Correo | `maria@demo.pe` |
| Contraseña | `Cliente2026*` |
| Teléfono | `987 654 321` |
| Acceso | `index.html` |

**Pedidos de ejemplo:**

- `PB-0004` · 2 × Pelícano de pollo sin arroz + chicha morada · Yape · pago pendiente · recojo hoy.
- `PB-0001` · 1 × Pelícano de pollo completo + agua · efectivo · pagado · entregado ayer.

### 2.2 Juan Mamani

| Campo | Valor |
|---|---|
| Nombre | Juan Mamani |
| Usuario | `juan` |
| Correo | `juan@demo.pe` |
| Contraseña | `Cliente2026*` |
| Teléfono | `912 345 678` |
| Acceso | `index.html` |

**Pedidos de ejemplo:**

- `PB-0003` · 1 × Pelícano mixto con papa extra + Inca Kola · efectivo · pago pendiente · en preparación.
- `PB-0002` · 2 × Pelícano de pollo sin ensalada + chicha morada · Yape · pagado · entregado ayer.

---

## 3. Cuenta nueva

Cualquier visitante puede crear una cuenta desde **Crear cuenta** en la tienda.

| Campo | Requisito |
|---|---|
| Nombre | Mínimo 3 caracteres |
| Correo | Formato válido y no repetido |
| Teléfono | Mínimo 6 dígitos |
| Contraseña | Mínimo 6 caracteres |
| Confirmación | Debe coincidir con la contraseña |

La cuenta nueva empieza sin pedidos. Su historial se llena a medida que compra.

---

## 4. Cómo probar la separación de historiales

1. Abre `index.html` e inicia sesión como **María**.
2. Revisa **Mis pedidos**: verás `PB-0004` y `PB-0001`.
3. Cierra sesión.
4. Inicia sesión como **Juan**.
5. Revisa **Mis pedidos**: verás `PB-0003` y `PB-0002`, no los de María.
6. Abre `admin.html` con la cuenta de administrador.
7. Ve a **Clientes** y abre el historial de María y de Juan: el administrador sí ve ambos.

---

## 5. Reiniciar la demo

Si quieres volver a los datos iniciales:

### Opción A · Desde el navegador

1. Abre la app.
2. Presiona `F12` para abrir la consola.
3. Ejecuta:

```js
localStorage.clear();
location.reload();
```

### Opción B · Borrar datos del sitio

En Chrome/Edge:

1. Abre la configuración del sitio.
2. Busca la URL de la app.
3. Borra los datos del sitio.
4. Recarga.

> Al borrar los datos se eliminan también los usuarios y pedidos creados durante la demo. Las cuentas semilla se vuelven a crear automáticamente.

---

## 6. Notas de seguridad

- Las contraseñas se transforman con un hash **demostrativo** en el navegador.
- No es bcrypt, Argon2 ni un esquema seguro para producción.
- Toda la información vive en `localStorage` y puede ser leída o modificada por el usuario.
- Los pagos no se procesan: el cliente declara el método y el administrador verifica manualmente.
- Para producción se requiere backend, HTTPS, autenticación robusta y una base de datos centralizada.

---

Volver a la [documentación](DOCUMENTACION.md) · [README](../README.md) · [Tienda](../index.html)
