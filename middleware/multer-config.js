//Import du package multer
const multer = require("multer");

//Dictionnaire des differents fichier images possibles
const MIME_TYPES = {
	"image/jpg": "jpg",
	"image/jpeg": "jpg",
	"image/png": "png"
};

//Creation d'un objet de config pour multer avec enregistrement
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "images");
	},
	//nom de fichier utilisé avec creation du nom du fichier
	filename: (req, file, callback) => {
		const name = file.originalname.split(" ").join("_");
		const extension = MIME_TYPES[file.mimetype];
		callback(null, name + Date.now() + "." + extension);
	}
});

//Export du middleware
module.exports = multer({ storage }).single("image");
