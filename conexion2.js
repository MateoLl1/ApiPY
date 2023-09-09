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

async function insertarUsuario(
  nombreEm,
  nombreAd,
  eslogan,
  correo,
  password,
  ruc,
  imagen,
  tipoEmpresa
) {
  try {
    // Esperar a que se establezca la conexión antes de realizar el INSERT
    await poolConnect;

    // Consulta SQL INSERT parametrizada
    const consulta = `
      INSERT INTO tbl_usuario (
        em_nombre,
        em_admin,
        em_eslogan,
        em_correo,
        em_password,
        em_ruc,
        em_imagen,
        em_estado,
        ti_e_id
      )
      VALUES (
        @nombreEm,
        @nombreAd,
        @eslogan,
        @correo,
        @password,
        @ruc,
        @imagen,
        'A',
        @tipoEmpresa
      )
    `;

    // Crear un objeto de parámetros
    const parametros = {
      nombreEm,
      nombreAd,
      eslogan,
      correo,
      password,
      ruc,
      imagen,
      tipoEmpresa,
    };

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("nombreEm", sql.NVarChar, parametros.nombreEm)
      .input("nombreAd", sql.NVarChar, parametros.nombreAd)
      .input("eslogan", sql.NVarChar, parametros.eslogan)
      .input("correo", sql.NVarChar, parametros.correo)
      .input("password", sql.NVarChar, parametros.password)
      .input("ruc", sql.NVarChar, parametros.ruc)
      .input("imagen", sql.NVarChar, parametros.imagen)
      .input("tipoEmpresa", sql.Int, parametros.tipoEmpresa)
      .query(consulta);

    console.log("Usuario registrado");
    return true; // Devolver 'true' si el INSERT fue exitoso
  } catch (err) {
    console.error("Error al ingresar usuario", err);
    return false; // Devolver 'false' si ocurrió un error al insertar
  }
}

///USUARIO
module.exports.verificarUsuario = verificarUsuario;
module.exports.insertarUsuario = insertarUsuario;
