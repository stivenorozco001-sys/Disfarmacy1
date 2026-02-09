fetch('https://opensheet.elk.sh/1xS8HxxIUUpCfs6pH--_AN_GttVLohHrEAdKtnTdz4Hs/Hoja%201')
  .then(response => response.json())
  .then(productos => {
    const contenedor = document.getElementById('productos');

    // Mensaje si no hay productos
    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
      return;
    }

    contenedor.innerHTML = '';

    productos.forEach(p => {
      if (!p.nombre || !p.imagen) return;

      const estado = p.estado ? p.estado.trim() : 'Disponible';
      const agotado = estado.toLowerCase() === 'agotado';

      contenedor.innerHTML += `
        <article class="producto" data-estado="${estado}">
          <img 
            src="${p.imagen}" 
            alt="Producto farmacéutico: ${p.nombre}"
            loading="lazy"
          >
          <h3>${p.nombre}</h3>
          <p class="estado ${agotado ? 'agotado' : 'disponible'}">
            ${estado}
          </p>
        </article>
      `;
    });
  })
  .catch(error => {
    console.error('Error cargando productos:', error);

    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '<p>Error al cargar los productos. Intenta más tarde.</p>';
  });
