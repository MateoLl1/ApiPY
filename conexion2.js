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

async function insertarFactura(
  descripcionProducto,
  descripcionPrecio,
  total,
  usuarioId,
  empresaId
) {
  try {
    const pool = await poolConnect;

    const consulta = `
      INSERT INTO tbl_factura (fac_fecha, fac_des_pro, fac_des_pre, fac_total, us_id, em_id)
      VALUES (@fac_fecha, @fac_des_pro, @fac_des_pre, @fac_total, @us_id, @em_id)
    `;
    const request = pool.request();
    request.input("fac_fecha", sql.Date, new Date());
    request.input("fac_des_pro", sql.NVarChar, descripcionProducto);
    request.input("fac_des_pre", sql.NVarChar, descripcionPrecio);
    request.input("fac_total", sql.Float, total);
    request.input("us_id", sql.Int, usuarioId);
    request.input("em_id", sql.Int, empresaId);
    const result = await request.query(consulta);
    console.log("Factura Ingresada");
    return true;
  } catch (err) {
    console.error("Error al insertar la factura:", err);
    return false;
  }
}

async function obtenerFacturaPorId(id) {
  try {
    await poolConnect;

    const consulta = `
      SELECT * FROM tbl_factura WHERE us_id = @id
    `;

    const request = pool.request();
    request.input("id", sql.Int, id);

    const resultado = await request.query(consulta);
    const factura = resultado.recordset;

    return factura;
  } catch (err) {
    console.error("Error al obtener la factura por ID:", err);
    return false;
  }
}

///USUARIO

async function obtenerUsuarioPorId(userId) {
  try {
    const pool = await poolConnect;

    const request = pool.request();
    request.input("us_id", sql.Int, userId);

    const query = "SELECT * FROM tbl_usuario WHERE us_id = @us_id";
    const result = await request.query(query);

    const data = result.recordset;
    return data;
  } catch (err) {
    console.error("Error al ejecutar la consulta SQL:", err);
    return false;
  }
}

async function actualizarUsuario(
  userId,
  nombre,
  nickname,
  imagen,
  cedula,
  fechaN
) {
  try {
    const pool = await poolConnect;
    const request = pool.request();

    // Query de actualización
    const query = `
      UPDATE tbl_usuario
      SET
        us_nombre = @nombre,
        us_nick = @nick,
        us_imagen = @imagen,
        us_cedula = @cedula,
        us_nacimiento = @naci
      WHERE us_id = @userId
    `;

    request.input("userId", sql.Int, userId);
    request.input("nombre", sql.VarChar, nombre);
    request.input("nick", sql.VarChar, nickname);
    request.input("imagen", sql.VarChar, imagen);
    request.input("cedula", sql.VarChar, cedula);
    request.input("naci", sql.Date, fechaN);

    const result = await request.query(query);

    console.log("Usuario actualizado con éxito.");
    return true;
  } catch (err) {
    console.error("Error al actualizar el usuario:", err);
    return false;
  }
}

async function obtenerVentasEmpresa(id) {
  try {
    await poolConnect;

    const consulta = `
      SELECT * FROM tbl_factura WHERE em_id = @id
    `;

    const request = pool.request();
    request.input("id", sql.Int, id);

    const resultado = await request.query(consulta);
    const factura = resultado.recordset;

    return factura;
  } catch (err) {
    console.error("Error al obtener informe", err);
    return false;
  }
}

module.exports.verificarUsuario = verificarUsuario;
module.exports.insertarUsuario = insertarUsuario;
module.exports.insertarFactura = insertarFactura;
module.exports.obtenerFacturaPorId = obtenerFacturaPorId;
module.exports.obtenerUsuarioPorId = obtenerUsuarioPorId;
module.exports.actualizarUsuario = actualizarUsuario;
module.exports.obtenerVentasEmpresa = obtenerVentasEmpresa;
