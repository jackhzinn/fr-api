const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const database = {
	users: [
			{id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
			},
			{id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
			}
		]
}

/* Routes:*/ 

app.use(express.json());	// parse JSON
app.use(cors());			//Cross Origin

app.get('/', (req, res) => {
	res.json(database.users);
});

app.post('/signin', (req, res) => {
/*	
	bcrypt.compare('apples', '$2a$10$ew9MsxAqJDLbfN31dnb/9.OOZXA7e9z4VX7wJa8SVngg/lSa711RG', (err, res) => {
		console.log('true guess', res)
	})
	bcrypt.compare('bananas', '$2a$10$ew9MsxAqJDLbfN31dnb/9.OOZXA7e9z4VX7wJa8SVngg/lSa711RG', (err, res) => {
		console.log('false guess', res)
	})
*/
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password ) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const {email, name, password} = req.body;
/*
	bcrypt.hash(password, null, null, (err, hash)=> {
		console.log(password, hash);
	});
*/
	database.users.push(
		{	id: '125',
			name: name,
			email: email,
			password: password,
			entries: 0,
			joined: new Date()
		}
	);
	res.json(database.users.at(-1));
});

app.get('/profile/:id', (req, res) => {
	const {id} = req.params;
	if (!database.users.some(user => {
			if (user.id === id) {
				res.json(user);
				return true;
			}
				return false;
			})) {
		res.status(404).json('no such user');
	}

});

app.put('/image', (req, res) => {
	const {id} = req.body;
	if (!database.users.some(user => {
			if (user.id === id) {
				user.entries++;
				res.json({"entries":user.entries});
				return true;
			}
				return false;
			})) {
		res.status(404).json('no such user');
	}
});

app.listen(3000, ()=>{
	console.log('app is running');
});