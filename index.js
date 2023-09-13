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

//USUARIO CRUD
app.post("/login", async (req, res) => {
  const Usuario = req.body;
  console.log(Usuario);
  const Resultado = {
    Res: await con2.verificarUsuario(Usuario.Usuario, Usuario.Pass),
  };
  res.json(Resultado);
});

app.post("/registrarUsuario", async (req, res) => {
  const Usuario = req.body;
  console.log(Usuario);
  const respuesta = {
    Res: await con2.insertarUsuario(
      Usuario.nombre,
      Usuario.nickname,
      Usuario.password,
      Usuario.imagen,
      Usuario.cedula,
      Usuario.telefono,
      Usuario.Nacimiento,
      Usuario.Hoy
    ),
  };
  res.json(respuesta);
});

//EMPRESA CRUD

app.post("/tipoEmpresa", async (req, res) => {
  try {
    // Llamamos a la función obtenerYMostrarUsuarios()
    const resultado = await con.obtenerTipoEmpresas();

    // Enviamos el resultado en la respuesta JSON
    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener y mostrar tipo empresas:", error);
    res.status(500).json({ error: "Error al obtener y mostrar tipo empresas" });
  }
});

app.post("/cargarEmpresa", async (req, res) => {
  try {
    const resultado = await con.obtenerEmpresas();

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener las empresas", error);
    res.status(500).json({ error: "Error al obtener las empresas" });
  }
});

app.post("/registrarEmpresa", async (req, res) => {
  const empresa = req.body;
  const respuesta = {
    Res: await con.insertarEmpresa(
      empresa.nombreEmpresa,
      empresa.nombreAdmin,
      empresa.eslogan,
      empresa.correo,
      empresa.password,
      empresa.ruc,
      empresa.imagen,
      empresa.tipoEmpresa
    ),
  };
  res.json(respuesta);
});

app.post("/idEmpresa", async (req, res) => {
  const empresa = req.body;
  const respuesta = {
    Res: await con.idEmpresa(empresa.id),
  };
  res.json(respuesta);
});

//PRODUCTOS CRUD

app.post("/insertarProducto", async (req, res) => {
  const productos = req.body;
  const respuesta = {
    Res: await con.insertarProducto(
      productos.nombre,
      productos.descripcion,
      productos.precio,
      productos.imagen,
      productos.idEmpresa
    ),
  };
  res.json(respuesta);
});

app.post("/idProductos", async (req, res) => {
  const empresa = req.body;
  try {
    const resultado = await con.cargarProductos(empresa.id);
    res.json(resultado);
  } catch (error) {
    console.error("Error cargar producto", error);
    res.status(500).json({ error: "Error al obtener las productos" });
  }
});

app.post("/actualizarProducto", async (req, res) => {
  const productos = req.body;
  const respuesta = {
    Res: await con.actualizarProducto(
      productos.nombreProducto,
      productos.descripcion,
      productos.precio,
      productos.imagen,
      productos.idProducto,
      productos.idEmpresa
    ),
  };
  res.json(respuesta);
});

app.post("/eliminarProducto", async (req, res) => {
  const productos = req.body;
  const respuesta = {
    Res: await con.eliminarProducto(productos.idProducto),
  };
  res.json(respuesta);
});

app.post("/actualizarEmpresa", async (req, res) => {
  const empresa = req.body;
  const respuesta = {
    Res: await con.actualizarEmpresa(
      empresa.idEmpresa,
      empresa.nombreEmpresa,
      empresa.nombreAdmin,
      empresa.eslogan,
      empresa.correo,
      empresa.password,
      empresa.ruc,
      empresa.imagen,
      empresa.tipoEmpresa
    ),
  };
  res.json(respuesta);
});

app.post("/eliminarEmpresa", async (req, res) => {
  const empresa = req.body;
  console.log(empresa);
  const respuesta = {
    Res: await con.eliminarEmpresa(empresa.idEmpresa),
  };
  res.json(respuesta);
});

//FACTURA
app.post("/generarFactura", async (req, res) => {
  const factura = req.body;
  const respuesta = {
    Res: await con2.insertarFactura(
      factura.desProd,
      factura.desPrecio,
      factura.total,
      factura.us_id,
      factura.em_id
    ),
  };
  res.json(respuesta);
});

app.post("/facturaId", async (req, res) => {
  const factura = req.body;
  const respuesta = {
    Res: await con2.obtenerFacturaPorId(factura.us_id),
  };
  res.json(respuesta);
});

const server = app.listen(port, async () => {
  console.log(`\x1b[34mServidor Iniciado en ${port}\x1b[37m`);
});
