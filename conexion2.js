const sql = require("mssql");
const config = {
  user: "mateo",
  password: "Assassin6890",
  server: "mateoservice.database.windows.net",
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

async function obtenerProductos() {
  try {
    const data = [];
    // Esperar a que se establezca la conexión antes de hacer la consulta
    await poolConnect;

    // Consulta SQL
    const consulta = "SELECT * FROM tbl_producto";

    // Ejecutar la consulta
    const resultado = await pool.request().query(consulta);

    // Los datos están en el atributo recordset del resultado
    const productos = resultado.recordset;
    //console.log(usuarios);

    return productos;
    // Hacer lo que necesites con el objeto 'usuarios' aquí
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}

async function insertarProducto(nombre, descripcion, precio) {
  try {
    // Esperar a que se establezca la conexión antes de hacer la inserción
    await poolConnect;

    // Consulta SQL para insertar el producto
    const consulta = `
      INSERT INTO tbl_producto (pro_nombre, pro_descripcion, pro_precio, pro_estado)
      VALUES ('${nombre}', '${descripcion}', ${precio}, 'A')
    `;

    // Ejecutar la consulta
    await pool.request().query(consulta);

    console.log("Producto insertado correctamente");
  } catch (err) {
    console.error("Error al insertar el producto:", err);
    return false;
  }
  return true;
}

async function eliminarProducto(idProducto) {
  try {
    // Esperar a que se establezca la conexión antes de hacer la eliminación
    await poolConnect;

    // Consulta SQL para eliminar el producto con el ID proporcionado
    const consulta = `DELETE FROM tbl_producto WHERE pro_id = ${idProducto}`;

    // Ejecutar la consulta
    await pool.request().query(consulta);

    console.log("Producto eliminado correctamente");
    return true; // Devolver 'true' si se eliminó correctamente
  } catch (err) {
    console.error("Error al eliminar el producto:", err);
    return false; // Devolver 'false' si ocurrió un error al eliminar
  }
}

async function actualizarProducto(idProducto, nombre, descripcion, precio) {
  try {
    // Esperar a que se establezca la conexión antes de hacer la actualización
    await poolConnect;

    // Consulta SQL para la actualización
    const consulta = `UPDATE tbl_producto
                      SET pro_nombre = '${nombre}',
                          pro_descripcion = '${descripcion}',
                          pro_precio = ${precio}
                      WHERE pro_id = ${idProducto}`;

    // Ejecutar la consulta
    await pool.request().query(consulta);

    console.log("Producto actualizado correctamente");
    return true; // Devolver 'true' si la actualización fue exitosa
  } catch (err) {
    console.error("Error al actualizar el producto:", err);
    return false; // Devolver 'false' si ocurrió un error al actualizar
  }
}

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
module.exports.insertarProducto = insertarProducto;
module.exports.eliminarProducto = eliminarProducto;
module.exports.obtenerProductos = obtenerProductos;
module.exports.actualizarProducto = actualizarProducto;
