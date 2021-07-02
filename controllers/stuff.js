//Imports des sauces(schema)
const Sauce = require("../models/Sauce");

//Permet de travailler avec les fichiers de l'ordinateur
const fs = require("fs");

//Création des sauces
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	const sauce = new Sauce({
		...sauceObject,
		//Creation de l'url de l'image de maniere dynamique
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
	});

	sauce
		//enregistre la sauce dans la BDD
		.save()
		.then(() => res.status(201).json({ message: "Sauce crée" }))
		.catch(error => res.status(400).json({ error }));
};

//Permet l'affichage d'une sauce
exports.getOneSauce = (req, res, next) => {
	//Recup de l'ID
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			console.log(sauce.userId);
			return res.status(200).json(sauce);
		})
		.catch(error => res.status(404).json({ error }));
};

//Permet de modifier une sauce avec suppression de l'ancienne photo si la photo est modifiée
exports.modifySauce = (req, res, next) => {
	if (req.file) {
		Sauce.findOne({ _id: req.params.id }).then(sauce => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {});
		});
	}
	//pour vérifier sur req.file existe sinon création
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
		  }
		: { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce modifiée" }))
		.catch(error => res.status(400).json({ error }));
};

//Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée" }))
					.catch(error => res.status(400).json({ error }));
			});
		})
		.catch(error => res.status(500).json({ error }));
};

//Affiche toutes les sauces
exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then(sauces => {
			res.status(200).json(sauces);
		})

		.catch(error => res.status(400).json({ error }));
};

//Mise en place des fonctions like/dislike
exports.likeSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			if (req.body.like === 1) {
				Sauce.updateOne(
					{ _id: req.params.id },
					{ $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
				)
					.then(() => res.status(201).json({ message: "like ajouté !" }))
					.catch(error => res.status(400).json({ error }));
			}
			if (req.body.like === -1) {
				Sauce.updateOne(
					{ _id: req.params.id },
					{ $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } }
				)
					.then(() => res.status(201).json({ message: "dislike ajouté !" }))
					.catch(error => res.status(400).json({ error }));
			}
			if (req.body.like === 0) {
				if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
					)
						.then(() => res.status(201).json({ message: "Like retiré !" }))
						.catch(error => res.status(400).json({ error }));
				}
				if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
					Sauce.updateOne(
						{ _id: req.params.id },
						{
							$pull: { usersDisliked: req.body.userId },
							$inc: { dislikes: -1 }
						}
					)
						.then(() => res.status(201).json({ message: "Dislike retiré !" }))
						.catch(error => res.status(400).json({ error }));
				}
			}
		})
		.catch(error => res.status(400).json({ error }));
};
