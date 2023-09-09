const sql = require("mssql");
const config = {
  user: "mateo",
  password: "Assassin6890",
  server: "mateo.database.windows.net",
  // user: "sa",
  // password: "123456",
  // server: "localhost",
  database: "delivery",
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

async function insertarUsuario(
  nombre,
  nickname,
  password,
  imagen,
  cedula,
  telefono,
  Nacimiento,
  Hoy
) {
  try {
    await sql.connect(config);

    const request = new sql.Request();

    request.input("us_nombre", sql.VarChar(50), nombre);
    request.input("us_nick", sql.VarChar(50), nickname);
    request.input("us_pass", sql.VarChar(50), password);
    request.input("us_imagen", sql.VarChar(50), imagen);
    request.input("us_cedula", sql.VarChar(10), cedula);
    request.input("us_telf", sql.VarChar(10), telefono);
    request.input("us_feNa", sql.Date, new Date(Nacimiento));
    request.input("us_registro", sql.Date, new Date());

    const result = await request.execute("insertar_usuario");
    console.error("Usuario ingresado");
    return true;
  } catch (err) {
    console.error("Error al ejecutar el procedimiento almacenado:", err);
    return false;
  } finally {
    sql.close();
  }
}

///USUARIO
module.exports.verificarUsuario = verificarUsuario;
module.exports.insertarUsuario = insertarUsuario;
