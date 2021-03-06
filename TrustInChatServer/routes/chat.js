var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

var Message = require('../models/message');
var Session = require('../models/session');

router.use('/', function(req, res, next) {
	var cert = fs.readFileSync(path.join(__dirname, 'rsa', 'public.pem'));
	jwt.verify(req.query.token, cert, { algorithms: ['RS256'] }, function(err, decoded) {
		if (err) {
			return res.status(401).json({
				title: 'Authentication failed',
				error: err
			});
		}
		next();
	});
});

router.get('/', function(req, res, next) {
	var decoded = jwt.decode(req.query.token);

	Session.find({serverSessionId: req.query.serverSessionId}, function(err, session) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!session) {
			return res.status(500).json({
				title: 'Session Closed',
				error: {message: 'Session not found!'}
			});
		}
		if (!session[0]) {
			return res.status(500).json({
				title: 'Session Closed',
				error: {message: 'User closed the session!'}
			});
		}
		var sessionId = session[0]._id;

		Message.find({session: sessionId})
			.populate('session', 'fromEmail toEmail serverSessionId')
			.exec(function(err, messages) {
				if (err) {
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				}
				res.status(200).json({
					message: 'Success',
					obj: messages
				});
			});
	});
});

router.post('/', function(req, res, next) {
	var decoded = jwt.decode(req.query.token);

	Session.findById(decoded.session._id, function(err, session) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!session) {
			return res.status(401).json({
				title: 'Session Closed',
				error: {message: 'Remote user closed session.'}
			});
		}
		var message = new Message({
			encryptedMessage: req.body.encryptedMessage,
			messageSalt: req.body.newMessageSalt,
			messageSecretValidation: req.body.newMessageSecretValidation,
			messageIntegrity: req.body.newMessageIntegrity,
			user: req.body.user,
			session: session
		});

		message.save(function(err, result) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			session.messages.push(result);
			session.save();

			res.status(201).json({
				message: 'Saved message',
				obj: result
			});
		});
	});
});

router.patch('/:id', function(req, res, next) {
	var decoded = jwt.decode(req.query.token);

	Message.findById(req.params.id, function(err, message) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!message) {
			return res.status(500).json({
				title: 'No Message Found',
				error: {message: 'Message not found!'}
			});
		}
		if (message.session != decoded.session._id) {
			return res.status(401).json({
				title: 'Not Authorized',
				error: err
			});
		}
		message.encryptedMessage = req.body.encryptedMessage;
		message.messageSalt = req.body.newMessageSalt;
		message.messageSecretValidation = req.body.newMessageSecretValidation;
		message.messageIntegrity = req.body.newMessageIntegrity;

		message.save(function(err, result) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Updated message',
				obj: result
			});
		});
	});
});

router.delete('/:id', function(req, res, next) {
	var decoded = jwt.decode(req.query.token);

	Message.findById(req.params.id, function(err, message) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!message) {
			return res.status(500).json({
				title: 'No Message Found',
				error: {message: 'Message not found!'}
			});
		}
		if (message.session != decoded.session._id) {
			return res.status(401).json({
				title: 'Not Authorized',
				error: err
			});
		}
		message.remove(function(err, result) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Deleted message',
				obj: result
			});
		});
	});
});

router.delete('/close/:serverSessionId', function(req, res, next) {
	var decoded = jwt.decode(req.query.token);
	
	Session.find({serverSessionId: req.params.serverSessionId}, function(err, session) {
		if (err) {
			return res.status(500).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!session[0]) {
			return res.status(401).json({
				title: 'Message is permanently deleted.',
				error: {message: 'Message is permanently deleted.'}
			});
		}
		var sessionId = session[0]._id;

		Message.remove({session: sessionId}, function(err, result) {
			if (err) {
				return res.status(500).json({
					title: 'An error occurred',
					error: err
				});
			}
			Session.remove({_id: sessionId}, function(err) {
				if (err) {
					return res.status(500).json({
						title: 'An error occurred',
						error: err
					});
				}
			});
			res.status(200).json({
				message: 'Messages and session deleted.',
				obj: result
			});
		});
	});
});

module.exports = router;