//Recuperation d'une sauce
//Recuperation de la personne connecté
//comparaison des deux
// if ==== true
// next()
//else (error)


module.exports = (req, res, next) => {
    try{
        const findOneSauce = req.params.sauce;
        const userId = req.params.user;
        if(findOneSauce && userId !== true){
            throw "ERROR";
        } else {
            next();
        }
    } catch {
		res.status(401).json({
			error: new Error("Requête non valide")
		});
}