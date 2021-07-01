//Importation package http de Node
const http = require("http");

//Importation app.js
const app = require("./app");

//Renvoi un port valide
const normalizePort = val => {
	const port = parseInt(val, 10);

	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//Recherche des erreurs et les gère de manière approprié puis est enregistré dans le serveur
const errorHandler = error => {
	if (error.syscall !== "listen") {
		throw error;
	}
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges.");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use.");
			process.exit(1);
			break;
		default:
			throw error;
	}
};

//Permet de créer un serveur
const server = http.createServer(app);

//Ecouteur d'événements qui est enregistré, consigne le port ou canal sur lequel le serveur s'execute dans la console
server.on("error", errorHandler);
server.on("listening", () => {
	const address = server.address();
	const bind = typeof address === "string" ? "pipe " + address : "port " + port;
	console.log("Listening on " + bind);
});

//Permet d'écouter le port souhaité
server.listen(port);
