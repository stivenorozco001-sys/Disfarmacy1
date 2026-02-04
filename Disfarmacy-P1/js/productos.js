fetch('/productos')
  .then(response => response.text())
  .then(text => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const links = [...doc.querySelectorAll('a')];

    const contenedor = document.getElementById('productos');

    links.forEach(link => {
      fetch('/productos/' + link.textContent)
        .then(res => res.text())
        .then(content => {
          const nombre = content.match(/nombre: "(.*)"/)?.[1];
          const imagen = content.match(/imagen: "(.*)"/)?.[1];
          const estado = content.match(/estado: "(.*)"/)?.[1];

          if (nombre && imagen) {
            contenedor.innerHTML += `
              <div class="producto">
                <img src="${imagen}" alt="${nombre}">
                <h3>${nombre}</h3>
                <p class="estado ${estado === 'Agotado' ? 'agotado' : ''}">
                  ${estado}
                </p>
              </div>
            `;
          }
        });
    });
  });
