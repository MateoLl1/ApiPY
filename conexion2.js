const sql = require("mssql");
const config = {
  // user: "mateo",
  // password: "Assassin6890",
  // server: "mateoservice.database.windows.net",
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "Delivery",
  options: {
    encrypt: true, // Establece esto en true si estás utilizando una conexión segura (HTTPS)
    trustServerCertificate: true, // Establece esto en true si deseas confiar en el certificado del servidor
  },
};

// Crear una instancia del cliente SQL Server
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
poolConnect
  .then(() => {})
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

async function verificarUsuario(nombre, pass) {
  try {
    // Esperar a que se establezca la conexión antes de llamar al procedimiento almacenado
    await poolConnect;

    // Crear una solicitud para ejecutar el procedimiento almacenado
    const request = pool.request();
    request.input("nombre", sql.VarChar(50), nombre);
    request.input("pass", sql.VarChar(50), pass);

    // Ejecutar el procedimiento almacenado
    const resultado = await request.execute("verificar_credenciales");
    // Si la respuesta contiene al menos una fila, el usuario y la contraseña coinciden
    return resultado.recordset.length > 0;
  } catch (err) {
    console.error("Error al verificar el usuario:");
    return false;
  }
}

async function ingresarUsuario(nombre, pass, cedula, correo, telf, feNa) {
  try {
    // Esperar a que se establezca la conexión antes de llamar al procedimiento almacenado
    await poolConnect;

    // Crear una solicitud para ejecutar el procedimiento almacenado
    const request = pool.request();
    request.input("us_nombre", sql.VarChar(50), nombre);
    request.input("us_pass", sql.VarChar(50), pass);
    request.input("us_cedula", sql.VarChar(10), cedula);
    request.input("us_correo", sql.VarChar(50), correo);
    request.input("us_telf", sql.VarChar(10), telf);
    request.input("us_feNa", sql.Date, feNa);

    // Ejecutar el procedimiento almacenado
    const resultado = await request.execute("insertar_usuario");
    console.log("Usuario Ingresado");
    return true;
  } catch (err) {
    console.error("Error al registrar");
    return false;
  }
}

module.exports.verificarUsuario = verificarUsuario;
module.exports.ingresarUsuario = ingresarUsuario;
