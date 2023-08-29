const servidor = "https://mateoservice.onrender.com";
let txtNombre = document.getElementById("txtNombre");
let txtUsuario = document.getElementById("txtUsuario");
let txtCedula = document.getElementById("txtCedula");
let txtCorreo = document.getElementById("txtCorreo");
let txtPassword = document.getElementById("txtPassword");
let txtNumero = document.getElementById("txtNumero");
let txtFechaNacimiento = document.getElementById("txtFechaNacimiento");
let imgUsuario = document.getElementById("imgUsuario");
let btnRegistro = document.getElementById("btnRegistro");
let mensaje = document.getElementById("mensaje");

window.addEventListener("load", principal);

function principal() {
  var fechaActual = new Date().toISOString().split("T")[0];
  txtFechaNacimiento.setAttribute("max", fechaActual);
  btnRegistro.addEventListener("click", validar);
}

function validar() {
  let nombre = txtNombre.value.trim();
  let cedula = txtCedula.value.trim();
  let correo = txtCorreo.value.trim();
  let password = txtPassword.value.trim();
  let numero = txtNumero.value.trim();
  let nacimiento = txtFechaNacimiento.value.trim();

  if (
    nombre === "" ||
    cedula === "" ||
    correo === "" ||
    password === "" ||
    numero === "" ||
    nacimiento === ""
  ) {
    mensaje.innerHTML = "⚠ Llene los campos";
    mensaje.style.color = "yellow";
    mensaje.style.display = "block";
  } else {
    mensaje.innerHTML = "✔ Campos Validos";
    mensaje.style.color = "green";
    mensaje.style.display = "block";

    const file = imgUsuario.files[0];
    const formData = new FormData();
    formData.append("imagen", file);

    const objetoRegistro = {
      Nombre: nombre,
      Cedula: cedula,
      Correo: correo,
      Pass: password,
      Numero: numero,
      Nacimiento: nacimiento,
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
          window.location.href = "../Login.html";
        } else {
          mensaje.innerHTML = "❌ Error";
          mensaje.style.color = "red";
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }
}
