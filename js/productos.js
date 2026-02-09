fetch('https://opensheet.elk.sh/1xS8HxxIUUpCfs6pH--_AN_GttVLohHrEAdKtnTdz4Hs/Hoja%201')
  .then(response => response.json())
  .then(productos => {
    const contenedor = document.getElementById('productos');
    const botones = document.querySelectorAll('.filtro-btn');
    const buscador = document.getElementById('buscadorInput');

    let filtroEstado = 'todos';
    let textoBusqueda = '';

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos disponibles.</p>';
      return;
    }

    function renderProductos() {
      contenedor.innerHTML = '';

      const filtrados = productos.filter(p => {
        if (!p.nombre || !p.imagen) return false;

        const nombre = p.nombre.toLowerCase();
        const estado = p.estado ? p.estado.trim() : 'Disponible';

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
        const estado = p.estado ? p.estado.trim() : 'Disponible';
        const agotado = estado.toLowerCase() === 'agotado';

        contenedor.innerHTML += `
          <article class="producto">
            <img src="${p.imagen}" alt="${p.nombre}" loading="lazy">
            <h3>${p.nombre}</h3>
            <p class="estado ${agotado ? 'agotado' : 'disponible'}">
              ${estado}
            </p>
          </article>
        `;
      });
    }

    // Render inicial
    renderProductos();

    // Eventos filtros
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
  .catch(error => {
    console.error(error);
    document.getElementById('productos').innerHTML =
      '<p>Error al cargar los productos.</p>';
  });
