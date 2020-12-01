const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
	handle: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
});

const Chat = mongoose.model("chat", chatSchema);

module.exports = Chat;
