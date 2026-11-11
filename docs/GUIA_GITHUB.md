# Guía de publicación en GitHub Pages

Esta guía explica cómo subir la carpeta `pelicanos-bros/` a GitHub y publicarla como sitio web gratuito.

---

## 1. Requisitos

- Una cuenta de GitHub.
- El contenido de la carpeta `pelicanos-bros/` (no la carpeta contenedora).
- Opcional: Git instalado si prefieres usar la terminal.

---

## 2. Opción A · Subir desde la web de GitHub

Ideal si no tienes Git instalado.

### 2.1 Crear el repositorio

1. Inicia sesión en [github.com](https://github.com).
2. Haz clic en **New repository**.
3. Nombre sugerido: `pelicanos-bros`.
4. Visibilidad: **Public** (GitHub Pages gratuito requiere repositorio público en cuentas gratuitas).
5. No marques “Add a README file” si ya vas a subir el del proyecto.
6. Haz clic en **Create repository**.

### 2.2 Subir los archivos

1. En el repositorio vacío, haz clic en **uploading an existing file**.
2. Abre la carpeta `pelicanos-bros/` en tu computadora.
3. Selecciona **todo el contenido** de dentro de la carpeta:
   - `index.html`, `admin.html`, `presentacion.html`, `documentacion.html`, `404.html`
   - `.nojekyll`, `LICENSE`, `README.md`
   - carpetas `css/`, `js/`, `img/`, `docs/`
4. Arrástralo a GitHub o selecciónalo con el explorador.
5. Escribe un mensaje de commit, por ejemplo: `Primera versión del sistema Pelícanos Bros`.
6. Haz clic en **Commit changes**.

> **Importante:** no subas la carpeta `pelicanos-bros/` como una carpeta dentro del repositorio. Sube su contenido directamente en la raíz. Así `index.html` queda en la raíz y GitHub Pages lo encuentra.

### 2.3 Activar GitHub Pages

1. Entra a **Settings** del repositorio.
2. En el menú lateral, elige **Pages**.
3. En **Build and deployment → Source**, selecciona **Deploy from a branch**.
4. En **Branch**, elige `main` y la carpeta `/ (root)`.
5. Haz clic en **Save**.
6. Espera 1–2 minutos. GitHub mostrará la URL publicada.

La URL tendrá esta forma:

```text
https://TU-USUARIO.github.io/pelicanos-bros/
```

---

## 3. Opción B · Subir con Git desde la terminal

### 3.1 Inicializar el repositorio

Abre una terminal dentro de la carpeta `pelicanos-bros/`:

```bash
git init
git add .
git commit -m "Primera versión del sistema Pelícanos Bros"
git branch -M main
```

### 3.2 Conectar con GitHub

Crea el repositorio vacío en GitHub y copia su URL. Luego:

```bash
git remote add origin https://github.com/TU-USUARIO/pelicanos-bros.git
git push -u origin main
```

### 3.3 Activar Pages

Repite los pasos de **Settings → Pages → Deploy from a branch → main / root**.

---

## 4. Verificar la publicación

Abre la URL de GitHub Pages y comprueba:

- [ ] La tienda carga con imágenes y estilos.
- [ ] El botón **Crear cuenta** abre el modal.
- [ ] El login de María funciona.
- [ ] Se puede agregar un producto al carrito.
- [ ] El checkout permite confirmar un pedido.
- [ ] `admin.html` abre el login del panel.
- [ ] El administrador ve los pedidos.
- [ ] `presentacion.html` navega con las flechas.
- [ ] `documentacion.html` se imprime correctamente.

---

## 5. Solución de problemas

### La página muestra 404

- Verifica que `index.html` esté en la **raíz** del repositorio, no dentro de otra carpeta.
- Espera unos minutos después de activar Pages.
- Revisa que la rama seleccionada sea `main` y la carpeta `/ (root)`.

### Los estilos o las imágenes no cargan

- Los archivos deben conservar la estructura de carpetas: `css/`, `js/`, `img/`.
- Los nombres distinguen mayúsculas y minúsculas en GitHub Pages. Usa exactamente los mismos nombres.
- No renombres `estilos.css` ni las fotos de `img/platos/`.

### El login o los pedidos no se guardan

- `localStorage` requiere un origen HTTP/HTTPS. En GitHub Pages funciona.
- Si abres el archivo con doble clic (`file://`), algunos navegadores aíslan el almacenamiento por archivo.
- Para probar localmente, usa un servidor:

```bash
python -m http.server 8000
```

Y abre `http://localhost:8000/`.

### GitHub Pages muestra el README en lugar de la tienda

- Asegúrate de que `index.html` exista en la raíz.
- Si hay un `README.md`, GitHub Pages igual prioriza `index.html`; si no lo encuentra, muestra el README.

### Los cambios no se reflejan

- Espera 1–2 minutos y recarga con `Ctrl + F5`.
- Verifica que el commit se haya subido a la rama `main`.
- En **Actions**, revisa que el despliegue de Pages haya terminado.

### El archivo `.nojekyll` no aparece

- En GitHub, los archivos que empiezan con punto pueden estar ocultos en el explorador.
- Puedes crearlo manualmente: **Add file → Create new file**, escribe `.nojekyll` y guarda vacío.
- Su función es evitar que Jekyll ignore carpetas o archivos.

---

## 6. Actualizar el sitio

Cada vez que subas cambios a la rama `main`, GitHub Pages reconstruye el sitio automáticamente.

```bash
git add .
git commit -m "Actualiza precios y documentación"
git push
```

---

## 7. Dominio personalizado (opcional)

Si tienes un dominio propio:

1. En **Settings → Pages → Custom domain**, escribe tu dominio.
2. En tu proveedor de DNS, crea un registro `CNAME` apuntando a `TU-USUARIO.github.io`.
3. Espera la propagación y activa **Enforce HTTPS**.

Para la demo académica no es necesario.

---

## 8. Checklist final antes de entregar

- [ ] `index.html`, `admin.html`, `presentacion.html` y `documentacion.html` abren sin errores.
- [ ] Las credenciales demo están en `docs/CREDENCIALES.md`.
- [ ] El README explica cómo ejecutar y publicar.
- [ ] Las imágenes tienen atribución en `docs/CREDITOS.md`.
- [ ] `.nojekyll` está en la raíz.
- [ ] `404.html` está en la raíz.
- [ ] La URL de GitHub Pages funciona en una ventana de incógnito.
- [ ] Probaste el flujo cliente y el flujo administrador.

---

Volver a la [documentación](DOCUMENTACION.md) · [README](../README.md)
