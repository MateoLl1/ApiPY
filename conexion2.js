const sql = require("mssql");
const configCloud = {
  user: "mateo",
  password: "Assassin6890",
  server: "mssql-144847-0.cloudclusters.net",
  port: 19465,
  database: "delivery",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
const configAzure = {
  user: "mateo",
  password: "Assassin6890",
  server: "mateo.database.windows.net",
  database: "delivery",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
const config = {
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "delivery",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Crear una instancia del cliente SQL Server
const pool = new sql.ConnectionPool(configCloud);
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

    const resultado = await request.execute("verificar_credenciales");
    const usuario = resultado.recordset[0];

    // Si la respuesta contiene al menos un registro, el usuario y la contraseña coinciden
    if (usuario) {
      return { success: true, usuario };
    } else {
      return { success: true, usuario: null };
    }
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
    await sql.connect(configCloud);

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
    const usuario = result.recordset[0];

    if (usuario) {
      return { success: true, usuario };
    } else {
      return { success: true, usuario: null };
    }
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
