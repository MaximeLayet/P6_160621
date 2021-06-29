const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const expressMongoSanitize = require("express-mongo-sanitize");
const expressRateLimit = require("express-rate-limit");

const stuffRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

const app = express();

const limiter = expressRateLimit({
	max: 100,
	windowsMs: 15 * 60 * 1000,
	message: "Trop de requêtes depuis votre adresse IP, merci de réessayer un peu plus tard"
});
app.use("/api", limiter);

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

mongoose
	.connect(
		"mongodb+srv://leonie:4MR1X8qbIWoaZCb3@cluster0.l60sc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", stuffRoutes);
app.use("/api/auth", userRoutes);

app.use(expressMongoSanitize());

module.exports = app;
