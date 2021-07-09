const Sauce = require("../models/Sauce");

module.exports = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id }).then(sauce => {
		if (sauce.userId !== req.body.userFromToken) {
			throw "Requête non autorisée";
		} else {
			next();
		}
	});
};
