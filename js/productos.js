fetch('https://opensheet.elk.sh/1xS8HxxIUUpCfs6pH--_AN_GttVLohHrEAdKtnTdz4Hs/Hoja%201')
  .then(res => res.json())
  .then(productos => {
    const contenedor = document.getElementById('productos');
    const botones = document.querySelectorAll('.filtro-btn');
    const buscador = document.getElementById('buscadorInput');

    let filtroEstado = 'todos';
    let textoBusqueda = '';

    // 📲 CONFIGURA TU WHATSAPP AQUÍ
    const telefonoWhatsApp = '573242228107'; 

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    // 🔎 Detectar estado sin depender del nombre exacto
    function obtenerEstado(producto) {
      const posiblesClaves = ['estado', 'Estado', 'disponibilidad', 'Disponibilidad'];

      let valor = '';
      posiblesClaves.forEach(clave => {
        if (producto[clave]) valor = producto[clave];
      });

      if (!valor) return 'Disponible';

      const limpio = valor.toString().trim().toLowerCase();
      return limpio === 'agotado' ? 'Agotado' : 'Disponible';
    }

    function renderProductos() {
      contenedor.innerHTML = '';

      const filtrados = productos.filter(p => {
        if (!p.nombre && !p.Nombre) return false;

        const nombre = (p.nombre || p.Nombre).toLowerCase();
        const estado = obtenerEstado(p);

        const coincideTexto = nombre.includes(textoBusqueda);
        const coincideEstado =
          filtroEstado === 'todos' || estado === filtroEstado;

        return coincideTexto && coincideEstado;
      });

      if (filtrados.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron productos.</p>';
        return;
      }

      filtrados.forEach(p => {
        const nombre = p.nombre || p.Nombre;
        const imagen = p.imagen || p.Imagen;
        const estado = obtenerEstado(p);
        const agotado = estado === 'Agotado';

        // 🟢 BOTÓN WHATSAPP SOLO SI ESTÁ DISPONIBLE
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
          <article class="producto">
            <img src="${imagen}" alt="${nombre}" loading="lazy">
            <h3>${nombre}</h3>
            <p class="estado ${agotado ? 'agotado' : 'disponible'}">
              ${estado}
            </p>
            ${botonWhatsApp}
          </article>
        `;
      });
    }

    // Render inicial
    renderProductos();

    // Filtros
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
      textoBusqueda = e.target.value.toLowerCase();
      renderProductos();
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById('productos').innerHTML =
      '<p>Error al cargar los productos.</p>';
  });
