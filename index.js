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
const professionalChat = io.of("/professional-chat");

professionalChat.on("connection", (socket) => {
  // console.log("user connected");
  socket.on("join", (data) => {
    socket.join(data.room);
    professionalChat
      .in(data.room)
      .emit("message", `New user joined ${data.room} room!`);
  });
  socket.on("message", (data) => {
    console.log(`message: ${data.msg}`);
    // professionalChat.emit("message", data.msg);
    professionalChat.in(data.room).emit("message", data.msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    professionalChat.emit("message", "user disconnected");
  });
});
