// Cargar las variables de entorno del archivo .env
require("dotenv").config();

const bodyparser = require("body-parser");

// Importar el módulo Express
const express = require("express");
const app = express();

// Importar las funciones del gestor de frutas
const { leerFrutas, guardarFrutas } = require("./src/frutasManager");
const bodyParser = require("body-parser");

// Configurar el número de puerto para el servidor
const PORT = process.env.PORT || 3000;

// Crear un arreglo vacío para almacenar los datos de las frutas
let BD = [];

// Configurar el middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

app.use(bodyparser.json());

// Middleware para leer los datos de las frutas antes de cada solicitud
app.use((req, res, next) => {
  BD = leerFrutas(); // Leer los datos de las frutas desde el archivo
  next(); // Pasar al siguiente middleware o ruta
});

// Ruta principal que devuelve los datos de las frutas
app.get("/", (req, res) => {
  res.send(BD);
});

// Ruta para agregar una nueva fruta al arreglo y guardar los cambios
app.post("/", (req, res) => {
  const nuevaFruta = req.body;
  BD.push(nuevaFruta); // Agregar la nueva fruta al arreglo
  guardarFrutas(BD); // Guardar los cambios en el archivo
  res.status(201).send("Fruta agregada!"); // Enviar una respuesta exitosa
});






//PUT
app.put("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let product = BD.find((p) => p.id === id);

  if (product !== undefined) {
    product = req.body; //product con nueva info
    BD[id - 1] = product;
    //let indice = BD.findIndex(p => p.id === id); //otra manera es teniendo el indice
    guardarFrutas(BD); //guardo en db
    res.status(200).send("Fruta modificada");
  } else {
    res.status(404).send("Error, fruta inexistente");
  }
});

//DELETE
app.delete("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let existe = BD.some((p) => p.id === id);

  if (existe) {
    let index = BD.findIndex(p => p.id === id);
    BD.splice(index, 1);
    guardarFrutas(BD); //guardo en db
    res.status(200).send("Fruta eliminada");
  } else {
    res.status(404).send("Error, fruta inexistente");
  }
});

app.get("/id/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let product = BD.find((p) => p.id === id);
  res.send(product);
});





// Ruta para manejar las solicitudes a rutas no existentes
app.get("*", (req, res) => {
  res.status(404).send("Lo sentimos, la página que buscas no existe.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
