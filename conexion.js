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

async function conectarSQL() {
  try {
    // Intenta conectarte a SQL Server
    await sql.connect(config);
    console.log("Conexión exitosa a SQL Server");

    sql.close();
    console.log("Conexión cerrada correctamente");
  } catch (error) {
    console.log("Error al conectar a SQL Server:", error);
  }
}

module.exports.conectarSQL = conectarSQL;
