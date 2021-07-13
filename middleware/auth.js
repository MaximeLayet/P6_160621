//Importation de jsonwebtoken qui crée  et vérifié un token(permet de rester connecter avec son compte)
const jwt = require("jsonwebtoken");

//Export du middleware
module.exports = (req, res, next) => {
	try {
		//Recuperation du token dans le header
		const token = req.headers.authorization.split(" ")[1];
		//Decodage du token avec jwt
		const decodedToken = jwt.verify(token, "bvbdjvdLKlknlknnhjvv");
		//Recup du userId et vérification qu'il correspond à celui du token
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "User ID non valable";
		} else {
			req.body.userFromToken = userId;
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Requête non valide")
		});
	}
};
