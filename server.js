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

/* Controllers */
const register = require('./controllers/register');
const signin   = require('./controllers/signin');
const profile  = require('./controllers/profile');
const image    = require('./controllers/image');


/* Filters:*/ 
app.use(express.json());	// parse JSON
app.use(cors());			//Cross Origin


/* Routes */
app.get('/', (req, res) => { /*res.json(database.users);*/ });


app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id_email', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.listen(3000, ()=>{
	console.log('app is running');
});