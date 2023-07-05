const express = require("express");
const app = express();
const port = 4040;
const cors = require("cors");
const sql = require('mssql');

//Extensiones utilizadas
app.use(express.static('ExpressEats'))
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:false}))

//VARIABLES GLOBALES
const config = {
  user: 'sa',
  password: '123456',
  server: 'localhost',
  database: 'Prueba',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};



//Middleware
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});




//Rutas
app.post('/login', (req,res) =>{
  const nomLog = req.body.Usuario
  const passLog = req.body.Pass
  async function verificarCredenciales() {
    try {
      await sql.connect(config);
      console.log('Conexión exitosa a SQL Server');
  
      const query = `SELECT usuario, password FROM tbl_usuario WHERE usuario = '${nomLog}' AND password = '${passLog}'`;
      const result = await new sql.Request().query(query);
  
      return result.recordset.length > 0;
    } catch (error) {
      console.log('Error al conectar a SQL Server:', error);
      return false;
    }
  }
  
  const respuesta = {
    Res: null
  }
  
  verificarCredenciales(nomLog,passLog)
    .then((existe) => {
      console.log(`Las credenciales ${nomLog}:${passLog} ${existe}`);
      respuesta.Res = existe
      res.json(respuesta)
    })
    .catch((error) => {
      console.error('Error al verificar las credenciales:', error);
      respuesta.Res = false
      res.json(respuesta)
    });
 
});




app.post('/SingIn',(req,res) =>{
  const objetoRegistro = req.body;
  let respuesta2 = {
    Res: null
  }
  
  async function insertarRegistro(objetoRegistro) {
    try {
      await sql.connect(config);
      console.log('Conexión exitosa a SQL Server');
  
      const query = `
      insert into tbl_usuario (usuario,password,cedula,correo,numero,fechaNacimiento)
      values (@Usuario,@Password,@Cedula,@Correo,@Numero,@Fecha)
      `;
      
      const request = new sql.Request();
      request.input('Usuario', sql.VarChar, objetoRegistro.Nombre);
      request.input('Password', sql.VarChar, objetoRegistro.Pass);
      request.input('Cedula', sql.VarChar, objetoRegistro.Cedula);
      request.input('Correo', sql.VarChar, objetoRegistro.Correo);
      request.input('Numero', sql.VarChar, objetoRegistro.Numero);
      request.input('Fecha', sql.VarChar, objetoRegistro.Nacimiento);
  
      await request.query(query);
  
      console.log('Registro insertado exitosamente');
      respuesta2.Res = true
      res.json(respuesta2) 
    } catch (error) {
      respuesta2.Res = false 
      res.json(respuesta2) 
      console.log('Error al conectar a SQL Server:', error);
    }
  }
  
  
  insertarRegistro(objetoRegistro).catch((error) => {
    console.error('Error al insertar el registro:', error);
    respuesta2.Res = false
    res.json(respuesta2)
  });
  
  
})


const server = app.listen(port, () => {
    console.log(`\x1b[34mServidor Iniciado en ${port}\x1b[37m`);
  });
  
  
  