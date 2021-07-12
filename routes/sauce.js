//Importation d'express
const express = require("express");
//Création d'un router
const router = express.Router();

//import du controlleur sauceCtrl
const sauceCtrl = require("../controllers/sauce");
//Import du middleware d'authenfication
const auth = require("../middleware/auth");
//Import du middleware multer
const multer = require("../middleware/multer-config");
//Import du middleware isOwner
const isOwner = require("../middleware/isOwner");

//Création des routes pour le CRUD
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/", auth, sauceCtrl.getAllSauce);

router.put("/:id", auth, isOwner, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, isOwner, sauceCtrl.deleteSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

//Export du router
module.exports = router;
