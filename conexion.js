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
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((err) => {
    console.error("Error al conectar a la base de datos:", err);
  });

//EMPRESA
async function idEmpresa(id) {
  try {
    await poolConnect;
    const consulta = "SELECT * FROM tbl_empresa WHERE em_id = @id";
    const request = pool.request();
    request.input("id", id);
    const resultado = await request.query(consulta);
    const empresa = resultado.recordset;
    return empresa;
  } catch (err) {
    console.error("Error al obtener las empresas:", err);
  }
}

async function obtenerEmpresas() {
  try {
    const data = [];
    // Esperar a que se establezca la conexión antes de hacer la consulta
    await poolConnect;

    // Consulta SQL
    const consulta =
      "select em_id,em_nombre,em_eslogan,em_imagen from tbl_empresa";

    // Ejecutar la consulta
    const resultado = await pool.request().query(consulta);

    // Los datos están en el atributo recordset del resultado
    const empresas = resultado.recordset;
    return empresas;
  } catch (err) {
    console.error("Error al obtener las empresas:", err);
  }
}
async function obtenerTipoEmpresas() {
  try {
    const data = [];
    // Esperar a que se establezca la conexión antes de hacer la consulta
    await poolConnect;

    // Consulta SQL
    const consulta = "select ti_e_id,ti_e_descri from tbl_tipo_emp";

    // Ejecutar la consulta
    const resultado = await pool.request().query(consulta);

    // Los datos están en el atributo recordset del resultado
    const tipoEmpresas = resultado.recordset;
    return tipoEmpresas;
  } catch (err) {
    console.error("Error al obtener tipo empresas:", err);
  }
}
async function insertarEmpresa(
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
      INSERT INTO tbl_empresa (
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

    console.log("Empresa ingresada correctamente");
    return true; // Devolver 'true' si el INSERT fue exitoso
  } catch (err) {
    console.error("Error al insertar la empresa:", err);
    return false; // Devolver 'false' si ocurrió un error al insertar
  }
}

async function insertarProducto(
  nombre,
  descripcion,
  precio,
  imagen,
  idEmpresa
) {
  try {
    // Esperar a que se establezca la conexión antes de realizar el INSERT
    await poolConnect;

    // Consulta SQL INSERT parametrizada
    const consulta = `
    insert into tbl_producto (pro_nombre,pro_descripcion,pro_imagen,pro_precio,pro_estado,em_id)
    values(@nombre,@descripcion,@imagen,@precio,'A',@idEmpresa)
    `;

    // Crear un objeto de parámetros
    const parametros = {
      nombre,
      descripcion,
      precio,
      idEmpresa,
      imagen,
    };

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("nombre", sql.NVarChar, parametros.nombre)
      .input("descripcion", sql.NVarChar, parametros.descripcion)
      .input("imagen", sql.NVarChar, parametros.imagen)
      .input("precio", sql.Float, parametros.precio)
      .input("idEmpresa", sql.Int, parametros.idEmpresa)
      .query(consulta);

    console.log("Producto ingresado");
    return true; // Devolver 'true' si el INSERT fue exitoso
  } catch (err) {
    console.error("Error ingresado producto ", err);
    return false; // Devolver 'false' si ocurrió un error al insertar
  }
}

async function cargarProductos(id) {
  try {
    await poolConnect;
    const consulta = "SELECT * FROM tbl_producto WHERE em_id = @id";
    const request = pool.request();
    request.input("id", id);
    const resultado = await request.query(consulta);
    const empresa = resultado.recordset;
    return empresa;
  } catch (err) {
    console.error("Error al obtener las empresas:", err);
  }
}

async function actualizarProducto(
  nombreProducto,
  descripcion,
  precio,
  imagen,
  idProducto,
  idEmpresa
) {
  try {
    // Esperar a que se establezca la conexión antes de realizar la actualización
    await poolConnect;

    // Consulta SQL UPDATE parametrizada con WHERE
    const consulta = `
    UPDATE tbl_producto
    SET pro_nombre = @nombre,
        pro_descripcion = @descripcion,
        pro_imagen = @imagen,
        pro_precio = @precio,
        em_id = @idEmpresa
    WHERE pro_id = @idProducto
    `;

    // Crear un objeto de parámetros
    const parametros = {
      idProducto,
      nombreProducto,
      descripcion,
      precio,
      imagen,
      idEmpresa,
    };
    console.log(parametros);

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("idProducto", sql.Int, parametros.idProducto)
      .input("nombre", sql.NVarChar, parametros.nombreProducto)
      .input("descripcion", sql.NVarChar, parametros.descripcion)
      .input("imagen", sql.NVarChar, parametros.imagen)
      .input("precio", sql.Float, parametros.precio)
      .input("idEmpresa", sql.Int, parametros.idEmpresa)
      .query(consulta);
    console.log("Producto actualizado");
    return true;
  } catch (err) {
    console.error("Error al actualizar producto ", err);
    return false;
  }
}

