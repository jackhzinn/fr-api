const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const PORT = process.env.PORT ?? 3000;
const DB_HOST = process.env.DB_HOST ?? 'localhost';
const DB_PORT = process.env.DB_PORT ?? 5432;
const DB_USER = process.env.DB_USER ?? 'postgres';
const DB_PSWD = process.env.DB_PSWD ?? 'test';
const DB_NAME = process.env.DB_NAME ?? 'facial_recognition';

const knex = require('knex')
const db = knex({
				  client: 'pg',
				  connection: {
				    host : DB_HOST, //localhost
				    port : DB_PORT,
				    user : DB_USER,
				    password : DB_PSWD,
				    database : DB_NAME
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
app.post('/imageDetect', (req, res) => { image.handleDetectAPI(req, res) });


app.listen(PORT, ()=>{
	console.log(`app is running on port ${PORT}`);
});