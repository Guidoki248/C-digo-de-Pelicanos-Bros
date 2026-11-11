# Manual del cliente · Pelícanos Bros

Bienvenido. Este manual explica cómo pedir tu pelícano en línea, personalizarlo y revisar tus pedidos.

---

## 1. Ingresar a la tienda

Abre la página principal del proyecto (`index.html`) desde GitHub Pages o desde el servidor local.

Verás:

- El menú con los platos, bebidas y extras.
- Un carrito a la derecha (o debajo del menú en el celular).
- Los botones **Ingresar** y **Crear cuenta**.
- La sección **Mis pedidos**.

---

## 2. Crear una cuenta

1. Haz clic en **Crear cuenta**.
2. Completa:
   - Nombre completo.
   - Correo electrónico.
   - Teléfono de contacto.
   - Contraseña (mínimo 6 caracteres).
   - Repite la contraseña.
3. Haz clic en **Crear mi cuenta**.

Tu cuenta queda creada y tu sesión se inicia automáticamente. El historial de pedidos es privado: solo tú lo ves.

> Si ya tienes una cuenta demo, puedes usar `maria` / `Cliente2026*` o `juan` / `Cliente2026*`.

---

## 3. Iniciar sesión

1. Haz clic en **Ingresar**.
2. Escribe tu correo o usuario y tu contraseña.
3. Haz clic en **Ingresar**.

Si olvidaste la contraseña, en esta demo no hay recuperación automática. Puedes crear una cuenta nueva o reiniciar los datos del navegador.

---

## 4. Elegir un plato

1. Baja hasta la sección **Arma tu pelícano**.
2. Usa los filtros: **Todos**, **Pelicanos**, **Bebidas** o **Extras**.
3. Cada tarjeta muestra:
   - Foto del producto.
   - Nombre y descripción.
   - Precio base.
   - Botón **Personalizar** o **Agregar**.

Si un producto aparece como **Agotado hoy**, no se puede agregar.

---

## 5. Personalizar tu pelícano

Haz clic en **Personalizar** sobre un plato.

Para cada acompañamiento puedes elegir:

| Opción | Efecto en el precio |
|---|---|
| **Con** | Incluido en el precio base. |
| **Sin** | Descuenta S/ 2.00 (arroz, papa o ensalada) o S/ 1.00 (cremas). |
| **Extra** | Suma S/ 2.00 (arroz, papa o ensalada) o S/ 1.00 (cremas). |

El modal muestra:

- El precio unitario actualizado.
- El desglose de cada ajuste.
- Un campo de nota para cocina (por ejemplo: “sin ají”, “bien cocido”).
- El selector de cantidad.
- El total antes de agregar.

Ejemplo: un **Pelícano de pollo sin arroz** pasa de S/ 14.00 a **S/ 12.00**.

Haz clic en **Agregar · S/ ...** para sumarlo al carrito.

---

## 6. Revisar el carrito

En el carrito puedes:

- Ver cada producto con su personalización y nota.
- Cambiar la cantidad con **−** y **+**.
- Quitar una línea con **✕**.
- Ver el subtotal y el total.

El carrito se guarda en tu navegador. Si cierras la página y vuelves, seguirá ahí (mientras no borres los datos del sitio).

---

## 7. Confirmar el pedido

1. Haz clic en **Continuar pedido**.
2. Si no iniciaste sesión, el sistema te pedirá ingresar o crear una cuenta.
3. Completa:
   - **Teléfono de contacto.**
   - **Hora de recojo:** debe ser al menos 10 minutos después de la hora actual.
   - **Forma de pago:** efectivo, Yape, Plin o transferencia.
   - **Nota para la cocina** (opcional).
4. Revisa el resumen y el total.
5. Haz clic en **Confirmar pedido**.

El sistema genera un código único, por ejemplo **PB-0005**, y muestra la confirmación.

> **Importante:** el pago no se cobra en la web. Si eliges Yape, Plin o transferencia, el administrador verificará el pago manualmente. Si eliges efectivo, pagas al recoger.

---

## 8. Ver tus pedidos

Baja hasta **Mis pedidos** o usa el enlace del menú superior.

Verás:

- Código del pedido.
- Estado actual: Pedido recibido, En preparación, Listo para recoger, Entregado o Cancelado.
- Estado del pago: Pagado o Pago pendiente.
- Fecha y hora del pedido.
- Hora de recojo.
- Método de pago.
- Detalle de productos y notas.
- Total.

Haz clic en **↻ Actualizar** para refrescar la información.

---

## 9. Recoger el pedido

1. Llega a la hora elegida.
2. Da tu código de pedido en el mostrador.
3. Si tu pago está pendiente, paga en ese momento.
4. El administrador marcará el pedido como **Entregado**.

---

## 10. Cerrar sesión

Haz clic en **Salir** en la barra superior.

Tu carrito se conserva. Tus pedidos quedan guardados en tu cuenta.

---

## 11. Preguntas frecuentes

### ¿Puedo pedir sin crear cuenta?

No. Para confirmar un pedido necesitas una cuenta, porque el historial debe quedar asociado a ti.

### ¿Puedo cambiar un pedido ya confirmado?

No desde la web. Contacta al negocio. El administrador puede cancelar el pedido desde el panel.

### ¿Por qué no veo los pedidos de otra persona?

Porque el historial es privado. Cada cuenta solo muestra sus propios pedidos. El administrador sí puede ver todos.

### ¿Dónde se guardan mis datos?

En el `localStorage` de tu navegador. No se envían a un servidor. Si borras los datos del sitio, se pierden.

### ¿Puedo pagar con tarjeta?

En esta demo no. Solo efectivo, Yape, Plin o transferencia declarada.

### ¿El precio cambia si el administrador edita el menú?

No para pedidos ya registrados. El total se guarda con el pedido. Los cambios aplican a pedidos nuevos.

---

## 12. Credenciales demo

| Usuario | Contraseña |
|---|---|
| `maria` | `Cliente2026*` |
| `juan` | `Cliente2026*` |

También puedes crear tu propia cuenta.

---

Volver a la [documentación](DOCUMENTACION.md) · [README](../README.md) · [Tienda](../index.html)
