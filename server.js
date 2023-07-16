const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex')
const db = knex({
				  client: 'pg',
				  connection: {
				    host : '127.0.0.1', //localhost
				    port : 5432,
				    user : 'postgres',
				    password : 'test',
				    database : 'facial_recognition'
				  }
				});

/* Routes:*/ 

app.use(express.json());	// parse JSON
app.use(cors());			//Cross Origin

app.get('/', (req, res) => {
//	res.json(database.users);
});

app.post('/signin', (req, res) => {
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
});

app.post('/register', (req, res) => {
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
});

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;

	db.select('*').from('users')
		.where({id})
		.then(recSet=>{
			recSet.length ? res.json(recSet[0]) : res.status(400).json('No User found');
		})
		.catch(err=>{
			res.status(400).json('Error fetching user')
		});
});

app.put('/image', (req, res) => {
	const {id} = req.body;
	db('users')
		.increment('entries')
		.returning('entries')
		.where({id})
		.then(recSet => {
				res.json({'id': id, 'entries': recSet[0]?.entries});
			})
		.catch(err=>{res.status(400).json('No entries found')});
});

app.listen(3000, ()=>{
	console.log('app is running');
});