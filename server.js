const express = require("express");
const http = require("http");
const socket = require("socket.io");
const mongoose = require("mongoose");
const Chat = require("./model/chatschema");
require("dotenv").config({ path: "./config/config.env" });

// App Initialization
const app = express();
const server = http.createServer(app);
const io = socket(server);

// Port config
const PORT = process.env.PORT || 6000;

// Static Files
app.use(express.static("public"));

// DB Connect URI
const dbUri = process.env.MONGO_URI;

// Establish connection to the mongodb database
// listening for request only after database connection is successful
mongoose
	.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("DB Connection Successfull!");

		// Server listning for requests
		server.listen(PORT, () => {
			console.log(`Server running on ${PORT}`);
		});

		// Listening for connections made
		io.on("connection", (socket) => {
			console.log("made socket connection");

			// Getting chats from the database
			Chat.find()
				.limit(100)
				.then((data) => {
					const users = data;
					socket.emit("output", data);
				})
				.catch((err) => console.log(err));

			// Handle input events
			socket.on("input", (data) => {
				let handle = data.handle;
				let message = data.message;

				if (handle == "" || message == "") {
					console.log("Name or Message is blank");
				} else {
					const chat = new Chat({ handle, message });
					chat.save()
						.then((data) => {
							io.emit("output", [data]);
						})
						.catch((err) => console.log(err));
				}
			});

			socket.on("typing", (data) => {
				socket.broadcast.emit("typing", data);
			});
		});
	})
	.catch((err) => console.log(err));
