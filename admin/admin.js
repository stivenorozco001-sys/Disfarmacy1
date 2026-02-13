const PASSWORD = "disfarmacy2026*"; // 🔐 Cambia esto si quieres

let productos = [];
let editIndex = null;

/* ===== LOGIN ===== */
function verificarPassword() {
  const input = document.getElementById("passwordInput").value;

  if (input === PASSWORD) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    cargarProductos();
  } else {
    alert("Contraseña incorrecta");
  }
}

/* ===== CARGAR JSON ===== */
function cargarProductos() {
  fetch("../productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      renderLista();
    })
    .catch(() => {
      console.log("No se pudo cargar productos.json");
    });
}

/* ===== GUARDAR ===== */
function guardarProducto() {
  const nombre = document.getElementById("nombre").value.trim();
  const imagen = document.getElementById("imagen").value.trim();
  const estado = document.getElementById("estado").value;
  const categoria = document.getElementById("categoria").value;

  if (!nombre || !imagen) {
    alert("Nombre e imagen son obligatorios");
    return;
  }

  const producto = { nombre, imagen, estado, categoria };

  if (editIndex !== null) {
    productos[editIndex] = producto;
    editIndex = null;
  } else {
    productos.push(producto);
  }

  limpiarFormulario();
  renderLista();
}

/* ===== LISTAR CON BUSCADOR Y FILTRO ===== */
function renderLista() {
  const lista = document.getElementById("listaProductos");
  const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
  const filtroCategoria = document.getElementById("filtroCategoria").value;

  lista.innerHTML = "";

  productos
    .filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda) &&
      (filtroCategoria === "" || p.categoria === filtroCategoria)
    )
    .forEach((p, index) => {

      // 🔥 Normalizamos estado (importa mayúscula/minúscula)
      const estadoNormalizado = (p.estado || "").toLowerCase();

      const claseEstado =
        estadoNormalizado === "disponible"
          ? "estado-disponible"
          : "estado-agotado";

      // Mostrar bonito capitalizado
      const estadoMostrar =
        estadoNormalizado === "disponible"
          ? "Disponible"
          : "Agotado";

      lista.innerHTML += `
        <div class="producto-item">
          <span>
            <strong>${p.nombre}</strong> |
            ${p.categoria} |
            <span class="${claseEstado}">
              ${estadoMostrar}
            </span>
          </span>
          <div>
            <button onclick="editarProducto(${index})">Editar</button>
            <button class="eliminar" onclick="eliminarProducto(${index})">
              Eliminar
            </button>
          </div>
        </div>
      `;
    });
}

/* ===== EDITAR ===== */
function editarProducto(index) {
  const p = productos[index];

  document.getElementById("nombre").value = p.nombre;
  document.getElementById("imagen").value = p.imagen;
  document.getElementById("estado").value =
    p.estado.toLowerCase() === "disponible"
      ? "Disponible"
      : "Agotado";
  document.getElementById("categoria").value = p.categoria;

  editIndex = index;
}

/* ===== ELIMINAR ===== */
function eliminarProducto(index) {
  productos.splice(index, 1);
  renderLista();
}

/* ===== LIMPIAR ===== */
function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("imagen").value = "";
  document.getElementById("estado").value = "Disponible";
  document.getElementById("categoria").value = "insumos";
}

/* ===== DESCARGAR ===== */
function descargarJSON() {
  const dataStr = JSON.stringify(productos, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "productos.json";
  a.click();

  URL.revokeObjectURL(url);
}
