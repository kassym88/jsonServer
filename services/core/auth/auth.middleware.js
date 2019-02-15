const express = require('express');
const router = express.Router();
const url = require('url');

module.exports = (server) => {

	router.post('/auth/login', (req, res, next) => {
		/*req.on('data', function (data) {
			const body = JSON.parse(data.toString());


			   console.log(body);
			   let users = server.db.getState().users,
		   matchedUser = users.find((user) => {
			   const ret = user.login.toUpperCase() === body.login.toUpperCase();
			   if(ret)console.log(user);
			   return ret;
		   });

		   if(!matchedUser) {
			   res.status(401).send('Wrong username');
		   } else if(matchedUser.password === body.password) {
			   res.json({ token: matchedUser.fakeToken});
		   } else {
			   res.status(401).send("Wrong password");
		   }
		});*/
		const login = req.body.login,
			password = req.body.password;
		console.log('login', login);
		console.log('password', password);
		if(login && password){
            const searchUser = server.db.getState().users.find(user =>
            	user.login.toUpperCase() === login.toUpperCase() && user.password === password
			);
            if(searchUser)
            	res.json({token: searchUser.fakeToken});
            else
            	res.status(401).send('User not found');
		}
		else
			res.status(401).send('Login or/and password not provided');
	});
		
	router.post('/auth/userinfo', (req, res, next) => {
		let users = server.db.getState().users,
			matchedUser = users.find((user) => {
				console.log(user);
				return user.fakeToken === req.header('Authorization');
			});

		if(!matchedUser) {
			res.status(401).send('Unauthorized');
		} else {
			res.json(matchedUser);
		}
	});

	return router;
};
