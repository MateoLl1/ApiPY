const servidor = "http://192.168.100.107:4040";
const txtId = document.getElementById("txtId");
const txtNombre = document.getElementById("txtNombre");
const txtDes = document.getElementById("txtDes");
const txtPrecio = document.getElementById("txtPrecio");
const comboEmpresa = document.getElementById("comboEmpresa");
const btnIns = document.getElementById("btnIns");
const btnEli = document.getElementById("btnEli");
const btnAct = document.getElementById("btnAct");
const btnLimp = document.getElementById("btnLimp");
const formularioLogin = document.getElementById("form");

window.addEventListener("load", () => {
  cargarUsuario();
  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();
  });
  btnIns.addEventListener("click", insertarProducto);
  btnEli.addEventListener("click", eliminarPro);
  btnLimp.addEventListener("click", limpiar);
  btnAct.addEventListener("click", actualizarProducto);
});

function cargarUsuario() {
  fetch(`${servidor}/CargarP`, {
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
      data.forEach((producto) => {
        const fila = `
          <tr>
            <td>${producto.pro_id}</td>
            <td>${producto.pro_nombre}</td>
            <td>${producto.pro_descripcion}</td>
            <td>${producto.pro_precio}</td>
            <td>${producto.pro_estado}</td>
            <td>${producto.em_id}</td>
            <td>
            <button type="button" class="btn btn-danger btn-sm" data-id="${producto.pro_id}" onclick="btnSeleccionar(this)">Seleccionar</button>
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
  //alert("ID del botón seleccionado: " + idUsuario);
  txtId.value = idUsuario;
  const fila = btn.parentNode.parentNode;
  const celdas = fila.querySelectorAll("td");

  // Obtener los valores de las celdas individuales
  const proId = celdas[0].textContent;
  const proNombre = celdas[1].textContent;
  const proDescripcion = celdas[2].textContent;
  const proPrecio = celdas[3].textContent;
  const proEstado = celdas[4].textContent;
  const emId = celdas[5].textContent;
  txtNombre.value = proNombre;
  txtDes.value = proDescripcion;
  txtPrecio.value = proPrecio;
}

function eliminarPro() {
  let id = txtId.value.trim();
  if (id == "") {
    mensaje.innerHTML = "Escoja un Registro";
    mensaje.style.color = "red";
  } else {
    const producto = {
      ID: id,
    };
    fetch(`${servidor}/EliminarP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((data) => {
        const ResNodeJs = data;
        console.log("Respuesta del servidor:", data);
        if (ResNodeJs.Res === true) {
          mensaje.innerHTML = "✔ Eliminado";
          mensaje.style.color = "green";
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          mensaje.innerHTML = "❌ Error";
          mensaje.style.color = "red";
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }
}
function insertarProducto() {
  let id = txtId.value.trim();
  let nombre = txtNombre.value.trim();
  let descri = txtDes.value.trim();
  let precio = txtPrecio.value.trim();

  if (nombre === "" || descri === "" || precio == "") {
    mensaje.style.color = "red";
    mensaje.innerHTML = "Llene los campos";
  } else {
    mensaje.innerHTML = "";
    mensaje.style.color = "black";
    const producto = {
      Nombre: nombre,
      Descripcion: descri,
      Precio: precio,
    };
    fetch(`${servidor}/Producto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then((data) => {
        const ResNodeJs = data;
        console.log("Respuesta del servidor:", data);
        if (ResNodeJs.Res === true) {
          mensaje.innerHTML = "✔ Registrado";
          mensaje.style.color = "green";
          setTimeout(() => {
            location.reload();
          }, 1000);
        } else {
          mensaje.innerHTML = "❌ Error";
          mensaje.style.color = "red";
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));

    ////////
  }
}

function actualizarProducto() {
  let id = txtId.value.trim();
  let nombre = txtNombre.value.trim();
  let descri = txtDes.value.trim();
  let precio = txtPrecio.value.trim();

  if (id === "" || nombre === "" || descri === "" || precio == "") {
    mensaje.style.color = "red";
    mensaje.innerHTML = "Llene los campos";
  } else {
    if (precio <= 0) {
      mensaje.style.color = "red";
      mensaje.innerHTML = "ID invalido";
    } else {
      mensaje.innerHTML = "";
      const producto = {
        ID: txtId.value,
        Nombre: nombre,
        Descripcion: descri,
        Precio: precio,
      };
      fetch(`${servidor}/actualiP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      })
        .then((response) => response.json())
        .then((data) => {
          const ResNodeJs = data;
          console.log("Respuesta del servidor:", data);
          if (ResNodeJs.Res === true) {
            mensaje.innerHTML = "✔ Actualizado";
            mensaje.style.color = "green";
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else {
            mensaje.innerHTML = "❌ Error";
            mensaje.style.color = "red";
          }
        })
        .catch((error) => console.error("Error en la solicitud:", error));

      ////////
    }
  }
}

function limpiar() {
  location.reload();
}
