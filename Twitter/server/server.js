const express = require("express");
const app = express();
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes/authRoute");
const postRoutes = require("./Routes/postRoutes/postRoute");
const { Server } = require('socket.io');
const { createServer } = require('http'); 

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["*"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use("/auth", authRoutes);
app.use("/post", postRoutes);


io.on('connection', (socket) => {
    console.log(`User connected with ${socket.id}`);

    socket.on("newPost", (data)=> {
        console.log("received: ", data.email);
        io.emit('updatePost',{data});
    })
});

server.listen(3001, (err) => {
    if(err) return console.log(err);
    console.log('Server running PORT: 3001');
});

app.listen(3000, (err) => {
    if(err) return console.log(err);

    console.log("App running on PORT: 3000");
});
