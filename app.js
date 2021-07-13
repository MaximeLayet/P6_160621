//Importation d'Express
const express = require("express");

//Importation du package body-parser
const bodyParser = require("body-parser");

//Importation du package Mongoose
const mongoose = require("mongoose");
//Import qui donne acces au chemein du systeme de fichier
const path = require("path");

//Import du package EMS (contre les injections)
const expressMongoSanitize = require("express-mongo-sanitize");

//Import du package ERL
const expressRateLimit = require("express-rate-limit");
//Import package dotenv
const dotenv = require("dotenv");
dotenv.config();
const USER_DB = process.env.USER_DB;
const PASSWD = process.env.PASSWD;

//Import du Router
const sauceRoutes = require("./routes/sauce");
//Import du user router
const userRoutes = require("./routes/user");

//Pour appeler la méthode express
const app = express();

//Config de ERL qui va déterminer le nombre de connexion autorisée avec un temps défini pour une adresse IP
const limiter = expressRateLimit({
	max: 100,
	windowsMs: 15 * 60 * 1000,
	message: "Trop de requêtes depuis votre adresse IP, merci de réessayer un peu plus tard"
});
app.use("/api", limiter);

//Middleware général
app.use((req, res, next) => {
	//Autorise tout le monde a accèder à l'API
	res.setHeader("Access-Control-Allow-Origin", "*");
	//Autorise certains headers  et certaines méthodes sur l'objet requete
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

//permet la connexion à MongoDB
mongoose
	.connect(
		"mongodb+srv://leonie:4MR1X8qbIWoaZCb3@cluster0.l60sc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

//Permet de transformer le corps de la requete en objet JavaScript utilisable
app.use(express.json());

//middleware pour les requetes d'image
app.use("/images", express.static(path.join(__dirname, "images")));
//Import du router
app.use("/api/sauces", sauceRoutes);
//Pour enregistrer les routes
app.use("/api/auth", userRoutes);

app.use(expressMongoSanitize());

//Export pour y accèder depuis les autres fichiers
module.exports = app;
