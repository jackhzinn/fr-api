const handleRegister = (req, res, db, bcrypt) => {
	const {email, name, password} = req.body;
	db.transaction(trx => {
		trx.insert({
			'email': email.trim(),
			'name': name.trim(),
			})
			.into('users')
			.returning('*')
			.then(recSet => { // Return all columns... ID most importantly
				const id = recSet[0]?.id; 
				if (!!id) {	// If ID exists, hash it and store it in Login
		  			bcrypt.hash(password, null, null, (err, hash)=>{
		  					trx.insert({'id':id, 'hash':hash})
		  						.into('login')
		  						.returning('id')
		  						.then(recSet=> {
		  							if (!recSet.length) {
		  								console.log('ID', id, 'failure to store hash');
		  								throw new Error('failure to store hash!'); // Rollback on catch
		  							} 
		  						})
		  						.then(trx.commit);
		  				});
		  			res.json(recSet[0]);
				} else {
					throw new Error('No user to register'); // auto-rollbakck in .catch
				}
		  	})
		  	.catch(err=>{res.status(400).json('Unable to Register')}); // 
	});
};

module.exports = {
	handleRegister
}
