window.addEventListener("load", () => {
  cargarUsuario();
});

function cargarUsuario() {
  fetch("http://192.168.1.100:4040/cargar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Respuesta de error de red o HTTP");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Limpia el contenido de la tabla para evitar duplicados
      const tablaUsuarios = document.getElementById("tablaUsuarios");
      const tbody = tablaUsuarios.getElementsByTagName("tbody")[0];
      tbody.innerHTML = "";

      // Agrega una fila por cada objeto en 'data'
      data.forEach((usuario) => {
        const fila = `
          <tr>
            <td>${usuario.id}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.password}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.numero}</td>
            <td>${usuario.fechaNacimiento}</td>
            <td>
            <button type="button" class="btn btn-danger btn-sm" data-id="${usuario.id}" onclick="btnSeleccionar(this)">Seleccionar</button>
            </td>
          </tr>
        `;
        tbody.innerHTML += fila;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function btnSeleccionar(btn) {
  const idUsuario = btn.getAttribute("data-id");
  alert("ID del botón seleccionado: " + idUsuario);
  // Aquí puedes implementar la lógica para eliminar el usuario con el id 'idUsuario'
  console.log("Eliminar usuario con ID:", idUsuario);
}
