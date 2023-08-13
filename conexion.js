const sql = require("mssql");
const config = {
  user: "sa",
  password: "123456",
  server: "localhost", // Puede ser una dirección IP o el nombre del servidor
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

async function insertarUsuario(
  usuario,
  password,
  cedula,
  correo,
  numero,
  fechaNacimiento
) {
  try {
    // Esperar a que se establezca la conexión antes de realizar el INSERT
    await poolConnect;

    // Consulta SQL INSERT
    const consulta = `INSERT INTO tbl_usuario (usuario, password, cedula, correo, numero, fechaNacimiento)
                      VALUES ('${usuario}', '${password}', '${cedula}', '${correo}', '${numero}', '${fechaNacimiento}')`;

    // Ejecutar la consulta
    await pool.request().query(consulta);

    console.log("Nuevo usuario insertado correctamente");
    return true; // Devolver 'true' si el INSERT fue exitoso
  } catch (err) {
    console.error("Error al insertar el usuario:", err);
    return false; // Devolver 'false' si ocurrió un error al insertar
  }
}

async function eliminarUsuario(idProducto) {
  try {
    // Esperar a que se establezca la conexión antes de hacer la eliminación
    await poolConnect;

    // Consulta SQL para eliminar el producto con el ID proporcionado
    const consulta = `DELETE FROM tbl_usuario WHERE id = ${idProducto}`;

    // Ejecutar la consulta
    await pool.request().query(consulta);

    console.log("Producto eliminado correctamente");
    return true; // Devolver 'true' si se eliminó correctamente
  } catch (err) {
    console.error("Error al eliminar el producto:", err);
    return false; // Devolver 'false' si ocurrió un error al eliminar
  }
}

async function actualizarUsuario(
  idUsuario,
  usuario,
  password,
  cedula,
  correo,
  numero,
  fechaNacimiento
) {
  try {
    // Esperar a que se establezca la conexión antes de hacer la actualización
    await poolConnect;

    // Consulta SQL para la actualización
    const consulta = `UPDATE tbl_usuario
                      SET usuario = '${usuario}',
                          password = '${password}',
                          cedula = '${cedula}',
                          correo = '${correo}',
                          numero = '${numero}',
                          fechaNacimiento = '${fechaNacimiento}'
                      WHERE id = '${idUsuario}'`;

    await pool.request().query(consulta);
    console.log("Usuario actualizado correctamente");
    return true; // Devolver 'true' si la actualización fue exitosa
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    return false; // Devolver 'false' si ocurrió un error al actualizar
  }
}

module.exports.obtenerUsuarios = obtenerUsuarios;
module.exports.insertarUsuario = insertarUsuario;
module.exports.eliminarUsuario = eliminarUsuario;
module.exports.actualizarUsuario = actualizarUsuario;
