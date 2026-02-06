fetch('https://opensheet.elk.sh/TU_SHEET_ID/Hoja1')
  .then(response => response.json())
  .then(productos => {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

    productos.forEach(p => {
      if (!p.nombre || !p.imagen) return;

      contenedor.innerHTML += `
        <div class="producto">
          <img src="${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p class="estado ${p.estado === 'Agotado' ? 'agotado' : ''}">
            ${p.estado || 'Disponible'}
          </p>
        </div>
      `;
    });
  })
  .catch(error => {
    console.error('Error cargando productos:', error);
  });