async function eliminarProducto(idProducto) {
  try {
    // Esperar a que se establezca la conexión antes de realizar la eliminación
    await poolConnect;

    // Consulta SQL DELETE parametrizada con WHERE
    const consulta = `
    DELETE FROM tbl_producto
    WHERE pro_id = @idProducto
    `;

    // Crear un objeto de parámetros
    const parametros = {
      idProducto,
    };

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("idProducto", sql.Int, parametros.idProducto)
      .query(consulta);

    console.log("Producto eliminado");
    return true; // Devolver 'true' si la eliminación fue exitosa
  } catch (err) {
    console.error("Error al eliminar producto ", err);
    return false; // Devolver 'false' si ocurrió un error al eliminar
  }
}

async function actualizarEmpresa(
  idEmpresa,
  nombreEmpresa,
  nombreAdmin,
  eslogan,
  correo,
  password,
  ruc,
  imagen,
  tipoEmpresa
) {
  try {
    // Esperar a que se establezca la conexión antes de realizar la actualización
    await poolConnect;

    // Consulta SQL UPDATE parametrizada con WHERE
    const consulta = `
    UPDATE tbl_empresa
    SET em_nombre = @nombre,
        em_admin = @nombreAdmin,
        em_eslogan = @eslogan,
        em_correo = @correo,
        em_password = @password,
        em_ruc = @ruc,
        em_imagen = @imagen,
        ti_e_id = @tiEmpresa
    WHERE em_id = @em_id
    `;

    // Crear un objeto de parámetros
    const parametros = {
      idEmpresa,
      nombreEmpresa,
      nombreAdmin,
      eslogan,
      correo,
      password,
      ruc,
      imagen,
      tipoEmpresa,
    };
    console.log(parametros);

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("em_id", sql.Int, parametros.idEmpresa)
      .input("nombre", sql.NVarChar, parametros.nombreEmpresa)
      .input("nombreAdmin", sql.NVarChar, parametros.nombreAdmin)
      .input("eslogan", sql.NVarChar, parametros.eslogan)
      .input("correo", sql.NVarChar, parametros.correo)
      .input("password", sql.NVarChar, parametros.password)
      .input("ruc", sql.NVarChar, parametros.ruc)
      .input("imagen", sql.NVarChar, parametros.imagen)
      .input("tiEmpresa", sql.Int, parametros.tipoEmpresa)
      .query(consulta);
    console.log("Empresa actualizada");
    return true;
  } catch (err) {
    console.error("Error al actualizar empresa ", err);
    return false;
  }
}

async function eliminarEmpresa(idEmpresa) {
  try {
    // Esperar a que se establezca la conexión antes de realizar la eliminación
    await poolConnect;

    // Consulta SQL DELETE parametrizada con WHERE
    const consulta = `
    DELETE FROM tbl_empresa
    WHERE em_id = @idEmpresa
    `;

    // Crear un objeto de parámetros
    const parametros = {
      idEmpresa,
    };

    // Ejecutar la consulta con parámetros
    await pool
      .request()
      .input("idEmpresa", sql.Int, parametros.idEmpresa)
      .query(consulta);

    console.log("Empresa eliminada");
    return true; // Devolver 'true' si la eliminación fue exitosa
  } catch (err) {
    console.error("Error al eliminar empresa ", err);
    return false; // Devolver 'false' si ocurrió un error al eliminar
  }
}

//empresa modulos
module.exports.obtenerTipoEmpresas = obtenerTipoEmpresas;
module.exports.insertarEmpresa = insertarEmpresa;
module.exports.obtenerEmpresas = obtenerEmpresas;
module.exports.actualizarEmpresa = actualizarEmpresa;
module.exports.idEmpresa = idEmpresa;
module.exports.eliminarEmpresa = eliminarEmpresa;

//PRODUCTOS
module.exports.insertarProducto = insertarProducto;
module.exports.cargarProductos = cargarProductos;
module.exports.actualizarProducto = actualizarProducto;
module.exports.eliminarProducto = eliminarProducto;
