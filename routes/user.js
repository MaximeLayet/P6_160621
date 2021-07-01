//Importation d'express
const express = require("express");
//Creation du router
const router = express.Router();
//Pour associer les fonctions aux differentes routes
const userCtrl = require("../controllers/user");

//Creation des routes
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Exportation du router
module.exports = router;
