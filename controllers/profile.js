const handleProfileGet =  (req, res, db) => {
	const {id} = req.params;

	db.select('*').from('users')
		.where({id})
		.then(recSet=>{
			recSet.length ? res.json(recSet[0]) : res.status(400).json('No User found');
		})
		.catch(err=>{
			res.status(400).json('Error fetching user')
		});
};

module.exports = {
	handleProfileGet
}
