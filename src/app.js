const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const { getCurrentInvoke } = require('@vendia/serverless-express');
const ejs = require('ejs').__express;
const app = express();
const router = express.Router();

router.use(compression());

router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', (req, res) => {
	const currentInvoke = getCurrentInvoke();
	const { event = {} } = currentInvoke;
	const { requestContext = {}, multiValueHeaders = {} } = event;
	const { stage = '' } = requestContext;
	const { Host = ['localhost:3000'] } = multiValueHeaders;
	const apiUrl = `https://${Host[0]}/${stage}`;
	res.send({
		debug: true,
		success: true,
		apiUrl,
		stage,
	});
});

// router.get('/users', (req, res) => {
// 	res.json(users);
// });

// router.get('/users/:userId', (req, res) => {
// 	const user = getUser(req.params.userId);

// 	if (!user) return res.status(404).json({});

// 	return res.json(user);
// });

// router.post('/users', (req, res) => {
// 	const user = {
// 		id: ++userIdCounter,
// 		name: req.body.name,
// 	};
// 	users.push(user);
// 	res.status(201).json(user);
// });

// router.put('/users/:userId', (req, res) => {
// 	const user = getUser(req.params.userId);

// 	if (!user) return res.status(404).json({});

// 	user.name = req.body.name;
// 	res.json(user);
// });

// router.delete('/users/:userId', (req, res) => {
// 	const userIndex = getUserIndex(req.params.userId);

// 	if (userIndex === -1) return res.status(404).json({});

// 	users.splice(userIndex, 1);
// 	res.json(users);
// });

// router.get('/cookie', (req, res) => {
// 	res.cookie('Foo', 'bar');
// 	res.cookie('Fizz', 'buzz');
// 	res.json({});
// });

// const getUser = (userId) => users.find((u) => u.id === parseInt(userId));
// const getUserIndex = (userId) =>
// 	users.findIndex((u) => u.id === parseInt(userId));

// // Ephemeral in-memory data store
// const users = [
// 	{
// 		id: 1,
// 		name: 'Joe',
// 	},
// 	{
// 		id: 2,
// 		name: 'Jane',
// 	},
// ];
// let userIdCounter = users.length;

// The serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
