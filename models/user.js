//Importation Mongoose
const mongoose = require("mongoose");
//Imporation du package MUV
const uniqueValidator = require("mongoose-unique-validator");

//Creation schema user
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});

//Application du unique validator au schema
userSchema.plugin(uniqueValidator);

//Exportation du schema
module.exports = mongoose.model("User", userSchema);
