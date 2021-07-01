//importation de bcrypt qui est un modele de cryptage
const bcrypt = require("bcrypt");

//Importation de jsonwebtoken qui crée un token(permet de rester connecter avec son compte)
const jwt = require("jsonwebtoken");

//Import du model user
const User = require("../models/User");

//Permet l'inscription
exports.signup = (req, res, next) => {
	//bcrypt va recupérer le mot de passe, le hacher et le saler
	bcrypt
		.hash(req.body.password, 10)
		.then(hash => {
			//creation de l'utilisateur avec le modele Mongoose
			const user = new User({
				email: req.body.email,
				password: hash
			});
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};

//Permet de se connecter
exports.login = (req, res, next) => {
	//Pour trouver l'utilisateur
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé" });
			}
			//Utilisation de bcrypt pour comparer le mot de passe envoyé avec la requete avec le hash enregistré
			bcrypt
				.compare(req.body.password, user.password)
				.then(valid => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect" });
					}
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
							expiresIn: "24h"
						})
					});
				})
				.catch(error => res.status(500).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};
