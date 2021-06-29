const Thing = require("../models/Thing");
const fs = require("fs");

exports.createThing = (req, res, next) => {
	const thingObject = JSON.parse(req.body.sauce);
	const thing = new Thing({
		...thingObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
	});

	thing
		.save()
		.then(() => res.status(201).json({ message: "Sauce crée" }))
		.catch(error => res.status(400).json({ error }));
};

exports.getOneThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then(thing => {
			console.log(thing.userId);
			return res.status(200).json(thing);
		})
		.catch(error => res.status(404).json({ error }));
};

exports.modifyThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id }).then(thing => {
		const filename = thing.imageUrl.split("/images/")[1];
		fs.unlink(`images/${filename}`, () => {
			Thing.deleteOne({ imageUrl: req.params.imageUrl })
				.then(() => res.status(200))
				.catch(error => res.status(400).json({ error }));
		});
	});
	const thingObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
		  }
		: { ...req.body };
	Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Sauce modifiée" }))
		.catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then(thing => {
			const filename = thing.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Thing.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: "Sauce supprimée" }))
					.catch(error => res.status(400).json({ error }));
			});
		})
		.catch(error => res.status(500).json({ error }));
};

exports.getAllThing = (req, res, next) => {
	Thing.find()
		.then(things => {
			res.status(200).json(things);
		})

		.catch(error => res.status(400).json({ error }));
};

//Mise en place des fonctions like/dislike .

exports.likeThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		.then(thing => {
			if (req.body.like === 1) {
				Thing.updateOne(
					{ _id: req.params.id },
					{ $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
				)
					.then(() => res.status(201).json({ message: "like ajouté !" }))
					.catch(error => res.status(400).json({ error }));
			}
			if (req.body.like === -1) {
				Thing.updateOne(
					{ _id: req.params.id },
					{ $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } }
				)
					.then(() => res.status(201).json({ message: "dislike ajouté !" }))
					.catch(error => res.status(400).json({ error }));
			}
			if (req.body.like === 0) {
				if (thing.usersLiked.indexOf(req.body.userId) !== -1) {
					Thing.updateOne(
						{ _id: req.params.id },
						{ $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
					)
						.then(() => res.status(201).json({ message: "Like retiré !" }))
						.catch(error => res.status(400).json({ error }));
				}
				if (thing.usersDisliked.indexOf(req.body.userId) !== -1) {
					Thing.updateOne(
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
