const servidor = "http://192.168.1.26:4040";
const txtId = document.getElementById("txtId");
const txtUsu = document.getElementById("txtUsu");
const txtPass = document.getElementById("txtPass");
const txtCed = document.getElementById("txtCed");
const txtCorreo = document.getElementById("txtCorreo");
const txtNum = document.getElementById("txtNum");
const lblFecha = document.getElementById("lblFecha");
const txtFecha = document.getElementById("txtFecha");
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
  btnLimp.addEventListener("click", limpiar);
  btnIns.addEventListener("click", insertarUsuario);
  btnEli.addEventListener("click", eliminarPro);
  var fechaActual = new Date().toISOString().split("T")[0];
  txtFecha.setAttribute("max", fechaActual);
  btnAct.addEventListener("click", actualizarProducto);
});

function cargarUsuario() {
  fetch(`${servidor}/cargar`, {
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
            <td>${usuario.us_id}</td>
            <td>${usuario.us_nombre}</td>
            <td>${usuario.us_password}</td>
            <td>${usuario.us_cedula}</td>
            <td>${usuario.us_correo}</td>
            <td>${usuario.us_telefono}</td>
            <td>${usuario.us_nacimiento}</td>
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
  //alert("ID del botón seleccionado: " + idUsuario);
  txtId.value = idUsuario;

  const fila = btn.parentNode.parentNode;

  // Obtener los elementos de las celdas (<td>) dentro de la fila
  const celdas = fila.querySelectorAll("td");

  // Obtener los valores de las celdas individuales
  const id = celdas[0].textContent;
  const usuario = celdas[1].textContent;
  const password = celdas[2].textContent;
  const cedula = celdas[3].textContent;
  const correo = celdas[4].textContent;
  const numero = celdas[5].textContent;
  const fechaNacimiento = celdas[6].textContent;

  txtUsu.value = usuario;
  txtPass.value = password;
  txtCed.value = cedula;
  txtCorreo.value = correo;
  txtNum.value = numero;
  txtFecha.value = fechaNacimiento;
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
    fetch(`${servidor}/EliminarUs`, {
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
function insertarUsuario() {
  let nombre = txtUsu.value.trim();
  let contra = txtPass.value.trim();
  let cedula = txtCed.value.trim();
  let correo = txtCorreo.value.trim();
  let numero = txtNum.value.trim();
  let fecha = txtFecha.value;

  if (
    nombre === "" ||
    contra === "" ||
    cedula === "" ||
    correo === "" ||
    numero === "" ||
    fecha === ""
  ) {
    mensaje.style.color = "red";
    mensaje.innerHTML = "Llene los campos";
  } else {
    mensaje.style.color = "black";
    mensaje.innerHTML = "";
    const objetoRegistro = {
      Nombre: nombre,
      Pass: contra,
      Cedula: cedula,
      Correo: correo,
      Numero: numero,
      Nacimiento: fecha,
    };

    fetch(`${servidor}/SingIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objetoRegistro),
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
  let nombre = txtUsu.value.trim();
  let contra = txtPass.value.trim();
  let cedula = txtCed.value.trim();
  let correo = txtCorreo.value.trim();
  let numero = txtNum.value.trim();
  let fecha = txtFecha.value;
  let id = txtId.value.trim();
  if (id === "") {
    mensaje.style.color = "red";
    mensaje.innerHTML = "Seleccione un registro";
  } else {
    mensaje.innerHTML = "";
    const objetoRegistro = {
      ID: id,
      Nombre: nombre,
      Pass: contra,
      Cedula: cedula,
      Correo: correo,
      Numero: numero,
      Nacimiento: fecha,
    };
    fetch(`${servidor}/actualiUsu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objetoRegistro),
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

function limpiar() {
  location.reload();
}
