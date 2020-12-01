// Make Connection
const socket = io();

// Query DOM
const output = document.getElementById("output");
const handle = document.getElementById("handle");
const message = document.getElementById("message");
const send = document.getElementById("send");
const feedback = document.getElementById("feedback");
let timeout;

// Event Listeners
send.addEventListener("click", () => {
	socket.emit("input", {
		handle: handle.value,
		message: message.value,
	});
	message.value = "";
});

// typing function
const timeoutFunction = () => {
	socket.emit("typing", false);
};

message.addEventListener("keyup", () => {
	socket.emit("typing", handle.value);
	clearTimeout(timeout);
	timeout = setTimeout(timeoutFunction, 2000);
});

// Listening for all the doc data from DB
socket.on("output", (data) => {
	if (data.length) {
		data.forEach((chat) => {
			const chatText = `<p><strong>${chat.handle}</strong>: ${chat.message}</p>`;
			output.innerHTML += chatText;
		});
	}
});

socket.on("typing", (data) => {
	if (data) {
		feedback.innerHTML = `<p><em>${data} is typing a message.....</em></p>`;
	} else {
		feedback.innerHTML = "";
	}
});
