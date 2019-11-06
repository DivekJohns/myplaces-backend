const express = require('express');
const router = express.Router();
const UserController = require('../../controller/client/auth-controller');

// User-Login route
router.post('/login', (req,res)=> {
	UserController.userLogin(req.body).then((data)=>{
		res.status(201).send(data);
	}).catch((err)=>{
		res.status(500).send(err);
	});
});


module.exports = router;