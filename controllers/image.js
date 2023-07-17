const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users')
		.increment('entries')
		.returning('entries')
		.where({id})
		.then(recSet => {
				res.json({'id': id, 'entries': recSet[0]?.entries});
			})
		.catch(err=>{res.status(400).json('No entries found')});
}

module.exports = {
	handleImage
}