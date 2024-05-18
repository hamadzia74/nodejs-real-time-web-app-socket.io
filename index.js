const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/work", (req, res) => {
  res.sendFile(__dirname + "/public/work.html");
});

/* Namespace is creating separation that will be useful when we get to work on rooms.
    So basically, creating an internal endpoint for socket.io to use for rooms like namespace for professional work. 
    Also add authorization to namepsace. */

// Creating a namespace
const professionalWrok = io.of("/professional-work");

professionalWrok.on("connection", (socket) => {
  console.log("user connected");
  socket.on("message", (msg) => {
    console.log(`message: ${msg}`);
    professionalWrok.emit("message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    professionalWrok.emit("message", "user disconnected");
  });
});
