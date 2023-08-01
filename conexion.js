const sql = require("mssql");
const config = {
  user: "sa",
  password: "123456",
  server: "localhost", // Puede ser una dirección IP o el nombre del servidor
  database: "Prueba",
  options: {
    encrypt: true, // Establece esto en true si estás utilizando una conexión segura (HTTPS)
    trustServerCertificate: true, // Establece esto en true si deseas confiar en el certificado del servidor
  },
};

// Crear una instancia del cliente SQL Server
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();
poolConnect
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

async function obtenerUsuarios() {
  try {
    const data = [];
    // Esperar a que se establezca la conexión antes de hacer la consulta
    await poolConnect;

    // Consulta SQL
    const consulta = "SELECT * FROM tbl_usuario";

    // Ejecutar la consulta
    const resultado = await pool.request().query(consulta);

    // Los datos están en el atributo recordset del resultado
    const usuarios = resultado.recordset;
    //console.log(usuarios);

    return usuarios;
    // Hacer lo que necesites con el objeto 'usuarios' aquí
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}

module.exports.obtenerUsuarios = obtenerUsuarios;
