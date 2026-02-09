const URL = 'https://opensheet.elk.sh/1xS8HxxIUUpCfs6pH--_AN_GttVLohHrEAdKtnTdz4Hs/Hoja%201';

const contenedor = document.getElementById('productos');
const buscador = document.getElementById('buscarProducto');

let listaProductos = [];

// Cargar productos
fetch(URL)
  .then(response => response.json())
  .then(productos => {

    if (!productos || productos.length === 0) {
      contenedor.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
      return;
    }

    listaProductos = productos;
    mostrarProductos(listaProductos);
  })
  .catch(error => {
    console.error('Error cargando productos:', error);
    contenedor.innerHTML = '<p>Error al cargar los productos. Intenta más tarde.</p>';
  });


// Función para mostrar productos
function mostrarProductos(productos) {
  contenedor.innerHTML = '';

  if (productos.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }

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
}


// 🔍 BUSCADOR EN TIEMPO REAL
buscador.addEventListener('input', () => {
  const texto = buscador.value.toLowerCase();

  const filtrados = listaProductos.filter(p =>
    p.nombre && p.nombre.toLowerCase().includes(texto)
  );

  mostrarProductos(filtrados);
});
