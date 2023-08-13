//COMPONENTES HTML
const servidor = "http://192.168.1.26:4040";
const txtUsu = document.getElementById("txtUsu");
const txtPassword = document.getElementById("txtPassword");
const btnIniciar = document.getElementById("btnIniciar");
const txtMensaje = document.getElementById("txtMensaje");
const formularioLogin = document.getElementById("formularioLogin");

//Metodo Main

window.addEventListener("load", iniciar);

function iniciar() {
  btnIniciar.addEventListener("click", Validar);
  formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();
  });
}

function Validar() {
  let usuario = txtUsu.value.trim();
  let password = txtPassword.value.trim();
  console.log(usuario);
  console.log(password);
  if (usuario === "" || password === "") {
    txtMensaje.innerHTML = "❌ Llene los campos";
    txtMensaje.style.display = "inline";
    txtMensaje.style.textAlign = "left";
  } else {
    txtMensaje.style.display = "block";
    txtMensaje.style.color = "black";
    txtMensaje.style.textAlign = "right";
    setTimeout(() => {
      txtMensaje.innerHTML = "Comprobando informacion";
      setTimeout(() => {
        txtMensaje.innerHTML = "Comprobando informacion.";
        setTimeout(() => {
          txtMensaje.innerHTML = "Comprobando informacion..";
          setTimeout(() => {
            txtMensaje.innerHTML = "Comprobando informacion...";
            setTimeout(() => {
              const objetoLogIn = {
                Usuario: usuario,
                Pass: password,
              };
              fetch(`${servidor}/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(objetoLogIn),
              })
                .then((response) => response.json())
                .then((data) => {
                  const ResNodeJs = data;
                  console.log("Respuesta del servidor:", data);
                  if (ResNodeJs.Res === true) {
                    txtMensaje.innerHTML = "✔ CREDENCIALES CORRECTAS";
                    txtMensaje.style.color = "green";
                    window.location.href = "./pedidos.html";
                  } else {
                    txtMensaje.innerHTML = "❌ Credenciales Incorrectas";
                    txtMensaje.style.color = "red";
                  }
                })
                .catch((error) =>
                  console.error("Error en la solicitud:", error)
                );
            }, 1000);
          }, 10);
        }, 10);
      }, 10);
    }, 10);
  }
}
