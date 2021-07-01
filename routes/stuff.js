//Importation d'express
const express = require("express");
//Création d'un router
const router = express.Router();

//import du controlleur stuffCtrl
const stuffCtrl = require("../controllers/stuff");
//Import du middleware d'authenfication
const auth = require("../middleware/auth");
//Import du middleware multer
const multer = require("../middleware/multer-config");

//Création des routes pour le CRUD
router.post("/", auth, multer, stuffCtrl.createSauce);
router.get("/", auth, stuffCtrl.getAllSauce);

router.put("/:id", auth, multer, stuffCtrl.modifySauce);
router.delete("/:id", auth, stuffCtrl.deleteSauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.post("/:id/like", auth, stuffCtrl.likeSauce);

//Export du router
module.exports = router;
