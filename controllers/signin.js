const handleSignin = (req, res, db, bcrypt) => {
	const {email, password} = req.body;
	let status = false;
	db.select('users.*', 'hash')
		.from('users')
		.join('login', 'users.id', 'login.id')
		.where({email: email.trim()})
		.then(recSet => {
				if (recSet.length) {
					if (bcrypt.compareSync(password, recSet[0].hash)) {
							const {id, name, email, entries, joined} = recSet[0];
							status = true;
							res.json({id, name, email, entries, joined});	
						}
				} 
			})
		.finally(err => {status || res.status(400).json('Credentials did not match')});
}

module.exports = {
	handleSignin
}