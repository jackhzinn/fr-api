const handleProfileGet =  (req, res, db) => {
	const {id_email} = req.params;
	const [id, email] = id_email.split('_');

	db.select('*').from('users')
		.where({id, email})
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
