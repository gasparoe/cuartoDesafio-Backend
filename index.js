const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const productManager = require("./src/ProductManager");

//SOCKET
const { Server } = require("socket.io");
const io = new Server(server);

let productos = [];

//INICIALIZAR SOCKET EN EL SERVIDOR
io.on("connection", (socket) => {
  console.log("Usuario conectado");

  //inicialmente Busco los productos en el archivo y los envio por socket
  const instanciaProductManager = new productManager("./products.json");
  instanciaProductManager
    .getProducts()
    .then((products) => {
      productos = products;
      socket.emit("productos", productos);
    })
    .catch((err) => socket.emit("estado", err));

  //Escucho cuando se crea un nuevo producto, actualizo el archivo, y vuelvo a enviar los productos ya con el nuevo cargado
  socket.on("new-product", (data) => {
    const instanciaProductManager = new productManager("./products.json");
    instanciaProductManager
      .addProduct(
        data.title,
        data.description,
        data.code,
        data.price,
        true,
        data.stock,
        data.category,
        []
      )
      .then((estado) => {
        //Envio el estado de la operacion a una etiqueta <em> ubicada debajo del boton de Cargar Productos
        socket.emit("estado", estado);
        instanciaProductManager
          .getProducts()
          .then((products) => {
            productos = products;
          })
          .catch((err) => socket.emit("estado", err));
      })
      .catch((err) => socket.emit("estado", err));

    io.sockets.emit("productos", productos); //ENVIO A TODOS LOS SOCKETS
  });

  //Escucho cuando se presiona en eliminar producto, lo elimino del archivo y vuelvo a enviar la lista de productos
  socket.on("delete-product", (id) => {
    const instanciaProductManager = new productManager("./products.json");
    instanciaProductManager
      .deleteProduct(id)
      .then((estado) => {
        //Envio el estado de la operacion a una etiqueta <em> ubicada debajo del boton de Cargar Productos
        socket.emit("estado", estado);
        instanciaProductManager
          .getProducts()
          .then((products) => {
            productos = products;
          })
          .catch((err) => socket.emit("estado", err));
      })
      .catch((err) => socket.emit("estado", err));

    io.sockets.emit("productos", productos); //ENVIO A TODOS LOS SOCKETS
  });
});

const handlebars = require("express-handlebars");
const routerRealTimeProducts = require("./routes/realTimeProducts.router");

//ROUTES
app.use("/realtimeproducts", routerRealTimeProducts);

//CARPETA PUBLICA ARCHIVOS ESTATICOS
app.use(express.static(__dirname + "/public"));

//CONFIGURACION HANDLEBARS VIEWS Y IMAGES
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("images", __dirname + "/images");
app.set("view engine", "handlebars");

//GET A LA RAIZ
app.get("/", (req, res) => {
  const instanciaProductManager = new productManager("./products.json");
  instanciaProductManager
    .getProducts()
    .then((products) => {
      let data = {
        productos: products,
      };
      res.render("index", data);
    })
    .catch((err) => res.status(500).send({ error: "server error" }));
});

server.listen(8080, () => {
  console.log("Server running on port 8080");
});
