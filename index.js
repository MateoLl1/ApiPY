const express = require("express");
const app = express();
const port = 4040;
const cors = require("cors");
const sql = require("mssql");
//Extensiones utilizadas
app.use(express.static("ExpressEats"));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

//Datos base de datos
const con = require("./conexion");
const con2 = require("./conexion2");
//Credenciales SQL
const config = {
  user: "sa",
  password: "123456",
  server: "localhost",
  database: "Prueba",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

//Middleware
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//Rutas
app.post("/login", (req, res) => {
  const nomLog = req.body.Usuario;
  const passLog = req.body.Pass;
  async function verificarCredenciales() {
    try {
      await sql.connect(config);
      console.log("Conexión exitosa a SQL Server");

      const query = `SELECT usuario, password FROM tbl_usuario WHERE usuario = '${nomLog}' AND password = '${passLog}'`;
      const result = await new sql.Request().query(query);

      return result.recordset.length > 0;
    } catch (error) {
      console.log("Error al conectar a SQL Server:", error);
      return false;
    }
  }

  //FUNCIONES

  const respuesta = {
    Res: null,
  };

  verificarCredenciales(nomLog, passLog)
    .then((existe) => {
      console.log(`Las credenciales ${nomLog}:${passLog} ${existe}`);
      respuesta.Res = existe;
      res.json(respuesta);
    })
    .catch((error) => {
      console.error("Error al verificar las credenciales:", error);
      respuesta.Res = false;
      res.json(respuesta);
    });
});

//Traer usuarios de la base
async function obtenerYMostrarUsuarios() {
  try {
    const datos = await con.obtenerUsuarios();
    return datos;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}
async function obtenerYMostrarProducto() {
  try {
    const datos = await con2.obtenerProductos();
    return datos;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
  }
}
//Carga los clientes
app.post("/Cargar", async (req, res) => {
  try {
    // Llamamos a la función obtenerYMostrarUsuarios()
    const resultado = await obtenerYMostrarUsuarios();

    // Enviamos el resultado en la respuesta JSON
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener y mostrar usuarios:", error);
    res.status(500).json({ error: "Error al obtener y mostrar usuarios" });
  }
});
//Carga los productos
app.post("/CargarP", async (req, res) => {
  try {
    // Llamamos a la función obtenerYMostrarUsuarios()
    const resultado = await obtenerYMostrarProducto();

    // Enviamos el resultado en la respuesta JSON
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener y mostrar usuarios:", error);
    res.status(500).json({ error: "Error al obtener y mostrar usuarios" });
  }
});
//Inserta Productos
app.post("/Producto", async (req, res) => {
  const Producto = req.body;
  const valor = await con2.insertarProducto(
    Producto.Nombre,
    Producto.Descripcion,
    Producto.Precio
  );
  const respuesta = {
    Res: valor,
  };
  res.json(respuesta);
});
//Elimina Productos
app.post("/EliminarP", async (req, res) => {
  const Producto = req.body;
  console.log(`Registro a eliminar ${Producto.ID}`);
  const respuesta = { Res: await con2.eliminarProducto(Producto.ID) };
  res.json(respuesta);
});

app.post("/actualiP", async (req, res) => {
  const Producto = req.body;
  console.log(`Registro a Actualizar ${Producto.ID}`);
  const respuesta = {
    Res: await con2.actualizarProducto(
      Producto.ID,
      Producto.Nombre,
      Producto.Descripcion,
      Producto.Precio
    ),
  };
  res.json(respuesta);
});

app.post("/actualiUsu", async (req, res) => {
  const Usuario = req.body;
  console.log(`Registro a Actualizar ${Usuario.ID}`);
  const respuesta = {
    Res: await con.actualizarUsuario(
      Usuario.ID,
      Usuario.Nombre,
      Usuario.Pass,
      Usuario.Cedula,
      Usuario.Correo,
      Usuario.Numero,
      Usuario.Nacimiento
    ),
  };
  res.json(respuesta);
});

app.post("/SingIn", async (req, res) => {
  const Usuario = req.body;
  const respuesta = {
    Res: await con.insertarUsuario(
      Usuario.Nombre,
      Usuario.Pass,
      Usuario.Cedula,
      Usuario.Correo,
      Usuario.Numero,
      Usuario.Nacimiento
    ),
  };
  res.json(respuesta);
});

app.post("/EliminarUs", async (req, res) => {
  const Usuario = req.body;
  const respuesta = {
    Res: await con.eliminarUsuario(Usuario.ID),
  };
  res.json(respuesta);
});

const server = app.listen(port, () => {
  console.log(`\x1b[34mServidor Iniciado en ${port}\x1b[37m`);
});
