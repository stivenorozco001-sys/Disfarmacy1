fetch('productos.json?v=' + new Date().getTime())
  .then(res => res.json())
  .then(productos => {

    /* ===============================
       REFERENCIAS AL DOM
       =============================== */

    const contenedor = document.getElementById('productos');
    const botones = document.querySelectorAll('.filtro-btn');
    const buscador = document.getElementById('buscadorInput');
    const categoriaSelect = document.getElementById('categoriaSelect');

    /* ===============================
       ESTADO DE FILTROS
       =============================== */

    let filtroEstado = 'todos';
    let textoBusqueda = '';
    let filtroCategoria = 'todas';

    /* ===============================
       CONFIGURACIÓN
       =============================== */

    // 📲 WHATSAPP
    const telefonoWhatsApp = '573242228107';

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    /* ===============================
       UTILIDADES
       =============================== */

    // Normaliza texto para comparar y crear clases CSS
    function normalizar(texto) {
      return texto
        ? texto
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '') // elimina espacios
        : '';
    }

    // Obtiene el estado real del producto
    function obtenerEstado(producto) {
      const posiblesClaves = ['estado', 'Estado', 'disponibilidad', 'Disponibilidad'];
      let valor = '';

      posiblesClaves.forEach(clave => {
        if (producto[clave]) valor = producto[clave];
      });

      return normalizar(valor) === 'agotado'
        ? 'Agotado'
        : 'Disponible';
    }

    // Obtiene la categoría del producto
    function obtenerCategoria(producto) {
      const posiblesClaves = ['categoria', 'Categoria', 'categoría', 'Categoría'];
      let valor = '';

      posiblesClaves.forEach(clave => {
        if (producto[clave]) valor = producto[clave];
      });

      return normalizar(valor);
    }

    /* ===============================
       RENDER DE PRODUCTOS
       =============================== */

    function renderProductos() {
      contenedor.innerHTML = '';

      const filtrados = productos.filter(p => {
        const nombre = normalizar(p.nombre || p.Nombre);
        if (!nombre) return false;

        const estado = obtenerEstado(p);
        const categoria = obtenerCategoria(p);

        const coincideTexto = nombre.includes(textoBusqueda);
        const coincideEstado =
          filtroEstado === 'todos' || estado === filtroEstado;
        const coincideCategoria =
          filtroCategoria === 'todas' || categoria === filtroCategoria;

        return coincideTexto && coincideEstado && coincideCategoria;
      });

      if (filtrados.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos.</p>';
        return;
      }

      filtrados.forEach(p => {
        const nombre = p.nombre || p.Nombre;
        const imagen = p.imagen || p.Imagen;
        const estado = obtenerEstado(p);
        const categoria = obtenerCategoria(p);
        const agotado = estado === 'Agotado';

        // 🔥 CLASE DINÁMICA POR CATEGORÍA
        const categoriaClase = categoria || 'sin-categoria';

        const mensaje = encodeURIComponent(
          `Hola, estoy interesado en el producto "${nombre}". ¿Está disponible?`
        );

        const botonWhatsApp = !agotado
          ? `
            <a 
              href="https://wa.me/${telefonoWhatsApp}?text=${mensaje}" 
              class="btn-whatsapp" 
              target="_blank"
            >
              💬 Consultar por WhatsApp
            </a>
          `
          : '';

        contenedor.innerHTML += `
          <article class="producto categoria-${categoriaClase}">
            <img src="${imagen}" alt="${nombre}" loading="lazy">
            <h3>${nombre}</h3>

            <span class="categoria-badge categoria-${categoriaClase}">
              ${categoria || 'Sin categoría'}
            </span>

            <p class="estado ${agotado ? 'agotado' : 'disponible'}">
              ${estado}
            </p>

            ${botonWhatsApp}
          </article>
        `;
      });
    }

    /* ===============================
       EVENTOS
       =============================== */

    renderProductos();

    // Filtro por estado
    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        botones.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');

        filtroEstado = btn.dataset.filtro;
        renderProductos();
      });
    });

    // Buscador
    buscador.addEventListener('input', e => {
      textoBusqueda = normalizar(e.target.value);
      renderProductos();
    });

    // Filtro por categoría
    categoriaSelect.addEventListener('change', e => {
      filtroCategoria = normalizar(e.target.value);
      renderProductos();
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById('productos').innerHTML =
      '<p>Error al cargar los productos.</p>';
  });
