const express = require("express");
const app = express();
const port = 5050;
const con = require("./conexion");
const cors = require("cors");

//Extensiones utilizadas
app.use(express.static("ExpressEats"));
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: false }));

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

//RUTAS

//CARGA DEL SERVIDOR
const server = app.listen(port, () => {
  console.log(`\x1b[34mServidor Iniciado en ${port}\x1b[37m`);
  console.log(con.conectarSQL());
});
