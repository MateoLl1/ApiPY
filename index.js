const express = require("express");
const app = express();
const port = 4040;
const cors = require("cors");

app.use(express.static('ExpressEats'))
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended:false}))

app.use(cors())

app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//Rutas
app.get('/login', (req,res) =>{
  const datos = req.body
  console.log(datos);
  res.send("Seccion Iniciada");
});


app.post('/SingIn',(req,res) =>{
  const datos = req.body;
  console.log(datos);
  const respuesta = {
    Res: false
  }
  res.json(respuesta)
})


const server = app.listen(port, () => {
    console.log(`\x1b[34mServidor Iniciado en ${port}\x1b[37m`);
  });
  
  
  